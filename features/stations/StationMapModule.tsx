import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { MetricTile } from '@/components/MetricTile';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/constants/theme';
import { getStationMapContent, getStationMapLayout, getStationMapStationById, getStationMapStations } from '@/features/stations/content';
import { StationMapCanvas } from '@/features/stations/StationMapCanvas';
import {
  buildStationMapReviewSummary,
  evaluatePinTheStationGuess,
  shuffleStationIds,
} from '@/features/stations/logic';
import type { StationMapStepId, StationMapStation } from '@/features/stations/types';
import type { ModuleContent } from '@/lib/types';
import { isBookmarked, useLearnerProgress } from '@/store/learner-progress';

const STEP_SEQUENCE: Array<{ id: StationMapStepId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'map', label: 'Map + Detail' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'summary', label: 'Summary' },
];

const STEP_PROGRESS: Record<StationMapStepId, number> = {
  overview: 14,
  map: 38,
  flashcards: 62,
  quiz: 84,
  summary: 100,
};

const ZOOM_LEVELS = [0.92, 1.08, 1.24] as const;

const stationMapContent = getStationMapContent();
const stationMapLayout = getStationMapLayout();
const stationMapStations = getStationMapStations();
const stationIds = stationMapStations.map((station) => station.id);

function toStationMapStepId(value: string | null | undefined): StationMapStepId | null {
  return STEP_SEQUENCE.some((step) => step.id === value) ? (value as StationMapStepId) : null;
}

function getInitialStation(lastViewedStationId: string | null): StationMapStation {
  return getStationMapStationById(lastViewedStationId ?? '') ?? stationMapStations[0];
}

function getInitialFlashcardOrder() {
  return [...stationIds];
}

export function StationMapModule({ module }: { module: ModuleContent }) {
  const { state, setLastViewedStation, setModuleProgress, setQuizScore, toggleBookmark } = useLearnerProgress();
  const moduleProgress = state.moduleProgress['station-map'];
  const resumedStep = toStationMapStepId(moduleProgress.lastScreen);
  const initialStation = getInitialStation(state.lastViewedStationId);
  const [currentStep, setCurrentStep] = useState<StationMapStepId>(resumedStep ?? 'overview');
  const [selectedStationId, setSelectedStationId] = useState(initialStation.id);
  const [reviewedStationIds, setReviewedStationIds] = useState<string[]>([initialStation.id]);
  const [zoomIndex, setZoomIndex] = useState(1);
  const [flashcardOrder, setFlashcardOrder] = useState<string[]>(getInitialFlashcardOrder);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardReveal, setFlashcardReveal] = useState(false);
  const [randomOrderEnabled, setRandomOrderEnabled] = useState(false);
  const [quizRoundIndex, setQuizRoundIndex] = useState(0);
  const [quizAnsweredRoundIds, setQuizAnsweredRoundIds] = useState<string[]>([]);
  const [quizCorrectRoundIds, setQuizCorrectRoundIds] = useState<string[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<{
    correctStationId: string;
    selectedStationId: string;
  } | null>(null);
  const [quizFinished, setQuizFinished] = useState(moduleProgress.quizScore !== null);

  const currentStepIndex = STEP_SEQUENCE.findIndex((step) => step.id === currentStep);
  const currentStation = getStationMapStationById(selectedStationId) ?? initialStation;
  const currentZoom = ZOOM_LEVELS[zoomIndex];
  const currentFlashcard = getStationMapStationById(flashcardOrder[flashcardIndex]) ?? currentStation;
  const currentQuizRound = stationMapContent.quizRounds[quizRoundIndex];
  const effectiveQuizCorrectCount = quizFinished ? moduleProgress.quizScore ?? quizCorrectRoundIds.length : quizCorrectRoundIds.length;
  const moduleSaved = isBookmarked(state, module.id, 'module');
  const stationSaved = isBookmarked(state, currentStation.id, 'station');
  const flashcardSaved = isBookmarked(state, `station-map-card-${currentFlashcard.id}`, 'card');
  const relevantBookmarks = state.bookmarks.filter(
    (bookmark) =>
      bookmark.moduleId === 'station-map' &&
      (bookmark.kind === 'station' || bookmark.kind === 'card' || bookmark.id === 'station-map'),
  );
  const reviewSummary = buildStationMapReviewSummary({
    bookmarkedCount: relevantBookmarks.length,
    correctCount: effectiveQuizCorrectCount,
    reviewedStationIds,
    totalRounds: stationMapContent.quizRounds.length,
    totalStations: stationMapStations.length,
  });

  useEffect(() => {
    if (resumedStep && resumedStep !== currentStep) {
      setCurrentStep(resumedStep);
    }
  }, [currentStep, resumedStep]);

  useEffect(() => {
    const persistedStation = getStationMapStationById(state.lastViewedStationId ?? '');

    if (persistedStation) {
      setSelectedStationId(persistedStation.id);
      setReviewedStationIds((currentIds) =>
        currentIds.includes(persistedStation.id) ? currentIds : [...currentIds, persistedStation.id],
      );
    }
  }, [state.lastViewedStationId]);

  useEffect(() => {
    setModuleProgress('station-map', {
      completed: currentStep === 'summary' && quizFinished,
      lastScreen: currentStep,
      percentComplete: STEP_PROGRESS[currentStep],
    });
  }, [currentStep, quizFinished]);

  function moveToStep(stepId: StationMapStepId) {
    if (stepId === 'summary' && !quizFinished) {
      return;
    }

    setCurrentStep(stepId);
  }

  function goToNextStep() {
    if (currentStep === 'quiz' && !quizFinished) {
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

  function handleSelectStation(stationId: string) {
    setSelectedStationId(stationId);
    setLastViewedStation(stationId);
    setReviewedStationIds((currentIds) => (currentIds.includes(stationId) ? currentIds : [...currentIds, stationId]));
  }

  function handleFlashcardToggleRandom() {
    if (randomOrderEnabled) {
      setRandomOrderEnabled(false);
      setFlashcardOrder(getInitialFlashcardOrder());
    } else {
      setRandomOrderEnabled(true);
      setFlashcardOrder(shuffleStationIds(stationIds));
    }

    setFlashcardIndex(0);
    setFlashcardReveal(false);
  }

  function handleFlashcardReshuffle() {
    setFlashcardOrder(shuffleStationIds(stationIds));
    setFlashcardIndex(0);
    setFlashcardReveal(false);
  }

  function moveFlashcard(offset: -1 | 1) {
    const nextIndex = flashcardIndex + offset;

    if (nextIndex < 0 || nextIndex >= flashcardOrder.length) {
      return;
    }

    const nextStationId = flashcardOrder[nextIndex];

    if (nextStationId) {
      handleSelectStation(nextStationId);
    }

    setFlashcardIndex(nextIndex);
    setFlashcardReveal(false);
  }

  function handleQuizSelection(stationId: string) {
    if (!currentQuizRound || quizAnsweredRoundIds.includes(currentQuizRound.id)) {
      return;
    }

    const result = evaluatePinTheStationGuess(currentQuizRound, stationId);

    handleSelectStation(stationId);
    setQuizFeedback({
      correctStationId: result.correctStationId,
      selectedStationId: result.selectedStationId,
    });
    setQuizAnsweredRoundIds((currentIds) => [...currentIds, currentQuizRound.id]);

    if (result.isCorrect) {
      setQuizCorrectRoundIds((currentIds) => [...currentIds, currentQuizRound.id]);
    }
  }

  function advanceQuiz() {
    if (!currentQuizRound || !quizAnsweredRoundIds.includes(currentQuizRound.id)) {
      return;
    }

    const isLastRound = quizRoundIndex === stationMapContent.quizRounds.length - 1;

    if (isLastRound) {
      const correctCount = quizCorrectRoundIds.length;

      setQuizFinished(true);
      setQuizScore('station-map', correctCount);
      setCurrentStep('summary');
      return;
    }

    setQuizRoundIndex((currentIndex) => currentIndex + 1);
    setQuizFeedback(null);
  }

  function resetQuiz() {
    setQuizRoundIndex(0);
    setQuizAnsweredRoundIds([]);
    setQuizCorrectRoundIds([]);
    setQuizFeedback(null);
    setQuizFinished(false);
    setCurrentStep('quiz');
  }

  function toggleModuleSave() {
    toggleBookmark({
      id: module.id,
      kind: 'module',
      label: module.title,
      moduleId: module.id,
    });
  }

  function toggleStationSave(station: StationMapStation) {
    toggleBookmark({
      id: station.id,
      kind: 'station',
      label: station.displayName,
      moduleId: 'station-map',
    });
  }

  function toggleFlashcardSave(station: StationMapStation) {
    toggleBookmark({
      id: `station-map-card-${station.id}`,
      kind: 'card',
      label: `Flashcard: ${station.displayName}`,
      moduleId: 'station-map',
    });
  }

  function renderOverviewStep() {
    return (
      <>
        <SectionCard
          title="Orientation"
          subtitle="Start with stable patterns before you trace individual stations on the map.">
          {stationMapContent.introSections.map((section) => (
            <View key={section.id} style={styles.lessonCard}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.bodyText}>{section.summary}</Text>
              <Text style={styles.supportingText}>Takeaway: {section.takeaway}</Text>
            </View>
          ))}
        </SectionCard>

        <SectionCard title="Core v1 stations" subtitle="The same structured station schema is shared with the future explorer module.">
          <View style={styles.stationChipGrid}>
            {stationMapStations.map((station) => (
              <Pressable
                key={station.id}
                accessibilityRole="button"
                accessibilityLabel={`Open ${station.displayName}`}
                onPress={() => {
                  handleSelectStation(station.id);
                  setCurrentStep('map');
                }}
                style={({ pressed }) => [styles.stationChip, pressed && styles.pressed]}>
                <Text style={styles.stationChipId}>{station.id}</Text>
                <Text style={styles.stationChipText}>{station.shortLabel}</Text>
              </Pressable>
            ))}
          </View>
        </SectionCard>
      </>
    );
  }

  function renderMapStep() {
    return (
      <>
        <SectionCard
          title="Zoomable Map"
          subtitle="Tap a station to review the detail sheet. The landmarks use text labels and outline changes so the state is not color-only.">
          <View style={styles.tipStack}>
            {stationMapContent.mapTips.map((tip) => (
              <Text key={tip} style={styles.bodyText}>
                {`\u2022 ${tip}`}
              </Text>
            ))}
          </View>

          <View style={styles.zoomRow}>
            <ActionButton
              label="Smaller"
              onPress={() => setZoomIndex((currentIndex) => Math.max(0, currentIndex - 1))}
              variant="secondary"
              disabled={zoomIndex === 0}
            />
            <StatusPill label={`Zoom ${Math.round(currentZoom * 100)}%`} tone="teal" />
            <ActionButton
              label="Larger"
              onPress={() => setZoomIndex((currentIndex) => Math.min(ZOOM_LEVELS.length - 1, currentIndex + 1))}
              variant="secondary"
              disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            />
          </View>

          <StationMapCanvas
            layout={stationMapLayout}
            mode="browse"
            selectedStationId={currentStation.id}
            stations={stationMapStations}
            zoom={currentZoom}
            onSelectStation={handleSelectStation}
          />
        </SectionCard>

        <SectionCard title={`${currentStation.displayName} Detail`} subtitle="Detail sheet for the currently selected station." tone="teal">
          <View style={styles.tagRow}>
            <StatusPill label={currentStation.zone} tone="gold" />
            <StatusPill label={currentStation.laterality} tone="neutral" />
            <StatusPill label={stationSaved ? 'Saved' : 'Ready to save'} tone="accent" />
          </View>

          <Text style={styles.sectionTitle}>{currentStation.shortLabel}</Text>
          <Text style={styles.bodyText}>{currentStation.description}</Text>
          <Text style={styles.supportingText}>Access note: {currentStation.accessNotes}</Text>

          <View style={styles.cueList}>
            {currentStation.memoryCues.map((cue) => (
              <Text key={cue} style={styles.bodyText}>
                {`\u2022 ${cue}`}
              </Text>
            ))}
          </View>

          {currentStation.relatedStationIds.length ? (
            <View style={styles.relatedRow}>
              {currentStation.relatedStationIds.map((stationId) => {
                const relatedStation = getStationMapStationById(stationId);

                if (!relatedStation) {
                  return null;
                }

                return (
                  <Pressable
                    key={relatedStation.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Jump to ${relatedStation.displayName}`}
                    onPress={() => handleSelectStation(relatedStation.id)}
                    style={({ pressed }) => [styles.relatedChip, pressed && styles.pressed]}>
                    <Text style={styles.relatedChipText}>{relatedStation.id}</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          <ActionButton
            label={stationSaved ? 'Remove saved station' : 'Save station'}
            onPress={() => toggleStationSave(currentStation)}
            variant="secondary"
          />
        </SectionCard>
      </>
    );
  }

  function renderFlashcardsStep() {
    return (
      <>
        <SectionCard title="Flashcards" subtitle={stationMapContent.flashcardPrompt}>
          <View style={styles.tagRow}>
            <StatusPill label={`${flashcardIndex + 1}/${flashcardOrder.length}`} tone="gold" />
            <StatusPill label={randomOrderEnabled ? 'Random order' : 'Guided order'} tone="teal" />
            <StatusPill label={flashcardSaved ? 'Card saved' : 'Tap save if useful'} tone="accent" />
          </View>

          <View style={styles.actionCluster}>
            <ActionButton
              label={randomOrderEnabled ? 'Use guided order' : 'Use random order'}
              onPress={handleFlashcardToggleRandom}
              variant="secondary"
            />
            <ActionButton
              label="Reshuffle"
              onPress={handleFlashcardReshuffle}
              variant="secondary"
              disabled={!randomOrderEnabled}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Reveal flashcard for ${currentFlashcard.displayName}`}
            onPress={() => setFlashcardReveal((currentValue) => !currentValue)}
            style={({ pressed }) => [styles.flashcard, flashcardReveal && styles.flashcardOpen, pressed && styles.pressed]}>
            <Text style={styles.flashcardEyebrow}>{flashcardReveal ? 'Back' : 'Front'}</Text>
            <Text style={styles.flashcardTitle}>{currentFlashcard.displayName}</Text>
            {!flashcardReveal ? (
              <>
                <Text style={styles.flashcardPrompt}>Where does this station sit in the staging map?</Text>
                <Text style={styles.supportingText}>Tap the card to reveal the cue set.</Text>
              </>
            ) : (
              <>
                <Text style={styles.bodyText}>{currentFlashcard.description}</Text>
                <Text style={styles.supportingText}>Access note: {currentFlashcard.accessNotes}</Text>
                <Text style={styles.supportingText}>Memory cue: {currentFlashcard.memoryCues[0]}</Text>
                <Text style={styles.supportingText}>
                  Common confusion: {currentFlashcard.confusionPairs.join(', ') || 'None listed'}
                </Text>
              </>
            )}
          </Pressable>

          <View style={styles.actionCluster}>
            <ActionButton
              label="Previous"
              onPress={() => moveFlashcard(-1)}
              variant="secondary"
              disabled={flashcardIndex === 0}
            />
            <ActionButton
              label={flashcardReveal ? 'Hide answer' : 'Reveal answer'}
              onPress={() => setFlashcardReveal((currentValue) => !currentValue)}
              variant="secondary"
            />
            <ActionButton
              label="Next"
              onPress={() => moveFlashcard(1)}
              variant="secondary"
              disabled={flashcardIndex === flashcardOrder.length - 1}
            />
          </View>

          <ActionButton
            label={flashcardSaved ? 'Remove saved card' : 'Save flashcard'}
            onPress={() => toggleFlashcardSave(currentFlashcard)}
            variant="secondary"
          />
        </SectionCard>
      </>
    );
  }

  function renderQuizStep() {
    const roundAnswered = currentQuizRound ? quizAnsweredRoundIds.includes(currentQuizRound.id) : false;

    return (
      <SectionCard
        title="Pin-the-Station Quiz"
        subtitle="Read the prompt, tap the best station on the map, then move to the next round.">
        <View style={styles.tagRow}>
          <StatusPill label={`Round ${quizRoundIndex + 1}/${stationMapContent.quizRounds.length}`} tone="gold" />
          <StatusPill label={`${quizCorrectRoundIds.length} correct`} tone="teal" />
          <StatusPill label={roundAnswered ? 'Answer locked' : 'Waiting for selection'} tone="accent" />
        </View>

        {currentQuizRound ? (
          <>
            <View style={styles.quizPromptCard}>
              <Text style={styles.sectionTitle}>{currentQuizRound.prompt}</Text>
              <Text style={styles.supportingText}>Hint: {currentQuizRound.hint}</Text>
              {quizFeedback ? (
                <Text
                  style={[
                    styles.feedbackText,
                    {
                      color:
                        quizFeedback.correctStationId === quizFeedback.selectedStationId ? colors.teal : colors.danger,
                    },
                  ]}>
                  {quizFeedback.correctStationId === quizFeedback.selectedStationId
                    ? `Correct. ${currentQuizRound.stationId} is the right station.`
                    : `Review this pair: ${quizFeedback.selectedStationId} was not correct. The target was ${quizFeedback.correctStationId}.`}
                </Text>
              ) : null}
            </View>

            <StationMapCanvas
              layout={stationMapLayout}
              mode="quiz"
              selectedStationId={quizFeedback?.selectedStationId ?? selectedStationId}
              stations={stationMapStations}
              zoom={currentZoom}
              onSelectStation={handleQuizSelection}
              feedback={quizFeedback}
            />

            <View style={styles.actionCluster}>
              <ActionButton
                label={quizRoundIndex === stationMapContent.quizRounds.length - 1 ? 'Finish quiz' : 'Next round'}
                onPress={advanceQuiz}
                disabled={!roundAnswered}
              />
              <ActionButton label="Restart quiz" onPress={resetQuiz} variant="secondary" />
            </View>
          </>
        ) : null}
      </SectionCard>
    );
  }

  function renderSummaryStep() {
    const lastViewedStation = getStationMapStationById(state.lastViewedStationId ?? '') ?? currentStation;

    return (
      <>
        <SectionCard
          title="Review Summary"
          subtitle="Use the summary to see what you covered and what still needs repetition.">
          <View style={styles.metricGrid}>
            <MetricTile label="Stations reviewed" value={`${reviewSummary.reviewedCount}/${stationMapStations.length}`} tone="teal" />
            <MetricTile label="Saved items" value={`${reviewSummary.bookmarkedCount}`} tone="gold" />
            <MetricTile
              label="Quiz score"
              value={`${effectiveQuizCorrectCount}/${stationMapContent.quizRounds.length}`}
              tone="accent"
            />
          </View>

          <Text style={styles.bodyText}>{reviewSummary.coverageLabel}</Text>
          <Text style={styles.bodyText}>{reviewSummary.quizLabel}</Text>
          <Text style={styles.supportingText}>Last viewed station: {lastViewedStation.displayName}</Text>
        </SectionCard>

        <SectionCard title="Quick review prompts" subtitle="Use these prompts before moving into the station explorer module.">
          {stationMapContent.reviewChecklist.map((item) => (
            <Text key={item} style={styles.bodyText}>
              {`\u2022 ${item}`}
            </Text>
          ))}
        </SectionCard>

        <SectionCard title="Extensibility" subtitle="The station data and drawing data stay separate on purpose.">
          <Text style={styles.bodyText}>{stationMapContent.extensionNote}</Text>
          <ActionButton label="Retake quiz" onPress={resetQuiz} variant="secondary" />
        </SectionCard>
      </>
    );
  }

  return (
    <Screen eyebrow={module.featureFolder} title={module.title} subtitle={module.summary}>
      <SectionCard title="Module Progress" subtitle="This module uses the shared learner progress store for resume state, completion, and bookmarks." tone="navy">
        <View style={styles.tagRow}>
          <StatusPill label={`${stationMapStations.length} core stations`} tone="gold" />
          <StatusPill label={`${stationMapContent.quizRounds.length} quiz rounds`} tone="teal" />
          <StatusPill label={`${moduleProgress.percentComplete}% tracked`} tone="accent" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.stepRow}>
            {STEP_SEQUENCE.map((step, index) => {
              const disabled = step.id === 'summary' && !quizFinished;

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
          <ActionButton label="Open map" onPress={() => setCurrentStep('map')} variant="secondary" />
        </View>
      </SectionCard>

      {currentStep === 'overview' ? renderOverviewStep() : null}
      {currentStep === 'map' ? renderMapStep() : null}
      {currentStep === 'flashcards' ? renderFlashcardsStep() : null}
      {currentStep === 'quiz' ? renderQuizStep() : null}
      {currentStep === 'summary' ? renderSummaryStep() : null}

      <SectionCard title="Navigation" subtitle="Move step by step or jump with the step chips above.">
        <View style={styles.navigationRow}>
          <ActionButton
            label="Back"
            onPress={goToPreviousStep}
            variant="secondary"
            disabled={currentStepIndex <= 0}
            icon={<FontAwesome color={colors.ink} name="arrow-left" size={16} />}
          />
          <ActionButton
            label={currentStep === 'quiz' ? 'Finish quiz first' : currentStep === 'summary' ? 'Summary complete' : 'Next'}
            onPress={goToNextStep}
            disabled={currentStep === 'quiz' || currentStep === 'summary'}
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
  cueList: {
    gap: 4,
  },
  feedbackText: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    lineHeight: 18,
  },
  flashcard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 1,
    gap: 12,
    minHeight: 240,
    padding: 22,
  },
  flashcardEyebrow: {
    color: colors.accent,
    fontFamily: 'SpaceMono',
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  flashcardOpen: {
    borderColor: colors.accent,
  },
  flashcardPrompt: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 18,
    lineHeight: 26,
  },
  flashcardTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 24,
    lineHeight: 30,
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
  pressed: {
    opacity: 0.88,
  },
  quizPromptCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 24,
    gap: 8,
    padding: 16,
  },
  relatedChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  relatedChipText: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  relatedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
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
    minWidth: 92,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  stationChipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stationChipId: {
    color: colors.accent,
    fontFamily: 'SpaceMono',
    fontSize: 16,
  },
  stationChipText: {
    color: colors.inkSoft,
    fontSize: 12,
    lineHeight: 17,
  },
  stepChip: {
    backgroundColor: '#17465B',
    borderColor: '#2E6176',
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    minWidth: 128,
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
  tipStack: {
    gap: 2,
  },
  zoomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
