import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9229;
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
  console.log('Spawning Chrome headless on port 9229...');
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

    console.log('Waiting 2.5s for initial page load...');
    await new Promise(r => setTimeout(r, 2500));

    // Frame the core-focus-section perfectly in the viewport
    async function frameSection() {
      await send('Runtime.evaluate', {
        expression: `
          const el = document.getElementById('core-focus-section');
          if (el) {
            const rect = el.getBoundingClientRect();
            window.scrollTo({ top: window.scrollY + rect.top - 80, behavior: 'instant' });
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

    // 1. Capture Card 1: Engineering Rigor (active by default)
    console.log('Capturing 10_focus_card1_engineering.png...');
    await frameSection();
    await capture('10_focus_card1_engineering.png');

    // 2. Click Digital Marketing & Growth (Card 2)
    console.log('Clicking Card 2: Digital Marketing & Growth...');
    await send('Runtime.evaluate', {
      expression: `
        const card2 = document.querySelector('[data-domain="digital"]');
        if (card2) card2.click();
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    await frameSection();
    console.log('Capturing 11_focus_card2_digital_marketing.png...');
    await capture('11_focus_card2_digital_marketing.png');

    // 3. Click Machine Learning & Tech (Card 3)
    console.log('Clicking Card 3: Machine Learning & Tech...');
    await send('Runtime.evaluate', {
      expression: `
        const card3 = document.querySelector('[data-domain="ml"]');
        if (card3) card3.click();
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    await frameSection();
    console.log('Capturing 12_focus_card3_machine_learning.png...');
    await capture('12_focus_card3_machine_learning.png');

    // 4. Click Energy Management (Card 4)
    console.log('Clicking Card 4: Energy Management...');
    await send('Runtime.evaluate', {
      expression: `
        const card4 = document.querySelector('[data-domain="energy"]');
        if (card4) card4.click();
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    await frameSection();
    console.log('Capturing 13_focus_card4_energy_management.png...');
    await capture('13_focus_card4_energy_management.png');

    console.log('All focus dual-column sync tests completed successfully!');
    ws.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
