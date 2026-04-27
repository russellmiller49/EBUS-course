import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const BASE_URL = process.env.TUTORIAL_BASE_URL ?? 'http://127.0.0.1:5173';
const OUTPUT_DIR = path.resolve(process.env.TUTORIAL_FRAME_DIR ?? 'tmp/tutorial-video-remaining/frames');
const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = Number(process.env.CHROME_DEBUG_PORT ?? 9226);
const VIEWPORT = { width: 1600, height: 900 };
const HEADLESS = process.env.TUTORIAL_HEADLESS !== '0';

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
        knobology: moduleProgress(100, true),
        'station-map': moduleProgress(100, true),
        'station-explorer': moduleProgress(100, true),
        'tnm-staging': moduleProgress(85, false),
        quiz: moduleProgress(0, false),
        'case-001': moduleProgress(65, false),
        simulator: moduleProgress(55, false),
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
      lastUsedKnobologyControl: 'save',
      lastViewedTnmCaseId: 'tnm-case-04-multistation-n2',
    },
  };
}

function simulatorState() {
  return {
    selectedKey: 'station_7_node_a::rms',
    teachingView: true,
    lineIndex: 8,
    sMm: 137.27431527458967,
    rollDeg: 0,
    layers: {
      airway: true,
      vessels: true,
      heart: true,
      nodes: false,
      stations: true,
      context: true,
      centerline: false,
      fan: true,
      cutPlane: true,
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

  for (let attempt = 0; attempt < 100; attempt += 1) {
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

  waitForEvent(method, timeoutMs = 20000) {
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
  const profileDir = await mkdtemp(path.join(tmpdir(), 'socal-ebus-remaining-tutorial-chrome-'));
  const chrome = spawn(
    CHROME,
    [
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${profileDir}`,
      ...(HEADLESS ? ['--headless=new'] : []),
      ...(HEADLESS ? ['--disable-gpu'] : []),
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
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

async function navigate(cdp, url, settleMs = 1200) {
  const loaded = cdp.waitForEvent('Page.loadEventFired');
  await cdp.send('Page.navigate', { url });
  await loaded;
  await sleep(settleMs);
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
      await new Promise((resolve) => setTimeout(resolve, 700));
      return Boolean(target);
    })()`,
  );
}

async function clickAria(cdp, label) {
  await evaluate(
    cdp,
    `(async () => {
      const target = document.querySelector(${JSON.stringify(`[aria-label="${label}"]`)});
      if (target) {
        target.click();
      }
      await new Promise((resolve) => setTimeout(resolve, 700));
      return Boolean(target);
    })()`,
  );
}

async function setNthSelectValue(cdp, index, value) {
  await evaluate(
    cdp,
    `(async () => {
      const select = Array.from(document.querySelectorAll('select'))[${index}];
      if (select) {
        select.value = ${JSON.stringify(value)};
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      await new Promise((resolve) => setTimeout(resolve, 900));
      return Boolean(select);
    })()`,
  );
}

async function setCheckboxByLabel(cdp, label, checked) {
  await evaluate(
    cdp,
    `(async () => {
      const needle = ${JSON.stringify(label)};
      const labels = Array.from(document.querySelectorAll('label'));
      const labelNode = labels.find((node) => node.textContent && node.textContent.includes(needle));
      const checkbox = labelNode?.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked !== ${JSON.stringify(checked)}) {
        checkbox.click();
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
      return Boolean(checkbox);
    })()`,
  );
}

async function setFirstRange(cdp, value) {
  await evaluate(
    cdp,
    `(async () => {
      const range = document.querySelector('input[type="range"]');
      if (range) {
        range.value = ${JSON.stringify(String(value))};
        range.dispatchEvent(new Event('input', { bubbles: true }));
        range.dispatchEvent(new Event('change', { bubbles: true }));
      }
      await new Promise((resolve) => setTimeout(resolve, 700));
      return Boolean(range);
    })()`,
  );
}

async function scrollToText(cdp, text) {
  await evaluate(
    cdp,
    `(async () => {
      const needle = ${JSON.stringify(text)};
      const candidates = Array.from(document.querySelectorAll('h1,h2,h3,h4,.eyebrow,strong,span'));
      const target = candidates.find((node) => node.textContent && node.textContent.includes(needle));
      if (target) {
        target.scrollIntoView({ block: 'start', inline: 'nearest' });
        window.scrollBy(0, -24);
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
      return Boolean(target);
    })()`,
  );
}

async function waitForText(cdp, text, timeoutMs = 12000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const found = await evaluate(
      cdp,
      `document.body.textContent.includes(${JSON.stringify(text)})`,
    );
    if (found) {
      return true;
    }
    await sleep(500);
  }
  return false;
}

async function waitForNoLoading(cdp, timeoutMs = 16000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const loading = await evaluate(
      cdp,
      `document.body.textContent.includes('Loading case geometry') || document.body.textContent.includes('Loading CT volume') || document.body.textContent.includes('Loading simulator')`,
    );
    if (!loading) {
      await sleep(1800);
      return true;
    }
    await sleep(700);
  }
  return false;
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
    file: '01-dashboard-remaining.png',
    url: '/',
    action: async (cdp) => {
      await evaluate(cdp, 'window.scrollTo(0, document.body.scrollHeight)');
    },
  },
  {
    file: '02-tnm-reference.png',
    url: '/tnm-staging',
    action: async (cdp) => {
      await evaluate(cdp, 'window.scrollTo(0, 0)');
    },
  },
  {
    file: '03-tnm-stager.png',
    url: '/tnm-staging',
    action: async (cdp) => {
      await clickText(cdp, 'Stager');
      await clickText(cdp, 'T2b');
      await clickText(cdp, 'N2b');
      await clickText(cdp, 'M0');
    },
  },
  {
    file: '04-tnm-t-builder.png',
    url: '/tnm-staging',
    action: async (cdp) => {
      await clickText(cdp, 'T Builder');
      await setFirstRange(cdp, 5.4);
      await clickText(cdp, 'Mediastinal');
      await clickText(cdp, 'Same lobe');
    },
  },
  {
    file: '05-tnm-n-map.png',
    url: '/tnm-staging',
    action: async (cdp) => {
      await clickText(cdp, 'N Map');
      await clickAria(cdp, 'Select station 7');
      await clickAria(cdp, 'Select station 7');
      await clickAria(cdp, 'Select station 4R');
      await clickAria(cdp, 'Select station 4R');
    },
  },
  {
    file: '06-tnm-cases.png',
    url: '/tnm-staging',
    action: async (cdp) => {
      await clickText(cdp, 'Cases');
      await clickText(cdp, 'Check case');
    },
  },
  {
    file: '07-3d-anatomy-hero.png',
    url: '/cases/case-001',
    settleMs: 2600,
    action: async (cdp) => {
      await waitForNoLoading(cdp, 22000);
      await setNthSelectValue(cdp, 0, '7');
      await setCheckboxByLabel(cdp, 'All anatomy', true);
      await setCheckboxByLabel(cdp, '2D segmentation overlay', true);
      await evaluate(cdp, 'window.scrollTo(0, 0)');
      await sleep(2200);
    },
  },
  {
    file: '08-3d-anatomy-slices.png',
    url: '/cases/case-001',
    settleMs: 2600,
    action: async (cdp) => {
      await waitForNoLoading(cdp, 22000);
      await setNthSelectValue(cdp, 0, '4R');
      await setCheckboxByLabel(cdp, 'All anatomy', true);
      await setCheckboxByLabel(cdp, '2D segmentation overlay', true);
      await scrollToText(cdp, 'Orthogonal CT');
      await sleep(1800);
    },
  },
  {
    file: '09-simulator-workspace.png',
    url: '/simulator',
    settleMs: 2200,
    action: async (cdp) => {
      await waitForText(cdp, 'Station snap', 14000);
      await setNthSelectValue(cdp, 0, 'station_7_node_a::rms');
      await sleep(2500);
    },
  },
  {
    file: '10-simulator-adjusted.png',
    url: '/simulator',
    settleMs: 2200,
    action: async (cdp) => {
      await waitForText(cdp, 'Station snap', 14000);
      await setNthSelectValue(cdp, 0, 'station_11rs_node_a::default');
      await evaluate(
        cdp,
        `(async () => {
          const ranges = Array.from(document.querySelectorAll('input[type="range"]'));
          if (ranges[1]) {
            ranges[1].value = '24';
            ranges[1].dispatchEvent(new Event('input', { bubbles: true }));
            ranges[1].dispatchEvent(new Event('change', { bubbles: true }));
          }
          await new Promise((resolve) => setTimeout(resolve, 1800));
          return true;
        })()`,
      );
      await scrollToText(cdp, 'External anatomy');
      await sleep(1200);
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
    )});
    localStorage.setItem('socal-ebus-prep:simulator-state:v1', ${JSON.stringify(
      JSON.stringify(simulatorState()),
    )});`,
  );

  for (const scene of scenes) {
    await navigate(cdp, `${BASE_URL}${scene.url}`, scene.settleMs ?? 1200);
    await scene.action(cdp);
    await screenshot(cdp, scene.file);
    console.log(`captured ${scene.file}`);
  }
});
