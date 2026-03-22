import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { MetricTile } from '@/components/MetricTile';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/constants/theme';
import { Case3DCanvas } from '@/features/case3d/Case3DCanvas';
import {
  getCase3DManifest,
  getCase3DModuleContent,
  getCase3DReviewPrompts,
  getCase3DSliceAssets,
  getCase3DStationById,
  getCase3DStations,
  getCase3DTargetById,
  getCaseTargetsForStation,
} from '@/features/case3d/content';
import {
  buildCaseReviewSummary,
  clampFrameIndex,
  createToggleSet,
  DEFAULT_CASE3D_TOGGLE_SET,
  evaluateCaseReviewAnswer,
  getCenteredFrameIndex,
  getNearestLandmarks,
  normalizeVisibleToggleSetIds,
  resolveCaseSelection,
} from '@/features/case3d/logic';
import { SliceViewer } from '@/features/case3d/SliceViewer';
import { StructureToggles } from '@/features/case3d/StructureToggles';
import { TargetPicker } from '@/features/case3d/TargetPicker';
import { TeachingCard } from '@/features/case3d/TeachingCard';
import {
  DEFAULT_CASE3D_PLANE,
  DEFAULT_CASE3D_VISIBLE_TOGGLE_SET_IDS,
  type CasePlane,
  type CaseSelectionMode,
  type CaseReviewPrompt,
} from '@/features/case3d/types';
import type { ModuleContent } from '@/lib/types';
import { isBookmarked, useLearnerProgress } from '@/store/learner-progress';

type Case3DStepId = 'intro' | 'explorer' | 'review' | 'summary';

const STEP_SEQUENCE: Array<{ id: Case3DStepId; label: string }> = [
  { id: 'intro', label: 'Intro' },
  { id: 'explorer', label: 'Explorer' },
  { id: 'review', label: 'Review' },
  { id: 'summary', label: 'Summary' },
];

const STEP_PROGRESS: Record<Case3DStepId, number> = {
  intro: 12,
  explorer: 58,
  review: 84,
  summary: 100,
};

const caseManifest = getCase3DManifest();
const caseStations = getCase3DStations();
const caseModuleContent = getCase3DModuleContent();
const reviewPrompts = getCase3DReviewPrompts();

function toCase3DStepId(value: string | null | undefined): Case3DStepId | null {
  return STEP_SEQUENCE.some((step) => step.id === value) ? (value as Case3DStepId) : null;
}

function getInitialStationId(selectedStationId: string | null) {
  return getCase3DStationById(selectedStationId ?? '')?.id ?? caseStations[0].id;
}

export function Case3DExplorerModule({ module }: { module: ModuleContent }) {
  const {
    state,
    setModuleProgress,
    setQuizScore,
    toggleBookmark,
    updateCase3DExplorer,
    markCase3DTargetVisited,
    setCase3DReviewScore,
  } = useLearnerProgress();
  const moduleProgress = state.moduleProgress['case-3d-explorer'];
  const persistedCaseState = state.case3dExplorer;
  const initialStationId = getInitialStationId(persistedCaseState.selectedStationId);
  const initialStation = getCase3DStationById(initialStationId) ?? caseStations[0];
  const initialTarget =
    getCase3DTargetById(persistedCaseState.selectedTargetId ?? '') ??
    getCase3DTargetById(initialStation.primaryTargetId) ??
    caseManifest.targets[0];
  const resumedStep = toCase3DStepId(moduleProgress.lastScreen) ?? 'intro';
  const [currentStep, setCurrentStep] = useState<Case3DStepId>(resumedStep);
  const [selectionMode, setSelectionMode] = useState<CaseSelectionMode>('station');
  const [selectedStationId, setSelectedStationId] = useState(initialStation.id);
  const [selectedTargetId, setSelectedTargetId] = useState(initialTarget.id);
  const [selectedPlane, setSelectedPlane] = useState<CasePlane>(persistedCaseState.selectedPlane ?? DEFAULT_CASE3D_PLANE);
  const [visibleToggleSetIds, setVisibleToggleSetIds] = useState<string[]>(
    normalizeVisibleToggleSetIds(persistedCaseState.visibleToggleSetIds),
  );
  const [frameOffsets, setFrameOffsets] = useState<Record<CasePlane, number>>({
    axial: 0,
    coronal: 0,
    sagittal: 0,
  });
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewCorrectIds, setReviewCorrectIds] = useState<string[]>([]);
  const [reviewAnsweredIds, setReviewAnsweredIds] = useState<string[]>([]);
  const [reviewFeedback, setReviewFeedback] = useState<{
    correctId: string;
    selectedId: string;
  } | null>(null);
  const resolvedSelection = useMemo(
    () =>
      resolveCaseSelection({
        manifest: caseManifest,
        selectionMode,
        selectedStationId,
        selectedTargetId,
        visibleToggleSetIds,
      }),
    [selectedStationId, selectedTargetId, selectionMode, visibleToggleSetIds],
  );
  const toggleSet = createToggleSet(visibleToggleSetIds);
  const focusedTarget = resolvedSelection.focusTarget;
  const focusedStation = resolvedSelection.resolvedStation;
  const focusedStationTargets = getCaseTargetsForStation(focusedStation.id);
  const sliceAssets = getCase3DSliceAssets(selectedPlane);
  const centeredFrameIndex = focusedTarget ? focusedTarget.sliceIndex[selectedPlane] : 0;
  const currentFrameIndex = focusedTarget
    ? getCenteredFrameIndex(
        focusedTarget,
        selectedPlane,
        frameOffsets[selectedPlane],
        sliceAssets.length,
      )
    : 0;
  const currentPrompt: CaseReviewPrompt | null = reviewPrompts[reviewIndex] ?? null;
  const reviewSummary = buildCaseReviewSummary({
    reviewScore: state.case3dExplorer.reviewScore,
    reviewPromptCount: reviewPrompts.length,
    totalTargetCount: caseManifest.targets.length,
    visitedTargetIds: state.case3dExplorer.visitedTargetIds,
  });
  const nearestLandmarks = focusedTarget ? getNearestLandmarks(caseManifest, focusedTarget.id) : [];
  const teachingStation = focusedTarget.stationId ? getCase3DStationById(focusedTarget.stationId) ?? focusedStation : null;
  const moduleSaved = isBookmarked(state, module.id, 'module');

  useEffect(() => {
    updateCase3DExplorer({
      selectedPlane,
      selectedStationId,
      selectedTargetId,
      visibleToggleSetIds: normalizeVisibleToggleSetIds(visibleToggleSetIds),
    });
  }, [selectedPlane, selectedStationId, selectedTargetId, visibleToggleSetIds]);

  useEffect(() => {
    if (focusedTarget) {
      setFrameOffsets({
        axial: 0,
        coronal: 0,
        sagittal: 0,
      });
      markCase3DTargetVisited(focusedTarget.id);
    }
  }, [focusedTarget?.id]);

  useEffect(() => {
    setModuleProgress('case-3d-explorer', {
      completed: currentStep === 'summary' && state.case3dExplorer.reviewScore !== null,
      lastScreen: currentStep,
      percentComplete: STEP_PROGRESS[currentStep],
    });
  }, [currentStep, state.case3dExplorer.reviewScore]);

  function ensureToggleVisible(toggleId: keyof typeof DEFAULT_CASE3D_TOGGLE_SET) {
    setVisibleToggleSetIds((currentIds) =>
      currentIds.includes(toggleId)
        ? currentIds
        : normalizeVisibleToggleSetIds([...currentIds, toggleId]),
    );
  }

  function handleSelectStation(stationId: string) {
    const station = getCase3DStationById(stationId);

    if (!station) {
      return;
    }

    const primaryTarget = getCase3DTargetById(station.primaryTargetId);

    setSelectedStationId(station.id);
    if (primaryTarget) {
      setSelectedTargetId(primaryTarget.id);
      ensureToggleVisible(primaryTarget.structureGroupId);
    }
  }

  function handleSelectTarget(targetId: string) {
    const target = getCase3DTargetById(targetId);

    if (!target) {
      return;
    }

    setSelectedStationId(target.stationId ?? selectedStationId);
    setSelectedTargetId(target.id);
    setSelectionMode('target');
    ensureToggleVisible(target.structureGroupId);
  }

  function handleToggle(toggleId: keyof typeof DEFAULT_CASE3D_TOGGLE_SET) {
    setVisibleToggleSetIds((currentIds) => {
      const visibleIds = new Set(currentIds);

      if (visibleIds.has(toggleId)) {
        visibleIds.delete(toggleId);
      } else {
        visibleIds.add(toggleId);
      }

      return normalizeVisibleToggleSetIds([...visibleIds]);
    });
  }

  function toggleModuleSave() {
    toggleBookmark({
      id: module.id,
      kind: 'module',
      label: module.title,
      moduleId: module.id,
    });
  }

  function handleStepFrame(delta: number) {
    setFrameOffsets((currentOffsets) => ({
      ...currentOffsets,
      [selectedPlane]:
        clampFrameIndex(centeredFrameIndex + currentOffsets[selectedPlane] + delta, sliceAssets.length) -
        centeredFrameIndex,
    }));
  }

  function resetFrameOffset() {
    setFrameOffsets((currentOffsets) => ({
      ...currentOffsets,
      [selectedPlane]: 0,
    }));
  }

  function startReview() {
    setCurrentStep('review');
    setReviewIndex(0);
    setReviewAnsweredIds([]);
    setReviewCorrectIds([]);
    setReviewFeedback(null);
  }

  function handleReviewAnswer(optionId: string) {
    if (!currentPrompt || reviewAnsweredIds.includes(currentPrompt.id)) {
      return;
    }

    const result = evaluateCaseReviewAnswer(currentPrompt, optionId);

    setReviewAnsweredIds((currentIds) => [...currentIds, currentPrompt.id]);
    setReviewFeedback({
      correctId: result.correctId,
      selectedId: result.selectedId,
    });

    if (result.isCorrect) {
      setReviewCorrectIds((currentIds) => [...currentIds, currentPrompt.id]);
    }

    if (currentPrompt.answerKind === 'station') {
      handleSelectStation(optionId);
      setSelectionMode('station');
    } else {
      handleSelectTarget(optionId);
    }
  }

  function advanceReview() {
    if (!currentPrompt) {
      return;
    }

    const nextIndex = reviewIndex + 1;

    if (nextIndex >= reviewPrompts.length) {
      const score = reviewCorrectIds.length;

      setQuizScore('case-3d-explorer', score);
      setCase3DReviewScore(score);
      setCurrentStep('summary');
      return;
    }

    setReviewIndex(nextIndex);
    setReviewFeedback(null);
  }

  function renderStepNav() {
    return (
      <View style={styles.stepRow}>
        {STEP_SEQUENCE.map((step) => {
          const active = step.id === currentStep;

          return (
            <Pressable
              key={step.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => {
                if (step.id === 'summary' && state.case3dExplorer.reviewScore === null) {
                  return;
                }

                setCurrentStep(step.id);
              }}
              style={({ pressed }) => [
                styles.stepChip,
                active ? styles.stepChipActive : styles.stepChipInactive,
                pressed ? styles.stepChipPressed : null,
              ]}>
              <Text style={[styles.stepChipLabel, active ? styles.stepChipLabelActive : styles.stepChipLabelInactive]}>
                {step.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  function renderIntroStep() {
    return (
      <>
        <SectionCard title="Orientation" subtitle={module.summary}>
          {caseModuleContent.introSections.map((section) => (
            <View key={section.id} style={styles.lessonCard}>
              <Text style={styles.lessonTitle}>{section.title}</Text>
              <Text style={styles.bodyText}>{section.summary}</Text>
              <Text style={styles.supportingText}>Takeaway: {section.takeaway}</Text>
            </View>
          ))}
        </SectionCard>

        <SectionCard title="Build-Time Case Linkage" subtitle="The slice centers come from CT geometry plus the markup control points, not from hardcoded frame numbers.">
          <View style={styles.metricRow}>
            <MetricTile label="Stations" tone="accent" value={`${caseManifest.stations.length}`} />
            <MetricTile label="Targets" tone="gold" value={`${caseManifest.targets.length}`} />
            <MetricTile label="Mesh names" tone="teal" value={`${caseManifest.meshNames.length}`} />
          </View>
          <View style={styles.pillWrap}>
            {caseManifest.warnings.map((warning) => (
              <StatusPill key={warning} label={warning} tone="neutral" />
            ))}
          </View>
        </SectionCard>

        <ActionButton label="Open explorer" onPress={() => setCurrentStep('explorer')} />
      </>
    );
  }

  function renderExplorerStep() {
    return (
      <>
        <SectionCard title="Pick a view mode" subtitle="Station mode highlights every target in the station. Target mode isolates one anatomy point at a time.">
          <TargetPicker
            onSelectStation={handleSelectStation}
            onSelectTarget={handleSelectTarget}
            onSelectionModeChange={setSelectionMode}
            selectedStationId={focusedStation.id}
            selectedTargetId={resolvedSelection.resolvedTarget.id}
            selectionMode={selectionMode}
            stationTargets={focusedStationTargets}
            stations={caseStations}
            visitedTargetIds={state.case3dExplorer.visitedTargetIds}
          />
        </SectionCard>

        <SectionCard title="Structure filters" subtitle="Hide nonessential groups, then add them back when you need orientation cues.">
          <StructureToggles onToggle={handleToggle} toggleSet={toggleSet} />
        </SectionCard>

        <SectionCard title="3D navigator" subtitle="This spatial cloud uses the derived case coordinates and keeps the current focus aligned with the slice viewer.">
          <Case3DCanvas
            activeTargetIds={resolvedSelection.activeTargets.map((target) => target.id)}
            focusTargetId={focusedTarget.id}
            onSelectTarget={handleSelectTarget}
            selectionMode={selectionMode}
            visibleTargets={resolvedSelection.visibleTargets}
          />
        </SectionCard>

        <SectionCard title="Slice viewer" subtitle="The selected plane jumps to the derived target frame and lets the learner step around it.">
          <SliceViewer
            centerFrameIndex={centeredFrameIndex}
            frameCount={sliceAssets.length}
            frameIndex={currentFrameIndex}
            onPlaneChange={setSelectedPlane}
            onReset={resetFrameOffset}
            onStep={handleStepFrame}
            plane={selectedPlane}
            source={sliceAssets[currentFrameIndex]}
            targetLabel={focusedTarget.displayLabel}
          />
        </SectionCard>

        <SectionCard title="Teaching card" subtitle="Nearby landmarks are derived from the same case coordinates to keep the cueing local to this case.">
          <TeachingCard nearbyLandmarks={nearestLandmarks} station={teachingStation} target={focusedTarget} />
        </SectionCard>

        <ActionButton label="Start review" onPress={startReview} />
      </>
    );
  }

  function renderReviewStep() {
    const options = currentPrompt
      ? currentPrompt.optionIds.flatMap((optionId) => {
          const option =
            currentPrompt.answerKind === 'station' ? getCase3DStationById(optionId) : getCase3DTargetById(optionId);

          return option ? [option] : [];
        })
      : [];

    return (
      <>
        <SectionCard title="Quick prompts" subtitle="The review uses five fast prompts with immediate feedback.">
          <View style={styles.metricRow}>
            <MetricTile label="Prompt" tone="accent" value={`${reviewIndex + 1}/${reviewPrompts.length}`} />
            <MetricTile label="Correct" tone="teal" value={`${reviewCorrectIds.length}`} />
            <MetricTile label="Visited targets" tone="gold" value={`${state.case3dExplorer.visitedTargetIds.length}`} />
          </View>
          {currentPrompt ? (
            <View style={styles.reviewCard}>
              <Text style={styles.lessonTitle}>{currentPrompt.prompt}</Text>
              <View style={styles.optionColumn}>
                {options.map((option) => (
                  <ActionButton
                    key={option.id}
                    accessibilityLabel={`Answer ${'displayLabel' in option ? option.displayLabel : option.label}`}
                    label={'displayLabel' in option ? option.displayLabel : option.label}
                    onPress={() => handleReviewAnswer(option.id)}
                    variant={
                      reviewFeedback
                        ? option.id === currentPrompt.correctId
                          ? 'primary'
                          : option.id === reviewFeedback.selectedId
                            ? 'danger'
                            : 'secondary'
                        : 'secondary'
                    }
                  />
                ))}
              </View>
              {reviewFeedback ? (
                <View style={styles.feedbackCard}>
                  <Text style={styles.feedbackTitle}>
                    {reviewFeedback.selectedId === currentPrompt.correctId ? 'Correct' : 'Review the anchor'}
                  </Text>
                  <Text style={styles.bodyText}>{currentPrompt.explanation}</Text>
                  <ActionButton
                    label={reviewIndex === reviewPrompts.length - 1 ? 'Finish review' : 'Next prompt'}
                    onPress={advanceReview}
                  />
                </View>
              ) : null}
            </View>
          ) : null}
        </SectionCard>
      </>
    );
  }

  function renderSummaryStep() {
    return (
      <>
        <SectionCard title="Summary" subtitle="This module persists the current station, target, plane, toggle set, visited anatomy, and review score.">
          <View style={styles.metricRow}>
            <MetricTile label="Review score" tone="accent" value={`${state.case3dExplorer.reviewScore ?? 0}/${reviewPrompts.length}`} />
            <MetricTile label="Coverage" tone="gold" value={`${reviewSummary.coverage}%`} />
            <MetricTile label="Module score" tone="teal" value={`${reviewSummary.normalizedScore}%`} />
          </View>
          <View style={styles.pillWrap}>
            <StatusPill label={`Plane: ${selectedPlane}`} tone="neutral" />
            <StatusPill label={`Station: ${focusedStation.label}`} tone="gold" />
            <StatusPill label={`${normalizeVisibleToggleSetIds(visibleToggleSetIds).length} visible groups`} tone="teal" />
          </View>
        </SectionCard>

        <SectionCard title="Resume state" subtitle="The shared learner-progress store now restores the current case explorer state after restart.">
          <Text style={styles.bodyText}>
            Last target: {focusedTarget.displayLabel}. Saved items: {moduleSaved ? 'module bookmarked' : 'module not bookmarked'}.
          </Text>
          <ActionButton
            icon={<FontAwesome color={moduleSaved ? colors.white : colors.accent} name="bookmark" size={14} />}
            label={moduleSaved ? 'Remove module bookmark' : 'Save module bookmark'}
            onPress={toggleModuleSave}
            variant={moduleSaved ? 'primary' : 'secondary'}
          />
        </SectionCard>
      </>
    );
  }

  return (
    <Screen
      eyebrow={module.shortTitle}
      title={module.title}
      subtitle="Linked case explorer driven by generated slice indices, markup control points, and shared local progress state.">
      <SectionCard title="Module progress" subtitle={`Resume point: ${currentStep}. The selected station, target, plane, toggles, and review score persist locally.`}>
        <ProgressBar value={STEP_PROGRESS[currentStep]} />
        {renderStepNav()}
      </SectionCard>

      {currentStep === 'intro' ? renderIntroStep() : null}
      {currentStep === 'explorer' ? renderExplorerStep() : null}
      {currentStep === 'review' ? renderReviewStep() : null}
      {currentStep === 'summary' ? renderSummaryStep() : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bodyText: {
    color: colors.inkSoft,
    fontSize: 14,
    lineHeight: 20,
  },
  feedbackCard: {
    backgroundColor: colors.tealSoft,
    borderRadius: 22,
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  feedbackTitle: {
    color: colors.teal,
    fontFamily: 'SpaceMono',
    fontSize: 13,
  },
  lessonCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  lessonTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionColumn: {
    gap: 10,
  },
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reviewCard: {
    gap: 14,
  },
  stepChip: {
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  stepChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  stepChipInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  stepChipLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
  },
  stepChipLabelActive: {
    color: colors.accent,
  },
  stepChipLabelInactive: {
    color: colors.inkSoft,
  },
  stepChipPressed: {
    opacity: 0.84,
  },
  stepRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  supportingText: {
    color: colors.teal,
    fontSize: 13,
    lineHeight: 18,
  },
});
