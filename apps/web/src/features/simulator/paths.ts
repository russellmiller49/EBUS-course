import { resolveCourseAssetPath } from '@/lib/assets';

const CASE_ROOT = '/simulator/case-001';

export function simulatorCaseAssetUrl(assetPath: string): string {
  return resolveCourseAssetPath(`${CASE_ROOT}/${assetPath.replace(/^\/+/, '')}`);
}

export function simulatorManifestUrl(): string {
  return simulatorCaseAssetUrl('case_manifest.web.json');
}
