import vtkGLTFImporter from '@kitware/vtk.js/IO/Geometry/GLTFImporter';
import type vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';

import { normalizeStructureKey } from '../structureKeys';
import { rowMajorToColumnMajor } from './coordinateTransforms';

import type { RuntimeCaseManifest } from '../../../../../../features/case3d/types';

type GlbSceneNode = {
  id: string | number;
  name?: string;
  children?: GlbSceneNode[];
};

export interface LoadedGlbOverlay {
  importer: vtkGLTFImporter;
  namedActors: Map<string, any[]>;
}

function collectNamedActors(importer: vtkGLTFImporter) {
  const namedActors = new Map<string, any[]>();
  const actorMap = importer.getActors();
  const scenes = (importer as vtkGLTFImporter & {
    getScenes?: () => Array<{ nodes?: GlbSceneNode[] }>;
  }).getScenes?.();

  function visit(node: GlbSceneNode) {
    const nodeKey = String(node.id);
    const actorsForNode = new Set<any>();
    const nodeActor = actorMap?.get(nodeKey);

    if (nodeActor) {
      actorsForNode.add(nodeActor);
    }

    actorMap?.forEach((actor, key) => {
      if (String(key).startsWith(`${nodeKey}_`)) {
        actorsForNode.add(actor);
      }
    });

    if (node.name && actorsForNode.size > 0) {
      const key = normalizeStructureKey(node.name);
      const existing = namedActors.get(key) ?? [];

      namedActors.set(
        key,
        [...new Set([...existing, ...actorsForNode])],
      );
    }

    node.children?.forEach(visit);
  }

  scenes?.forEach((scene) => scene.nodes?.forEach(visit));

  return namedActors;
}

export async function loadGlbOverlay(
  renderer: vtkRenderer,
  manifest: RuntimeCaseManifest,
  url: string,
): Promise<LoadedGlbOverlay> {
  const importer = vtkGLTFImporter.newInstance();
  importer.setRenderer(renderer);
  await importer.setUrl(url, { binary: true });
  await importer.loadData({ binary: true });
  importer.importActors();
  const matrix = rowMajorToColumnMajor(manifest.patientToScene.inverseMatrix);

  importer.getActors().forEach((actor) => {
    actor.setUserMatrix(matrix);
  });

  return {
    importer,
    namedActors: collectNamedActors(importer),
  };
}
