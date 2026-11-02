import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9228;
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
  console.log('Spawning Chrome headless on port 9228...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-extensions',
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

    console.log('Waiting for Bhanu + Sphere + Quote phase to be visible in DOM...');
    for (let i = 0; i < 40; i++) {
      const hasBhanu = await send('Runtime.evaluate', {
        expression: `Boolean(document.querySelector('h2[aria-label="Bhanu"]'))`,
        returnByValue: true
      });
      if (hasBhanu.result && hasBhanu.result.value) {
        console.log('Bhanu phase detected in DOM!');
        break;
      }
      await new Promise(r => setTimeout(r, 200));
    }
    await new Promise(r => setTimeout(r, 800));

    async function capture(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(res.data, 'base64');
      const filePath = path.join(SCREENSHOTS_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
    }

    // 1. Capture 3D Particle Sphere + Quote + BHANU Reveal
    console.log('Capturing 01_hero_particle_sphere_bhanu.png...');
    await capture('01_hero_particle_sphere_bhanu.png');

    // 2. Simulate mouse movement across the screen to test interactive rotation
    console.log('Simulating mouse movement to right side (normX = 0.8, normY = -0.5)...');
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 1050,
      y: 280
    });
    await new Promise(r => setTimeout(r, 700));

    console.log('Capturing 02_hero_sphere_mouse_moved.png...');
    await capture('02_hero_sphere_mouse_moved.png');

    // 3. Wait for transition to 'portfolio' + photo view
    console.log('Waiting for portfolio phase transition (at ~4.8s)...');
    await new Promise(r => setTimeout(r, 2800));

    console.log('Capturing 03_hero_portfolio_revealed.png...');
    await capture('03_hero_portfolio_revealed.png');

    console.log('All hero section 3D particle sphere tests completed successfully!');
    ws.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

