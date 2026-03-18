import type { FeatureScaffold } from '@/lib/types';

export const knobologyScaffold: FeatureScaffold = {
  moduleId: 'knobology',
  statusLabel: 'Simulator shell ready',
  emphasis: 'Depth, gain, contrast, Doppler, calipers, freeze, and save are all represented in the local contract.',
  milestones: [
    {
      id: 'primer',
      title: 'Primer route',
      description: 'Route shell and local content hook exist for a future scrollable lesson.'
    },
    {
      id: 'control-lab',
      title: 'Control lab stub',
      description: 'Placeholder milestone reserved for bad-image presets and slider-driven feedback.'
    },
    {
      id: 'doppler',
      title: 'Doppler mini-lab',
      description: 'Placeholder data contract is ready for vessel-detection teaching cards.'
    }
  ],
  persistenceNotes: [
    'Module visit state persists locally.',
    'Quiz score and last screen are already in the progress contract.',
    'Future simulator logic can land without changing the store shape.'
  ]
};
