import type { FeatureScaffold } from '@/lib/types';

export const stationExplorerScaffold: FeatureScaffold = {
  moduleId: 'station-explorer',
  statusLabel: 'Tri-view contract ready',
  emphasis: 'CT, bronchoscopy, and ultrasound asset placeholders are already synchronized around the shared station object.',
  milestones: [
    {
      id: 'selector',
      title: 'Selector route',
      description: 'The route is wired to local station content and last-viewed station persistence.'
    },
    {
      id: 'tri-view',
      title: 'Tri-view placeholder',
      description: 'Stable asset keys exist for CT, bronchoscopy, and ultrasound panels.'
    },
    {
      id: 'challenge',
      title: 'Recognition challenge contract',
      description: 'Question-bank and progress state support a future accuracy tracker.'
    }
  ],
  persistenceNotes: [
    'Last-viewed station persists locally.',
    'Module completion flows through the same learner progress store.',
    'Recognition metrics can extend the current contract without breaking routes.'
  ]
};
