import { useDeferredValue, useEffect, useMemo, useReducer, useState } from 'react';

import { EducationSectionCard } from '@/components/education/EducationModuleRenderer';
import { knobologyAdvancedContent } from '@/content/education';
import { knobologyContent, knobologyControlMeta, knobologyReferenceCards } from '@/content/knobology';
import { getKnobologyMedia } from '@/content/media';
import type { KnobologyControlId } from '@/content/types';
import { KnobologySegmentVideo } from '@/features/knobology/KnobologySegmentVideo';
import { getKnobologyLearnMoreSections } from '@/features/knobology/learnMore';
import euMe2LayoutData from '@/features/knobology/processor/eu-me2-layout.json';
import { EuMe2Keyboard } from '@/features/knobology/processor/EuMe2Keyboard';
import type { EuMe2Hotspot, EuMe2Layout } from '@/features/knobology/processor/types';
import { useKnobologyVideoLookup } from '@/features/knobology/useKnobologyVideoLookup';
import {
  getKnobologyVideoDepthCm,
  KNOBOLOGY_VIDEO_SRC,
  resolveKnobologyVideoSegment,
  type KnobologyBModeSegmentControl,
  type KnobologyFlowSegmentMode,
} from '@/features/knobology/videoSegments';
import {
  buildFrameMetrics,
  createKnobologyFrameState,
  evaluateExercise,
  FREQUENCY_LABELS,
  reduceKnobologyFrameState,
  type KnobologyMenuMode,
  type KnobologyProcessorActionId,
} from '@/features/knobology/logic';
import { mapNestedAssetPaths } from '@/lib/assets';
import { useLearnerProgress } from '@/lib/progress';

const euMe2Layout = mapNestedAssetPaths(euMe2LayoutData as EuMe2Layout);

const KEYBOARD_FEEDBACK_CONTROLS = ['depth', 'gain', 'contrast'] as const;
const FLOW_PREVIEW_MODES = ['color', 'power', 'h-flow'] as const;
const FLOW_PREVIEW_MODE_LABELS: Record<KnobologyFlowSegmentMode, string> = {
  color: 'Color Flow',
  power: 'Power Flow',
  'h-flow': 'H-flow',
};

function isHotspotVisibleForMenu(hotspot: EuMe2Hotspot, menuMode: KnobologyMenuMode) {
  return hotspot.visibleInMenus ? hotspot.visibleInMenus.includes(menuMode) : true;
}

function getControlForAction(actionId: KnobologyProcessorActionId): KnobologyControlId | null {
  switch (actionId) {
    case 'GAIN_DOWN':
    case 'GAIN_UP':
      return 'gain';
    case 'OPEN_IMAGE_ADJUST':
    case 'TOGGLE_ENHANCE':
    case 'THE_OFF':
    case 'THE_P':
    case 'THE_R':
      return 'contrast';
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

function getActiveBModeSegmentControl(
  activeControl: KnobologyControlId,
  lastKeyboardControl: KnobologyControlId | null,
): KnobologyBModeSegmentControl {
  if (lastKeyboardControl === 'gain' || lastKeyboardControl === 'contrast' || lastKeyboardControl === 'depth') {
    return lastKeyboardControl;
  }

  if (activeControl === 'gain' || activeControl === 'contrast' || activeControl === 'depth') {
    return activeControl;
  }

  return 'depth';
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
  const [flowPreviewMode, setFlowPreviewMode] = useState<KnobologyFlowSegmentMode>('color');
  const videoLookupState = useKnobologyVideoLookup();
  const activeExercise =
    knobologyContent.controlLabExercises.find((exercise) => exercise.id === activeExerciseId) ??
    knobologyContent.controlLabExercises[0];
  const [frameState, dispatchFrame] = useReducer(reduceKnobologyFrameState, activeExercise, createKnobologyFrameState);

  useEffect(() => {
    dispatchFrame({ type: 'RESET_FOR_EXERCISE', exercise: activeExercise });
    setActiveControl(activeExercise.focusControl);
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
  const dopplerMedia = getKnobologyMedia('color-doppler');
  const deferredReferenceFilter = useDeferredValue(referenceFilter);
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
  const visibleProcessorHotspots = useMemo(
    () => euMe2Layout.hotspots.filter((hotspot) => isHotspotVisibleForMenu(hotspot, frameState.menu)),
    [frameState.menu],
  );
  const processorLayout = useMemo(
    () => ({
      ...euMe2Layout,
      hotspots: visibleProcessorHotspots,
    }),
    [visibleProcessorHotspots],
  );
  const compactTouchButtons = useMemo(
    () =>
      visibleProcessorHotspots
        .filter((hotspot) => hotspot.id.startsWith('touch_'))
        .map((hotspot) => ({
          actionId: hotspot.action,
          label: hotspot.label,
        })),
    [visibleProcessorHotspots],
  );
  const lastKeyboardControl = frameState.lastActionId ? getControlForAction(frameState.lastActionId) : null;
  const activeBModeSegmentControl = getActiveBModeSegmentControl(activeControl, lastKeyboardControl);
  const activeDepthCm = getKnobologyVideoDepthCm(frameState.depth);
  const controlLabFlowMode: KnobologyFlowSegmentMode | null =
    frameState.mode === 'flow' ? 'color' : frameState.mode === 'pw' ? 'power' : null;
  const activeVideoMedia = controlLabFlowMode
    ? dopplerMedia
    : getKnobologyMedia(
        activeBModeSegmentControl === 'contrast'
          ? 'contrast'
          : activeBModeSegmentControl === 'gain'
            ? 'gain'
            : 'depth',
      );
  const controlLabSegment = videoLookupState.lookup
    ? resolveKnobologyVideoSegment(videoLookupState.lookup, {
        depth: frameState.depth,
        gain: frameState.gain,
        contrast: frameState.contrast,
        control: activeBModeSegmentControl,
        flowMode: controlLabFlowMode,
      })
    : null;
  const dopplerPreviewSegment = videoLookupState.lookup
    ? resolveKnobologyVideoSegment(videoLookupState.lookup, {
        depth: frameState.depth,
        gain: frameState.gain,
        contrast: frameState.contrast,
        control: 'depth',
        flowMode: dopplerEnabled ? flowPreviewMode : null,
      })
    : null;
  const videoTimelineStatus =
    videoLookupState.status === 'error' ? 'Video timeline unavailable' : 'Loading video timeline';
  const keyboardFeedbackCards = KEYBOARD_FEEDBACK_CONTROLS.map((controlId) => {
    const currentValue = frameState[controlId];
    const targetValue = activeExercise.target[controlId];
    const delta = currentValue - targetValue;
    const absDelta = Math.abs(delta);
    const isExerciseFocus = activeExercise.focusControl === controlId;
    const isKeyboardActive = activeControl === controlId;
    const hasRecentKeyboardChange = lastKeyboardControl === controlId;

    if (controlId === 'depth') {
      return {
        controlId,
        currentValue,
        targetValue,
        isExerciseFocus,
        isKeyboardActive,
        hasRecentKeyboardChange,
        status:
          absDelta <= 8
            ? 'Framing is close to target.'
            : delta < 0
              ? 'Need more depth.'
              : 'Depth is running long.',
        guidance:
          absDelta <= 8
            ? 'The node is sitting in a more usable part of the frame.'
            : delta < 0
              ? 'Use DEPTH/RANGE +/- on the processor until more tissue opens below the node.'
              : 'Cycle depth back once the target starts dropping into unused space.',
      };
    }

    if (controlId === 'gain') {
      return {
        controlId,
        currentValue,
        targetValue,
        isExerciseFocus,
        isKeyboardActive,
        hasRecentKeyboardChange,
        status:
          absDelta <= 8
            ? 'Brightness is close to target.'
            : delta < 0
              ? 'Frame still looks undergained.'
              : 'The image is washing out.',
        guidance:
          absDelta <= 8
            ? 'Target borders are readable without flooding the screen.'
            : delta < 0
              ? 'Use GAIN + until the target border separates from the background.'
              : 'Tap GAIN - to recover detail and keep the frame from looking chalky.',
      };
    }

    return {
      controlId,
      currentValue,
      targetValue,
      isExerciseFocus,
      isKeyboardActive,
      hasRecentKeyboardChange,
      status:
        absDelta <= 8
          ? 'Edge definition is close to target.'
          : delta < 0
            ? 'Contrast is still too flat.'
            : 'Contrast is too aggressive.',
      guidance:
        absDelta <= 8
          ? 'The target is separating from the haze more cleanly now.'
          : delta < 0
            ? 'Open IMAGE ADJUST and tap contrast + until the border definition starts to recover.'
            : 'Tap contrast - in IMAGE ADJUST if the border starts to look overly harsh.',
    };
  });

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
          <div className="knobology-workbench">
            <div className="stack-card knobology-frame">
              <div className="knobology-frame__screen">
                <div className="knobology-frame__video-shell">
                  {controlLabSegment ? (
                    <KnobologySegmentVideo
                      ariaLabel="Timestamped EBUS video segment used for the knobology control lab"
                      className="knobology-frame__video"
                      paused={frameState.frozen && !frameState.cinePlaying}
                      segment={controlLabSegment.segment}
                      src={KNOBOLOGY_VIDEO_SRC}
                    />
                  ) : (
                    <div className="knobology-frame__video-empty">
                      <span>{videoTimelineStatus}</span>
                    </div>
                  )}
                </div>

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
                {frameState.calipers ? (
                  <div
                    className={`knobology-frame__calipers${frameState.measurementMode === 'trace' ? ' knobology-frame__calipers--trace' : ''}`}
                  >
                    {frameState.measurementPoints > 1 ? (
                      <span className="knobology-frame__measure-readout">12.4 mm</span>
                    ) : null}
                  </div>
                ) : null}
                {frameState.pipEnabled && controlLabSegment ? (
                  <div className="knobology-frame__pip" style={{ opacity: frameMetrics.pipOpacity }}>
                    <strong>{controlLabSegment.label}</strong>
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
                  <span>D {activeDepthCm} cm</span>
                  <span>G {frameState.gain}</span>
                  <span>C {frameState.contrast}</span>
                  <span>{frameState.mode.toUpperCase()}</span>
                  <span>F {FREQUENCY_LABELS[frameState.frequencyIndex]}</span>
                  {frameState.frozen ? <span>FRZ</span> : null}
                  {frameState.saved ? <span>SAV</span> : null}
                  {frameState.pipEnabled ? <span>PIP</span> : null}
                </div>
                {controlLabSegment ? (
                  <div className="knobology-frame__segment-chip">
                    <span>{controlLabSegment.segment.name}</span>
                    {controlLabSegment.isPreferredBestView ? <strong>Best view</strong> : null}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="stack-card knobology-console">
              <div className="knobology-console__prompt">
                <div className="eyebrow">Interactive processor</div>
                <strong>Tap a glowing control on the processor to update the ultrasound image.</strong>
              </div>

              <EuMe2Keyboard
                activeActionId={frameState.lastActionId}
                debug={processorDebug}
                layout={processorLayout}
                menuMode={frameState.menu}
                onAction={handleProcessorAction}
                showHotspotHints
              />

              <div className="knobology-console__details">
                <div className="knobology-console__hero">
                  <div>
                    <h3>Use the processor and touch panel together.</h3>
                    <p>
                      Every glowing hotspot is clickable, including the touch panel. Try depth, gain, freeze, Doppler,
                      calipers, and save to see immediate feedback in the frame above. Tapping `IMAGE ADJUST` swaps the
                      processor screen so the contrast controls change with it.
                    </p>
                  </div>
                </div>

                <div className="tag-row">
                  <span className="tag">Glowing overlays = tappable controls</span>
                  <span className="tag">Touch panel hotspots change with the active screen</span>
                </div>

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
              </div>
            </div>
          </div>

          <div className="stack-card knobology-controls">
            <div className="knobology-rescue-card">
              <strong>{activeExercise.title}</strong>
              <p>{activeExercise.symptom}</p>
              <p className="knobology-frame__status-line">{frameState.statusMessage}</p>
              {activeVideoMedia.caption ? (
                <p className="knobology-frame__media-note">{activeVideoMedia.caption}</p>
              ) : null}
            </div>

            <div className="eyebrow">Instructions</div>
            <p>{activeExercise.instructions}</p>
            <div className="knobology-keyboard-feedback">
              <div className="eyebrow">Keyboard feedback</div>
              <p>
                The processor is now the only control surface here. Depth, gain, and contrast highlight as you change
                them from the keyboard.
              </p>
              <div className="knobology-keyboard-feedback__grid">
                {keyboardFeedbackCards.map((card) => (
                  <article
                    key={card.controlId}
                    className={`knobology-keyboard-feedback__card${card.isKeyboardActive ? ' knobology-keyboard-feedback__card--active' : ''}${card.isExerciseFocus ? ' knobology-keyboard-feedback__card--focus' : ''}`}
                  >
                    <div className="knobology-keyboard-feedback__header">
                      <div className="mini-card__title">
                        <span>{knobologyControlMeta[card.controlId].icon}</span>
                        <strong>{knobologyControlMeta[card.controlId].shortLabel}</strong>
                      </div>
                      <div className="tag-row">
                        {card.isExerciseFocus ? <span className="tag">Exercise focus</span> : null}
                        {card.hasRecentKeyboardChange ? <span className="tag">Recent keyboard change</span> : null}
                      </div>
                    </div>
                    <div className="knobology-keyboard-feedback__values">
                      <span>Current {card.currentValue}</span>
                      <span>Target {card.targetValue}</span>
                    </div>
                    <strong className="knobology-keyboard-feedback__status">
                      {card.hasRecentKeyboardChange ? frameState.statusMessage : card.status}
                    </strong>
                    <p>{card.guidance}</p>
                  </article>
                ))}
              </div>
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
                {dopplerPreviewSegment ? (
                  <KnobologySegmentVideo
                    ariaLabel="Timestamped EBUS flow video segment"
                    className="doppler-lab__video"
                    segment={dopplerPreviewSegment.segment}
                    src={KNOBOLOGY_VIDEO_SRC}
                  />
                ) : (
                  <div className="knobology-frame__video-empty">
                    <span>{videoTimelineStatus}</span>
                  </div>
                )}
                <span className="doppler-lab__state">
                  {dopplerEnabled ? FLOW_PREVIEW_MODE_LABELS[flowPreviewMode] : 'Doppler off'}
                </span>
                <span className="doppler-lab__label">
                  {dopplerPreviewSegment?.label ?? dopplerMedia.caption ?? 'Toggle Doppler to reveal flow'}
                </span>
              </div>
              <div className="button-row button-row--wrap">
                <button
                  className={`button${dopplerEnabled ? ' button--ghost' : ''}`}
                  onClick={() => handleProcessorAction(dopplerEnabled ? 'B_MODE' : 'FLOW_MODE')}
                  type="button"
                >
                  {dopplerEnabled ? 'Doppler Off' : 'Doppler On'}
                </button>
                {FLOW_PREVIEW_MODES.map((mode) => (
                  <button
                    key={mode}
                    className={`control-pill${dopplerEnabled && flowPreviewMode === mode ? ' control-pill--active' : ''}`}
                    onClick={() => {
                      setFlowPreviewMode(mode);

                      if (!dopplerEnabled) {
                        handleProcessorAction('FLOW_MODE');
                      }
                    }}
                    type="button"
                  >
                    {FLOW_PREVIEW_MODE_LABELS[mode]}
                  </button>
                ))}
              </div>
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
