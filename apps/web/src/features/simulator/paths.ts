const CASE_ROOT = 'simulator/case-001';

function joinBase(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${path.replace(/^\/+/, '')}`;
}

export function simulatorCaseAssetUrl(assetPath: string): string {
  return joinBase(`${CASE_ROOT}/${assetPath}`);
}

export function simulatorManifestUrl(): string {
  return simulatorCaseAssetUrl('case_manifest.web.json');
}
