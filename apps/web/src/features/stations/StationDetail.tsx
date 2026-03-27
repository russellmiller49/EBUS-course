import { getStationPrimaryMedia } from '@/content/media';
import { getViewLabel, zoneThemes } from '@/content/stations';
import type { CombinedStation } from '@/content/types';

function MediaSlot({
  station,
  viewId,
}: {
  station: CombinedStation;
  viewId: 'ct' | 'bronchoscopy' | 'ultrasound';
}) {
  const media = getStationPrimaryMedia(station.media, viewId);
  const view = station.views[viewId];

  return (
    <article className="media-slot">
      <div className="media-slot__eyebrow">
        <span>{getViewLabel(viewId)}</span>
        <span>{view.focusLabel}</span>
      </div>
      <div className={`media-slot__frame media-slot__frame--${view.visualAnchor}`}>
        {media?.kind === 'image' ? <img alt={`${station.id} ${getViewLabel(viewId)} correlate`} src={media.src} /> : null}
        {media?.kind === 'video' ? <video controls preload="metadata" src={media.src} /> : null}
        {!media ? (
          <div className="media-slot__placeholder">
            <span>{getViewLabel(viewId)}</span>
            <strong>{view.orientation}</strong>
            <p>{station.media.notes?.[0] ?? 'Media manifest is ready for this slot.'}</p>
          </div>
        ) : null}
      </div>
      <p className="media-slot__caption">{view.caption}</p>
    </article>
  );
}

export function StationDetail({
  station,
  isBookmarked,
  onToggleBookmark,
}: {
  station: CombinedStation;
  isBookmarked: boolean;
  onToggleBookmark: (stationId: string) => void;
}) {
  const theme = zoneThemes[station.zoneKey];

  return (
    <section className="detail-card" style={{ ['--detail-accent' as string]: theme.border }}>
      <div className="detail-card__header">
        <div>
          <div className="detail-card__meta">
            <span className="chip chip--accent">{station.id}</span>
            <span className="chip">{theme.label}</span>
            <span className="chip">{station.laterality}</span>
          </div>
          <h2>{station.displayName}</h2>
          <p>{station.description}</p>
        </div>
        <button
          aria-pressed={isBookmarked}
          className={`action-pill${isBookmarked ? ' action-pill--active' : ''}`}
          onClick={() => onToggleBookmark(station.id)}
          type="button"
        >
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>

      <div className="detail-card__grid">
        <div className="detail-card__column">
          <div className="stack-card">
            <div className="eyebrow">Access notes</div>
            <p>{station.accessNotes}</p>
          </div>
          <div className="stack-card">
            <div className="eyebrow">Memory cues</div>
            <ul className="plain-list">
              {station.memoryCues.map((cue) => (
                <li key={cue}>{cue}</li>
              ))}
            </ul>
          </div>
          <div className="stack-card">
            <div className="eyebrow">Landmark checklist</div>
            <ul className="plain-list">
              {station.landmarkChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="stack-card">
            <div className="eyebrow">Common confusion pairs</div>
            <div className="tag-row">
              {station.confusionPairs.map((pair) => (
                <span key={pair} className="tag">
                  {pair}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="detail-card__column detail-card__column--media">
          <div className="media-grid">
            <MediaSlot station={station} viewId="ct" />
            <MediaSlot station={station} viewId="bronchoscopy" />
            <MediaSlot station={station} viewId="ultrasound" />
          </div>
          <div className="stack-card">
            <div className="eyebrow">Aliases</div>
            <div className="tag-row">
              {station.aliases.map((alias) => (
                <span key={alias} className="tag">
                  {alias}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
