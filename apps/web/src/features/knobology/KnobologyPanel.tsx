import { useEffect, useState } from 'react';

import { knobologyContent, knobologyControlMeta, knobologyReferenceCards } from '@/content/knobology';
import { getKnobologyMedia } from '@/content/media';
import type { KnobologyControlId } from '@/content/types';
import { getDepthFieldClipPath } from '@/features/knobology/depthField';
import {
  buildFrameMetrics,
  createKnobologyFrameState,
  evaluateExercise,
  getDepthFrameIndex,
  type KnobologyFrameState,
} from '@/features/knobology/logic';
import { useLearnerProgress } from '@/lib/progress';

function setNumericField(
  state: KnobologyFrameState,
  field: 'depth' | 'gain' | 'contrast',
  value: number,
): KnobologyFrameState {
  return {
    ...state,
    [field]: value,
  };
}

export function KnobologyPanel() {
  const { setLastUsedKnobologyControl, setModuleProgress, state: progressState } = useLearnerProgress();
  const [activeExerciseId, setActiveExerciseId] = useState(knobologyContent.controlLabExercises[0]?.id ?? '');
  const [activeControl, setActiveControl] = useState<KnobologyControlId>(
    progressState.lastUsedKnobologyControl ?? 'depth',
  );
  const [referenceFilter, setReferenceFilter] = useState('');
  const [dopplerEnabled, setDopplerEnabled] = useState(false);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const activeExercise =
    knobologyContent.controlLabExercises.find((exercise) => exercise.id === activeExerciseId) ??
    knobologyContent.controlLabExercises[0];
  const [frameState, setFrameState] = useState(() => createKnobologyFrameState(activeExercise));

  useEffect(() => {
    setFrameState(createKnobologyFrameState(activeExercise));
  }, [activeExercise]);

  useEffect(() => {
    setLastUsedKnobologyControl(activeControl);
  }, [activeControl, setLastUsedKnobologyControl]);

  const frameMetrics = buildFrameMetrics({
    ...frameState,
    colorDoppler: dopplerEnabled,
  });
  const evaluation = evaluateExercise(activeExercise, {
    ...frameState,
    colorDoppler: dopplerEnabled,
  });
  const safePathSelected = selectedPathId === knobologyContent.dopplerLab.safePathId;
  const depthMedia = getKnobologyMedia('depth');
  const depthFrames = depthMedia.comparisonImages ?? [];
  const depthFrameIndex = depthFrames.length > 0 ? getDepthFrameIndex(frameState.depth, depthFrames.length) : 0;
  const controlLabImage = depthFrames[depthFrameIndex];
  const depthFieldClipPath = getDepthFieldClipPath(depthFrameIndex);
  const dopplerMedia = getKnobologyMedia('color-doppler');
  const dopplerClip =
    dopplerEnabled
      ? dopplerMedia.clips?.[1] ?? dopplerMedia.clips?.[0]
      : dopplerMedia.clips?.[0];
  const filteredReferenceCards = knobologyReferenceCards.filter((card) => {
    const query = referenceFilter.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      card.title.toLowerCase().includes(query) ||
      card.whenToUse.toLowerCase().includes(query) ||
      card.whatChanges.toLowerCase().includes(query)
    );
  });

  function markExerciseSolved() {
    if (evaluation.solved) {
      setModuleProgress('knobology', 55);
    }
  }

  function handleControlSelect(controlId: KnobologyControlId) {
    setActiveControl(controlId);

    if (controlId === 'color-doppler') {
      setDopplerEnabled((current) => !current);
    }

    if (controlId === 'calipers') {
      setFrameState((current) => ({ ...current, calipers: !current.calipers }));
    }

    if (controlId === 'freeze') {
      setFrameState((current) => ({ ...current, frozen: !current.frozen }));
    }

    if (controlId === 'save') {
      setFrameState((current) => ({ ...current, saved: !current.saved }));
      setModuleProgress('knobology', 70);
    }
  }

  return (
    <div className="knobology-panel">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Primer</div>
            <h2>Control sequence before you touch the needle</h2>
          </div>
        </div>
        <div className="mini-card-grid">
          {knobologyContent.primerSections.map((section) => (
            <article key={section.id} className="mini-card">
              <div className="mini-card__title">
                <span>{knobologyControlMeta[section.id as KnobologyControlId]?.icon ?? '•'}</span>
                <strong>{section.title}</strong>
              </div>
              <p>{section.summary}</p>
              <div className="mini-card__footer">
                <span>Best move: {section.bestMove}</span>
                <span>Pitfall: {section.pitfall}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Fix The Image</div>
            <h2>Control lab</h2>
          </div>
          <select
            aria-label="Select image rescue exercise"
            className="select"
            onChange={(event) => setActiveExerciseId(event.target.value)}
            value={activeExercise.id}
          >
            {knobologyContent.controlLabExercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.title}
              </option>
            ))}
          </select>
        </div>

        <div className="knobology-lab">
          <div className="knobology-frame">
            <div className="knobology-frame__screen">
              {controlLabImage ? (
                <div className="knobology-frame__image-shell">
                  <img
                    alt="EBUS teaching frame used for the knobology control lab"
                    className="knobology-frame__image knobology-frame__image--base"
                    src={controlLabImage}
                  />
                  {depthFieldClipPath ? (
                    <img
                      alt=""
                      aria-hidden="true"
                      className="knobology-frame__image knobology-frame__image--field"
                      src={controlLabImage}
                      style={{
                        clipPath: depthFieldClipPath,
                        WebkitClipPath: depthFieldClipPath,
                        filter: `brightness(${frameMetrics.realFrameBrightness}) contrast(${frameMetrics.realFrameContrast})`,
                      }}
                    />
                  ) : (
                    <img
                      alt=""
                      aria-hidden="true"
                      className="knobology-frame__image knobology-frame__image--field"
                      src={controlLabImage}
                      style={{
                        filter: `brightness(${frameMetrics.realFrameBrightness}) contrast(${frameMetrics.realFrameContrast})`,
                      }}
                    />
                  )}
                </div>
              ) : (
                <>
                  <div className="knobology-frame__sector" style={{ opacity: frameMetrics.brightness }} />
                  <div className="knobology-frame__haze" style={{ opacity: frameMetrics.hazeOpacity }} />
                  <div
                    className="knobology-frame__node"
                    style={{
                      top: `${frameMetrics.nodeY}%`,
                      width: `${frameMetrics.nodeSize}%`,
                      height: `${frameMetrics.nodeSize * 0.62}%`,
                      borderColor: `rgba(225, 241, 255, ${frameMetrics.borderOpacity})`,
                    }}
                  />
                  {Array.from({ length: 42 }).map((_, index) => (
                    <span
                      key={index}
                      className="knobology-frame__speck"
                      style={{
                        left: `${20 + ((index * 17) % 58)}%`,
                        top: `${12 + ((index * 13) % 68)}%`,
                        opacity: 0.08 + ((index % 4) + 1) * 0.04,
                      }}
                    />
                  ))}
                </>
              )}
              {dopplerEnabled ? <div className="knobology-frame__doppler" style={{ opacity: frameMetrics.colorSignalOpacity }} /> : null}
              {frameState.calipers ? <div className="knobology-frame__calipers" /> : null}
              <div className="knobology-frame__status">
                <span>D {frameState.depth}</span>
                <span>G {frameState.gain}</span>
                <span>C {frameState.contrast}</span>
                {frameState.frozen ? <span>FRZ</span> : null}
                {frameState.saved ? <span>SAV</span> : null}
                {dopplerEnabled ? <span>CFM</span> : null}
              </div>
            </div>
            <div className="knobology-frame__caption">
              <strong>{activeExercise.title}</strong>
              <p>{activeExercise.symptom}</p>
              {controlLabImage && depthMedia.caption ? <p className="knobology-frame__media-note">{depthMedia.caption}</p> : null}
            </div>
          </div>

          <div className="stack-card">
            <div className="eyebrow">Instructions</div>
            <p>{activeExercise.instructions}</p>
            <div className="button-row button-row--wrap">
              {(Object.keys(knobologyControlMeta) as KnobologyControlId[]).map((controlId) => (
                <button
                  key={controlId}
                  className={`control-pill${activeControl === controlId ? ' control-pill--active' : ''}`}
                  onClick={() => handleControlSelect(controlId)}
                  type="button"
                >
                  <span>{knobologyControlMeta[controlId].icon}</span>
                  <span>{knobologyControlMeta[controlId].shortLabel}</span>
                </button>
              ))}
            </div>

            <div className="slider-stack">
              {(['depth', 'gain', 'contrast'] as const).map((field) => (
                <label key={field} className="slider-field">
                  <span>{field}</span>
                  <input
                    aria-label={`${field} slider`}
                    max={100}
                    min={0}
                    onChange={(event) => {
                      setFrameState((current) => setNumericField(current, field, Number(event.target.value)));
                      setActiveControl(field);
                    }}
                    type="range"
                    value={frameState[field]}
                  />
                  <strong>{frameState[field]}</strong>
                </label>
              ))}
            </div>

            <div className={`feedback-banner${evaluation.solved ? ' feedback-banner--success' : ''}`}>
              <strong>{evaluation.solved ? 'Solved' : `Score ${evaluation.score}`}</strong>
              <p>{evaluation.feedback}</p>
            </div>

            <div className="button-row">
              <button
                className="button button--ghost"
                onClick={() => setFrameState(createKnobologyFrameState(activeExercise))}
                type="button"
              >
                Reset frame
              </button>
              <button className="button" onClick={markExerciseSolved} type="button">
                Save progress
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Doppler mini-lab</div>
            <h2>{knobologyContent.dopplerLab.title}</h2>
          </div>
        </div>
        <div className="split-grid">
          <div className="stack-card">
            <p>{knobologyContent.dopplerLab.brief}</p>
            <div className="doppler-lab">
              <div className="doppler-lab__frame">
                {dopplerClip ? (
                  <video
                    key={dopplerClip}
                    autoPlay
                    className="doppler-lab__video"
                    controls
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    src={dopplerClip}
                  />
                ) : (
                  <>
                    <div className="doppler-lab__target" />
                    {dopplerEnabled ? <div className="doppler-lab__vessel" /> : null}
                  </>
                )}
                <span className="doppler-lab__state">{dopplerEnabled ? 'Doppler on' : 'Doppler off'}</span>
                <span className="doppler-lab__label">
                  {dopplerMedia.caption ?? 'Toggle Doppler to reveal flow'}
                </span>
              </div>
              <button
                className={`button${dopplerEnabled ? ' button--ghost' : ''}`}
                onClick={() => {
                  const nextValue = !dopplerEnabled;
                  setDopplerEnabled(nextValue);
                  if (nextValue) {
                    setModuleProgress('knobology', 80);
                  }
                }}
                type="button"
              >
                {dopplerEnabled ? 'Switch to Doppler Off' : 'Switch to Doppler On'}
              </button>
            </div>
          </div>
          <div className="stack-card">
            <div className="eyebrow">Path challenge</div>
            <p>{knobologyContent.dopplerLab.prompt}</p>
            <div className="stack-list">
              {knobologyContent.dopplerLab.paths.map((path) => (
                <button
                  key={path.id}
                  className={`choice-card${selectedPathId === path.id ? ' choice-card--selected' : ''}`}
                  onClick={() => {
                    setSelectedPathId(path.id);
                    if (path.id === knobologyContent.dopplerLab.safePathId) {
                      setModuleProgress('knobology', 90);
                    }
                  }}
                  type="button"
                >
                  <strong>{path.label}</strong>
                  <span>{path.description}</span>
                </button>
              ))}
            </div>
            {selectedPathId ? (
              <div className={`feedback-banner${safePathSelected ? ' feedback-banner--success' : ''}`}>
                <strong>{safePathSelected ? 'Safe path selected' : 'Try again'}</strong>
                <p>
                  {safePathSelected
                    ? 'The selected path routes around the color-filled vessel instead of crossing it.'
                    : 'That path still crosses Doppler signal. Pick the trajectory that avoids the color-filled vessel.'}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Quick reference</div>
            <h2>Searchable control cards</h2>
          </div>
          <input
            aria-label="Filter quick reference cards"
            className="input"
            onChange={(event) => setReferenceFilter(event.target.value)}
            placeholder="Filter by control or scenario"
            type="search"
            value={referenceFilter}
          />
        </div>
        <div className="mini-card-grid">
          {filteredReferenceCards.map((card) => (
            <article key={card.id} className="mini-card">
              <div className="mini-card__title">
                <span>{knobologyControlMeta[card.id].icon}</span>
                <strong>{card.title}</strong>
              </div>
              <p>{card.whenToUse}</p>
              <div className="mini-card__footer">
                <span>{card.whatChanges}</span>
                <span>{card.noviceTrap}</span>
                <span>{getKnobologyMedia(card.id).caption ?? ''}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
