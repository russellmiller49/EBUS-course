import { stationConnections, zoneThemes } from '@/content/stations';
import type { CombinedStation, StationMapLayout, StationMapLandmark } from '@/content/types';
import { StationNode } from '@/features/stations/StationNode';

function renderLandmark(landmark: StationMapLandmark) {
  const style = {
    left: `${(landmark.x / 320) * 100}%`,
    top: `${(landmark.y / 420) * 100}%`,
    width: `${(landmark.width / 320) * 100}%`,
    height: `${(landmark.height / 420) * 100}%`,
    transform: `rotate(${landmark.rotation}deg)`,
  };

  return <div key={landmark.id} className={`station-map__landmark station-map__landmark--${landmark.kind}`} style={style} />;
}

function getQuizMaskDimensions(stationId: string) {
  if (stationId === '10R' || stationId === '10L') {
    return { width: 86, height: 58 };
  }

  if (stationId === '11Rs' || stationId === '11Ri' || stationId === '11L') {
    return { width: 98, height: 58 };
  }

  if (stationId === '7') {
    return { width: 58, height: 58 };
  }

  return { width: 64, height: 64 };
}

export function StationMap({
  layout,
  stations,
  selectedStationId,
  onSelect,
  quizMode,
}: {
  layout: StationMapLayout;
  stations: CombinedStation[];
  selectedStationId: string | null;
  onSelect: (stationId: string) => void;
  quizMode?: boolean;
}) {
  const stationLookup = Object.fromEntries(stations.map((station) => [station.id, station]));

  return (
    <div className={`station-map${quizMode ? ' station-map--quiz' : ''}`}>
      <img
        alt={quizMode ? 'Mediastinal station quiz schematic with masked labels' : 'Mediastinal anatomy and lymph node station schematic'}
        className={`station-map__image${quizMode ? ' station-map__image--quiz' : ''}`}
        src="/media/stations/clean_mediastinum.png"
      />
      {quizMode ? (
        <>
          <div className="station-map__quiz-scrim" />
          <div className="station-map__quiz-masks" aria-hidden="true">
            {stations.map((station) => {
              const mask = getQuizMaskDimensions(station.id);

              return (
                <div
                  key={`mask-${station.id}`}
                  className="station-map__quiz-mask"
                  style={{
                    left: `${((station.mapNode.x + station.mapNode.width / 2) / layout.designWidth) * 100}%`,
                    top: `${((station.mapNode.y + station.mapNode.height / 2) / layout.designHeight) * 100}%`,
                    width: `${(mask.width / layout.designWidth) * 100}%`,
                    height: `${(mask.height / layout.designHeight) * 100}%`,
                  }}
                />
              );
            })}
          </div>
          <svg className="station-map__connections" viewBox={`0 0 ${layout.designWidth} ${layout.designHeight}`} aria-hidden="true">
            {stationConnections.map((connection) => {
              const from = stationLookup[connection.from];
              const to = stationLookup[connection.to];

              if (!from || !to) {
                return null;
              }

              return (
                <line
                  key={`${connection.from}-${connection.to}`}
                  x1={from.mapNode.x + from.mapNode.width / 2}
                  x2={to.mapNode.x + to.mapNode.width / 2}
                  y1={from.mapNode.y + from.mapNode.height / 2}
                  y2={to.mapNode.y + to.mapNode.height / 2}
                />
              );
            })}
          </svg>
        </>
      ) : null}
      {layout.landmarks.map(renderLandmark)}
      <div className="station-map__zone station-map__zone--upper">{zoneThemes.upper.label}</div>
      <div className="station-map__zone station-map__zone--subcarinal">{zoneThemes.subcarinal.label}</div>
      <div className="station-map__zone station-map__zone--hilar">{zoneThemes.hilar.label}</div>
      {stations.map((station) => (
        <StationNode
          key={station.id}
          isQuizMode={quizMode}
          isSelected={selectedStationId === station.id}
          onSelect={onSelect}
          station={station}
        />
      ))}
    </div>
  );
}
