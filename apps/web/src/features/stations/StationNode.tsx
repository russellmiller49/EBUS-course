import type { CombinedStation } from '@/content/types';

export function StationNode({
  station,
  isSelected,
  isQuizMode,
  onSelect,
}: {
  station: CombinedStation;
  isSelected: boolean;
  isQuizMode?: boolean;
  onSelect: (stationId: string) => void;
}) {
  const shouldShowLabel = isSelected || isQuizMode;

  return (
    <button
      aria-label={`Select station ${station.id}`}
      className={`station-node${isSelected ? ' station-node--selected' : ''}${isQuizMode ? ' station-node--quiz' : ''}${
        shouldShowLabel ? ' station-node--labeled' : ''
      }`}
      onClick={() => onSelect(station.id)}
      style={{
        left: `${((station.mapNode.x + station.mapNode.width / 2) / 649) * 100}%`,
        top: `${((station.mapNode.y + station.mapNode.height / 2) / 791) * 100}%`,
        ['--station-bg' as string]: `var(--zone-${station.zoneKey}-bg)`,
        ['--station-border' as string]: `var(--zone-${station.zoneKey}-border)`,
        ['--station-text' as string]: `var(--zone-${station.zoneKey}-text)`,
      }}
      type="button"
    >
      {shouldShowLabel ? (isQuizMode ? '?' : station.id) : ''}
    </button>
  );
}
