import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9230;
const SCREENSHOTS_DIR = path.resolve('test/e2e/screenshots');

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function getPageTarget() {
  for (let i = 0; i < 30; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${PORT}/json`, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
          });
        }).on('error', reject);
      });
      const page = data.find(t => t.url && t.url.includes('5173'));
      if (page && page.webSocketDebuggerUrl) {
        return page.webSocketDebuggerUrl;
      }
    } catch {
      await new Promise(r => setTimeout(r, 200));
    }
  }
  throw new Error('Could not find Chrome page target');
}

async function run() {
  console.log('Spawning Chrome headless on port 9230...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-extensions',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,1050',
    'http://localhost:5173'
  ]);

  try {
    const wsUrl = await getPageTarget();
    console.log('Connected to target:', wsUrl);

    const ws = new WebSocket(wsUrl);
    let msgId = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const resp = JSON.parse(event.data);
      if (resp.id && callbacks.has(resp.id)) {
        const cb = callbacks.get(resp.id);
        callbacks.delete(resp.id);
        if (resp.error) cb.reject(resp.error);
        else cb.resolve(resp.result);
      }
    };

    await new Promise((resolve) => ws.onopen = resolve);

    const send = (method, params = {}) => {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        callbacks.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    console.log('Waiting 2.5s for page to load...');
    await new Promise(r => setTimeout(r, 2500));

    // Scroll to the About section
    async function frameAboutSection() {
      await send('Runtime.evaluate', {
        expression: `
          const el = document.getElementById('about');
          if (el) {
            const rect = el.getBoundingClientRect();
            window.scrollTo({ top: window.scrollY + rect.top - 60, behavior: 'instant' });
          }
        `
      });
      await new Promise(r => setTimeout(r, 350));
    }

    async function capture(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(res.data, 'base64');
      const filePath = path.join(SCREENSHOTS_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
    }

    // 1. Capture initial clean state (cards hidden)
    console.log('Framing About section (Initial state: cards hidden)...');
    await frameAboutSection();
    console.log('Capturing 20_about_clean_initial_state.png...');
    await capture('20_about_clean_initial_state.png');

    // 2. Click 'Read More' button
    console.log('Clicking "Read More" button...');
    await send('Runtime.evaluate', {
      expression: `
        const btn = document.querySelector('[data-testid="read-more-btn"]');
        if (btn) btn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Frame About section with expanded cards
    await frameAboutSection();
    console.log('Capturing 21_about_cards_revealed.png...');
    await capture('21_about_cards_revealed.png');

    // 3. Hover mouse over Card 1 (Web Development) to test 3D tilt tracking
    console.log('Testing 3D mouse hover tilt on Card 1...');
    const cardRect = await send('Runtime.evaluate', {
      expression: `
        const card = document.querySelector('[data-testid="skill-card-01"]');
        if (card) {
          const r = card.getBoundingClientRect();
          JSON.stringify({ x: r.left + r.width * 0.8, y: r.top + r.height * 0.3 });
        } else {
          null;
        }
      `,
      returnByValue: true
    });

    if (cardRect.result && cardRect.result.value) {
      const pos = JSON.parse(cardRect.result.value);
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: Math.round(pos.x),
        y: Math.round(pos.y)
      });
      await new Promise(r => setTimeout(r, 500));
    }

    console.log('Capturing 22_about_card1_3d_tilt_hover.png...');
    await capture('22_about_card1_3d_tilt_hover.png');

    console.log('All About Section Redesign CDP tests completed successfully!');
    ws.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

