import { useDeferredValue, useEffect, useMemo, useReducer, useState } from 'react';

import { EducationSectionCard } from '@/components/education/EducationModuleRenderer';
import { knobologyAdvancedContent } from '@/content/education';
import { knobologyContent, knobologyControlMeta, knobologyReferenceCards } from '@/content/knobology';
import { getKnobologyMedia } from '@/content/media';
import type { KnobologyControlId } from '@/content/types';
import { getDepthFieldClipPath } from '@/features/knobology/depthField';
import { getKnobologyLearnMoreSections } from '@/features/knobology/learnMore';
import euMe2LayoutData from '@/features/knobology/processor/eu-me2-layout.json';
import { EuMe2Keyboard, type EuMe2Layout } from '@/features/knobology/processor/EuMe2Keyboard';
import {
  buildFrameMetrics,
  createKnobologyFrameState,
  evaluateExercise,
  FREQUENCY_LABELS,
  getDepthFrameIndex,
  reduceKnobologyFrameState,
  type KnobologyProcessorActionId,
} from '@/features/knobology/logic';
import { useLearnerProgress } from '@/lib/progress';

const euMe2Layout = euMe2LayoutData as EuMe2Layout;

const ACCESSIBILITY_TOUCH_ACTIONS: KnobologyProcessorActionId[] = [
  'OPEN_MAIN_MENU',
  'OPEN_IMAGE_ADJUST',
  'TOGGLE_ENHANCE',
  'THE_OFF',
  'THE_P',
  'THE_R',
  'FREQUENCY_DOWN',
  'FREQUENCY_UP',
  'FOCUS_DOWN',
  'FOCUS_UP',
  'OBS_GI',
  'OBS_PB',
  'OBS_RSP',
];

function getControlForAction(actionId: KnobologyProcessorActionId): KnobologyControlId | null {
  switch (actionId) {
    case 'GAIN_DOWN':
    case 'GAIN_UP':
      return 'gain';
    case 'DEPTH_UP':
    case 'FOCUS_CYCLE':
    case 'FOCUS_DOWN':
    case 'FOCUS_UP':
      return 'depth';
    case 'FLOW_MODE':
    case 'B_MODE':
    case 'PW_MODE':
      return 'color-doppler';
    case 'TRACE_MODE':
    case 'MEASURE_MODE':
    case 'MEASURE_SET':
    case 'CLEAR':
      return 'calipers';
    case 'TOGGLE_FREEZE':
    case 'CINE_REVIEW_MODE':
    case 'CINE_STEP_BACK':
    case 'CINE_PLAY_PAUSE':
    case 'CINE_STEP_FORWARD':
      return 'freeze';
    case 'SAVE_REC':
      return 'save';
    default:
      return null;
  }
}

export function KnobologyPanel({ processorDebug = false }: { processorDebug?: boolean }) {
  const { setLastUsedKnobologyControl, setModuleProgress, state: progressState } = useLearnerProgress();
  const [activeExerciseId, setActiveExerciseId] = useState(knobologyContent.controlLabExercises[0]?.id ?? '');
  const [activeControl, setActiveControl] = useState<KnobologyControlId>(
    progressState.lastUsedKnobologyControl ?? 'depth',
  );
  const [referenceFilter, setReferenceFilter] = useState('');
  const [showLearnMore, setShowLearnMore] = useState(true);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const activeExercise =
    knobologyContent.controlLabExercises.find((exercise) => exercise.id === activeExerciseId) ??
    knobologyContent.controlLabExercises[0];
  const [frameState, dispatchFrame] = useReducer(reduceKnobologyFrameState, activeExercise, createKnobologyFrameState);

  useEffect(() => {
    dispatchFrame({ type: 'RESET_FOR_EXERCISE', exercise: activeExercise });
  }, [activeExercise]);

  useEffect(() => {
    setLastUsedKnobologyControl(activeControl);
  }, [activeControl, setLastUsedKnobologyControl]);

  useEffect(() => {
    if (!frameState.cinePlaying) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      dispatchFrame({ type: 'PROCESSOR_ACTION', actionId: 'CINE_STEP_FORWARD' });
    }, 420);

    return () => window.clearInterval(timer);
  }, [frameState.cinePlaying]);

  const frameMetrics = buildFrameMetrics(frameState);
  const evaluation = evaluateExercise(activeExercise, frameState);
  const dopplerEnabled = frameState.colorDoppler;
  const safePathSelected = selectedPathId === knobologyContent.dopplerLab.safePathId;
  const depthMedia = getKnobologyMedia('depth');
  const depthFrames = depthMedia.comparisonImages ?? [];
  const depthFrameIndex = depthFrames.length > 0 ? getDepthFrameIndex(frameState.depth, depthFrames.length) : 0;
  const controlLabImage = depthFrames[depthFrameIndex];
  const depthFieldClipPath = getDepthFieldClipPath(depthFrameIndex);
  const dopplerMedia = getKnobologyMedia('color-doppler');
  const deferredReferenceFilter = useDeferredValue(referenceFilter);
  const dopplerClip =
    dopplerEnabled
      ? dopplerMedia.clips?.[1] ?? dopplerMedia.clips?.[0]
      : dopplerMedia.clips?.[0];
  const learnMoreSections = getKnobologyLearnMoreSections(activeControl, knobologyAdvancedContent.sections);
  const filteredReferenceCards = knobologyReferenceCards.filter((card) => {
    const query = deferredReferenceFilter.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      card.title.toLowerCase().includes(query) ||
      card.whenToUse.toLowerCase().includes(query) ||
      card.whatChanges.toLowerCase().includes(query)
    );
  });
  const compactTouchButtons = useMemo(
    () =>
      ACCESSIBILITY_TOUCH_ACTIONS.map((actionId) => ({
        actionId,
        label: euMe2Layout.hotspots.find((hotspot) => hotspot.action === actionId)?.label ?? actionId,
      })),
    [],
  );

  function markExerciseSolved() {
    if (evaluation.solved) {
      setModuleProgress('knobology', 55);
    }
  }

  function handleProcessorAction(actionId: KnobologyProcessorActionId) {
    dispatchFrame({ type: 'PROCESSOR_ACTION', actionId });

    const mappedControl = getControlForAction(actionId);

    if (mappedControl) {
      setActiveControl(mappedControl);
    }

    if (actionId === 'SAVE_REC') {
      setModuleProgress('knobology', 70);
    }

    if (actionId === 'FLOW_MODE') {
      setModuleProgress('knobology', 80);
    }

    if (actionId === 'MEASURE_MODE' || actionId === 'MEASURE_SET' || actionId === 'TRACE_MODE') {
      setModuleProgress('knobology', 60);
    }
  }

  function handleControlSelect(controlId: KnobologyControlId) {
    setActiveControl(controlId);

    if (controlId === 'color-doppler') {
      handleProcessorAction(dopplerEnabled ? 'B_MODE' : 'FLOW_MODE');
    }

    if (controlId === 'calipers') {
      handleProcessorAction(frameState.measurementMode === 'measure' && frameState.calipers ? 'CLEAR' : 'MEASURE_MODE');
    }

    if (controlId === 'freeze') {
      handleProcessorAction('TOGGLE_FREEZE');
    }

    if (controlId === 'save') {
      handleProcessorAction('SAVE_REC');
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
                    style={{
                      transform: `translateX(${frameMetrics.imageShiftX}%) scale(${frameMetrics.imageScale})`,
                    }}
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
                        transform: `translateX(${frameMetrics.imageShiftX}%) scale(${frameMetrics.imageScale})`,
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
                        transform: `translateX(${frameMetrics.imageShiftX}%) scale(${frameMetrics.imageScale})`,
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

              <div className="knobology-frame__focus-marker" style={{ top: `${frameMetrics.focusMarkerY}%` }} />
              {frameState.mode === 'pw' ? (
                <div className="knobology-frame__waveform" style={{ opacity: frameMetrics.waveformOpacity }}>
                  {Array.from({ length: 20 }).map((_, index) => (
                    <span
                      key={index}
                      className="knobology-frame__waveform-bar"
                      style={{ height: `${28 + ((index * 17) % 56)}%` }}
                    />
                  ))}
                </div>
              ) : null}
              {dopplerEnabled ? <div className="knobology-frame__doppler" style={{ opacity: frameMetrics.colorSignalOpacity }} /> : null}
              {frameState.calipers ? (
                <div className={`knobology-frame__calipers${frameState.measurementMode === 'trace' ? ' knobology-frame__calipers--trace' : ''}`}>
                  {frameState.measurementPoints > 1 ? <span className="knobology-frame__measure-readout">12.4 mm</span> : null}
                </div>
              ) : null}
              {frameState.pipEnabled && controlLabImage ? (
                <div className="knobology-frame__pip" style={{ opacity: frameMetrics.pipOpacity }}>
                  <img alt="" aria-hidden="true" src={controlLabImage} />
                  <span>PIP</span>
                </div>
              ) : null}
              {frameState.commentCount > 0 ? (
                <div className="knobology-frame__comments">
                  {Array.from({ length: frameState.commentCount }).map((_, index) => (
                    <span
                      key={index}
                      className="knobology-frame__comment"
                      style={{
                        left: `${18 + index * 14}%`,
                        top: `${22 + index * 12}%`,
                      }}
                    >
                      Note {index + 1}
                    </span>
                  ))}
                </div>
              ) : null}
              {frameState.menu !== 'none' ? (
                <div className="knobology-frame__menu">
                  <strong>{frameState.menu === 'main' ? 'Main Menu' : 'Image Adjust'}</strong>
                  <span>Freq {FREQUENCY_LABELS[frameState.frequencyIndex]}</span>
                  <span>T.H.E. {frameState.harmonicMode.toUpperCase()}</span>
                  <span>{frameState.enhanceEnabled ? 'Enhance on' : 'Enhance off'}</span>
                </div>
              ) : null}
              {frameState.frozen || frameState.cineReviewMode ? (
                <div className="knobology-frame__cine-strip">
                  <span>Cine {frameState.cineFrame + 1}/7</span>
                  <div className="knobology-frame__cine-track">
                    <span
                      className="knobology-frame__cine-thumb"
                      style={{ left: `${(frameState.cineFrame / 6) * 100}%` }}
                    />
                  </div>
                  <span>{frameState.cinePlaying ? 'Playing' : 'Paused'}</span>
                </div>
              ) : null}
              <div className="knobology-frame__status">
                <span>D {frameState.depth}</span>
                <span>G {frameState.gain}</span>
                <span>C {frameState.contrast}</span>
                <span>{frameState.mode.toUpperCase()}</span>
                <span>F {FREQUENCY_LABELS[frameState.frequencyIndex]}</span>
                {frameState.frozen ? <span>FRZ</span> : null}
                {frameState.saved ? <span>SAV</span> : null}
                {frameState.pipEnabled ? <span>PIP</span> : null}
              </div>
            </div>
            <div className="knobology-frame__caption">
              <strong>{activeExercise.title}</strong>
              <p>{activeExercise.symptom}</p>
              <p className="knobology-frame__status-line">{frameState.statusMessage}</p>
              {controlLabImage && depthMedia.caption ? <p className="knobology-frame__media-note">{depthMedia.caption}</p> : null}
            </div>
          </div>

          <div className="stack-card knobology-console">
            <div className="eyebrow">Processor</div>
            <EuMe2Keyboard
              activeActionId={frameState.lastActionId}
              debug={processorDebug}
              layout={euMe2Layout}
              onAction={handleProcessorAction}
            />

            <div className="knobology-console__touch-panel">
              <div className="eyebrow">Touch panel mirror</div>
              <div className="button-row button-row--wrap">
                {compactTouchButtons.map((button) => (
                  <button
                    key={button.actionId}
                    className={`control-pill${frameState.lastActionId === button.actionId ? ' control-pill--active' : ''}`}
                    onClick={() => handleProcessorAction(button.actionId)}
                    type="button"
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>

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
                      dispatchFrame({
                        type: 'SET_NUMERIC_FIELD',
                        field,
                        value: Number(event.target.value),
                      });
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
                onClick={() => dispatchFrame({ type: 'RESET_FOR_EXERCISE', exercise: activeExercise })}
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

        <div className="learn-more-drawer">
          <div className="learn-more-drawer__header">
            <div>
              <div className="eyebrow">Learn More</div>
              <h3>{knobologyControlMeta[activeControl].shortLabel} in context</h3>
              <p>Reference content now follows the control you are actively adjusting instead of sitting above the simulator.</p>
            </div>
            <button
              className="button button--ghost"
              onClick={() => setShowLearnMore((current) => !current)}
              type="button"
            >
              {showLearnMore ? 'Hide reference' : 'Show reference'}
            </button>
          </div>
          {showLearnMore ? (
            <div className="learn-more-drawer__content">
              {learnMoreSections.map((section) => (
                <EducationSectionCard key={section.id} section={section} />
              ))}
            </div>
          ) : null}
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
                onClick={() => handleProcessorAction(dopplerEnabled ? 'B_MODE' : 'FLOW_MODE')}
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
            placeholder="Filter by control or scenario…"
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
