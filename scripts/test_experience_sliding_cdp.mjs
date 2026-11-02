import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9232;
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
  console.log('Spawning Chrome headless on port 9232...');
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

    async function capture(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(res.data, 'base64');
      const filePath = path.join(SCREENSHOTS_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
    }

    console.log('Waiting 2s for initial page load to settle...');
    await new Promise(r => setTimeout(r, 2000));

    console.log('Waiting for #experience to mount in DOM...');
    await send('Runtime.evaluate', {
      expression: `new Promise((resolve) => {
        const interval = setInterval(() => {
          const el = document.getElementById('experience');
          const card1 = document.querySelector('[data-testid="experience-card-01"]');
          if (el && card1) {
            clearInterval(interval);
            resolve(true);
          }
        }, 150);
      })`,
      awaitPromise: true
    });
    console.log('#experience mounted in DOM!');

    // Scroll to Experience section
    async function frameExperienceSection() {
      await send('Runtime.evaluate', {
        expression: `
          const el = document.getElementById('experience');
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        `
      });
      await new Promise(r => setTimeout(r, 600));
    }

    // 1. Frame initial State (Card 1: Social Media Manager active)
    console.log('Framing Experience section (Initial State: Card 01 active)...');
    await frameExperienceSection();
    console.log('Capturing 40_experience_card1_active.png...');
    await capture('40_experience_card1_active.png');

    // 2. Click Right Navigation Arrow (Next -> Card 02)
    console.log('Clicking Next Navigation Arrow to advance to Card 02...');
    await send('Runtime.evaluate', {
      expression: `
        const nextBtn = document.querySelector('[data-testid="exp-nav-next"]');
        if (nextBtn) nextBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));
    await frameExperienceSection();

    console.log('Capturing 41_experience_card2_active.png...');
    await capture('41_experience_card2_active.png');

    // 3. Click Card 03 (Energy Audit Intern)
    console.log('Clicking Card 03: Energy Audit Intern...');
    await send('Runtime.evaluate', {
      expression: `
        const card3 = document.querySelector('[data-testid="experience-card-03"]');
        if (card3) card3.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));
    await frameExperienceSection();

    console.log('Capturing 42_experience_card3_active.png...');
    await capture('42_experience_card3_active.png');

    // 4. Click Left Navigation Arrow (Previous -> Card 02)
    console.log('Clicking Left Navigation Arrow to slide Card 02 back into view...');
    await send('Runtime.evaluate', {
      expression: `
        const prevBtn = document.querySelector('[data-testid="exp-nav-prev"]');
        if (prevBtn) prevBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));
    await frameExperienceSection();

    console.log('Capturing 43_experience_card2_slid_back.png...');
    await capture('43_experience_card2_slid_back.png');

    // 5. Click Left Navigation Arrow again (Previous -> Card 01)
    console.log('Clicking Left Navigation Arrow to slide Card 01 back into view...');
    const step5Res = await send('Runtime.evaluate', {
      expression: `(() => {
        const prevBtn = document.querySelector('[data-testid="exp-nav-prev"]');
        if (prevBtn) {
          const wasDisabled = prevBtn.disabled;
          prevBtn.click();
          return { found: true, wasDisabled };
        }
        return { found: false };
      })()`,
      returnByValue: true
    });
    console.log('Step 5 click result:', JSON.stringify(step5Res));
    await new Promise(r => setTimeout(r, 1200));
    await frameExperienceSection();

    console.log('Capturing 44_experience_card1_slid_back.png...');
    await capture('44_experience_card1_slid_back.png');

    console.log('All Experience card sliding CDP tests completed successfully!');
    ws.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

