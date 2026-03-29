import type { FeatureScaffold } from '@/lib/types';

export const pretestScaffold: FeatureScaffold = {
  moduleId: 'pretest',
  statusLabel: 'Pretest flow live',
  emphasis: 'Baseline assessment before the course day.',
  milestones: [
    {
      id: 'pretest-intro',
      title: 'Clear pretest briefing',
      description: 'Explain that answers stay hidden and the demo stores scores locally.',
    },
    {
      id: 'pretest-question-flow',
      title: '42-question delivery',
      description: 'Support long-form assessment with persistent answers and question navigation.',
    },
    {
      id: 'pretest-submission',
      title: 'Demo logging shell',
      description: 'Persist a score and submission timestamp locally until authentication is added.',
    },
  ],
  persistenceNotes: [
    'The latest in-progress answers persist locally to support resume after app restart.',
    'The submitted demo score is stored on device only and can be swapped for login-backed logging later.',
  ],
};
