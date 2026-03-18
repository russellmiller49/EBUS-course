import { knobologyScaffold } from '@/features/knobology/scaffold';
import { stationExplorerScaffold } from '@/features/explorer/scaffold';
import { stationMapScaffold } from '@/features/stations/scaffold';
import type { FeatureScaffold, ModuleId } from '@/lib/types';

export const moduleScaffolds: Record<ModuleId, FeatureScaffold> = {
  knobology: knobologyScaffold,
  'station-map': stationMapScaffold,
  'station-explorer': stationExplorerScaffold,
};
