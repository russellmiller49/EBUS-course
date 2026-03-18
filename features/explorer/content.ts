import stationExplorerContentData from '@/content/modules/station-explorer.json';
import stationCorrelationsData from '@/content/stations/station-correlations.json';
import { getStationById } from '@/lib/content';

import type {
  ExplorerChallengeRound,
  ExplorerStation,
  StationCorrelationContent,
  StationExplorerModuleContent,
} from '@/features/explorer/types';

const stationExplorerContent = stationExplorerContentData as StationExplorerModuleContent;
const stationCorrelations = stationCorrelationsData as StationCorrelationContent[];

const explorerStations = stationCorrelations.flatMap((entry) => {
  const station = getStationById(entry.stationId);

  if (!station) {
    return [];
  }

  return [
    {
      ...station,
      aliases: entry.aliases,
      landmarkChecklist: entry.landmarkChecklist,
      primaryMemoryCue: station.memoryCues[0] ?? station.shortLabel,
      quizItems: entry.quizItems,
      views: {
        ct: {
          ...entry.views.ct,
          assetKey: station.assetKeys.ct,
        },
        bronchoscopy: {
          ...entry.views.bronchoscopy,
          assetKey: station.assetKeys.bronchoscopy,
        },
        ultrasound: {
          ...entry.views.ultrasound,
          assetKey: station.assetKeys.ultrasound,
        },
      },
    },
  ] satisfies ExplorerStation[];
});

const explorerChallengeRounds = explorerStations.flatMap((station) =>
  station.quizItems.map((item) => ({
    ...item,
    stationId: station.id,
  })),
) satisfies ExplorerChallengeRound[];

export function getStationExplorerContent(): StationExplorerModuleContent {
  return stationExplorerContent;
}

export function getExplorerStations(): ExplorerStation[] {
  return explorerStations;
}

export function getExplorerStationById(stationId: string): ExplorerStation | undefined {
  return explorerStations.find((station) => station.id === stationId);
}

export function getExplorerChallengeRounds(): ExplorerChallengeRound[] {
  return explorerChallengeRounds;
}
