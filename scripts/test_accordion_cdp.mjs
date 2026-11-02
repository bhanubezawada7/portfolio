import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;
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
      const page = data.find(t => t.type === 'page');
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
  console.log('Spawning Chrome headless on port 9222...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,950',
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

    console.log('Waiting for #education to mount in DOM...');
    await send('Runtime.evaluate', {
      expression: `new Promise((resolve) => {
        const interval = setInterval(() => {
          const el = document.getElementById('education');
          const cards = document.querySelectorAll('#education div[data-card-id]');
          if (el && cards.length >= 3) {
            clearInterval(interval);
            resolve(true);
          }
        }, 150);
      })`,
      awaitPromise: true
    });
    console.log('#education mounted with all 3 cards!');

    // Smoothly scroll to #education
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('education');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    async function capture(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(res.data, 'base64');
      const filePath = path.join(SCREENSHOTS_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
    }

    // 1. Initial Default State (Card 3: B.Tech - EEE is expanded)
    console.log('Capturing 01_btech_default_expanded.png...');
    await capture('01_btech_default_expanded.png');

    // Helper to click card by ID and wait for transition
    async function clickCard(id, filename) {
      console.log(`Clicking card: ${id}...`);
      await send('Runtime.evaluate', {
        expression: `(() => {
          const card = document.querySelector('#education div[data-card-id="${id}"]');
          if (card) card.click();
        })()`
      });
      // Wait for smooth horizontal expansion transition (700ms) plus buffer
      await new Promise(r => setTimeout(r, 1000));
      await capture(filename);
    }

    // 2. Click Card 1: 10th Class (ssc)
    await clickCard('ssc', '02_card1_ssc_expanded.png');

    // 3. Click Card 2: Intermediate (inter)
    await clickCard('inter', '03_card2_intermediate_expanded.png');

    // 4. Click Card 3: B.Tech - EEE (btech)
    await clickCard('btech', '04_card3_btech_expanded.png');

    console.log('All 4 state screenshots successfully captured via CDP!');
    ws.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
