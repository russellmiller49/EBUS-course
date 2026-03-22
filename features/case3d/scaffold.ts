import type { FeatureScaffold } from '@/lib/types';

export const case3DScaffold: FeatureScaffold = {
  moduleId: 'case-3d-explorer',
  statusLabel: 'Case explorer live',
  emphasis: 'Derived slice linkage, station and target selection, and resumable anatomy review now run from a generated case manifest.',
  milestones: [
    {
      id: 'case-enrichment',
      title: 'Build-time enrichment',
      description: 'The case manifest is enriched from CT geometry, markup control points, slice-series folders, and GLB mesh names.',
    },
    {
      id: 'linked-explorer',
      title: 'Linked explorer',
      description: 'Station or target selection updates both the pseudo-3D canvas and the current slice plane frame.',
    },
    {
      id: 'review-loop',
      title: 'Quick review',
      description: 'Five lightweight prompts provide instant feedback and persist the module score locally.',
    },
  ],
  persistenceNotes: [
    'Selected station, target, plane, toggles, review score, and visited target ids persist locally.',
    'The shared module progress store still tracks completion, percent complete, and last screen.',
    'The case explorer resumes where the learner left off after app restart.',
  ],
};
