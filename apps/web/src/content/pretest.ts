import pretestData from '../../../../content/modules/pretest.json';

import type { PretestContent, PretestImageAssetKey } from '@/content/types';

export const pretestContent = pretestData as PretestContent;

const pretestImages: Partial<Record<PretestImageAssetKey, { alt: string; caption: string; src: string }>> = {};

export function getPretestImage(imageAssetKey: PretestImageAssetKey) {
  return pretestImages[imageAssetKey];
}
