import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const FRAME_DIR = path.join(ROOT, 'tmp/tutorial-video/frames');
const WORK_DIR = path.join(ROOT, 'tmp/tutorial-video/build');
const AUDIO_DIR = path.join(WORK_DIR, 'audio');
const TEXT_DIR = path.join(WORK_DIR, 'text');
const SEGMENT_DIR = path.join(WORK_DIR, 'segments');
const OUTPUT_DIR = path.join(ROOT, 'docs/tutorials');
const OUTPUT_VIDEO = path.join(OUTPUT_DIR, 'socal-ebus-prep-module-tutorial.mp4');
const OUTPUT_TRANSCRIPT = path.join(OUTPUT_DIR, 'socal-ebus-prep-module-tutorial-transcript.md');
const SPEECH_RATE = '175';

const scenes = [
  {
    image: '01-home.png',
    duration: 26,
    title: 'Course App Orientation',
    caption: 'Start from the unlocked course dashboard and module navigation.',
    narration:
      'Welcome to SoCal EBUS Prep. In the next few minutes, we will walk through the first three course modules: ultrasound foundations and knobology, the mediastinal station map, and the station explorer that links CT, bronchoscopy, and EBUS views. The app is built for fast practice, not passive slide viewing. Learners move through short interactions, save local progress, and return to the same station or control they were studying.',
  },
  {
    image: '02-knobology-primer.png',
    duration: 25,
    title: 'Module 1: Knobology Primer',
    caption: 'Teach the control sequence before asking learners to fix an image.',
    narration:
      'The knobology module starts with a primer. The goal is to give beginners a usable control sequence before they touch a needle. Depth frames the target. Gain sets overall brightness. Contrast clarifies borders. Doppler checks for flow. Calipers, freeze, and save come after the frame is stable. Notice that the copy is practical and action oriented: each card names a best move and a common pitfall.',
  },
  {
    image: '03-knobology-lab.png',
    duration: 38,
    title: 'Fix-The-Image Control Lab',
    caption: 'The learner uses processor controls, not abstract sliders.',
    narration:
      'The control lab turns that primer into a repair exercise. Here the learner selects a bad image state, such as an undergained frame, then uses the rendered processor controls to improve it. The ultrasound frame, keyboard feedback, and instruction panel all update together. This is intentionally labeled as an educational approximation. It teaches the order of operations and visual consequences without pretending to be a clinically validated simulator.',
  },
  {
    image: '04-knobology-doppler.png',
    duration: 30,
    title: 'Doppler Mini-Lab',
    caption: 'Turn Doppler on, inspect flow, then choose the safer path.',
    narration:
      'The Doppler mini-lab adds a safety check. The learner turns color Doppler on, compares flow modes, and then chooses a path that avoids the color-filled vessel. The feedback is immediate. A wrong answer explains that the path still crosses Doppler signal. The safe answer reinforces the habit: use Doppler to notice flow before committing to a trajectory.',
  },
  {
    image: '05-stations-map.png',
    duration: 36,
    title: 'Module 2: Mediastinal Station Map',
    caption: 'Tap a station to connect IASLC naming with map position.',
    narration:
      'The station map module teaches recognition through the core EBUS stations: 2R, 2L, 4R, 4L, 7, 10R, 10L, and the 11-level stations. Learners tap the map and immediately see station identity, grouping, laterality, and memory cues. The map is not just decoration. It is the shared anchor for detail cards, bookmarks, flashcards, and the pin-the-station quiz.',
  },
  {
    image: '06-stations-flashcards.png',
    duration: 22,
    title: 'Flashcards And Recall',
    caption: 'Practice name, grouping, boundary, and memory cue retrieval.',
    narration:
      'Flashcards keep retrieval practice lightweight. A learner can rehearse station names, reveal descriptions, move forward and backward, or shuffle the deck. That matters because station knowledge is not only visual. Learners need to recall the name, the IASLC label, the anatomic grouping, and a useful cue under time pressure.',
  },
  {
    image: '07-stations-quiz.png',
    duration: 27,
    title: 'Pin-The-Station Quiz',
    caption: 'Quiz prompts use the same map, then explain the answer.',
    narration:
      'Quiz mode stays map based. The app asks the learner to pin a station from a prompt, then gives a hint or explanation. Below that, the recognition challenge tracks accuracy for selected stations. The design keeps mistakes productive: the learner sees why the answer is correct, and local progress records which stations still need repetition.',
  },
  {
    image: '08-station-explorer.png',
    duration: 36,
    title: 'Module 3: Correlated Station Explorer',
    caption: 'One selected station, three synchronized representations.',
    narration:
      'The station explorer extends the same station selection into three correlated views. With station 7 selected, the learner sees CT, bronchoscopic, and EBUS representations side by side. Labels can be pinned when the learner wants help and hidden when they want to test recognition. The point is mental translation: one station identity, three appearances, one staging consequence.',
  },
  {
    image: '09-station-detail.png',
    duration: 32,
    title: 'Details, Boundaries, And Checklists',
    caption: 'Structured local content keeps future asset swaps simple.',
    narration:
      'The detail view adds the deeper curriculum. Learners can review access notes, boundary definitions, what they should see on CT, bronchoscopy, and ultrasound, and memory aids for common confusion pairs. The important product choice is that these fields come from local structured content, so future approved images can replace placeholders without rewriting the component.',
  },
  {
    image: '10-wrap.png',
    duration: 28,
    title: 'Suggested Learner Flow',
    caption: 'Use the three modules as a short practice loop.',
    narration:
      'A good five minute practice loop is simple: warm up with knobology, review the map, then choose one station and translate it across CT, airway, and EBUS. This app is educational support, not a diagnostic device. Its job is to help fellows build orientation, vocabulary, and recognition habits before the live course and supervised clinical practice.',
  },
];

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'], ...options });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`${command} exited ${code}\n${stderr}`));
      }
    });
  });
}

async function audioDuration(file) {
  const { stdout } = await run('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    file,
  ]);

  return Number(stdout.trim());
}

async function makeSceneAudio(scene, index) {
  const paddedIndex = String(index + 1).padStart(2, '0');
  const textFile = path.join(TEXT_DIR, `${paddedIndex}-narration.txt`);
  const rawAudio = path.join(AUDIO_DIR, `${paddedIndex}-raw.aiff`);
  const finalAudio = path.join(AUDIO_DIR, `${paddedIndex}.wav`);

  await writeFile(textFile, `${scene.narration}\n`);
  await run('say', ['-r', SPEECH_RATE, '-o', rawAudio, '-f', textFile]);

  const rawDuration = await audioDuration(rawAudio);
  const filters = [];

  if (rawDuration > scene.duration - 0.5) {
    const tempo = Math.min(2, rawDuration / (scene.duration - 1));
    filters.push(`atempo=${tempo.toFixed(4)}`);
  }

  filters.push('apad');
  filters.push(`atrim=0:${scene.duration}`);
  filters.push('aresample=48000');

  await run('ffmpeg', ['-y', '-i', rawAudio, '-af', filters.join(','), '-ac', '2', finalAudio]);
  return { finalAudio, rawDuration };
}

async function makeSceneVideo(scene, index, audioFile) {
  const paddedIndex = String(index + 1).padStart(2, '0');
  const titleFile = path.join(TEXT_DIR, `${paddedIndex}-title.txt`);
  const captionFile = path.join(TEXT_DIR, `${paddedIndex}-caption.txt`);
  const segmentFile = path.join(SEGMENT_DIR, `${paddedIndex}.mp4`);
  const imageFile = path.join(FRAME_DIR, scene.image);

  await writeFile(titleFile, `${scene.title}\n`);
  await writeFile(captionFile, `${scene.caption}\n`);

  const videoFilter = ['scale=1920:1080', 'format=yuv420p'].join(',');

  await run('ffmpeg', [
    '-y',
    '-loop',
    '1',
    '-framerate',
    '30',
    '-t',
    String(scene.duration),
    '-i',
    imageFile,
    '-i',
    audioFile,
    '-vf',
    videoFilter,
    '-map',
    '0:v:0',
    '-map',
    '1:a:0',
    '-c:v',
    'libx264',
    '-preset',
    'veryfast',
    '-crf',
    '18',
    '-pix_fmt',
    'yuv420p',
    '-r',
    '30',
    '-c:a',
    'aac',
    '-b:a',
    '160k',
    '-movflags',
    '+faststart',
    '-t',
    String(scene.duration),
    segmentFile,
  ]);

  return segmentFile;
}

function formatTimestamp(seconds) {
  const minute = Math.floor(seconds / 60);
  const second = String(seconds % 60).padStart(2, '0');
  return `${minute}:${second}`;
}

async function writeTranscript(rawDurations) {
  let cursor = 0;
  const lines = ['# SoCal EBUS Prep Module Tutorial Transcript', ''];

  scenes.forEach((scene, index) => {
    lines.push(`## ${formatTimestamp(cursor)} ${scene.title}`);
    lines.push('');
    lines.push(scene.narration);
    lines.push('');
    lines.push(`Scene duration: ${scene.duration}s. Spoken source duration: ${rawDurations[index].toFixed(1)}s.`);
    lines.push('');
    cursor += scene.duration;
  });

  lines.push(`Total runtime: ${formatTimestamp(cursor)}.`);
  lines.push('');
  await writeFile(OUTPUT_TRANSCRIPT, lines.join('\n'));
}

await mkdir(AUDIO_DIR, { recursive: true });
await mkdir(TEXT_DIR, { recursive: true });
await mkdir(SEGMENT_DIR, { recursive: true });
await mkdir(OUTPUT_DIR, { recursive: true });

const rawDurations = [];
const segmentFiles = [];

for (const [index, scene] of scenes.entries()) {
  const { finalAudio, rawDuration } = await makeSceneAudio(scene, index);
  rawDurations.push(rawDuration);
  segmentFiles.push(await makeSceneVideo(scene, index, finalAudio));
  console.log(`built scene ${index + 1}: ${scene.title}`);
}

const concatFile = path.join(WORK_DIR, 'concat.txt');
await writeFile(concatFile, segmentFiles.map((file) => `file '${file}'`).join('\n'));

await run('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', concatFile, '-c', 'copy', OUTPUT_VIDEO]);
await writeTranscript(rawDurations);

console.log(OUTPUT_VIDEO);
console.log(OUTPUT_TRANSCRIPT);
