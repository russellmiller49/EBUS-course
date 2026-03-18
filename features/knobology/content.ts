import knobologyData from '@/content/modules/knobology.json';
import { getQuizQuestions } from '@/lib/content';
import type { KnobologyModuleContent } from '@/features/knobology/types';

const knobologyContent = knobologyData as KnobologyModuleContent;

export function getKnobologyContent() {
  return knobologyContent;
}

export function getKnobologyQuizQuestions() {
  return getQuizQuestions('knobology');
}
