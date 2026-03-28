import vtkGLTFImporter from '@kitware/vtk.js/IO/Geometry/GLTFImporter';
import type vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';

import { rowMajorToColumnMajor } from './coordinateTransforms';

import type { RuntimeCaseManifest } from '../../../../../../features/case3d/types';

export async function loadGlbOverlay(
  renderer: vtkRenderer,
  manifest: RuntimeCaseManifest,
  url: string,
) {
  const importer = vtkGLTFImporter.newInstance();
  importer.setRenderer(renderer);
  await importer.setUrl(url, { binary: true });
  await importer.loadData({ binary: true });
  importer.importActors();
  const matrix = rowMajorToColumnMajor(manifest.patientToScene.inverseMatrix);

  importer.getActors().forEach((actor) => {
    actor.setUserMatrix(matrix);
  });

  return importer;
}
