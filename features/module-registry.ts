import { case3DScaffold } from '@/features/case3d/scaffold';
import { knobologyScaffold } from '@/features/knobology/scaffold';
import { pretestScaffold } from '@/features/pretest/scaffold';
import { stationExplorerScaffold } from '@/features/explorer/scaffold';
import { stationMapScaffold } from '@/features/stations/scaffold';
import type { FeatureScaffold, ModuleId } from '@/lib/types';

export const moduleScaffolds: Record<ModuleId, FeatureScaffold> = {
  pretest: pretestScaffold,
  knobology: knobologyScaffold,
  'station-map': stationMapScaffold,
  'station-explorer': stationExplorerScaffold,
  'case-3d-explorer': case3DScaffold,
};
