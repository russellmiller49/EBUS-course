import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { MetricTile } from '@/components/MetricTile';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/constants/theme';
import { CorrelationPanel } from '@/features/explorer/CorrelationPanel';
import {
  getExplorerChallengeRounds,
  getExplorerStationById,
  getExplorerStations,
  getStationExplorerContent,
} from '@/features/explorer/content';
import {
  buildExplorerRecognitionSummary,
  evaluateRecognitionAnswer,
  shuffleExplorerRounds,
} from '@/features/explorer/logic';
import type { ExplorerChallengeRound, ExplorerStepId, ExplorerStation } from '@/features/explorer/types';
import type { ModuleContent } from '@/lib/types';
import { isBookmarked, useLearnerProgress } from '@/store/learner-progress';

const STEP_SEQUENCE: Array<{ id: ExplorerStepId; label: string }> = [
  { id: 'selector', label: 'Selector' },
  { id: 'tri-view', label: 'Tri-View' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'challenge', label: 'Challenge' },
  { id: 'summary', label: 'Summary' },
];

const STEP_PROGRESS: Record<ExplorerStepId, number> = {
  selector: 14,
  'tri-view': 38,
  checklist: 62,
  challenge: 84,
  summary: 100,
};

const stationExplorerContent = getStationExplorerContent();
const explorerStations = getExplorerStations();
const explorerStationIds = explorerStations.map((station) => station.id);
const baseChallengeRounds = getExplorerChallengeRounds();

function toExplorerStepId(value: string | null | undefined): ExplorerStepId | null {
  return STEP_SEQUENCE.some((step) => step.id === value) ? (value as ExplorerStepId) : null;
}

function getInitialStation(lastViewedStationId: string | null): ExplorerStation {
  return getExplorerStationById(lastViewedStationId ?? '') ?? explorerStations[0];
}

function getInitialChallengeRounds() {
  return shuffleExplorerRounds(baseChallengeRounds);
}

function getStationAccuracy(stat?: { attempts: number; correct: number }) {
  if (!stat || stat.attempts === 0) {
    return 0;
  }

  return Math.round((stat.correct / stat.attempts) * 100);
}

export function ExplorerModule({ module }: { module: ModuleContent }) {
  const {
    state,
    setLastViewedStation,
    setModuleProgress,
    setQuizScore,
    toggleBookmark,
    recordRecognitionAttempt,
  } = useLearnerProgress();
  const moduleProgress = state.moduleProgress['station-explorer'];
  const resumedStep = toExplorerStepId(moduleProgress.lastScreen);
  const initialStation = getInitialStation(state.lastViewedStationId);
  const [currentStep, setCurrentStep] = useState<ExplorerStepId>(resumedStep ?? 'selector');
  const [selectedStationId, setSelectedStationId] = useState(initialStation.id);
  const [reviewedStationIds, setReviewedStationIds] = useState<string[]>([initialStation.id]);
  const [challengeRounds, setChallengeRounds] = useState<ExplorerChallengeRound[]>(getInitialChallengeRounds);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [answeredRoundIds, setAnsweredRoundIds] = useState<string[]>([]);
  const [correctRoundIds, setCorrectRoundIds] = useState<string[]>([]);
  const [challengeFeedback, setChallengeFeedback] = useState<{
    correctStationId: string;
    selectedStationId: string;
  } | null>(null);
  const [challengeFinished, setChallengeFinished] = useState(moduleProgress.quizScore !== null);

  const currentStepIndex = STEP_SEQUENCE.findIndex((step) => step.id === currentStep);
  const currentStation = getExplorerStationById(selectedStationId) ?? initialStation;
  const challengeRound = challengeRounds[challengeIndex];
  const challengeStation = challengeRound ? getExplorerStationById(challengeRound.stationId) ?? currentStation : currentStation;
  const challengeOptions = challengeRound
    ? challengeRound.optionIds
        .map((stationId) => getExplorerStationById(stationId))
        .filter((station): station is ExplorerStation => Boolean(station))
    : [];
  const effectiveChallengeCorrectCount = challengeFinished
    ? moduleProgress.quizScore ?? correctRoundIds.length
    : correctRoundIds.length;
  const recognitionSummary = buildExplorerRecognitionSummary({
    recognitionStats: moduleProgress.recognitionStats,
    stationIds: explorerStationIds,
  });
  const currentStationAccuracy = getStationAccuracy(moduleProgress.recognitionStats[currentStation.id]);
  const currentStationAttempts = moduleProgress.recognitionStats[currentStation.id]?.attempts ?? 0;
  const moduleSaved = isBookmarked(state, module.id, 'module');
  const stationSaved = isBookmarked(state, currentStation.id, 'station');

  useEffect(() => {
    if (!resumedStep) {
      return;
    }

    setCurrentStep((current) => (current === resumedStep ? current : resumedStep));
  }, [resumedStep]);

  useEffect(() => {
    const persistedStation = getExplorerStationById(state.lastViewedStationId ?? '');

    if (persistedStation) {
      setSelectedStationId(persistedStation.id);
      setReviewedStationIds((currentIds) =>
        currentIds.includes(persistedStation.id) ? currentIds : [...currentIds, persistedStation.id],
      );
    }
  }, [state.lastViewedStationId]);

  useEffect(() => {
    setModuleProgress('station-explorer', {
      completed: currentStep === 'summary' && challengeFinished,
      lastScreen: currentStep,
      percentComplete: STEP_PROGRESS[currentStep],
    });
  }, [challengeFinished, currentStep]);

  function handleSelectStation(stationId: string) {
    setSelectedStationId(stationId);
    setLastViewedStation(stationId);
    setReviewedStationIds((currentIds) => (currentIds.includes(stationId) ? currentIds : [...currentIds, stationId]));
  }

  function moveToStep(stepId: ExplorerStepId) {
    if (stepId === 'summary' && !challengeFinished) {
      return;
    }

    setCurrentStep(stepId);
  }

  function goToNextStep() {
    if (currentStep === 'challenge' && !challengeFinished) {
      return;
    }

    const nextStep = STEP_SEQUENCE[currentStepIndex + 1];

    if (nextStep) {
      setCurrentStep(nextStep.id);
    }
  }

  function goToPreviousStep() {
    const previousStep = STEP_SEQUENCE[currentStepIndex - 1];

    if (previousStep) {
      setCurrentStep(previousStep.id);
    }
  }

  function resetChallenge() {
    setChallengeRounds(shuffleExplorerRounds(baseChallengeRounds));
    setChallengeIndex(0);
    setAnsweredRoundIds([]);
    setCorrectRoundIds([]);
    setChallengeFeedback(null);
    setChallengeFinished(false);
    setCurrentStep('challenge');
  }

  function handleChallengeAnswer(stationId: string) {
    if (!challengeRound || answeredRoundIds.includes(challengeRound.id)) {
      return;
    }

    const result = evaluateRecognitionAnswer(challengeRound, stationId);

    setChallengeFeedback({
      correctStationId: result.correctStationId,
      selectedStationId: result.selectedStationId,
    });
    setAnsweredRoundIds((currentIds) => [...currentIds, challengeRound.id]);
    recordRecognitionAttempt('station-explorer', challengeRound.stationId, result.isCorrect);

    if (result.isCorrect) {
      setCorrectRoundIds((currentIds) => [...currentIds, challengeRound.id]);
    }
  }

  function advanceChallenge() {
    if (!challengeRound || !answeredRoundIds.includes(challengeRound.id)) {
      return;
    }

    const isLastRound = challengeIndex === challengeRounds.length - 1;

    if (isLastRound) {
      const correctCount = correctRoundIds.length;

      setChallengeFinished(true);
      setQuizScore('station-explorer', correctCount);
      setCurrentStep('summary');
      return;
    }

    setChallengeIndex((currentIndex) => currentIndex + 1);
    setChallengeFeedback(null);
  }

  function toggleModuleSave() {
    toggleBookmark({
      id: module.id,
      kind: 'module',
      label: module.title,
      moduleId: module.id,
    });
  }

  function toggleStationSave(station: ExplorerStation) {
    toggleBookmark({
      id: station.id,
      kind: 'station',
      label: station.displayName,
      moduleId: 'station-explorer',
    });
  }

  function renderSelectorStep() {
    return (
      <>
        <SectionCard title="Orientation" subtitle="Use one station as the anchor while you compare the three correlate views.">
          {stationExplorerContent.introSections.map((section) => (
            <View key={section.id} style={styles.lessonCard}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.bodyText}>{section.summary}</Text>
              <Text style={styles.supportingText}>Takeaway: {section.takeaway}</Text>
            </View>
          ))}
        </SectionCard>

        <SectionCard title={`${currentStation.displayName} Snapshot`} subtitle="The selected station drives all later views and checklist content.">
          <View style={styles.tagRow}>
            <StatusPill label={currentStation.zone} tone="gold" />
            <StatusPill label={currentStation.laterality} tone="neutral" />
            <StatusPill
              label={currentStationAttempts ? `${currentStationAccuracy}% recognition` : 'No attempts yet'}
              tone="teal"
            />
          </View>

          <Text style={styles.sectionTitle}>{currentStation.shortLabel}</Text>
          <Text style={styles.bodyText}>Aliases: {currentStation.aliases.join(' / ')}</Text>
          <Text style={styles.supportingText}>Memory cue: {currentStation.primaryMemoryCue}</Text>
          <Text style={styles.supportingText}>
            Confusion pair: {currentStation.confusionPairs[0] ?? 'No confusion pair listed'}
          </Text>

          <ActionButton label="Open synchronized tri-view" onPress={() => setCurrentStep('tri-view')} />
        </SectionCard>
      </>
    );
  }

  function renderTriViewStep() {
    return (
      <SectionCard
        title="Correlated Tri-View"
        subtitle="The same selected station stays synchronized across CT, bronchoscopy, and ultrasound placeholders.">
        <Text style={styles.supportingText}>Current station memory cue: {currentStation.primaryMemoryCue}</Text>
        <View style={styles.panelStack}>
          <CorrelationPanel station={currentStation} viewId="ct" />
          <CorrelationPanel station={currentStation} viewId="bronchoscopy" />
          <CorrelationPanel station={currentStation} viewId="ultrasound" />
        </View>
      </SectionCard>
    );
  }

  function renderChecklistStep() {
    return (
      <>
        <SectionCard title="Landmark Checklist" subtitle="Keep the station fixed while you walk through the high-yield landmarks and confusion pairs.">
          {currentStation.landmarkChecklist.map((item) => (
            <Text key={item} style={styles.bodyText}>
              {`\u2022 ${item}`}
            </Text>
          ))}
        </SectionCard>

        <SectionCard title="Recall Guardrails" subtitle="These cues are the fastest way to keep similar stations from collapsing together.">
          <Text style={styles.bodyText}>Memory cue: {currentStation.primaryMemoryCue}</Text>
          <Text style={styles.bodyText}>
            Common confusion pair: {currentStation.confusionPairs.join(', ') || 'None listed'}
          </Text>
          <Text style={styles.bodyText}>Related stations: {currentStation.relatedStationIds.join(', ') || 'None listed'}</Text>
          <Text style={styles.supportingText}>
            Recognition accuracy for {currentStation.id}: {currentStationAccuracy}% across {currentStationAttempts} attempt
            {currentStationAttempts === 1 ? '' : 's'}
          </Text>
          <ProgressBar value={currentStationAccuracy} />
        </SectionCard>
      </>
    );
  }

  function renderChallengeStep() {
    const roundAnswered = challengeRound ? answeredRoundIds.includes(challengeRound.id) : false;

    return (
      <SectionCard
        title="Recognition Challenge"
        subtitle="The prompt and representation type change, but the task stays the same: identify the station.">
        <View style={styles.tagRow}>
          <StatusPill label={`Round ${challengeIndex + 1}/${challengeRounds.length}`} tone="gold" />
          <StatusPill label={`${correctRoundIds.length} correct`} tone="teal" />
          <StatusPill label={roundAnswered ? 'Feedback ready' : 'Pick an answer'} tone="accent" />
        </View>

        {challengeRound ? (
          <>
            <View style={styles.challengePromptCard}>
              <Text style={styles.sectionTitle}>{challengeRound.prompt}</Text>
              <Text style={styles.supportingText}>
                Representation: {challengeRound.viewId === 'ct' ? 'CT' : challengeRound.viewId === 'bronchoscopy' ? 'Bronchoscopy' : 'Ultrasound'}
              </Text>
              {challengeFeedback ? (
                <Text
                  style={[
                    styles.feedbackText,
                    {
                      color:
                        challengeFeedback.correctStationId === challengeFeedback.selectedStationId
                          ? colors.teal
                          : colors.danger,
                    },
                  ]}>
                  {challengeFeedback.correctStationId === challengeFeedback.selectedStationId
                    ? `Correct. ${challengeFeedback.correctStationId} matched the representation.`
                    : `${challengeFeedback.selectedStationId} was not correct. The target was ${challengeFeedback.correctStationId}.`}
                </Text>
              ) : null}
            </View>

            <CorrelationPanel station={challengeStation} viewId={challengeRound.viewId} />

            <View style={styles.optionGrid}>
              {challengeOptions.map((option) => {
                const isSelected = challengeFeedback?.selectedStationId === option.id;
                const isCorrect = challengeFeedback?.correctStationId === option.id;

                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Choose ${option.displayName}`}
                    onPress={() => handleChallengeAnswer(option.id)}
                    style={({ pressed }) => [
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                      isCorrect && styles.optionCardCorrect,
                      pressed && !roundAnswered && styles.pressed,
                    ]}>
                    <Text style={styles.optionId}>{option.id}</Text>
                    <Text style={styles.optionLabel}>{option.shortLabel}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.actionCluster}>
              <ActionButton
                label={challengeIndex === challengeRounds.length - 1 ? 'Finish challenge' : 'Next round'}
                onPress={advanceChallenge}
                disabled={!roundAnswered}
              />
              <ActionButton label="Restart challenge" onPress={resetChallenge} variant="secondary" />
            </View>
          </>
        ) : null}
      </SectionCard>
    );
  }

  function renderSummaryStep() {
    const strongestStation = recognitionSummary.strongestStationId
      ? getExplorerStationById(recognitionSummary.strongestStationId)
      : null;
    const weakestStations = recognitionSummary.weakestStationIds
      .map((stationId) => getExplorerStationById(stationId))
      .filter((station): station is ExplorerStation => Boolean(station));

    return (
      <>
        <SectionCard title="Review Summary" subtitle="Use the summary to see which stations transfer cleanly across representations and which still need work.">
          <View style={styles.metricGrid}>
            <MetricTile label="Stations explored" value={`${new Set(reviewedStationIds).size}/${explorerStations.length}`} tone="teal" />
            <MetricTile label="Attempts" value={`${recognitionSummary.totalAttempts}`} tone="gold" />
            <MetricTile label="Overall accuracy" value={`${recognitionSummary.overallAccuracy}%`} tone="accent" />
          </View>

          <Text style={styles.bodyText}>
            Challenge score: {effectiveChallengeCorrectCount}/{challengeRounds.length}
          </Text>
          <Text style={styles.bodyText}>
            Strongest transfer: {strongestStation ? strongestStation.displayName : 'No challenge attempts yet'}
          </Text>
          <Text style={styles.bodyText}>
            Weakest set: {weakestStations.length ? weakestStations.map((station) => station.id).join(', ') : 'No weak spots yet'}
          </Text>
        </SectionCard>

        <SectionCard title="Review Prompts" subtitle="Use these prompts before moving back into the map or forward into later asset swaps.">
          {stationExplorerContent.reviewPrompts.map((item) => (
            <Text key={item} style={styles.bodyText}>
              {`\u2022 ${item}`}
            </Text>
          ))}
        </SectionCard>

        <SectionCard title="Future Asset Swaps" subtitle="The explorer separates shared station identity from representation-specific copy and asset references.">
          <Text style={styles.bodyText}>{stationExplorerContent.extensionNote}</Text>
          <ActionButton label="Retake challenge" onPress={resetChallenge} variant="secondary" />
        </SectionCard>
      </>
    );
  }

  return (
    <Screen eyebrow={module.featureFolder} title={module.title} subtitle={module.summary}>
      <SectionCard title="Module Progress" subtitle="The explorer stores resume state, quiz score, and per-station recognition accuracy locally." tone="navy">
        <View style={styles.tagRow}>
          <StatusPill label={`${explorerStations.length} core stations`} tone="gold" />
          <StatusPill label={`${challengeRounds.length} mixed-view rounds`} tone="teal" />
          <StatusPill label={`${moduleProgress.percentComplete}% tracked`} tone="accent" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.stepRow}>
            {STEP_SEQUENCE.map((step, index) => {
              const disabled = step.id === 'summary' && !challengeFinished;

              return (
                <Pressable
                  key={step.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Open step ${index + 1}: ${step.label}`}
                  onPress={() => moveToStep(step.id)}
                  style={({ pressed }) => [
                    styles.stepChip,
                    currentStep === step.id && styles.stepChipActive,
                    disabled && styles.stepChipDisabled,
                    pressed && !disabled && styles.pressed,
                  ]}>
                  <Text style={[styles.stepIndex, currentStep === step.id && styles.stepIndexActive]}>{index + 1}</Text>
                  <Text style={[styles.stepLabel, currentStep === step.id && styles.stepLabelActive]}>{step.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.actionCluster}>
          <ActionButton
            label={moduleSaved ? 'Remove saved module' : 'Save module'}
            onPress={toggleModuleSave}
            variant="secondary"
          />
          <ActionButton label="Open tri-view" onPress={() => setCurrentStep('tri-view')} variant="secondary" />
        </View>
      </SectionCard>

      <SectionCard title="Station Selector" subtitle="Selecting a station here updates the tri-view and checklist content everywhere in the module.">
        <View style={styles.tagRow}>
          <StatusPill label={currentStation.displayName} tone="gold" />
          <StatusPill label={stationSaved ? 'Station saved' : 'Tap save to review'} tone="accent" />
          <StatusPill label={`${currentStationAccuracy}% recognition`} tone="teal" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.stationSelectorRow}>
            {explorerStations.map((station) => (
              <Pressable
                key={station.id}
                accessibilityRole="button"
                accessibilityLabel={`Select ${station.displayName}`}
                onPress={() => handleSelectStation(station.id)}
                style={({ pressed }) => [
                  styles.stationChip,
                  selectedStationId === station.id && styles.stationChipActive,
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.stationChipId, selectedStationId === station.id && styles.stationChipIdActive]}>
                  {station.id}
                </Text>
                <Text style={[styles.stationChipText, selectedStationId === station.id && styles.stationChipTextActive]}>
                  {station.shortLabel}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.supportingText}>Memory cue: {currentStation.primaryMemoryCue}</Text>
        <Text style={styles.supportingText}>
          Confusion pair: {currentStation.confusionPairs[0] ?? 'No confusion pair listed'}
        </Text>

        <ActionButton
          label={stationSaved ? 'Remove saved station' : 'Save station'}
          onPress={() => toggleStationSave(currentStation)}
          variant="secondary"
        />
      </SectionCard>

      {currentStep === 'selector' ? renderSelectorStep() : null}
      {currentStep === 'tri-view' ? renderTriViewStep() : null}
      {currentStep === 'checklist' ? renderChecklistStep() : null}
      {currentStep === 'challenge' ? renderChallengeStep() : null}
      {currentStep === 'summary' ? renderSummaryStep() : null}

      <SectionCard title="Navigation" subtitle="Move linearly or jump with the step chips above.">
        <View style={styles.navigationRow}>
          <ActionButton
            label="Back"
            onPress={goToPreviousStep}
            variant="secondary"
            disabled={currentStepIndex <= 0}
            icon={<FontAwesome color={colors.ink} name="arrow-left" size={16} />}
          />
          <ActionButton
            label={currentStep === 'challenge' ? 'Finish challenge first' : currentStep === 'summary' ? 'Summary complete' : 'Next'}
            onPress={goToNextStep}
            disabled={currentStep === 'challenge' || currentStep === 'summary'}
            icon={
              currentStep === 'summary' ? null : <FontAwesome color={colors.white} name="arrow-right" size={16} />
            }
          />
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actionCluster: {
    gap: 12,
  },
  bodyText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 21,
  },
  challengePromptCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 24,
    gap: 8,
    padding: 16,
  },
  feedbackText: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    lineHeight: 18,
  },
  lessonCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  navigationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    flexBasis: '48%',
    gap: 6,
    minHeight: 92,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionCardCorrect: {
    borderColor: colors.teal,
    borderWidth: 2,
  },
  optionCardSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderWidth: 2,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionId: {
    color: colors.accent,
    fontFamily: 'SpaceMono',
    fontSize: 16,
  },
  optionLabel: {
    color: colors.inkSoft,
    fontSize: 12,
    lineHeight: 17,
  },
  panelStack: {
    gap: 12,
  },
  pressed: {
    opacity: 0.88,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 16,
    lineHeight: 22,
  },
  stationChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 4,
    minWidth: 104,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  stationChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  stationChipId: {
    color: colors.accent,
    fontFamily: 'SpaceMono',
    fontSize: 16,
  },
  stationChipIdActive: {
    color: colors.accent,
  },
  stationChipText: {
    color: colors.inkSoft,
    fontSize: 12,
    lineHeight: 17,
  },
  stationChipTextActive: {
    color: colors.ink,
  },
  stationSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 12,
  },
  stepChip: {
    backgroundColor: '#17465B',
    borderColor: '#2E6176',
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    minWidth: 118,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  stepChipActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  stepChipDisabled: {
    opacity: 0.5,
  },
  stepIndex: {
    color: '#D2E0E7',
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  stepIndexActive: {
    color: colors.accent,
  },
  stepLabel: {
    color: colors.white,
    fontFamily: 'SpaceMono',
    fontSize: 13,
  },
  stepLabelActive: {
    color: colors.ink,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 12,
  },
  supportingText: {
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
