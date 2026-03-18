import type { FeatureScaffold } from '@/lib/types';

export const stationExplorerScaffold: FeatureScaffold = {
  moduleId: 'station-explorer',
  statusLabel: 'Tri-view explorer live',
  emphasis: 'Core stations now sync across CT, bronchoscopy, and ultrasound placeholders with checklist and challenge flows backed by local recognition tracking.',
  milestones: [
    {
      id: 'selector',
      title: 'Selector and tri-view',
      description: 'Learners can switch stations quickly and keep CT, bronchoscopy, and ultrasound panels synchronized.'
    },
    {
      id: 'checklist',
      title: 'Checklist',
      description: 'Each station now includes local landmark bullets, memory cues, and confusion-pair review cues.'
    },
    {
      id: 'challenge',
      title: 'Recognition challenge',
      description: 'Mixed-view challenge rounds now record local recognition accuracy by station.'
    }
  ],
  persistenceNotes: [
    'Last-viewed station persists locally across the map and explorer modules.',
    'Module completion and challenge score persist through the shared learner progress store.',
    'Per-station recognition attempts and correct counts persist locally for the explorer module.'
  ]
};
