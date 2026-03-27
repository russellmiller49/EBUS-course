import modulesData from '../../../../content/modules/modules.json';

import type { AppModuleCard, ModuleContent } from '@/content/types';

export const moduleContent = modulesData as ModuleContent[];

export const homeModuleCards: AppModuleCard[] = [
  {
    id: 'stations',
    title: 'Mediastinal Stations',
    description: 'IASLC map, detail cards, flashcards, and correlated CT/bronchoscopy/EBUS views.',
    accent: 'var(--accent-cyan)',
    icon: '◎',
    path: '/stations',
  },
  {
    id: 'knobology',
    title: 'EBUS Knobology',
    description: 'Primer, fix-the-image labs, Doppler safety check, and a focused quiz.',
    accent: 'var(--accent-green)',
    icon: '◐',
    path: '/knobology',
  },
  {
    id: 'lectures',
    title: 'Pre-Course Lectures',
    description: 'Manifest-driven lecture cards with poster and video slots ready for local media.',
    accent: 'var(--accent-gold)',
    icon: '▶',
    path: '/lectures',
  },
  {
    id: 'quiz',
    title: 'Knowledge Check',
    description: 'Mixed question bank across knobology, station recognition, and explorer logic.',
    accent: 'var(--accent-rose)',
    icon: '✎',
    path: '/quiz',
  },
];

export function getModuleById(moduleId: ModuleContent['id']): ModuleContent | undefined {
  return moduleContent.find((entry) => entry.id === moduleId);
}
