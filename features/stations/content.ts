import stationMapContentData from '@/content/modules/station-map.json';
import stationMapLayoutData from '@/content/stations/station-map-layout.json';
import { getStationById } from '@/lib/content';

import type { StationMapLayout, StationMapModuleContent, StationMapStation } from '@/features/stations/types';

const stationMapContent = stationMapContentData as StationMapModuleContent;
const stationMapLayout = stationMapLayoutData as StationMapLayout;

const stationMapStations = stationMapLayout.nodes.flatMap((node) => {
  const station = getStationById(node.stationId);

  if (!station) {
    return [];
  }

  return [
    {
      ...station,
      mapNode: node,
    },
  ] satisfies StationMapStation[];
});

export function getStationMapContent(): StationMapModuleContent {
  return stationMapContent;
}

export function getStationMapLayout(): StationMapLayout {
  return stationMapLayout;
}

export function getStationMapStations(): StationMapStation[] {
  return stationMapStations;
}

export function getStationMapStationById(stationId: string): StationMapStation | undefined {
  return stationMapStations.find((station) => station.id === stationId);
}
