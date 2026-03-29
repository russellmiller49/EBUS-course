import type { ImageSourcePropType } from 'react-native';

import type { PretestImageAssetKey } from '@/features/pretest/types';

interface PretestImageAsset {
  source: ImageSourcePropType;
  alt: string;
  caption: string;
}

const pretestImageAssets: Record<PretestImageAssetKey, PretestImageAsset> = {
  'pretest-q2-figure': {
    source: require('../../assets/pretest/pretest-q2-figure.png'),
    alt: 'Chest imaging example used in pretest question 2.',
    caption: 'Question 2 figure from the provided pretest document.',
  },
  'pretest-q8-figure': {
    source: require('../../assets/pretest/pretest-q8-figure.png'),
    alt: 'Ultrasound figure used in pretest question 8.',
    caption: 'Question 8 figure from the provided pretest document.',
  },
  'pretest-q22-figure': {
    source: require('../../assets/pretest/pretest-q22-figure.png'),
    alt: 'Ultrasound figure used in pretest question 22.',
    caption: 'Question 22 figure from the provided pretest document.',
  },
};

export function getPretestImageAsset(imageAssetKey: PretestImageAssetKey) {
  return pretestImageAssets[imageAssetKey];
}
