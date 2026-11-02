import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9231;
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
  console.log('Spawning Chrome headless on port 9231...');
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

    console.log('Waiting for portfolio photo view in Hero (around 5s)...');
    for (let i = 0; i < 40; i++) {
      const check = await send('Runtime.evaluate', {
        expression: `Boolean(document.getElementById('hero-sphere-target'))`,
        returnByValue: true
      });
      if (check.result && check.result.value) {
        console.log('Hero photo target detected in DOM!');
        break;
      }
      await new Promise(r => setTimeout(r, 300));
    }
    await new Promise(r => setTimeout(r, 1000));

    // 1. Capture 3D Sphere in Hero (Behind Photo)
    console.log('Capturing 30_hero_sphere_behind_photo.png...');
    await capture('30_hero_sphere_behind_photo.png');

    // 2. Scroll halfway to About Me (scrollY = 450)
    console.log('Scrolling halfway to About Me (scrollY = 450)...');
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 450, behavior: 'instant' });`
    });
    await new Promise(r => setTimeout(r, 600));

    console.log('Capturing 31_sphere_mid_scroll_transition.png...');
    await capture('31_sphere_mid_scroll_transition.png');

    // 3. Scroll to About Me section
    console.log('Scrolling to About Me section...');
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('about');
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo({ top: window.scrollY + rect.top - 60, behavior: 'instant' });
        }
      `
    });
    await new Promise(r => setTimeout(r, 600));

    console.log('Capturing 32_sphere_in_about_right_side.png...');
    await capture('32_sphere_in_about_right_side.png');

    // 4. Simulate mouse interaction in About Me section
    console.log('Simulating mouse movement in About Me section to verify continued interaction...');
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 1100,
      y: 320
    });
    await new Promise(r => setTimeout(r, 600));

    console.log('Capturing 33_sphere_in_about_mouse_interaction.png...');
    await capture('33_sphere_in_about_mouse_interaction.png');

    // 5. Click 'Read More' in About Me
    console.log('Clicking "Read More" button in About Me...');
    await send('Runtime.evaluate', {
      expression: `
        const btn = document.querySelector('[data-testid="read-more-btn"]');
        if (btn) btn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    console.log('Capturing 34_about_read_more_expanded_with_sphere.png...');
    await capture('34_about_read_more_expanded_with_sphere.png');

    console.log('All sphere scroll and positioning CDP tests completed successfully!');
    ws.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

