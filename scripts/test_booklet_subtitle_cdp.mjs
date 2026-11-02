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

    console.log('Waiting 8.5s for Hero sequence to reveal PORTFOLIO & Booklet...');
    await new Promise(r => setTimeout(r, 8500));

    // Check initial state
    const initialStatus = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('[data-testid="hero-3d-booklet"]');
        return el ? el.getAttribute('data-flipped') : 'not found';
      })()`,
      returnByValue: true
    });
    console.log('Initial booklet data-flipped:', JSON.stringify(initialStatus));

    // 1. Initial State: Page 1 (Software Developer)
    console.log('Capturing 60_booklet_page1_initial.png...');
    await capture('60_booklet_page1_initial.png');

    // 2. Click the booklet to toggle flip
    console.log('Clicking the booklet to flip open...');
    const clickStatus = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('[data-testid="hero-3d-booklet"]');
        if (!el) return 'not found';
        el.click();
        return el.getAttribute('data-flipped');
      })()`,
      returnByValue: true
    });
    console.log('Post-click data-flipped:', JSON.stringify(clickStatus));

    console.log('Waiting 1300ms for slow-motion 3D horizontal page flip to complete...');
    await new Promise(r => setTimeout(r, 1300));

    // 3. Flipped State: Page 2 (AI Web Developer) revealed
    console.log('Capturing 61_booklet_page2_flipped_revealed.png...');
    await capture('61_booklet_page2_flipped_revealed.png');

    // 4. Click again to toggle back
    console.log('Clicking again to flip back...');
    const toggleBackStatus = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('[data-testid="hero-3d-booklet"]');
        if (!el) return 'not found';
        el.click();
        return el.getAttribute('data-flipped');
      })()`,
      returnByValue: true
    });
    console.log('Toggle back data-flipped:', JSON.stringify(toggleBackStatus));
    await new Promise(r => setTimeout(r, 1300));

    console.log('Capturing 62_booklet_flipped_back.png...');
    await capture('62_booklet_flipped_back.png');

    console.log('All Booklet Subtitle CDP tests completed successfully!');
    ws.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
