import type { FeatureScaffold } from '@/lib/types';

export const stationMapScaffold: FeatureScaffold = {
  moduleId: 'station-map',
  statusLabel: 'Shared station schema ready',
  emphasis: 'Core IASLC stations are already modeled locally with memory cues, related stations, and stable asset keys.',
  milestones: [
    {
      id: 'overview',
      title: 'Overview shell',
      description: 'Module route and shared content layer are ready for the map intro.'
    },
    {
      id: 'map',
      title: 'Map placeholder',
      description: 'Stable map asset key reserved for a future vector drawing implementation.'
    },
    {
      id: 'quiz',
      title: 'Quiz contract',
      description: 'Question-bank structure is in place for pin-the-station interactions.'
    }
  ],
  persistenceNotes: [
    'Bookmarks persist locally and are visible in the progress screen.',
    'Completion state is wired into the shared learner progress store.',
    'Station data is already shared with the explorer module.'
  ]
};
