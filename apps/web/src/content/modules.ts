import modulesData from '../../../../content/modules/modules.json';

import type { AppModuleCard, ModuleContent } from '@/content/types';

export const moduleContent = modulesData as ModuleContent[];

export const homeModuleCards: AppModuleCard[] = [
  {
    id: 'lectures',
    title: 'Pre-Course Lectures',
    description: 'Manifest-driven lecture cards with poster and video slots ready for local media.',
    accent: 'var(--accent-gold)',
    icon: '▶',
    path: '/lectures',
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
    id: 'stations',
    title: 'Mediastinal Stations',
    description: 'IASLC map, focused sub-tabs, flashcards, quizzes, and correlated CT/bronchoscopy/EBUS views.',
    accent: 'var(--accent-cyan)',
    icon: '◎',
    path: '/stations/explore',
  },
  {
    id: 'case-001',
    title: 'Case 001 3D Viewer',
    description:
      'Repo-native tri-planar CT, segmentation, markups, and shared patient-space targeting for case exploration.',
    accent: 'var(--accent-cyan)',
    icon: '◫',
    path: '/cases/case-001',
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
