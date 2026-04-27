import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const BASE_URL = process.env.TUTORIAL_BASE_URL ?? 'http://localhost:5173';
const OUTPUT_DIR = path.resolve(process.env.TUTORIAL_FRAME_DIR ?? 'tmp/tutorial-video/frames');
const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = Number(process.env.CHROME_DEBUG_PORT ?? 9225);
const VIEWPORT = { width: 1600, height: 900 };

const now = new Date().toISOString();

function moduleProgress(percentComplete, completed = false) {
  return {
    visitedAt: now,
    completedAt: completed ? now : null,
    percentComplete,
  };
}

function engagement() {
  return {
    lastTrackedAt: now,
    totalSeconds: 300,
  };
}

function demoProgress() {
  return {
    savedAt: now,
    state: {
      version: 7,
      moduleProgress: {
        pretest: moduleProgress(100, true),
        lectures: moduleProgress(100, true),
        knobology: moduleProgress(80, false),
        'station-map': moduleProgress(70, false),
        'station-explorer': moduleProgress(65, false),
        'tnm-staging': moduleProgress(0, false),
        quiz: moduleProgress(0, false),
        'case-001': moduleProgress(0, false),
        simulator: moduleProgress(0, false),
      },
      bookmarkedStations: ['7', '4R'],
      stationRecognitionStats: {
        '7': { attempts: 2, correct: 1 },
        '4R': { attempts: 1, correct: 1 },
      },
      tnmCaseStats: {},
      tnmTagStats: {},
      lectureWatchStatus: {
        'lecture-01': {
          completed: true,
          completedAt: now,
          watchedSeconds: 600,
          lastOpenedAt: now,
        },
      },
      engagement: {
        pretest: engagement(),
        lectures: engagement(),
        knobology: engagement(),
        stations: engagement(),
        'tnm-staging': engagement(),
        quiz: engagement(),
        'case-001': engagement(),
        simulator: engagement(),
      },
      quizScoreHistory: [],
      courseAssessmentResults: {},
      courseSurvey: {
        submittedAt: null,
        responses: {},
      },
      pretest: {
        answers: {},
        currentQuestionIndex: 0,
        submittedAt: now,
        unlockedByPasscodeAt: now,
        score: 0,
        answeredCount: 20,
        totalQuestions: 20,
        attemptCount: 1,
      },
      lastViewedStationId: '7',
      lastUsedKnobologyControl: 'depth',
      lastViewedTnmCaseId: null,
    },
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.json();
}

async function waitForDebugEndpoint() {
  const url = `http://127.0.0.1:${PORT}/json/version`;

  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      return await fetchJson(url);
    } catch {
      await sleep(250);
    }
  }

  throw new Error('Chrome DevTools endpoint did not start');
}

class CdpSession {
  constructor(webSocketUrl) {
    this.id = 0;
    this.pending = new Map();
    this.eventWaiters = new Map();
    this.ws = new WebSocket(webSocketUrl);
  }

  async open() {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timed out opening WebSocket')), 10000);

      this.ws.addEventListener('open', () => {
        clearTimeout(timeout);
        resolve();
      });

      this.ws.addEventListener('error', (event) => {
        clearTimeout(timeout);
        reject(event.error ?? new Error('WebSocket error'));
      });
    });

    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);

      if (message.id && this.pending.has(message.id)) {
        const { reject, resolve } = this.pending.get(message.id);
        this.pending.delete(message.id);

        if (message.error) {
          reject(new Error(message.error.message));
        } else {
          resolve(message.result);
        }

        return;
      }

      if (message.method && this.eventWaiters.has(message.method)) {
        const waiters = this.eventWaiters.get(message.method);
        this.eventWaiters.delete(message.method);
        waiters.forEach((resolve) => resolve(message.params));
      }
    });
  }

  send(method, params = {}) {
    this.id += 1;
    const id = this.id;

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  waitForEvent(method, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs);

      const wrappedResolve = (params) => {
        clearTimeout(timeout);
        resolve(params);
      };

      const waiters = this.eventWaiters.get(method) ?? [];
      waiters.push(wrappedResolve);
      this.eventWaiters.set(method, waiters);
    });
  }

  close() {
    this.ws.close();
  }
}

async function withChrome(callback) {
  const profileDir = await mkdtemp(path.join(tmpdir(), 'socal-ebus-tutorial-chrome-'));
  const chrome = spawn(
    CHROME,
    [
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${profileDir}`,
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );

  let cdp;

  try {
    await waitForDebugEndpoint();
    const target = await fetchJson(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' });
    cdp = new CdpSession(target.webSocketDebuggerUrl);
    await cdp.open();
    await callback(cdp);
  } finally {
    cdp?.close();
    chrome.kill('SIGTERM');
    await new Promise((resolve) => chrome.once('exit', resolve));
    await rm(profileDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 250 });
  }
}

async function navigate(cdp, url) {
  const loaded = cdp.waitForEvent('Page.loadEventFired');
  await cdp.send('Page.navigate', { url });
  await loaded;
  await sleep(1400);
}

async function evaluate(cdp, expression, awaitPromise = true) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise,
    returnByValue: true,
  });

  if (result.exceptionDetails) {
    const detail =
      result.exceptionDetails.exception?.description ??
      result.exceptionDetails.exception?.value ??
      result.exceptionDetails.text;
    throw new Error(detail);
  }

  return result.result?.value;
}

async function scrollToText(cdp, text) {
  await evaluate(
    cdp,
    `(async () => {
      const needle = ${JSON.stringify(text)};
      const candidates = Array.from(document.querySelectorAll('h1,h2,h3,.eyebrow,strong'));
      const target = candidates.find((node) => node.textContent && node.textContent.includes(needle));
      if (target) {
        target.scrollIntoView({ block: 'start', inline: 'nearest' });
        window.scrollBy(0, -24);
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      return Boolean(target);
    })()`,
  );
}

async function clickText(cdp, text) {
  await evaluate(
    cdp,
    `(async () => {
      const needle = ${JSON.stringify(text)};
      const candidates = Array.from(document.querySelectorAll('button,a,[role="button"]'));
      const target = candidates.find((node) => node.textContent && node.textContent.includes(needle));
      if (target) {
        target.click();
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      return Boolean(target);
    })()`,
  );
}

async function setSelectValue(cdp, value) {
  await evaluate(
    cdp,
    `(async () => {
      const select = document.querySelector('select');
      if (select) {
        select.value = ${JSON.stringify(value)};
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      return Boolean(select);
    })()`,
  );
}

async function pinFirstLabels(cdp) {
  await evaluate(
    cdp,
    `(async () => {
      const buttons = Array.from(document.querySelectorAll('button'));
      buttons.filter((button) => button.textContent && button.textContent.includes('Pin labels')).slice(0, 3).forEach((button) => button.click());
      await new Promise((resolve) => setTimeout(resolve, 600));
      return true;
    })()`,
  );
}

async function screenshot(cdp, filename) {
  const result = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  });

  await writeFile(path.join(OUTPUT_DIR, filename), Buffer.from(result.data, 'base64'));
}

const scenes = [
  {
    file: '01-home.png',
    url: '/',
    action: async (cdp) => {
      await evaluate(cdp, 'window.scrollTo(0, 0)');
    },
  },
  {
    file: '02-knobology-primer.png',
    url: '/knobology',
    action: async (cdp) => {
      await evaluate(cdp, 'window.scrollTo(0, 0)');
    },
  },
  {
    file: '03-knobology-lab.png',
    url: '/knobology',
    action: async (cdp) => {
      await scrollToText(cdp, 'Control lab');
      await setSelectValue(cdp, 'gain-rescue');
    },
  },
  {
    file: '04-knobology-doppler.png',
    url: '/knobology',
    action: async (cdp) => {
      await scrollToText(cdp, 'Doppler mini-lab');
      await clickText(cdp, 'Doppler On');
      await clickText(cdp, 'Posterior-lateral path');
    },
  },
  {
    file: '05-stations-map.png',
    url: '/stations/explore',
    action: async (cdp) => {
      await scrollToText(cdp, 'Core IASLC stations');
      await pinFirstLabels(cdp);
    },
  },
  {
    file: '06-stations-flashcards.png',
    url: '/stations/flashcards',
    action: async (cdp) => {
      await clickText(cdp, 'Tap to reveal');
    },
  },
  {
    file: '07-stations-quiz.png',
    url: '/stations/quiz',
    action: async (cdp) => {
      await scrollToText(cdp, 'Pin-The-Station Quiz');
    },
  },
  {
    file: '08-station-explorer.png',
    url: '/stations/explore',
    action: async (cdp) => {
      await scrollToText(cdp, 'Core IASLC stations');
      await pinFirstLabels(cdp);
    },
  },
  {
    file: '09-station-detail.png',
    url: '/stations/explore',
    action: async (cdp) => {
      await scrollToText(cdp, 'What You Should See');
    },
  },
  {
    file: '10-wrap.png',
    url: '/',
    action: async (cdp) => {
      await evaluate(cdp, 'window.scrollTo(0, document.body.scrollHeight)');
    },
  },
];

await mkdir(OUTPUT_DIR, { recursive: true });

await withChrome(async (cdp) => {
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    ...VIEWPORT,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await navigate(cdp, `${BASE_URL}/`);
  await evaluate(
    cdp,
    `localStorage.setItem('socal-ebus-prep.web.learner-progress', ${JSON.stringify(
      JSON.stringify(demoProgress()),
    )});`,
  );

  for (const scene of scenes) {
    await navigate(cdp, `${BASE_URL}${scene.url}`);
    await scene.action(cdp);
    await screenshot(cdp, scene.file);
    console.log(`captured ${scene.file}`);
  }
});
