import fs from 'node:fs/promises';
import path from 'node:path';

import { FileBlob, SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const repoRoot = '/Users/russellmiller/Projects/EBUS-course';
const outputDir = path.join(repoRoot, 'outputs/precourse-engagement-by-learner-2026-05-30');
const outputPath = path.join(outputDir, 'socal_ebus_precourse_usage_by_learner_2026-05-30.xlsx');

const supabaseUrl = 'https://tqnhxlwvkkswuckszlee.supabase.co';
const anonKey = 'sb_publishable_RfW8pWkB6o0Ve-XwhapJOQ_nebXhlE6';
const generatedAtUtc = new Date().toISOString();
const totalLectureCount = 20;
const sessionCapSeconds = 7200;

const moduleLabels = {
  pretest: 'Pre-course survey/test',
  lectures: 'Course lecture videos/quizzes',
  knobology: 'EBUS knobology',
  stations: 'Mediastinal stations',
  'tnm-staging': 'TNM-9 staging',
  'case-001': '3D anatomy case',
  simulator: 'EBUS simulator',
};

const metricRollups = [
  { learner_id: '9081226e-c91b-4fcc-9261-8ddcbc59a42e', lecture_rows: 0, last_activity_at: null, raw_video_seconds: 0, avg_viewed_percent: 0, lectures_completed: 0, raw_session_seconds: 0, capped_video_seconds: 0, module_session_count: 0, capped_session_seconds: 0, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: 'fa818760-1c97-40a2-969d-dac001ec8a3f', lecture_rows: 1, last_activity_at: '2026-05-30T03:32:33.606+00:00', raw_video_seconds: 60, avg_viewed_percent: 0, lectures_completed: 1, raw_session_seconds: 41, capped_video_seconds: 60, module_session_count: 2, capped_session_seconds: 41, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: '72d9fb52-8e6b-47ae-a570-7263e5455367', lecture_rows: 0, last_activity_at: null, raw_video_seconds: 0, avg_viewed_percent: 0, lectures_completed: 0, raw_session_seconds: 0, capped_video_seconds: 0, module_session_count: 0, capped_session_seconds: 0, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: '9ba91cce-2e9e-4405-b2dc-e2c67adef09f', lecture_rows: 4, last_activity_at: '2026-05-30T04:26:29.863+00:00', raw_video_seconds: 3403, avg_viewed_percent: 75, lectures_completed: 3, raw_session_seconds: 817, capped_video_seconds: 3310, module_session_count: 8, capped_session_seconds: 817, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 1 },
  { learner_id: '7c4f1b0f-a64d-440d-bc9d-bf5e4b2fe3a8', lecture_rows: 0, last_activity_at: null, raw_video_seconds: 0, avg_viewed_percent: 0, lectures_completed: 0, raw_session_seconds: 0, capped_video_seconds: 0, module_session_count: 0, capped_session_seconds: 0, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: 'd2fe1a17-4e91-42f0-b03a-925e2229f0c3', lecture_rows: 0, last_activity_at: null, raw_video_seconds: 0, avg_viewed_percent: 0, lectures_completed: 0, raw_session_seconds: 0, capped_video_seconds: 0, module_session_count: 0, capped_session_seconds: 0, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: '2d20d7cd-5d40-424d-bf74-db55a79ab592', lecture_rows: 0, last_activity_at: null, raw_video_seconds: 0, avg_viewed_percent: 0, lectures_completed: 0, raw_session_seconds: 0, capped_video_seconds: 0, module_session_count: 0, capped_session_seconds: 0, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: 'b697d9d7-084e-4819-8bed-fec713e98582', lecture_rows: 2, last_activity_at: '2026-05-28T14:08:25.847+00:00', raw_video_seconds: 1053, avg_viewed_percent: 50, lectures_completed: 1, raw_session_seconds: 539, capped_video_seconds: 1053, module_session_count: 2, capped_session_seconds: 539, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: '8466cd1a-6fa1-47c2-b08a-52097295aeec', lecture_rows: 1, last_activity_at: '2026-05-27T04:45:30.848+00:00', raw_video_seconds: 1046, avg_viewed_percent: 99, lectures_completed: 1, raw_session_seconds: 0, capped_video_seconds: 1046, module_session_count: 0, capped_session_seconds: 0, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: 'e049d886-7486-424f-b96f-c3f047c7c939', lecture_rows: 11, last_activity_at: '2026-05-30T05:23:50.305+00:00', raw_video_seconds: 15953, avg_viewed_percent: 96, lectures_completed: 9, raw_session_seconds: 8637, capped_video_seconds: 15432, module_session_count: 14, capped_session_seconds: 8637, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 6 },
  { learner_id: 'c71189fd-5fdd-4820-a4cd-59b1827ae2ee', lecture_rows: 11, last_activity_at: '2026-05-29T22:42:39.524+00:00', raw_video_seconds: 14895, avg_viewed_percent: 96, lectures_completed: 8, raw_session_seconds: 14748, capped_video_seconds: 14883, module_session_count: 77, capped_session_seconds: 14748, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 2 },
  { learner_id: '6f1bc7bc-0abe-4b35-ab30-46da8238c189', lecture_rows: 17, last_activity_at: '2026-05-30T05:15:53.441+00:00', raw_video_seconds: 22622, avg_viewed_percent: 93, lectures_completed: 11, raw_session_seconds: 27357, capped_video_seconds: 22520, module_session_count: 111, capped_session_seconds: 27357, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 4 },
  { learner_id: 'e157675d-1426-4607-9448-0385315e2c6a', lecture_rows: 3, last_activity_at: '2026-05-30T05:23:48.293+00:00', raw_video_seconds: 2000, avg_viewed_percent: 37, lectures_completed: 1, raw_session_seconds: 4913, capped_video_seconds: 1605, module_session_count: 11, capped_session_seconds: 4913, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 1 },
  { learner_id: '48799b5e-f47f-460a-8d78-b09b5be00628', lecture_rows: 20, last_activity_at: '2026-05-30T02:13:40.844+00:00', raw_video_seconds: 28674, avg_viewed_percent: 100, lectures_completed: 20, raw_session_seconds: 35814, capped_video_seconds: 28674, module_session_count: 34, capped_session_seconds: 35814, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: 'b03204ed-db2c-4d0e-9d58-24f568f838a2', lecture_rows: 9, last_activity_at: '2026-05-27T04:09:45.383+00:00', raw_video_seconds: 6591, avg_viewed_percent: 54, lectures_completed: 4, raw_session_seconds: 2431, capped_video_seconds: 6345, module_session_count: 11, capped_session_seconds: 2431, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 2 },
  { learner_id: '68788314-8279-42d2-868d-2279171bf863', lecture_rows: 9, last_activity_at: '2026-05-28T05:36:48.321+00:00', raw_video_seconds: 16742, avg_viewed_percent: 89, lectures_completed: 8, raw_session_seconds: 16148, capped_video_seconds: 11774, module_session_count: 21, capped_session_seconds: 16148, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 7 },
  { learner_id: 'd8ef036b-1603-48f9-8e1a-6eb18187ac8f', lecture_rows: 20, last_activity_at: '2026-05-27T06:36:38.132+00:00', raw_video_seconds: 30621, avg_viewed_percent: 100, lectures_completed: 19, raw_session_seconds: 4288, capped_video_seconds: 28670, module_session_count: 5, capped_session_seconds: 4288, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 16 },
  { learner_id: 'a87d0c3d-4fac-4bb3-8996-98e167761229', lecture_rows: 19, last_activity_at: '2026-05-25T23:32:30.066+00:00', raw_video_seconds: 28706, avg_viewed_percent: 96, lectures_completed: 18, raw_session_seconds: 4098, capped_video_seconds: 25785, module_session_count: 5, capped_session_seconds: 4098, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 14 },
  { learner_id: '0685d181-5158-426d-8470-adc2863c701e', lecture_rows: 6, last_activity_at: '2026-05-28T22:30:37.276+00:00', raw_video_seconds: 7958, avg_viewed_percent: 98, lectures_completed: 4, raw_session_seconds: 12217, capped_video_seconds: 7553, module_session_count: 19, capped_session_seconds: 12217, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 3 },
  { learner_id: '3b4134ad-d199-448b-abc2-f8ef7d5b3a26', lecture_rows: 0, last_activity_at: null, raw_video_seconds: 0, avg_viewed_percent: 0, lectures_completed: 0, raw_session_seconds: 0, capped_video_seconds: 0, module_session_count: 0, capped_session_seconds: 0, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: '29ae882a-2eb7-4903-ad09-96b6cb13f084', lecture_rows: 20, last_activity_at: '2026-05-30T02:28:06.214+00:00', raw_video_seconds: 28812, avg_viewed_percent: 97, lectures_completed: 8, raw_session_seconds: 28743, capped_video_seconds: 27940, module_session_count: 106, capped_session_seconds: 28743, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 10 },
  { learner_id: '8ef54d55-6fd0-49ae-a7c8-a3c40b652ec8', lecture_rows: 14, last_activity_at: '2026-05-29T23:39:31.802+00:00', raw_video_seconds: 19392, avg_viewed_percent: 93, lectures_completed: 8, raw_session_seconds: 83713, capped_video_seconds: 19112, module_session_count: 64, capped_session_seconds: 22851, module_sessions_over_6h: 1, lecture_rows_watch_exceeds_duration: 5 },
  { learner_id: '6696eb12-b368-460c-be1e-b3374ca5f2b3', lecture_rows: 3, last_activity_at: '2026-05-30T05:23:52.683+00:00', raw_video_seconds: 4133, avg_viewed_percent: 100, lectures_completed: 2, raw_session_seconds: 420310, capped_video_seconds: 3313, module_session_count: 67, capped_session_seconds: 25457, module_sessions_over_6h: 2, lecture_rows_watch_exceeds_duration: 2 },
  { learner_id: 'a93ab24d-55b8-4161-8bc5-39c604019f83', lecture_rows: 20, last_activity_at: '2026-05-26T05:01:13.346+00:00', raw_video_seconds: 28377, avg_viewed_percent: 92, lectures_completed: 15, raw_session_seconds: 16451, capped_video_seconds: 26506, module_session_count: 70, capped_session_seconds: 16451, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 10 },
  { learner_id: 'fe126454-e5cb-4672-8dad-c90a1f4ca125', lecture_rows: 20, last_activity_at: '2026-05-29T18:12:26.692+00:00', raw_video_seconds: 28876, avg_viewed_percent: 100, lectures_completed: 18, raw_session_seconds: 23057, capped_video_seconds: 28634, module_session_count: 46, capped_session_seconds: 23057, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 5 },
  { learner_id: 'b14a5af0-9eb3-406f-a79a-054451e7cfc4', lecture_rows: 2, last_activity_at: '2026-05-29T23:14:26.127+00:00', raw_video_seconds: 1592, avg_viewed_percent: 65, lectures_completed: 1, raw_session_seconds: 6128, capped_video_seconds: 1504, module_session_count: 11, capped_session_seconds: 6128, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 1 },
  { learner_id: '34d35754-8961-4ee5-9f53-37eaddfdfa57', lecture_rows: 16, last_activity_at: '2026-05-26T05:15:14.782+00:00', raw_video_seconds: 23675, avg_viewed_percent: 97, lectures_completed: 14, raw_session_seconds: 26368, capped_video_seconds: 22070, module_session_count: 85, capped_session_seconds: 26368, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 10 },
  { learner_id: '3e4abb7d-3576-4f81-9948-cfd98777d770', lecture_rows: 13, last_activity_at: '2026-05-29T05:52:56.083+00:00', raw_video_seconds: 21522, avg_viewed_percent: 100, lectures_completed: 9, raw_session_seconds: 130434, capped_video_seconds: 18916, module_session_count: 80, capped_session_seconds: 38219, module_sessions_over_6h: 2, lecture_rows_watch_exceeds_duration: 10 },
  { learner_id: 'e4374697-d762-4134-a42f-7e05a58134d9', lecture_rows: 20, last_activity_at: '2026-05-28T03:42:54.097+00:00', raw_video_seconds: 22926, avg_viewed_percent: 76, lectures_completed: 9, raw_session_seconds: 43691, capped_video_seconds: 22298, module_session_count: 57, capped_session_seconds: 31873, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 4 },
  { learner_id: 'bb9c2a0d-236b-4304-a86b-8d2c1a546496', lecture_rows: 8, last_activity_at: '2026-05-27T04:21:25.782+00:00', raw_video_seconds: 8704, avg_viewed_percent: 75, lectures_completed: 4, raw_session_seconds: 9616, capped_video_seconds: 7743, module_session_count: 23, capped_session_seconds: 9616, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 5 },
  { learner_id: '0b0339d4-4a38-45ed-b6b8-9b8abdc89e55', lecture_rows: 20, last_activity_at: '2026-05-29T13:40:48.299+00:00', raw_video_seconds: 31634, avg_viewed_percent: 95, lectures_completed: 15, raw_session_seconds: 37056, capped_video_seconds: 27437, module_session_count: 126, capped_session_seconds: 37056, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 19 },
  { learner_id: 'be4cbf1f-ac5e-48ad-95a1-4aec9b93da50', lecture_rows: 17, last_activity_at: '2026-05-30T05:04:34.289+00:00', raw_video_seconds: 25414, avg_viewed_percent: 99, lectures_completed: 16, raw_session_seconds: 31624, capped_video_seconds: 23788, module_session_count: 154, capped_session_seconds: 29016, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 10 },
  { learner_id: '8578f69c-02fe-4e6d-8ab7-6aadc7b60ffe', lecture_rows: 20, last_activity_at: '2026-05-28T05:40:53.324+00:00', raw_video_seconds: 28753, avg_viewed_percent: 100, lectures_completed: 17, raw_session_seconds: 27825, capped_video_seconds: 28513, module_session_count: 77, capped_session_seconds: 27825, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 6 },
  { learner_id: '7e97641e-fb12-4ef1-9219-519dccd3442f', lecture_rows: 20, last_activity_at: '2026-05-28T13:13:40.493+00:00', raw_video_seconds: 28072, avg_viewed_percent: 96, lectures_completed: 18, raw_session_seconds: 29480, capped_video_seconds: 27819, module_session_count: 59, capped_session_seconds: 28541, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 9 },
  { learner_id: '0fa6ace2-1e21-455b-af6b-b0dce4e085cd', lecture_rows: 0, last_activity_at: null, raw_video_seconds: 0, avg_viewed_percent: 0, lectures_completed: 0, raw_session_seconds: 0, capped_video_seconds: 0, module_session_count: 0, capped_session_seconds: 0, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: '470d4ff7-4312-42be-b7f6-f26ad33d1d2e', lecture_rows: 16, last_activity_at: '2026-05-28T14:26:46.734+00:00', raw_video_seconds: 24458, avg_viewed_percent: 96, lectures_completed: 10, raw_session_seconds: 35275, capped_video_seconds: 21879, module_session_count: 54, capped_session_seconds: 35275, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 12 },
  { learner_id: '09e51430-103d-4f1c-a560-e8c2681a6d3b', lecture_rows: 14, last_activity_at: '2026-05-27T23:11:44.567+00:00', raw_video_seconds: 20300, avg_viewed_percent: 95, lectures_completed: 8, raw_session_seconds: 20350, capped_video_seconds: 19334, module_session_count: 48, capped_session_seconds: 20350, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 8 },
  { learner_id: '372c5e73-2d89-4e62-9751-43cb44c75d9f', lecture_rows: 20, last_activity_at: '2026-05-26T04:01:23.524+00:00', raw_video_seconds: 29163, avg_viewed_percent: 97, lectures_completed: 15, raw_session_seconds: 28866, capped_video_seconds: 27594, module_session_count: 75, capped_session_seconds: 28691, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 12 },
  { learner_id: '13f92793-287a-4731-96a3-b109883fab75', lecture_rows: 1, last_activity_at: '2026-05-26T01:23:20.962+00:00', raw_video_seconds: 60, avg_viewed_percent: 0, lectures_completed: 1, raw_session_seconds: 658, capped_video_seconds: 60, module_session_count: 5, capped_session_seconds: 658, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: '9e4f2841-05f1-43ac-af62-1660e29c7243', lecture_rows: 20, last_activity_at: '2026-05-29T23:26:18.552+00:00', raw_video_seconds: 21378, avg_viewed_percent: 71, lectures_completed: 5, raw_session_seconds: 191149, capped_video_seconds: 21254, module_session_count: 91, capped_session_seconds: 38554, module_sessions_over_6h: 2, lecture_rows_watch_exceeds_duration: 2 },
  { learner_id: '044358ca-9417-43d4-82c9-599839fd3367', lecture_rows: 9, last_activity_at: '2026-05-30T04:26:33.404+00:00', raw_video_seconds: 14516, avg_viewed_percent: 95, lectures_completed: 8, raw_session_seconds: 1028869, capped_video_seconds: 12582, module_session_count: 145, capped_session_seconds: 98783, module_sessions_over_6h: 9, lecture_rows_watch_exceeds_duration: 3 },
  { learner_id: 'e8f31585-661d-4e9c-8884-a530be0488dd', lecture_rows: 20, last_activity_at: '2026-05-19T19:01:45.925+00:00', raw_video_seconds: 17345, avg_viewed_percent: 64, lectures_completed: 12, raw_session_seconds: 238984, capped_video_seconds: 16620, module_session_count: 73, capped_session_seconds: 46647, module_sessions_over_6h: 2, lecture_rows_watch_exceeds_duration: 5 },
  { learner_id: 'da0b5e1d-2ac0-4fa0-bea7-d39166aa9f4c', lecture_rows: 20, last_activity_at: '2026-05-30T01:56:53.041+00:00', raw_video_seconds: 29965, avg_viewed_percent: 100, lectures_completed: 18, raw_session_seconds: 300336, capped_video_seconds: 28629, module_session_count: 615, capped_session_seconds: 51576, module_sessions_over_6h: 1, lecture_rows_watch_exceeds_duration: 15 },
  { learner_id: '4e352a8e-7bda-4ad9-be80-879ca089f6f5', lecture_rows: 20, last_activity_at: '2026-05-30T01:18:42.905+00:00', raw_video_seconds: 30822, avg_viewed_percent: 100, lectures_completed: 18, raw_session_seconds: 832994, capped_video_seconds: 28674, module_session_count: 125, capped_session_seconds: 83800, module_sessions_over_6h: 7, lecture_rows_watch_exceeds_duration: 12 },
  { learner_id: 'fe9b318e-53b3-4fc7-9838-1f027b578404', lecture_rows: 20, last_activity_at: '2026-05-29T14:30:51.724+00:00', raw_video_seconds: 30386, avg_viewed_percent: 98, lectures_completed: 16, raw_session_seconds: 41603, capped_video_seconds: 27980, module_session_count: 58, capped_session_seconds: 41603, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 7 },
  { learner_id: '96d8ea6e-7e16-428a-959f-443ed5118fe9', lecture_rows: 1, last_activity_at: '2026-05-10T04:09:15.361+00:00', raw_video_seconds: 556, avg_viewed_percent: 53, lectures_completed: 0, raw_session_seconds: 0, capped_video_seconds: 556, module_session_count: 0, capped_session_seconds: 0, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: '81a37ad1-89e2-44ab-aa32-3b52098e6f74', lecture_rows: 3, last_activity_at: '2026-05-25T23:47:04.14+00:00', raw_video_seconds: 1217, avg_viewed_percent: 19, lectures_completed: 1, raw_session_seconds: 5121, capped_video_seconds: 1217, module_session_count: 18, capped_session_seconds: 5121, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: '9c74671b-b117-4b1f-9120-a89e907bf2b1', lecture_rows: 20, last_activity_at: '2026-05-28T04:54:06.048+00:00', raw_video_seconds: 29773, avg_viewed_percent: 95, lectures_completed: 16, raw_session_seconds: 64329, capped_video_seconds: 27657, module_session_count: 157, capped_session_seconds: 64329, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 15 },
  { learner_id: 'a25992a8-0f59-458b-a8b2-1f2578a0c48d', lecture_rows: 11, last_activity_at: '2026-05-11T05:58:29.425+00:00', raw_video_seconds: 6111, avg_viewed_percent: 29, lectures_completed: 2, raw_session_seconds: 7032, capped_video_seconds: 6060, module_session_count: 11, capped_session_seconds: 7032, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 2 },
  { learner_id: 'd27b24d3-8d4a-4f29-86a0-2bbea9bcf854', lecture_rows: 4, last_activity_at: '2026-05-09T04:31:48.659+00:00', raw_video_seconds: 661, avg_viewed_percent: 11, lectures_completed: 0, raw_session_seconds: 1688, capped_video_seconds: 661, module_session_count: 34, capped_session_seconds: 1688, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: '17e15f88-018d-41a6-946c-b93ba1a7e863', lecture_rows: 7, last_activity_at: '2026-05-25T03:31:13.849+00:00', raw_video_seconds: 10623, avg_viewed_percent: 100, lectures_completed: 7, raw_session_seconds: 4887, capped_video_seconds: 10462, module_session_count: 68, capped_session_seconds: 4887, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 4 },
  { learner_id: '1670770b-30ec-4cea-b0f5-c890082ba0b2', lecture_rows: 20, last_activity_at: '2026-05-28T04:59:54.62+00:00', raw_video_seconds: 1314, avg_viewed_percent: 6, lectures_completed: 1, raw_session_seconds: 3349, capped_video_seconds: 1314, module_session_count: 51, capped_session_seconds: 3349, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: 'bc8c3333-6cd2-41d4-9a0b-d97451593801', lecture_rows: 1, last_activity_at: '2026-05-06T02:23:07.907+00:00', raw_video_seconds: 60, avg_viewed_percent: 0, lectures_completed: 1, raw_session_seconds: 5178, capped_video_seconds: 60, module_session_count: 8, capped_session_seconds: 5178, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: '484e4ec1-1a06-4413-8698-9f9543d88ce5', lecture_rows: 1, last_activity_at: '2026-05-06T06:10:10.299+00:00', raw_video_seconds: 60, avg_viewed_percent: 6, lectures_completed: 1, raw_session_seconds: 986, capped_video_seconds: 60, module_session_count: 13, capped_session_seconds: 986, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: '8e0fca6c-82ce-4922-85d2-567f73a85567', lecture_rows: 11, last_activity_at: '2026-05-09T04:51:50.615+00:00', raw_video_seconds: 2445, avg_viewed_percent: 17, lectures_completed: 1, raw_session_seconds: 9448, capped_video_seconds: 2445, module_session_count: 72, capped_session_seconds: 9448, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: '685a06a9-1300-422f-be1d-df05d8c395e0', lecture_rows: 0, last_activity_at: null, raw_video_seconds: 0, avg_viewed_percent: 0, lectures_completed: 0, raw_session_seconds: 0, capped_video_seconds: 0, module_session_count: 0, capped_session_seconds: 0, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
  { learner_id: 'c0afbb5e-bf22-46d1-b77a-bf4df38a1d81', lecture_rows: 20, last_activity_at: '2026-05-30T05:20:58.334+00:00', raw_video_seconds: 10861, avg_viewed_percent: 90, lectures_completed: 19, raw_session_seconds: 19140, capped_video_seconds: 10861, module_session_count: 133, capped_session_seconds: 19140, module_sessions_over_6h: 0, lecture_rows_watch_exceeds_duration: 0 },
];

const workbook = Workbook.create();
const metricByLearnerId = new Map(metricRollups.map((row) => [row.learner_id, row]));

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
  paleRed: '#FEE2E2',
  white: '#FFFFFF',
};

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

function setTitle(sheet, title, subtitle, widthCols = 12) {
  const lastCol = colName(widthCols);
  sheet.getRange(`A1:${lastCol}1`).merge();
  sheet.getRange(`A2:${lastCol}2`).merge();
  sheet.getRange('A1').values = [[title]];
  sheet.getRange('A1').format = {
    fill: palette.navy,
    font: { bold: true, size: 18, color: palette.white },
    verticalAlignment: 'center',
  };
  sheet.getRange(`A1:${lastCol}1`).format.fill = palette.navy;
  sheet.getRange(`A1:${lastCol}1`).format.rowHeightPx = 30;
  sheet.getRange('A2').values = [[subtitle]];
  sheet.getRange(`A2:${lastCol}2`).format = {
    fill: palette.paleBlue,
    font: { italic: true, color: palette.ink },
    wrapText: true,
    verticalAlignment: 'center',
  };
  sheet.getRange(`A2:${lastCol}2`).format.rowHeightPx = 44;
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
    sheet.getRange(rangeAddress(startRow + 1, startCol, rows - 1, cols)).format.wrapText = true;
  }
}

function setColumnWidths(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.getRange(`${colName(index + 1)}:${colName(index + 1)}`).format.columnWidthPx = width;
  });
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

function readNumber(value, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function readString(value) {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function secondsToHours(seconds) {
  return Math.round((readNumber(seconds) / 3600) * 10) / 10;
}

function percent(part, whole) {
  return whole > 0 ? part / whole : 0;
}

function toDate(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time) : null;
}

function maxDateString(...values) {
  const valid = values
    .filter((value) => typeof value === 'string' && Number.isFinite(Date.parse(value)))
    .sort((a, b) => Date.parse(b) - Date.parse(a));
  return valid[0] ?? null;
}

function formatName(row) {
  return readString(row.full_name) ?? readString(row.email) ?? row.learner_id.slice(0, 8);
}

function getAverageModuleProgress(moduleProgress) {
  const rows = Array.isArray(moduleProgress) ? moduleProgress.filter((row) => row?.moduleId !== 'quiz') : [];
  if (rows.length === 0) {
    return 0;
  }
  return Math.round(rows.reduce((sum, row) => sum + readNumber(row.percentComplete), 0) / rows.length);
}

function getAssessmentStats(assessmentResults, assessmentLookup) {
  const raw = assessmentResults && typeof assessmentResults === 'object' ? assessmentResults : {};
  const postLectureResults = [];
  let finalPostTest = null;

  for (const [assessmentId, result] of Object.entries(raw)) {
    const assessment = assessmentLookup.get(assessmentId);
    if (!assessment || !result || typeof result !== 'object') {
      continue;
    }
    const completedAt = readString(result.completedAt);
    const row = {
      assessmentId,
      title: assessment.title ?? assessmentId,
      kind: assessment.kind,
      completedAt,
      correctCount: readNumber(result.correctCount, null),
      totalCount: readNumber(result.totalCount, null),
      percent: readNumber(result.percent, null),
      attemptCount: readNumber(result.attemptCount, 0),
    };

    if (assessment.kind === 'post-lecture-quiz' && completedAt) {
      postLectureResults.push(row);
    }
    if (assessment.kind === 'post-test') {
      finalPostTest = row;
    }
  }

  const avgPostLecturePercent =
    postLectureResults.length > 0
      ? Math.round(postLectureResults.reduce((sum, result) => sum + readNumber(result.percent), 0) / postLectureResults.length)
      : null;

  return {
    postLectureResults,
    avgPostLecturePercent,
    postLectureQuizCount: postLectureResults.length,
    lastPostLectureQuizAt: maxDateString(...postLectureResults.map((result) => result.completedAt)),
    finalPostTest,
  };
}

function getDataQualityFlags(row, metric) {
  const flags = [];
  if (!row.snapshot_updated_at) {
    flags.push('No synced progress snapshot');
  }
  if (metric.module_sessions_over_6h > 0) {
    flags.push('Idle-session risk');
  }
  if (metric.raw_session_seconds > metric.capped_session_seconds + 3600) {
    flags.push('Raw session time inflated');
  }
  if (metric.raw_video_seconds > metric.capped_video_seconds + 300) {
    flags.push('Raw video watch > cap');
  }
  return flags.length ? flags.join('; ') : 'OK';
}

function getEngagementScore(row, metric, assessmentStats) {
  const surveyDone = Boolean(row.pre_course_survey_results?.submittedAt);
  const pretestDone = row.pretest_percent !== null && row.pretest_percent !== undefined;
  const moduleAverage = getAverageModuleProgress(row.module_progress);

  const score =
    (surveyDone ? 10 : 0) +
    (pretestDone ? 15 : 0) +
    percent(metric.lecture_rows, totalLectureCount) * 20 +
    percent(metric.lectures_completed, totalLectureCount) * 20 +
    percent(assessmentStats.postLectureQuizCount, postLectureAssessmentIds.length) * 20 +
    (moduleAverage / 100) * 15;

  return Math.round(Math.max(0, Math.min(100, score)));
}

function getEngagementBand(score, metric, row) {
  if (score >= 80) {
    return 'High engagement';
  }
  if (score >= 50) {
    return 'Moderate engagement';
  }
  if (score > 0 || row.pretest_percent !== null || row.pre_course_survey_results?.submittedAt || metric.lecture_rows > 0) {
    return 'Started';
  }
  return 'Not started';
}

async function fetchAdminLearners() {
  const passcode = process.env.SOCAL_EBUS_ADMIN_PASSCODE;
  if (!passcode) {
    throw new Error('Set SOCAL_EBUS_ADMIN_PASSCODE before running this report builder.');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_admin_learner_overview`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ admin_passcode: passcode }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Admin learner overview request failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Admin learner overview returned an unexpected response.');
  }

  return data;
}

async function buildAssessmentLookup() {
  const raw = await fs.readFile(path.join(repoRoot, 'content/course/course-assessments.json'), 'utf8');
  const data = JSON.parse(raw);
  return new Map(data.assessments.map((assessment) => [assessment.id, assessment]));
}

const assessmentLookup = await buildAssessmentLookup();
const postLectureAssessmentIds = [...assessmentLookup.values()]
  .filter((assessment) => assessment.kind === 'post-lecture-quiz')
  .map((assessment) => assessment.id);

const rawLearners = await fetchAdminLearners();
const learnerRows = rawLearners.map((row) => {
  const metric = metricByLearnerId.get(row.learner_id) ?? {
    lecture_rows: row.lecture_summary?.quizReadyCount ?? 0,
    last_activity_at: row.lecture_summary?.lastOpenedAt ?? null,
    raw_video_seconds: row.lecture_summary?.totalWatchedSeconds ?? 0,
    avg_viewed_percent: row.lecture_summary?.averageViewedPercent ?? 0,
    lectures_completed: row.lecture_summary?.completedCount ?? 0,
    raw_session_seconds: row.total_time_spent_seconds ?? 0,
    capped_video_seconds: row.lecture_summary?.totalWatchedSeconds ?? 0,
    module_session_count: 0,
    capped_session_seconds: row.total_time_spent_seconds ?? 0,
    module_sessions_over_6h: 0,
    lecture_rows_watch_exceeds_duration: 0,
  };
  const assessmentStats = getAssessmentStats(row.assessment_results, assessmentLookup);
  const moduleAverage = getAverageModuleProgress(row.module_progress);
  const modulesVisited = Array.isArray(row.module_progress)
    ? row.module_progress.filter((module) => module.visitedAt || readNumber(module.percentComplete) > 0 || readNumber(module.timeSpentSeconds) > 0).length
    : 0;
  const modulesCompleted = Array.isArray(row.module_progress)
    ? row.module_progress.filter((module) => module.completedAt || readNumber(module.percentComplete) >= 100).length
    : 0;
  const engagementScore = getEngagementScore(row, metric, assessmentStats);

  return {
    row,
    metric,
    assessmentStats,
    learnerId: row.learner_id,
    learnerName: formatName(row),
    email: readString(row.email),
    institutionalEmail: readString(row.institutional_email),
    institution: readString(row.institution),
    fellowshipYear: readString(row.fellowship_year),
    degree: readString(row.degree),
    approvalStatus: readString(row.approval_status) ?? 'pending',
    createdAt: readString(row.created_at),
    approvedAt: readString(row.approved_at),
    onboardingCompletedAt: readString(row.onboarding_completed_at),
    snapshotUpdatedAt: readString(row.snapshot_updated_at),
    preCourseSurveySubmittedAt: readString(row.pre_course_survey_results?.submittedAt),
    pretestPercent: row.pretest_percent ?? null,
    pretestSubmittedAt: readString(row.pretest_submitted_at),
    modulesVisited,
    modulesCompleted,
    moduleAverage,
    engagementScore,
    engagementBand: getEngagementBand(engagementScore, metric, row),
    dataQualityFlags: getDataQualityFlags(row, metric),
    lastActivityAt: maxDateString(
      metric.last_activity_at,
      row.snapshot_updated_at,
      row.pretest_submitted_at,
      row.pre_course_survey_results?.submittedAt,
      assessmentStats.lastPostLectureQuizAt,
    ),
  };
});

learnerRows.sort((a, b) => b.engagementScore - a.engagementScore || a.learnerName.localeCompare(b.learnerName));

const kpis = {
  learners: learnerRows.length,
  approvedLearners: learnerRows.filter((learner) => learner.approvalStatus === 'approved').length,
  syncedLearners: learnerRows.filter((learner) => learner.snapshotUpdatedAt).length,
  surveySubmitted: learnerRows.filter((learner) => learner.preCourseSurveySubmittedAt).length,
  pretestSubmitted: learnerRows.filter((learner) => learner.pretestPercent !== null).length,
  lectureStarters: learnerRows.filter((learner) => learner.metric.lecture_rows > 0).length,
  fullLectureOpeners: learnerRows.filter((learner) => learner.metric.lecture_rows >= totalLectureCount).length,
  highEngagement: learnerRows.filter((learner) => learner.engagementScore >= 80).length,
  cappedVideoSeconds: learnerRows.reduce((sum, learner) => sum + learner.metric.capped_video_seconds, 0),
  rawVideoSeconds: learnerRows.reduce((sum, learner) => sum + learner.metric.raw_video_seconds, 0),
  cappedSessionSeconds: learnerRows.reduce((sum, learner) => sum + learner.metric.capped_session_seconds, 0),
  rawSessionSeconds: learnerRows.reduce((sum, learner) => sum + learner.metric.raw_session_seconds, 0),
  idleRiskLearners: learnerRows.filter((learner) => learner.metric.module_sessions_over_6h > 0).length,
};

function addExecutiveSummary() {
  const sheet = workbook.worksheets.add('Executive Summary');
  setColumnWidths(sheet, [210, 105, 300, 35, 155, 125, 125, 125, 135, 135, 135, 135]);
  setTitle(
    sheet,
    'SoCal EBUS Prep: Usage and Engagement by Learner',
    `Identifiable learner-level export generated ${generatedAtUtc}. Contains names and emails; use for internal course operations only.`,
  );

  const cards = [
    ['Learner profiles', kpis.learners, 'All learner profiles returned by admin overview'],
    ['Approved learners', kpis.approvedLearners, `${Math.round(percent(kpis.approvedLearners, kpis.learners) * 100)}% of profiles`],
    ['Synced progress rows', kpis.syncedLearners, `${Math.round(percent(kpis.syncedLearners, kpis.learners) * 100)}% with progress snapshot`],
    ['Pre-course survey', kpis.surveySubmitted, `${Math.round(percent(kpis.surveySubmitted, kpis.learners) * 100)}% submitted`],
    ['Pretest submitted', kpis.pretestSubmitted, `${Math.round(percent(kpis.pretestSubmitted, kpis.learners) * 100)}% submitted`],
    ['Started lectures', kpis.lectureStarters, `${Math.round(percent(kpis.lectureStarters, kpis.learners) * 100)}% opened at least one lecture`],
    ['Opened all lectures', kpis.fullLectureOpeners, `${Math.round(percent(kpis.fullLectureOpeners, kpis.learners) * 100)}% opened all ${totalLectureCount}`],
    ['High engagement', kpis.highEngagement, 'Learners with engagement score >=80'],
    ['Capped video hours', secondsToHours(kpis.cappedVideoSeconds), 'Best representative video exposure'],
    ['Capped active hours', secondsToHours(kpis.cappedSessionSeconds), `${sessionCapSeconds / 3600}h cap per route session`],
  ];

  setValues(sheet, 4, 1, [['Metric', 'Value', 'Interpretation'], ...cards]);
  styleTable(sheet, 4, 1, cards.length + 1, 3, { headerFill: palette.navy });
  sheet.getRange('B5:B14').format = { numberFormat: '0.0', horizontalAlignment: 'right' };
  sheet.getRange('A5:A14').format.font = { bold: true, color: palette.ink };

  const findingRows = [
    ['Best learner-level timing metric', `${secondsToHours(kpis.cappedVideoSeconds)} capped video hours and ${secondsToHours(kpis.cappedSessionSeconds)} capped active hours are the recommended timing totals.`],
    ['Why raw time differs', `${secondsToHours(kpis.rawVideoSeconds)} raw video hours and ${secondsToHours(kpis.rawSessionSeconds)} raw session hours are retained, but can be inflated by playback speed, rewatches, and idle tabs.`],
    ['Completion signal', `${kpis.fullLectureOpeners} learners opened all ${totalLectureCount} lectures; ${learnerRows.filter((learner) => learner.metric.lectures_completed >= totalLectureCount).length} have all lectures marked completed.`],
    ['Assessment signal', `${kpis.surveySubmitted} submitted the pre-course survey and ${kpis.pretestSubmitted} submitted the pretest. Post-lecture quiz depth is listed per learner in the Learner Summary tab.`],
    ['Data-quality watchlist', `${kpis.idleRiskLearners} learners have at least one route-session over 6 hours; the Learner Summary flags those rows.`],
  ];
  styleSectionHeader(sheet, 'A16', 'Executive Readout', palette.paleTeal);
  setValues(sheet, 17, 1, [['Finding', 'Detail', ''], ...findingRows.map((row) => [row[0], row[1], ''])]);
  for (let row = 17; row <= 22; row += 1) {
    sheet.getRange(`B${row}:C${row}`).merge();
  }
  styleTable(sheet, 17, 1, findingRows.length + 1, 3, { headerFill: palette.teal });
  sheet.getRange('A18:A22').format.font = { bold: true, color: palette.ink };

  const bandCounts = ['High engagement', 'Moderate engagement', 'Started', 'Not started'].map((band) => [
    band,
    learnerRows.filter((learner) => learner.engagementBand === band).length,
  ]);
  setValues(sheet, 4, 5, [['Engagement band', 'Learners'], ...bandCounts]);
  styleTable(sheet, 4, 5, bandCounts.length + 1, 2, { headerFill: palette.teal });

  const topLearners = learnerRows.slice(0, 10).map((learner) => [
    learner.learnerName,
    learner.institution ?? '',
    learner.engagementScore,
    learner.metric.lecture_rows,
    learner.metric.lectures_completed,
    learner.assessmentStats.postLectureQuizCount,
  ]);
  setValues(sheet, 11, 5, [['Learner', 'Institution', 'Score', 'Opened', 'Completed', 'Quizzes'], ...topLearners]);
  styleTable(sheet, 11, 5, topLearners.length + 1, 6, { headerFill: palette.navy });
  sheet.getRange('G12:G21').conditionalFormats.add('dataBar', { color: palette.blue, gradient: true });
}

function addLearnerSummarySheet() {
  const sheet = workbook.worksheets.add('Learner Summary');
  const headers = [
    'Learner',
    'Email',
    'Institution',
    'Degree',
    'Fellowship year',
    'Status',
    'Engagement band',
    'Engagement score',
    'Pre-course survey submitted',
    'Pretest %',
    'Lectures opened',
    'Lectures completed',
    'Avg viewed %',
    'Post-lecture quizzes',
    'Avg post-quiz %',
    'Capped video hours',
    'Raw video hours',
    'Capped active hours',
    'Raw active hours',
    'Session count',
    'Sessions >6h',
    'Modules visited',
    'Modules completed',
    'Avg module progress',
    'Last activity',
    'Data quality flags',
  ];
  const rows = learnerRows.map((learner) => [
    learner.learnerName,
    learner.email ?? '',
    learner.institution ?? '',
    learner.degree ?? '',
    learner.fellowshipYear ?? '',
    learner.approvalStatus,
    learner.engagementBand,
    learner.engagementScore,
    learner.preCourseSurveySubmittedAt ? 'Yes' : 'No',
    learner.pretestPercent === null ? null : learner.pretestPercent / 100,
    learner.metric.lecture_rows,
    learner.metric.lectures_completed,
    learner.metric.avg_viewed_percent / 100,
    learner.assessmentStats.postLectureQuizCount,
    learner.assessmentStats.avgPostLecturePercent === null ? null : learner.assessmentStats.avgPostLecturePercent / 100,
    secondsToHours(learner.metric.capped_video_seconds),
    secondsToHours(learner.metric.raw_video_seconds),
    secondsToHours(learner.metric.capped_session_seconds),
    secondsToHours(learner.metric.raw_session_seconds),
    learner.metric.module_session_count,
    learner.metric.module_sessions_over_6h,
    learner.modulesVisited,
    learner.modulesCompleted,
    learner.moduleAverage / 100,
    toDate(learner.lastActivityAt),
    learner.dataQualityFlags,
  ]);

  setColumnWidths(sheet, [180, 230, 210, 70, 105, 85, 135, 90, 125, 80, 90, 100, 85, 100, 95, 100, 95, 105, 95, 90, 80, 95, 100, 105, 150, 250]);
  setTitle(sheet, 'Learner Summary', 'One row per learner. Timing columns use capped metrics where available; raw timing is retained for audit.', headers.length);
  setValues(sheet, 4, 1, [headers, ...rows]);
  styleTable(sheet, 4, 1, rows.length + 1, headers.length, { headerFill: palette.navy });

  sheet.getRange(`H5:H${rows.length + 4}`).conditionalFormats.add('dataBar', { color: palette.blue, gradient: true });
  sheet.getRange(`J5:J${rows.length + 4}`).format.numberFormat = '0%';
  sheet.getRange(`M5:M${rows.length + 4}`).format.numberFormat = '0%';
  sheet.getRange(`O5:O${rows.length + 4}`).format.numberFormat = '0%';
  sheet.getRange(`X5:X${rows.length + 4}`).format.numberFormat = '0%';
  sheet.getRange(`P5:S${rows.length + 4}`).format.numberFormat = '0.0';
  sheet.getRange(`Y5:Y${rows.length + 4}`).format.numberFormat = 'yyyy-mm-dd hh:mm';
  sheet.getRange(`U5:U${rows.length + 4}`).conditionalFormats.addCellIs({
    operator: 'greaterThan',
    formula: 0,
    format: { fill: palette.paleAmber, font: { color: palette.amber, bold: true } },
  });
}

function addLearnerModulesSheet() {
  const sheet = workbook.worksheets.add('Learner Modules');
  const headers = ['Learner', 'Email', 'Module ID', 'Module', 'Percent complete', 'Reported module hours', 'Visited at', 'Completed at'];
  const rows = learnerRows.flatMap((learner) =>
    (Array.isArray(learner.row.module_progress) ? learner.row.module_progress : []).map((module) => [
      learner.learnerName,
      learner.email ?? '',
      module.moduleId,
      moduleLabels[module.moduleId] ?? module.moduleId,
      readNumber(module.percentComplete) / 100,
      secondsToHours(module.timeSpentSeconds),
      toDate(module.visitedAt),
      toDate(module.completedAt),
    ]),
  );

  setColumnWidths(sheet, [190, 230, 130, 230, 110, 130, 150, 150]);
  setTitle(sheet, 'Learner Module Progress', 'Rows are from learner_module_progress and may include raw app-reported module time.', headers.length);
  setValues(sheet, 4, 1, [headers, ...rows]);
  styleTable(sheet, 4, 1, rows.length + 1, headers.length, { headerFill: palette.navy });
  if (rows.length > 0) {
    sheet.getRange(`E5:E${rows.length + 4}`).format.numberFormat = '0%';
    sheet.getRange(`F5:F${rows.length + 4}`).format.numberFormat = '0.0';
    sheet.getRange(`G5:H${rows.length + 4}`).format.numberFormat = 'yyyy-mm-dd hh:mm';
    sheet.getRange(`E5:E${rows.length + 4}`).conditionalFormats.add('dataBar', { color: palette.green, gradient: true });
  }
}

function addLearnerQuizzesSheet() {
  const sheet = workbook.worksheets.add('Learner Quizzes');
  const headers = ['Learner', 'Email', 'Assessment ID', 'Assessment title', 'Score %', 'Correct', 'Total', 'Attempt count', 'Completed at'];
  const rows = learnerRows.flatMap((learner) =>
    learner.assessmentStats.postLectureResults.map((result) => [
      learner.learnerName,
      learner.email ?? '',
      result.assessmentId,
      result.title,
      result.percent === null ? null : result.percent / 100,
      result.correctCount,
      result.totalCount,
      result.attemptCount,
      toDate(result.completedAt),
    ]),
  );

  setColumnWidths(sheet, [190, 230, 155, 330, 80, 70, 70, 95, 150]);
  setTitle(sheet, 'Learner Post-lecture Quizzes', 'One row per completed post-lecture quiz. The final post-test is not included here.', headers.length);
  setValues(sheet, 4, 1, [headers, ...rows]);
  styleTable(sheet, 4, 1, rows.length + 1, headers.length, { headerFill: palette.navy });
  if (rows.length > 0) {
    sheet.getRange(`E5:E${rows.length + 4}`).format.numberFormat = '0%';
    sheet.getRange(`I5:I${rows.length + 4}`).format.numberFormat = 'yyyy-mm-dd hh:mm';
    sheet.getRange(`E5:E${rows.length + 4}`).conditionalFormats.add('dataBar', { color: palette.blue, gradient: true });
  }
}

function addTimingAuditSheet() {
  const sheet = workbook.worksheets.add('Timing Audit');
  const headers = [
    'Learner',
    'Email',
    'Capped video hours',
    'Raw video hours',
    'Raw minus capped video hours',
    'Lecture rows watch > duration',
    'Capped active hours',
    'Raw active hours',
    'Raw minus capped active hours',
    'Module sessions',
    'Sessions >6h',
    'Last activity',
  ];
  const rows = learnerRows.map((learner) => [
    learner.learnerName,
    learner.email ?? '',
    secondsToHours(learner.metric.capped_video_seconds),
    secondsToHours(learner.metric.raw_video_seconds),
    secondsToHours(Math.max(0, learner.metric.raw_video_seconds - learner.metric.capped_video_seconds)),
    learner.metric.lecture_rows_watch_exceeds_duration,
    secondsToHours(learner.metric.capped_session_seconds),
    secondsToHours(learner.metric.raw_session_seconds),
    secondsToHours(Math.max(0, learner.metric.raw_session_seconds - learner.metric.capped_session_seconds)),
    learner.metric.module_session_count,
    learner.metric.module_sessions_over_6h,
    toDate(learner.lastActivityAt),
  ]);

  setColumnWidths(sheet, [190, 230, 115, 105, 145, 130, 115, 105, 145, 110, 90, 150]);
  setTitle(sheet, 'Learner Timing Audit', 'Use this tab to understand where raw watch/session time differs from representative capped time.', headers.length);
  setValues(sheet, 4, 1, [headers, ...rows]);
  styleTable(sheet, 4, 1, rows.length + 1, headers.length, { headerFill: palette.navy });
  if (rows.length > 0) {
    sheet.getRange(`C5:E${rows.length + 4}`).format.numberFormat = '0.0';
    sheet.getRange(`G5:I${rows.length + 4}`).format.numberFormat = '0.0';
    sheet.getRange(`L5:L${rows.length + 4}`).format.numberFormat = 'yyyy-mm-dd hh:mm';
    sheet.getRange(`E5:E${rows.length + 4}`).conditionalFormats.add('dataBar', { color: palette.amber, gradient: true });
    sheet.getRange(`I5:I${rows.length + 4}`).conditionalFormats.add('dataBar', { color: palette.amber, gradient: true });
    sheet.getRange(`K5:K${rows.length + 4}`).conditionalFormats.addCellIs({
      operator: 'greaterThan',
      formula: 0,
      format: { fill: palette.paleAmber, font: { color: palette.amber, bold: true } },
    });
  }
}

function addMetricNotesSheet() {
  const sheet = workbook.worksheets.add('Metric Notes');
  setColumnWidths(sheet, [230, 760]);
  setTitle(sheet, 'Metric Definitions and Data Quality Notes', 'Read this sheet before using timing fields for learner comparisons.', 2);
  const rows = [
    ['Privacy', 'This workbook is identifiable. It includes learner names, email addresses, institution, and engagement data for internal course operations.'],
    ['Prep engagement score', 'A 0-100 operational score combining survey completion, pretest completion, lecture opening, lecture completion, post-lecture quiz completion, and average module progress. It is not a validated educational outcome measure.'],
    ['Recommended video metric', 'Capped video hours is the best representative video exposure metric. Each learner-video row is capped at the best available video duration for that lecture.'],
    ['Raw video watch hours', 'Raw watch time is video timeline seconds, not wall-clock time. It can exceed page-open time because faster playback, rewatches, and repeated play intervals advance the video timeline differently from route-session time.'],
    ['Recommended active-time metric', 'Capped active hours uses route-session records with each session capped at 2 hours to reduce idle-tab inflation.'],
    ['Raw active hours', 'Raw route-session time is retained for audit. It can be much larger than plausible active learning time when a browser tab is left open.'],
    ['Module progress', 'Module rows come from synced learner_module_progress state. Percent complete is the app progress state, not an externally proctored completion.'],
    ['Quiz rows', 'Learner Quizzes includes completed post-lecture quizzes from synced progress snapshots. Final post-test completion is summarized in learner state but not expanded in that tab.'],
    ['Data quality flags', 'OK means no obvious timing/sync flag. Idle-session risk means at least one route session exceeded 6 hours. Raw session/video inflation flags identify rows where raw time materially exceeds capped time.'],
    ['Source', 'Data source: Supabase project tqnhxlwvkkswuckszlee, get_admin_learner_overview RPC plus read-only per-learner timing rollups from learner lecture/session tables.'],
  ];
  setValues(sheet, 4, 1, [['Metric or note', 'Definition'], ...rows]);
  styleTable(sheet, 4, 1, rows.length + 1, 2, { headerFill: palette.navy });
  sheet.getRange(`A5:A${rows.length + 4}`).format.font = { bold: true, color: palette.ink };
}

addExecutiveSummary();
addLearnerSummarySheet();
addLearnerModulesSheet();
addLearnerQuizzesSheet();
addTimingAuditSheet();
addMetricNotesSheet();

await fs.mkdir(outputDir, { recursive: true });

const inspect = await workbook.inspect({
  kind: 'table',
  range: 'Executive Summary!A1:C22',
  include: 'values,formulas',
  tableMaxRows: 24,
  tableMaxCols: 3,
});
console.log(inspect.ndjson);

const errors = await workbook.inspect({
  kind: 'match',
  searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',
  options: { useRegex: true, maxResults: 100 },
  summary: 'final formula error scan before export',
});
console.log(errors.ndjson);

for (const sheetName of ['Executive Summary', 'Learner Summary', 'Learner Modules', 'Learner Quizzes', 'Timing Audit', 'Metric Notes']) {
  const range = sheetName === 'Learner Summary' ? 'A1:Z28' : 'A1:L32';
  const blob = await workbook.render({ sheetName, range, scale: 1 });
  const renderPath = path.join(outputDir, `${sheetName.replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '').toLowerCase()}.png`);
  await fs.writeFile(renderPath, Buffer.from(await blob.arrayBuffer()));
  console.log(`rendered ${sheetName} -> ${renderPath}`);
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

const imported = await SpreadsheetFile.importXlsx(await FileBlob.load(outputPath));
const postExportErrors = await imported.inspect({
  kind: 'match',
  searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',
  options: { useRegex: true, maxResults: 100 },
  summary: 'post-export formula error scan',
});
console.log(postExportErrors.ndjson);
console.log(`saved ${outputPath}`);
