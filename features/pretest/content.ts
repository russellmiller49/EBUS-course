import pretestData from '@/content/modules/pretest.json';
import type { PretestContent } from '@/features/pretest/types';

const pretestContent = pretestData as PretestContent;

export function getPretestContent() {
  return pretestContent;
}
