import pretestData from '../../../../content/modules/pretest.json';

import type { PretestContent, PretestImageAssetKey } from '@/content/types';

export const pretestContent = pretestData as PretestContent;

const pretestImages: Partial<Record<PretestImageAssetKey, { alt: string; caption: string; src: string }>> = {
  'ebus-2026-final-station-4r': {
    alt: 'EBUS ultrasound image of a measured right paratracheal lymph node.',
    caption: 'Figure: cpEBUS view of the sampled right paratracheal node.',
    src: '/media/assessments/ebus-2026-final/question-figure-1.png',
  },
  'ebus-2026-final-mediastinal-pet': {
    alt: 'Axial fused PET/CT showing FDG-avid thoracic lymph nodes.',
    caption: 'Figure: PET/CT with multifocal FDG-avid mediastinal lymph nodes.',
    src: '/media/assessments/ebus-2026-final/question-figure-2.png',
  },
  'ebus-2026-final-reverberation': {
    alt: 'EBUS image showing horizontal reverberation artifact after needle puncture.',
    caption: 'Figure: loss of probe-wall coupling with reverberation artifact.',
    src: '/media/assessments/ebus-2026-final/question-figure-3.png',
  },
};

export function getPretestImage(imageAssetKey: PretestImageAssetKey) {
  return pretestImages[imageAssetKey];
}
