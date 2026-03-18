import type { FeatureScaffold } from '@/lib/types';

export const stationMapScaffold: FeatureScaffold = {
  moduleId: 'station-map',
  statusLabel: 'Interactive station map live',
  emphasis: 'Core IASLC stations now render in a tappable 2D map with detail, flashcards, quiz flow, and persisted review state.',
  milestones: [
    {
      id: 'overview',
      title: 'Overview and map',
      description: 'Learners can review the intro, zoom the map, and open station detail sheets from the same route.'
    },
    {
      id: 'flashcards',
      title: 'Flashcards',
      description: 'Card reveal mode supports guided or randomized order and local bookmarking.'
    },
    {
      id: 'quiz',
      title: 'Pin-the-station quiz',
      description: 'Map-based quiz rounds score local performance and feed the module summary.'
    }
  ],
  persistenceNotes: [
    'Module completion, last screen, and quiz score persist locally.',
    'Station and flashcard bookmarks persist locally and are visible in the progress screen.',
    'Shared station text remains ready for the future explorer module.'
  ]
};
