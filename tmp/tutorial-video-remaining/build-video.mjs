import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const FRAME_DIR = path.join(ROOT, 'tmp/tutorial-video-remaining/frames');
const WORK_DIR = path.join(ROOT, 'tmp/tutorial-video-remaining/build');
const AUDIO_DIR = path.join(WORK_DIR, 'audio');
const TEXT_DIR = path.join(WORK_DIR, 'text');
const SEGMENT_DIR = path.join(WORK_DIR, 'segments');
const OUTPUT_DIR = path.join(ROOT, 'docs/tutorials');
const OUTPUT_VIDEO = path.join(OUTPUT_DIR, 'socal-ebus-prep-remaining-modules-tutorial.mp4');
const OUTPUT_TRANSCRIPT = path.join(OUTPUT_DIR, 'socal-ebus-prep-remaining-modules-tutorial-transcript.md');
const SPEECH_RATE = '175';

const scenes = [
  {
    image: '01-dashboard-remaining.png',
    duration: 20,
    title: 'Remaining Module Orientation',
    narration:
      'This second tutorial covers the remaining practice modules in SoCal EBUS Prep: TNM-9 staging, 3D Anatomy, and the EBUS Anatomy Correlation Simulator. These modules come after the foundational knobology and station-map work. They are meant to help learners move from station recognition into staging decisions, patient-space anatomy, and simulated scope orientation.',
  },
  {
    image: '02-tnm-reference.png',
    duration: 28,
    title: 'TNM-9 Reference',
    narration:
      'The TNM-9 module opens with searchable reference cards. Learners can review T, N, M, and stage-group descriptors, including key 9th-edition changes such as N2a versus N2b and M1c1 versus M1c2. The module uses local paraphrased teaching content, so it stays fast, offline friendly, and easy to update as course material changes.',
  },
  {
    image: '03-tnm-stager.png',
    duration: 30,
    title: 'Interactive Stager',
    narration:
      'The interactive stager turns the reference matrix into a working calculator. The learner chooses T, N, and M descriptors and immediately sees the computed clinical stage with an explanation. Adjacent comparisons show why nearby descriptor changes matter. That makes the screen useful for teaching stage-group logic, not just returning a final label.',
  },
  {
    image: '04-tnm-t-builder.png',
    duration: 30,
    title: 'Visual T Builder',
    narration:
      'The visual T builder helps learners reason from tumor features toward a T descriptor. Size, side, location, invasion features, atelectasis or pneumonitis, and separate tumor nodules all feed the computed T category. The lung schematic is intentionally app-owned teaching art. It supports practice without presenting itself as a diagnostic image.',
  },
  {
    image: '05-tnm-n-map.png',
    duration: 32,
    title: 'N Descriptor Map',
    narration:
      'The N map connects staging logic back to the station map. Learners choose the primary side, mark stations as unassessed, sampled negative, or positive, and see the computed N descriptor update by laterality. In this example, multiple ipsilateral mediastinal or subcarinal positives produce N2b. The systematic staging reminder keeps 4R, 4L, and 7 visible in the workflow.',
  },
  {
    image: '06-tnm-cases.png',
    duration: 28,
    title: 'TNM Cases',
    narration:
      'The cases tab changes the task from lookup to application. Each local case gives CT, PET, and EBUS findings, then asks the learner to assign T, N, and M before checking the rationale. The tags let learners focus on traps such as effusion, separate nodules, N2 subgroups, or oligometastatic disease.',
  },
  {
    image: '07-3d-anatomy-hero.png',
    duration: 36,
    title: '3D Anatomy Viewer',
    narration:
      'The 3D Anatomy module uses Case 001 as a patient-space anatomy viewer. The learner selects a station or target, then reviews airway, vessels, lymph nodes, and other segmented structures in one shared scene. Overlay controls can show or hide anatomy groups, turn nodes on or off, and adjust opacity. This is a teaching case for spatial orientation, not a clinical interpretation tool.',
  },
  {
    image: '08-3d-anatomy-slices.png',
    duration: 30,
    title: 'Linked CT Slices',
    narration:
      'Below the 3D scene, the same target is linked to axial, coronal, and sagittal CT slices. The crosshair and segmentation overlay help learners connect a station target in 3D with its corresponding CT location. The arbitrary reslice panel is designed to stay aligned with the draggable plane in the 3D scene.',
  },
  {
    image: '09-simulator-workspace.png',
    duration: 30,
    title: 'Simulator Controls',
    narration:
      'The simulator starts from curated station snaps. Learners choose a station target, advance or retract along a guided airway centerline, and adjust roll while keeping teaching layers visible. The status strip shows the approach, distance, and whether the EBUS-style sector comes from a prepared snapshot or live browser projection.',
  },
  {
    image: '10-simulator-adjusted.png',
    duration: 36,
    title: 'Anatomy To Sector Correlation',
    narration:
      'The simulator workspace is the payoff. The left pane shows the external anatomy, scope, fan, airway, vessels, and lymph node target. The right pane shows the matching EBUS-style sector with labels for the structures intersecting the fan. The learner can snap to a station, compare the two views, then change roll or position and watch the sector update. As with the rest of the app, this is for orientation training, not diagnostic validation.',
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
  const segmentFile = path.join(SEGMENT_DIR, `${paddedIndex}.mp4`);
  const imageFile = path.join(FRAME_DIR, scene.image);

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
    'scale=1920:1080,format=yuv420p',
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
  const lines = ['# SoCal EBUS Prep Remaining Modules Tutorial Transcript', ''];

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
