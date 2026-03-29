import pretestData from '../../../../content/modules/pretest.json';
import pretestQ2FigureUrl from '../../../../assets/pretest/pretest-q2-figure.png?url';
import pretestQ8FigureUrl from '../../../../assets/pretest/pretest-q8-figure.png?url';
import pretestQ22FigureUrl from '../../../../assets/pretest/pretest-q22-figure.png?url';

import type { PretestContent, PretestImageAssetKey } from '@/content/types';

export const pretestContent = pretestData as PretestContent;

const pretestImages: Record<PretestImageAssetKey, { alt: string; caption: string; src: string }> = {
  'pretest-q2-figure': {
    alt: 'Chest imaging figure used in pretest question 2.',
    caption: 'Question 2 figure from the provided pretest document.',
    src: pretestQ2FigureUrl,
  },
  'pretest-q8-figure': {
    alt: 'Ultrasound image used in pretest question 8.',
    caption: 'Question 8 figure from the provided pretest document.',
    src: pretestQ8FigureUrl,
  },
  'pretest-q22-figure': {
    alt: 'Ultrasound image used in pretest question 22.',
    caption: 'Question 22 figure from the provided pretest document.',
    src: pretestQ22FigureUrl,
  },
};

export function getPretestImage(imageAssetKey: PretestImageAssetKey) {
  return pretestImages[imageAssetKey];
}
