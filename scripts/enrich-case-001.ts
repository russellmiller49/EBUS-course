import path from 'node:path';

import { writeCaseOutputs } from './case-001-enrichment';

export function runCase001Enrichment(rootDir = process.cwd()) {
  const outputs = writeCaseOutputs(rootDir);

  process.stdout.write(
    [
      `Wrote ${path.relative(rootDir, outputs.enrichedManifestPath)}`,
      `Wrote ${path.relative(rootDir, outputs.assetIndexPath)}`,
      ...outputs.enrichedManifest.warnings.map((warning) => `Warning: ${warning}`),
    ].join('\n') + '\n',
  );

  return outputs;
}

if (require.main === module) {
  runCase001Enrichment();
}
