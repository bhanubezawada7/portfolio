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
    '--window-size=1440,950',
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

    console.log('Waiting 2s for page to settle...');
    await new Promise(r => setTimeout(r, 2000));

    // Wait for navbar pill to mount
    console.log('Waiting for navbar pill to mount...');
    await send('Runtime.evaluate', {
      expression: `new Promise((resolve) => {
        const interval = setInterval(() => {
          const pill = document.querySelector('[data-testid="navbar-pill"]');
          if (pill) {
            clearInterval(interval);
            resolve(true);
          }
        }, 100);
      })`,
      awaitPromise: true
    });
    console.log('Navbar pill mounted!');

    // 1. Initial State: Floating Pill at top, un-scrolled
    console.log('Capturing 50_navbar_floating_initial.png...');
    await capture('50_navbar_floating_initial.png');

    // 2. Hover over "About" link using real CDP mouse movement
    console.log('Hovering over "About" nav link using CDP mouse movement...');
    const aboutRect = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('[data-testid="nav-link-about"]');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      })()`,
      returnByValue: true
    });

    if (aboutRect?.result?.value) {
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: aboutRect.result.value.x + 4,
        y: aboutRect.result.value.y + 3
      });
      await new Promise(r => setTimeout(r, 400));
    }
    console.log('Capturing 51_navbar_magnetic_hover_about.png...');
    await capture('51_navbar_magnetic_hover_about.png');

    // 3. Hover over "Experience" link using real CDP mouse movement
    console.log('Hovering over "Experience" nav link using CDP mouse movement...');
    const expRect = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('[data-testid="nav-link-experience"]');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      })()`,
      returnByValue: true
    });

    if (expRect?.result?.value) {
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: expRect.result.value.x + 5,
        y: expRect.result.value.y + 4
      });
      await new Promise(r => setTimeout(r, 600));
    }
    console.log('Capturing 52_navbar_magnetic_hover_experience.png...');
    await capture('52_navbar_magnetic_hover_experience.png');

    // 4. Scroll down to trigger sticky dynamic shrinking
    console.log('Scrolling down 350px to test sticky shrink behavior...');
    await send('Runtime.evaluate', {
      expression: `
        window.scrollTo({ top: 350, behavior: 'instant' });
      `
    });
    await new Promise(r => setTimeout(r, 600));

    const scrolledStatus = await send('Runtime.evaluate', {
      expression: `(() => {
        const pill = document.querySelector('[data-testid="navbar-pill"]');
        return pill ? pill.getAttribute('data-scrolled') : null;
      })()`,
      returnByValue: true
    });
    console.log('Scrolled attribute status:', JSON.stringify(scrolledStatus));

    console.log('Capturing 53_navbar_sticky_shrunk.png...');
    await capture('53_navbar_sticky_shrunk.png');

    console.log('All Navbar CDP tests completed successfully!');
    ws.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
