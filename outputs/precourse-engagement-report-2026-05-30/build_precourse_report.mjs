import fs from 'node:fs/promises';
import path from 'node:path';

import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const repoRoot = '/Users/russellmiller/Projects/EBUS-course';
const outputDir = path.join(repoRoot, 'outputs/precourse-engagement-report-2026-05-30');
const outputPath = path.join(outputDir, 'socal_ebus_precourse_usage_engagement_report_2026-05-30.xlsx');

const generatedAtUtc = '2026-05-30T05:04:05Z';
const sessionCapSeconds = 7200;

const kpis = {
  totalProfiles: 57,
  activeLearners: 49,
  syncedLearners: 49,
  approvedProfiles: 57,
  preCourseSurveySubmissions: 44,
  pretestSubmissions: 42,
  avgPretestPercent: 70,
  medianPretestPercent: 72,
  learnersStartedLectures: 49,
  avgLecturesOpenedAmongStarters: 12.3,
  avgLecturesCompletedAmongStarters: 8.6,
  rawVideoWatchedSeconds: 760533,
  cappedVideoWatchedSeconds: 706575,
  cappedActiveSessionSeconds: 1047721,
  avgModuleProgressAmongActive: 33.1,
  medianCappedActiveSecondsPerActive: 19116,
  medianCappedVideoSecondsPerVideoLearner: 16620,
};

const summaryStats = {
  learners: 57,
  learnersWithActiveTime: 47,
  learnersWithVideoWatch: 46,
  p25CappedActiveSeconds: 4887,
  medianCappedActiveSeconds: 19116,
  p75CappedActiveSeconds: 31873,
  p25CappedVideoSeconds: 3168,
  medianCappedVideoSeconds: 16620,
  p75CappedVideoSeconds: 27437,
  avgLecturesOpenedAmongStarters: 12.3,
  medianLecturesOpenedAmongStarters: 14,
  avgPretestPercent: 70,
  medianPretestPercent: 72,
};

const quality = {
  learnerProfiles: 57,
  approvedLearners: 57,
  learnersWithSnapshots: 49,
  moduleProgressRows: 346,
  moduleSessionRows: 3189,
  lectureProgressRows: 602,
  lectureRowsWatchExceedsDuration: 258,
  rawWatchSecondsOverDuration: 42978,
  moduleSessionsOver6h: 26,
  maxModuleSessionSeconds: 370644,
  learnersRawWatchGtCappedLectureSessionTime: 25,
};

const funnel = [
  ['Approved learners', 57],
  ['Synced progress snapshot', 49],
  ['Pre-course survey submitted', 44],
  ['Pretest submitted', 42],
  ['Started lecture videos', 49],
  ['Opened 10+ lectures', 30],
  ['Opened all 20 lectures', 18],
];

const activeTimeDistribution = [
  ['No recorded active time', 10],
  ['<1 hour', 8],
  ['1-3 hours', 11],
  ['3-6 hours', 6],
  ['6-10 hours', 13],
  ['>10 hours', 9],
];

const videoDistribution = [
  ['No recorded video exposure', 11],
  ['<1 hour', 13],
  ['1-3 hours', 5],
  ['3-6 hours', 9],
  ['6-8 hours', 19],
  ['>8 hours', 0],
];

const lectureOpenedDistribution = [
  ['0', 8],
  ['1-5', 13],
  ['6-10', 7],
  ['11-15', 6],
  ['16-20', 23],
];

const pretestDistribution = [
  ['0-49%', 4],
  ['50-69%', 16],
  ['70-84%', 17],
  ['85-100%', 5],
  ['Not submitted', 15],
];

const quizCountDistribution = [
  ['0', 18],
  ['1-4', 5],
  ['5-9', 10],
  ['10-13', 10],
  ['14', 14],
];

const moduleSummary = [
  {
    moduleId: 'pretest',
    label: 'Pre-course survey/test',
    learnersWithProgress: 46,
    avgPercentComplete: 88,
    medianPercentComplete: 100,
    completedRows: 44,
    sessionRows: 244,
    cappedSessionSeconds: 47855,
    rawSessionSeconds: 47855,
    sessionsOver6h: 0,
    medianSessionSeconds: 33,
    maxSessionSeconds: 2797,
  },
  {
    moduleId: 'lectures',
    label: 'Course lecture videos/quizzes',
    learnersWithProgress: 43,
    avgPercentComplete: 54,
    medianPercentComplete: 60,
    completedRows: 0,
    sessionRows: 2521,
    cappedSessionSeconds: 908031,
    rawSessionSeconds: 2995279,
    sessionsOver6h: 19,
    medianSessionSeconds: 55,
    maxSessionSeconds: 370644,
  },
  {
    moduleId: 'knobology',
    label: 'EBUS knobology',
    learnersWithProgress: 22,
    avgPercentComplete: 21,
    medianPercentComplete: 0,
    completedRows: 3,
    sessionRows: 69,
    cappedSessionSeconds: 8469,
    rawSessionSeconds: 8469,
    sessionsOver6h: 0,
    medianSessionSeconds: 13,
    maxSessionSeconds: 1808,
  },
  {
    moduleId: 'stations',
    label: 'Mediastinal stations',
    learnersWithProgress: 19,
    avgPercentComplete: 16,
    medianPercentComplete: 0,
    completedRows: 0,
    sessionRows: 203,
    cappedSessionSeconds: 71030,
    rawSessionSeconds: 820224,
    sessionsOver6h: 7,
    medianSessionSeconds: 2,
    maxSessionSeconds: 249309,
  },
  {
    moduleId: 'tnm-staging',
    label: 'TNM-9 staging',
    learnersWithProgress: 17,
    avgPercentComplete: 18,
    medianPercentComplete: 0,
    completedRows: 1,
    sessionRows: 51,
    cappedSessionSeconds: 3531,
    rawSessionSeconds: 3531,
    sessionsOver6h: 0,
    medianSessionSeconds: 8,
    maxSessionSeconds: 487,
  },
  {
    moduleId: 'case-001',
    label: '3D anatomy case',
    learnersWithProgress: 19,
    avgPercentComplete: 6,
    medianPercentComplete: 0,
    completedRows: 0,
    sessionRows: 52,
    cappedSessionSeconds: 4608,
    rawSessionSeconds: 4608,
    sessionsOver6h: 0,
    medianSessionSeconds: 12,
    maxSessionSeconds: 985,
  },
  {
    moduleId: 'simulator',
    label: 'EBUS simulator',
    learnersWithProgress: 16,
    avgPercentComplete: 15,
    medianPercentComplete: 0,
    completedRows: 0,
    sessionRows: 42,
    cappedSessionSeconds: 3664,
    rawSessionSeconds: 3664,
    sessionsOver6h: 0,
    medianSessionSeconds: 24,
    maxSessionSeconds: 438,
  },
];

const lectureSummary = [
  { lectureId: 'lecture-01', learnerRows: 49, openedRows: 49, completedRows: 47, durationSeconds: 1053, avgViewedPercent: 70, medianViewedPercent: 100, rawWatchedSeconds: 36863, cappedWatchedSeconds: 36166, rowsWatchExceedsDuration: 8 },
  { lectureId: 'lecture-02', learnerRows: 42, openedRows: 42, completedRows: 31, durationSeconds: 1499, avgViewedPercent: 84, medianViewedPercent: 100, rawWatchedSeconds: 56312, cappedWatchedSeconds: 53122, rowsWatchExceedsDuration: 25 },
  { lectureId: 'lecture-03', learnerRows: 38, openedRows: 38, completedRows: 31, durationSeconds: 761, avgViewedPercent: 93, medianViewedPercent: 100, rawWatchedSeconds: 28770, cappedWatchedSeconds: 25999, rowsWatchExceedsDuration: 20 },
  { lectureId: 'lecture-04', learnerRows: 37, openedRows: 37, completedRows: 27, durationSeconds: 1952, avgViewedPercent: 91, medianViewedPercent: 100, rawWatchedSeconds: 66550, cappedWatchedSeconds: 63615, rowsWatchExceedsDuration: 20 },
  { lectureId: 'lecture-05', learnerRows: 37, openedRows: 37, completedRows: 31, durationSeconds: 1781, avgViewedPercent: 89, medianViewedPercent: 100, rawWatchedSeconds: 65295, cappedWatchedSeconds: 56912, rowsWatchExceedsDuration: 26 },
  { lectureId: 'lecture-06', learnerRows: 35, openedRows: 35, completedRows: 27, durationSeconds: 2723, avgViewedPercent: 84, medianViewedPercent: 100, rawWatchedSeconds: 89054, cappedWatchedSeconds: 77745, rowsWatchExceedsDuration: 23 },
  { lectureId: 'lecture-07', learnerRows: 34, openedRows: 34, completedRows: 16, durationSeconds: 1311, avgViewedPercent: 79, medianViewedPercent: 98, rawWatchedSeconds: 35767, cappedWatchedSeconds: 33731, rowsWatchExceedsDuration: 7 },
  { lectureId: 'lecture-08', learnerRows: 36, openedRows: 36, completedRows: 25, durationSeconds: 695, avgViewedPercent: 91, medianViewedPercent: 100, rawWatchedSeconds: 24013, cappedWatchedSeconds: 22085, rowsWatchExceedsDuration: 17 },
  { lectureId: 'lecture-09', learnerRows: 33, openedRows: 33, completedRows: 19, durationSeconds: 1502, avgViewedPercent: 83, medianViewedPercent: 100, rawWatchedSeconds: 41974, cappedWatchedSeconds: 39716, rowsWatchExceedsDuration: 18 },
  { lectureId: 'lecture-10', learnerRows: 30, openedRows: 30, completedRows: 23, durationSeconds: 1089, avgViewedPercent: 85, medianViewedPercent: 100, rawWatchedSeconds: 29340, cappedWatchedSeconds: 26758, rowsWatchExceedsDuration: 13 },
  { lectureId: 'lecture-11', learnerRows: 29, openedRows: 29, completedRows: 20, durationSeconds: 1742, avgViewedPercent: 87, medianViewedPercent: 100, rawWatchedSeconds: 44070, cappedWatchedSeconds: 42203, rowsWatchExceedsDuration: 12 },
  { lectureId: 'lecture-12', learnerRows: 26, openedRows: 26, completedRows: 18, durationSeconds: 1537, avgViewedPercent: 93, medianViewedPercent: 100, rawWatchedSeconds: 38678, cappedWatchedSeconds: 35519, rowsWatchExceedsDuration: 16 },
  { lectureId: 'lecture-13', learnerRows: 26, openedRows: 26, completedRows: 17, durationSeconds: 1289, avgViewedPercent: 85, medianViewedPercent: 100, rawWatchedSeconds: 28089, cappedWatchedSeconds: 27246, rowsWatchExceedsDuration: 5 },
  { lectureId: 'lecture-14', learnerRows: 25, openedRows: 25, completedRows: 15, durationSeconds: 1233, avgViewedPercent: 91, medianViewedPercent: 100, rawWatchedSeconds: 27669, cappedWatchedSeconds: 26882, rowsWatchExceedsDuration: 8 },
  { lectureId: 'lecture-15', learnerRows: 23, openedRows: 23, completedRows: 17, durationSeconds: 1405, avgViewedPercent: 90, medianViewedPercent: 100, rawWatchedSeconds: 29556, cappedWatchedSeconds: 27679, rowsWatchExceedsDuration: 12 },
  { lectureId: 'lecture-16', learnerRows: 23, openedRows: 23, completedRows: 16, durationSeconds: 1128, avgViewedPercent: 89, medianViewedPercent: 100, rawWatchedSeconds: 22705, cappedWatchedSeconds: 21893, rowsWatchExceedsDuration: 5 },
  { lectureId: 'lecture-17', learnerRows: 20, openedRows: 20, completedRows: 13, durationSeconds: 1305, avgViewedPercent: 81, medianViewedPercent: 100, rawWatchedSeconds: 21154, cappedWatchedSeconds: 19881, rowsWatchExceedsDuration: 5 },
  { lectureId: 'lecture-18', learnerRows: 20, openedRows: 20, completedRows: 8, durationSeconds: 1275, avgViewedPercent: 77, medianViewedPercent: 100, rawWatchedSeconds: 20069, cappedWatchedSeconds: 18430, rowsWatchExceedsDuration: 5 },
  { lectureId: 'lecture-19', learnerRows: 21, openedRows: 21, completedRows: 8, durationSeconds: 2214, avgViewedPercent: 77, medianViewedPercent: 98, rawWatchedSeconds: 35077, cappedWatchedSeconds: 33464, rowsWatchExceedsDuration: 5 },
  { lectureId: 'lecture-20', learnerRows: 18, openedRows: 18, completedRows: 12, durationSeconds: 1186, avgViewedPercent: 88, medianViewedPercent: 100, rawWatchedSeconds: 19528, cappedWatchedSeconds: 17529, rowsWatchExceedsDuration: 8 },
];

const quizSummary = [
  { assessmentId: 'post-lecture-02', completedCount: 38, avgPercent: 95, medianPercent: 100, lastCompletedAt: '2026-05-30T04:15:05.817Z' },
  { assessmentId: 'post-lecture-03', completedCount: 36, avgPercent: 87, medianPercent: 100, lastCompletedAt: '2026-05-30T04:25:04.780Z' },
  { assessmentId: 'post-lecture-04', completedCount: 35, avgPercent: 85, medianPercent: 80, lastCompletedAt: '2026-05-28T04:48:06.477Z' },
  { assessmentId: 'post-lecture-05', completedCount: 35, avgPercent: 82, medianPercent: 80, lastCompletedAt: '2026-05-29T16:01:29.079Z' },
  { assessmentId: 'post-lecture-06-07', completedCount: 32, avgPercent: 81, medianPercent: 80, lastCompletedAt: '2026-05-30T04:44:26.334Z' },
  { assessmentId: 'post-lecture-08', completedCount: 34, avgPercent: 76, medianPercent: 80, lastCompletedAt: '2026-05-30T00:32:04.923Z' },
  { assessmentId: 'post-lecture-09', completedCount: 29, avgPercent: 74, medianPercent: 80, lastCompletedAt: '2026-05-30T05:02:54.532Z' },
  { assessmentId: 'post-lecture-10-11', completedCount: 26, avgPercent: 90, medianPercent: 100, lastCompletedAt: '2026-05-29T22:56:59.542Z' },
  { assessmentId: 'post-lecture-12', completedCount: 25, avgPercent: 89, medianPercent: 100, lastCompletedAt: '2026-05-29T23:14:15.469Z' },
  { assessmentId: 'post-lecture-13', completedCount: 24, avgPercent: 86, medianPercent: 100, lastCompletedAt: '2026-05-29T23:27:10.222Z' },
  { assessmentId: 'post-lecture-14', completedCount: 21, avgPercent: 82, medianPercent: 80, lastCompletedAt: '2026-05-30T00:45:25.952Z' },
  { assessmentId: 'post-lecture-16', completedCount: 18, avgPercent: 83, medianPercent: 86, lastCompletedAt: '2026-05-30T00:48:59.920Z' },
  { assessmentId: 'post-lecture-17-18', completedCount: 17, avgPercent: 83, medianPercent: 83, lastCompletedAt: '2026-05-29T17:54:59.077Z' },
  { assessmentId: 'post-lecture-19', completedCount: 15, avgPercent: 83, medianPercent: 86, lastCompletedAt: '2026-05-29T19:58:38.108Z' },
];

const workbook = Workbook.create();
const lectureLookup = await buildLectureLookup();
const assessmentLookup = await buildAssessmentLookup();

const palette = {
  navy: '#17324D',
  teal: '#0F766E',
  blue: '#2563EB',
  green: '#15803D',
  amber: '#B45309',
  red: '#B91C1C',
  ink: '#1F2937',
  muted: '#6B7280',
  line: '#D7DEE8',
  paleBlue: '#EAF2FF',
  paleTeal: '#E8F7F4',
  paleAmber: '#FFF4DF',
  white: '#FFFFFF',
};

function secondsToHours(seconds) {
  return Math.round((seconds / 3600) * 10) / 10;
}

function secondsToMinutes(seconds) {
  return Math.round((seconds / 60) * 10) / 10;
}

function percent(part, whole) {
  return whole > 0 ? part / whole : 0;
}

function colName(index) {
  let name = '';
  let n = index;
  while (n > 0) {
    const rem = (n - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

function rangeAddress(startRow, startCol, rowCount, colCount) {
  const start = `${colName(startCol)}${startRow}`;
  const end = `${colName(startCol + colCount - 1)}${startRow + rowCount - 1}`;
  return `${start}:${end}`;
}

function setValues(sheet, startRow, startCol, rows) {
  if (!rows.length || !rows[0]?.length) {
    return null;
  }
  const range = sheet.getRange(rangeAddress(startRow, startCol, rows.length, rows[0].length));
  range.values = rows;
  return range;
}

function setTitle(sheet, title, subtitle) {
  sheet.getRange('A1:L1').merge();
  sheet.getRange('A2:L2').merge();
  sheet.getRange('A1').values = [[title]];
  sheet.getRange('A1').format = {
    fill: palette.navy,
    font: { bold: true, size: 18, color: palette.white },
    verticalAlignment: 'center',
  };
  sheet.getRange('A1:L1').format.fill = palette.navy;
  sheet.getRange('A1:L1').format.rowHeightPx = 28;
  sheet.getRange('A2').values = [[subtitle]];
  sheet.getRange('A2:L2').format = {
    fill: palette.paleBlue,
    font: { italic: true, color: palette.ink },
    wrapText: true,
    verticalAlignment: 'center',
  };
  sheet.getRange('A2:L2').format.rowHeightPx = 42;
}

function styleTable(sheet, startRow, startCol, rows, cols, options = {}) {
  const full = sheet.getRange(rangeAddress(startRow, startCol, rows, cols));
  full.format = {
    borders: { preset: 'all', style: 'thin', color: palette.line },
    font: { size: 10, color: palette.ink },
    verticalAlignment: 'center',
  };
  const header = sheet.getRange(rangeAddress(startRow, startCol, 1, cols));
  header.format = {
    fill: options.headerFill ?? palette.teal,
    font: { bold: true, color: palette.white },
    wrapText: true,
    horizontalAlignment: 'center',
    verticalAlignment: 'center',
    borders: { preset: 'all', style: 'thin', color: palette.white },
  };
  if (rows > 1) {
    const body = sheet.getRange(rangeAddress(startRow + 1, startCol, rows - 1, cols));
    body.format.wrapText = true;
  }
}

function styleSectionHeader(sheet, cell, label, fill = palette.paleTeal) {
  const range = sheet.getRange(cell);
  range.values = [[label]];
  range.format = {
    fill,
    font: { bold: true, color: palette.ink, size: 12 },
    borders: { preset: 'outside', style: 'thin', color: palette.line },
  };
}

function setColumnWidths(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.getRange(`${colName(index + 1)}:${colName(index + 1)}`).format.columnWidthPx = width;
  });
}

function addNoteBlock(sheet, startRow, lines) {
  const rows = lines.map(([label, text]) => [label, text]);
  setValues(sheet, startRow, 1, [['Note', 'Detail'], ...rows]);
  styleTable(sheet, startRow, 1, rows.length + 1, 2, { headerFill: palette.amber });
  sheet.getRange(`A${startRow + 1}:A${startRow + rows.length}`).format.font = { bold: true, color: palette.ink };
  sheet.getRange(`B${startRow + 1}:B${startRow + rows.length}`).format.wrapText = true;
}

async function buildLectureLookup() {
  const lectureRaw = await fs.readFile(path.join(repoRoot, 'apps/web/src/content/lectures.json'), 'utf8');
  const welcomeRaw = await fs.readFile(path.join(repoRoot, 'content/course/welcome.json'), 'utf8');
  const lectures = JSON.parse(lectureRaw);
  const welcome = JSON.parse(welcomeRaw);
  return new Map([welcome, ...lectures].map((lecture) => [lecture.id, lecture]));
}

async function buildAssessmentLookup() {
  const raw = await fs.readFile(path.join(repoRoot, 'content/course/course-assessments.json'), 'utf8');
  const data = JSON.parse(raw);
  return new Map(data.assessments.map((assessment) => [assessment.id, assessment]));
}

function addDashboard() {
  const sheet = workbook.worksheets.add('Executive Summary');
  setColumnWidths(sheet, [185, 110, 270, 35, 135, 135, 135, 135, 135, 135, 135, 135]);
  setTitle(
    sheet,
    'SoCal EBUS Prep: Pre-course Usage and Engagement',
    `Live Supabase export generated ${generatedAtUtc}. Report uses anonymized aggregate data and representative capped metrics.`,
  );

  const cards = [
    ['Approved learners', kpis.approvedProfiles, 'All approved course accounts'],
    ['Active/synced learners', kpis.activeLearners, `${Math.round(percent(kpis.activeLearners, kpis.approvedProfiles) * 100)}% of approved learners`],
    ['Pre-course survey', kpis.preCourseSurveySubmissions, `${Math.round(percent(kpis.preCourseSurveySubmissions, kpis.approvedProfiles) * 100)}% submitted`],
    ['Pretest submitted', kpis.pretestSubmissions, `${Math.round(percent(kpis.pretestSubmissions, kpis.approvedProfiles) * 100)}% submitted`],
    ['Started lectures', kpis.learnersStartedLectures, `${Math.round(percent(kpis.learnersStartedLectures, kpis.approvedProfiles) * 100)}% opened at least one`],
    ['Opened all lectures', 18, `${Math.round(percent(18, kpis.approvedProfiles) * 100)}% opened all 20`],
    ['Capped video exposure', secondsToHours(kpis.cappedVideoWatchedSeconds), 'hours, capped at each video length'],
    ['Representative active time', secondsToHours(kpis.cappedActiveSessionSeconds), 'hours, sessions capped at 2h'],
  ];

  setValues(sheet, 4, 1, [['Metric', 'Value', 'Interpretation'], ...cards]);
  styleTable(sheet, 4, 1, cards.length + 1, 3, { headerFill: palette.navy });
  sheet.getRange('B5:B12').format = { numberFormat: '0.0', horizontalAlignment: 'right' };
  sheet.getRange('A5:A12').format.font = { bold: true, color: palette.ink };

  const findingRows = [
    ['Best headline metric', `${secondsToHours(kpis.cappedVideoWatchedSeconds)} hours of capped video exposure across ${summaryStats.learnersWithVideoWatch} learners with recorded video activity.`],
    ['Median engagement', `Median learner with recorded activity had ${secondsToHours(summaryStats.medianCappedActiveSeconds)} capped active hours and ${secondsToHours(summaryStats.medianCappedVideoSeconds)} capped video exposure hours.`],
    ['Lecture reach', `${kpis.learnersStartedLectures} learners started lecture videos; ${funnel.find((row) => row[0] === 'Opened 10+ lectures')[1]} opened at least 10 lectures; 18 opened all 20 lectures.`],
    ['Assessment completion', `${kpis.preCourseSurveySubmissions} submitted the pre-course survey and ${kpis.pretestSubmissions} submitted the pretest. Average pretest score was ${kpis.avgPretestPercent}%.`],
    ['Data interpretation', 'Raw watch and page-open seconds are retained for audit, but capped metrics are the recommended representative numbers because playback speed, rewatching, and idle tabs distort raw totals.'],
  ];
  styleSectionHeader(sheet, 'A14', 'Executive Readout', palette.paleTeal);
  setValues(sheet, 15, 1, [['Finding', 'Detail', ''], ...findingRows.map((row) => [row[0], row[1], ''])]);
  for (let row = 15; row <= 20; row += 1) {
    sheet.getRange(`B${row}:C${row}`).merge();
  }
  styleTable(sheet, 15, 1, findingRows.length + 1, 3, { headerFill: palette.teal });
  sheet.getRange('A16:A20').format.font = { bold: true, color: palette.ink };
  sheet.getRange('B16:C20').format.wrapText = true;

  const chartCategories = funnel.map((row) => row[0].replace(' progress snapshot', '').replace(' submitted', ''));
  const chartValues = funnel.map((row) => row[1]);
  sheet.charts.add('bar', {
    title: 'Pre-course Engagement Funnel',
    categories: chartCategories,
    series: [{ name: 'Learners', values: chartValues }],
    hasLegend: false,
    barOptions: { direction: 'column', grouping: 'clustered', gapWidth: 80 },
    dataLabels: { showValue: true },
    from: { row: 3, col: 5 },
    extent: { widthPx: 640, heightPx: 330 },
  });

  sheet.charts.add('bar', {
    title: 'Representative Active Hours by Module',
    categories: moduleSummary.map((row) => row.label),
    series: [{ name: 'Capped active hours', values: moduleSummary.map((row) => secondsToHours(row.cappedSessionSeconds)) }],
    hasLegend: false,
    barOptions: { direction: 'column', grouping: 'clustered', gapWidth: 90 },
    dataLabels: { showValue: true },
    from: { row: 16, col: 5 },
    extent: { widthPx: 640, heightPx: 330 },
  });
}

function addFunnelSheet() {
  const sheet = workbook.worksheets.add('Funnel & Distributions');
  setColumnWidths(sheet, [210, 90, 110, 35, 220, 90, 220, 90, 35, 220, 90, 90]);
  setTitle(sheet, 'Funnel and Engagement Distributions', 'Counts are learner-level and anonymized. Percentages use approved learners as the denominator unless noted.');

  const funnelRows = funnel.map(([stage, learners]) => [stage, learners, percent(learners, kpis.approvedProfiles)]);
  setValues(sheet, 4, 1, [['Funnel stage', 'Learners', '% of approved'], ...funnelRows]);
  styleTable(sheet, 4, 1, funnelRows.length + 1, 3, { headerFill: palette.navy });
  sheet.getRange('C5:C11').format.numberFormat = '0%';

  const distRows = activeTimeDistribution.map((row, index) => [row[0], row[1], videoDistribution[index]?.[0] ?? '', videoDistribution[index]?.[1] ?? null]);
  setValues(sheet, 4, 5, [['Capped active-time band', 'Learners', 'Capped video-exposure band', 'Learners'], ...distRows]);
  styleTable(sheet, 4, 5, distRows.length + 1, 4, { headerFill: palette.teal });

  const openedRows = lectureOpenedDistribution.map((row, index) => [row[0], row[1], pretestDistribution[index]?.[0] ?? '', pretestDistribution[index]?.[1] ?? null]);
  setValues(sheet, 14, 1, [['Lectures opened band', 'Learners', 'Pretest score band', 'Learners'], ...openedRows]);
  styleTable(sheet, 14, 1, openedRows.length + 1, 4, { headerFill: palette.teal });

  setValues(sheet, 14, 10, [['Post-lecture quizzes completed', 'Learners'], ...quizCountDistribution]);
  styleTable(sheet, 14, 10, quizCountDistribution.length + 1, 2, { headerFill: palette.teal });

  sheet.charts.add('bar', {
    title: 'Capped Video Exposure Distribution',
    categories: videoDistribution.map((row) => row[0]),
    series: [{ name: 'Learners', values: videoDistribution.map((row) => row[1]) }],
    hasLegend: false,
    barOptions: { direction: 'column', grouping: 'clustered', gapWidth: 80 },
    dataLabels: { showValue: true },
    from: { row: 22, col: 1 },
    extent: { widthPx: 520, heightPx: 280 },
  });

  sheet.charts.add('bar', {
    title: 'Lectures Opened Distribution',
    categories: lectureOpenedDistribution.map((row) => row[0]),
    series: [{ name: 'Learners', values: lectureOpenedDistribution.map((row) => row[1]) }],
    hasLegend: false,
    barOptions: { direction: 'column', grouping: 'clustered', gapWidth: 80 },
    dataLabels: { showValue: true },
    from: { row: 22, col: 7 },
    extent: { widthPx: 520, heightPx: 280 },
  });
}

function addModuleSheet() {
  const sheet = workbook.worksheets.add('Module Engagement');
  setColumnWidths(sheet, [145, 220, 110, 100, 105, 105, 120, 125, 120, 120, 125, 120]);
  setTitle(sheet, 'Module Engagement', 'Representative active time uses raw route-session records with each session capped at 2 hours.');
  const rows = moduleSummary.map((row) => [
    row.moduleId,
    row.label,
    row.learnersWithProgress,
    row.avgPercentComplete / 100,
    row.medianPercentComplete / 100,
    row.completedRows,
    row.sessionRows,
    secondsToHours(row.cappedSessionSeconds),
    secondsToHours(row.rawSessionSeconds),
    row.sessionsOver6h,
    secondsToMinutes(row.medianSessionSeconds),
    secondsToHours(row.maxSessionSeconds),
  ]);
  const headers = [
    'Module ID',
    'Module',
    'Learners with progress',
    'Avg progress',
    'Median progress',
    'Completed rows',
    'Session rows',
    'Capped active hours',
    'Raw session hours',
    'Sessions >6h',
    'Median session min',
    'Max session hours',
  ];
  setValues(sheet, 4, 1, [headers, ...rows]);
  styleTable(sheet, 4, 1, rows.length + 1, headers.length, { headerFill: palette.navy });
  sheet.getRange('D5:E11').format.numberFormat = '0%';
  sheet.getRange('H5:I11').format.numberFormat = '0.0';
  sheet.getRange('K5:L11').format.numberFormat = '0.0';
  sheet.getRange('H5:H11').conditionalFormats.add('dataBar', { color: palette.blue, gradient: true });
  sheet.getRange('J5:J11').conditionalFormats.addCellIs({
    operator: 'greaterThan',
    formula: 0,
    format: { fill: palette.paleAmber, font: { color: palette.amber, bold: true } },
  });
}

function addLectureSheet() {
  const sheet = workbook.worksheets.add('Lecture Engagement');
  setColumnWidths(sheet, [105, 110, 300, 100, 95, 95, 95, 105, 105, 120, 120, 125]);
  setTitle(sheet, 'Lecture Video Engagement', 'Capped video exposure limits each learner-video row to the recorded video duration.');
  const headers = [
    'Lecture ID',
    'Week',
    'Title',
    'Opened rows',
    'Completed rows',
    'Completion rate',
    'Duration min',
    'Avg viewed',
    'Median viewed',
    'Capped watch h',
    'Raw watch h',
    'Rows watch > duration',
  ];
  const rows = lectureSummary.map((row) => {
    const lecture = lectureLookup.get(row.lectureId) ?? {};
    return [
      row.lectureId,
      lecture.week ?? row.lectureId,
      lecture.title ?? row.lectureId,
      row.openedRows,
      row.completedRows,
      percent(row.completedRows, row.openedRows),
      secondsToMinutes(row.durationSeconds),
      row.avgViewedPercent / 100,
      row.medianViewedPercent / 100,
      secondsToHours(row.cappedWatchedSeconds),
      secondsToHours(row.rawWatchedSeconds),
      row.rowsWatchExceedsDuration,
    ];
  });
  setValues(sheet, 4, 1, [headers, ...rows]);
  styleTable(sheet, 4, 1, rows.length + 1, headers.length, { headerFill: palette.navy });
  sheet.getRange('F5:F24').format.numberFormat = '0%';
  sheet.getRange('H5:I24').format.numberFormat = '0%';
  sheet.getRange('G5:G24').format.numberFormat = '0.0';
  sheet.getRange('J5:K24').format.numberFormat = '0.0';
  sheet.getRange('J5:J24').conditionalFormats.add('dataBar', { color: palette.green, gradient: true });
  sheet.charts.add('line', {
    title: 'Lecture Reach by Sequence',
    categories: rows.map((row) => row[1]),
    series: [
      { name: 'Opened rows', values: rows.map((row) => row[3]) },
      { name: 'Completed rows', values: rows.map((row) => row[4]) },
    ],
    hasLegend: true,
    legend: { position: 'bottom' },
    dataLabels: { showValue: false },
    from: { row: 27, col: 1 },
    extent: { widthPx: 760, heightPx: 320 },
  });
}

function addQuizSheet() {
  const sheet = workbook.worksheets.add('Quiz Engagement');
  setColumnWidths(sheet, [160, 320, 120, 100, 110, 170, 35, 220, 95]);
  setTitle(sheet, 'Post-lecture Quiz Engagement', 'Quiz rows are sourced from synced learner progress snapshots and exclude the final post-test.');
  const headers = ['Assessment ID', 'Title', 'Completed learners', 'Avg score', 'Median score', 'Last completed UTC'];
  const rows = quizSummary.map((row) => {
    const assessment = assessmentLookup.get(row.assessmentId) ?? {};
    return [
      row.assessmentId,
      assessment.title ?? row.assessmentId,
      row.completedCount,
      row.avgPercent / 100,
      row.medianPercent / 100,
      row.lastCompletedAt,
    ];
  });
  setValues(sheet, 4, 1, [headers, ...rows]);
  styleTable(sheet, 4, 1, rows.length + 1, headers.length, { headerFill: palette.navy });
  sheet.getRange('D5:E18').format.numberFormat = '0%';
  sheet.getRange('F5:F18').format.numberFormat = 'yyyy-mm-dd hh:mm';
  sheet.getRange('C5:C18').conditionalFormats.add('dataBar', { color: palette.blue, gradient: true });

  setValues(sheet, 4, 8, [['Completed quiz count band', 'Learners'], ...quizCountDistribution]);
  styleTable(sheet, 4, 8, quizCountDistribution.length + 1, 2, { headerFill: palette.teal });
  sheet.charts.add('bar', {
    title: 'Quiz Completion Depth',
    categories: quizCountDistribution.map((row) => row[0]),
    series: [{ name: 'Learners', values: quizCountDistribution.map((row) => row[1]) }],
    hasLegend: false,
    barOptions: { direction: 'column', grouping: 'clustered', gapWidth: 80 },
    dataLabels: { showValue: true },
    from: { row: 12, col: 8 },
    extent: { widthPx: 420, heightPx: 260 },
  });
}

function addNotesSheet() {
  const sheet = workbook.worksheets.add('Metric Notes');
  setColumnWidths(sheet, [220, 740]);
  setTitle(sheet, 'Metric Definitions and Data Quality Notes', 'Use this sheet when interpreting totals or comparing learners.');
  addNoteBlock(sheet, 4, [
    ['Scope', 'Pre-course report includes approved learners, welcome/course lecture videos, pre-course survey and test, post-lecture quizzes, and interactive prep modules: knobology, stations, TNM staging, 3D anatomy, and simulator.'],
    ['Recommended video metric', 'Capped video exposure is the best representative video measure in this export. It uses least(watched_seconds, duration_seconds) per learner and lecture to reduce inflation from rewatching and playback speed.'],
    ['Raw video watch seconds', 'Raw watch seconds are video timeline seconds advanced. They may exceed wall-clock time because learners can watch at faster playback speeds, replay sections, or trigger repeated play intervals.'],
    ['Recommended active-time metric', 'Representative active time uses route session rows with each session capped at 2 hours. This reduces, but does not eliminate, idle-tab inflation.'],
    ['Raw session time', 'Raw route-session seconds are retained for audit. Current data include 26 module sessions over 6 hours and a maximum recorded session of 102.96 hours, consistent with tabs left open.'],
    ['Lecture opened / quiz ready', 'The app marks a lecture as quiz ready when it is opened or has any playback activity. This is intentionally not the same as full video completion.'],
    ['Lecture completion', 'Completion is based on the app video-completion rule or explicit review action. It is useful for workflow status but should not be interpreted as clinically validated education exposure.'],
    ['Privacy', 'The workbook contains aggregate and anonymized data only. Names, emails, and learner IDs are not included.'],
    ['Source', 'Data source: Supabase project tqnhxlwvkkswuckszlee, public learner_* tables, queried read-only via the Supabase connector.'],
  ]);

  styleSectionHeader(sheet, 'A17', 'Data Quality Snapshot', palette.paleAmber);
  const qualityRows = [
    ['Learner profiles', quality.learnerProfiles],
    ['Approved learners', quality.approvedLearners],
    ['Learners with synced snapshots', quality.learnersWithSnapshots],
    ['Module progress rows', quality.moduleProgressRows],
    ['Module session rows', quality.moduleSessionRows],
    ['Lecture progress rows', quality.lectureProgressRows],
    ['Lecture rows where raw watch > duration', quality.lectureRowsWatchExceedsDuration],
    ['Raw watch seconds above duration', quality.rawWatchSecondsOverDuration],
    ['Module sessions over 6 hours', quality.moduleSessionsOver6h],
    ['Maximum raw module session hours', secondsToHours(quality.maxModuleSessionSeconds)],
    ['Learners raw watch > capped lecture session time', quality.learnersRawWatchGtCappedLectureSessionTime],
  ];
  setValues(sheet, 18, 1, [['Quality indicator', 'Value'], ...qualityRows]);
  styleTable(sheet, 18, 1, qualityRows.length + 1, 2, { headerFill: palette.amber });
  sheet.getRange('B19:B27').format.numberFormat = '0';
  sheet.getRange('B28').format.numberFormat = '0.0';
  sheet.getRange('B29').format.numberFormat = '0';
}

addDashboard();
addFunnelSheet();
addModuleSheet();
addLectureSheet();
addQuizSheet();
addNotesSheet();

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

const inspect = await workbook.inspect({
  kind: 'table',
  range: 'Executive Summary!A1:H20',
  include: 'values,formulas',
  tableMaxRows: 24,
  tableMaxCols: 8,
});
console.log(inspect.ndjson);

const errors = await workbook.inspect({
  kind: 'match',
  searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',
  options: { useRegex: true, maxResults: 100 },
  summary: 'final formula error scan',
});
console.log(errors.ndjson);

for (const sheetName of ['Executive Summary', 'Funnel & Distributions', 'Module Engagement', 'Lecture Engagement', 'Quiz Engagement', 'Metric Notes']) {
  const blob = await workbook.render({ sheetName, range: 'A1:L32', scale: 1 });
  const renderPath = path.join(outputDir, `${sheetName.replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '').toLowerCase()}.png`);
  await fs.writeFile(renderPath, Buffer.from(await blob.arrayBuffer()));
  console.log(`rendered ${sheetName} -> ${renderPath}`);
}

console.log(`saved ${outputPath}`);
