import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { MetricTile } from '@/components/MetricTile';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/constants/theme';
import { getKnobologyContent, getKnobologyQuizQuestions } from '@/features/knobology/content';
import { KnobologyFrame } from '@/features/knobology/KnobologyFrame';
import { scoreKnobologyQuiz } from '@/features/knobology/quiz';
import {
  buildFrameModel,
  createControlState,
  evaluateCorrectionExercise,
  evaluateDopplerChoice,
  getCorrectionSolvedCount,
  toggleUtilityControl,
  updateControlValue,
} from '@/features/knobology/simulator';
import { KnobologySlider } from '@/features/knobology/KnobologySlider';
import type { KnobologyControlKey, KnobologyControlState, KnobologyStepId } from '@/features/knobology/types';
import type { ModuleContent } from '@/lib/types';
import { isBookmarked, useLearnerProgress } from '@/store/learner-progress';

const STEP_SEQUENCE: Array<{ id: KnobologyStepId; label: string }> = [
  { id: 'primer', label: 'Primer' },
  { id: 'control-lab', label: 'Control Lab' },
  { id: 'doppler-mini-lab', label: 'Doppler' },
  { id: 'quick-reference', label: 'Reference' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'completion-summary', label: 'Summary' },
];

const STEP_PROGRESS: Record<KnobologyStepId, number> = {
  primer: 12,
  'control-lab': 38,
  'doppler-mini-lab': 56,
  'quick-reference': 72,
  quiz: 86,
  'completion-summary': 100,
};

const knobologyContent = getKnobologyContent();
const knobologyQuestions = getKnobologyQuizQuestions();

function toKnobologyStepId(value: string | null | undefined): KnobologyStepId | null {
  return STEP_SEQUENCE.some((step) => step.id === value) ? (value as KnobologyStepId) : null;
}

function createExerciseStateMap() {
  return Object.fromEntries(
    knobologyContent.controlLabExercises.map((exercise) => [exercise.id, createControlState(exercise.start)]),
  ) as Record<string, KnobologyControlState>;
}

export function KnobologyModule({ module }: { module: ModuleContent }) {
  const { state, setModuleProgress, setQuizScore, toggleBookmark } = useLearnerProgress();
  const moduleProgress = state.moduleProgress.knobology;
  const [currentStep, setCurrentStep] = useState<KnobologyStepId>(
    () => toKnobologyStepId(moduleProgress.lastScreen) ?? 'primer',
  );
  const [selectedExerciseId, setSelectedExerciseId] = useState(
    knobologyContent.controlLabExercises[0]?.id ?? 'depth-rescue',
  );
  const [exerciseStates, setExerciseStates] = useState<Record<string, KnobologyControlState>>(
    createExerciseStateMap,
  );
  const [dopplerOn, setDopplerOn] = useState(false);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [referenceQuery, setReferenceQuery] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(Boolean(moduleProgress.quizScore));

  const resumedStep = toKnobologyStepId(moduleProgress.lastScreen);

  useEffect(() => {
    if (resumedStep && resumedStep !== currentStep) {
      setCurrentStep(resumedStep);
    }
  }, [currentStep, resumedStep]);

  useEffect(() => {
    setModuleProgress('knobology', {
      completed: currentStep === 'completion-summary',
      lastScreen: currentStep,
      percentComplete: STEP_PROGRESS[currentStep],
    });
  }, [currentStep]);

  const currentStepIndex = STEP_SEQUENCE.findIndex((step) => step.id === currentStep);
  const selectedExercise =
    knobologyContent.controlLabExercises.find((exercise) => exercise.id === selectedExerciseId) ??
    knobologyContent.controlLabExercises[0];
  const selectedExerciseState = exerciseStates[selectedExercise.id];
  const selectedExerciseEvaluation = evaluateCorrectionExercise(selectedExercise, selectedExerciseState);
  const solvedCount = getCorrectionSolvedCount(knobologyContent.controlLabExercises, exerciseStates);
  const dopplerFeedback = evaluateDopplerChoice(
    knobologyContent.dopplerLab,
    dopplerOn,
    selectedPathId,
  );
  const dopplerFrame = buildFrameModel({
    ...createControlState({ depth: 62, gain: 56, contrast: 68 }),
    colorDoppler: dopplerOn,
  });
  const filteredCards = knobologyContent.quickReferenceCards.filter((card) => {
    const query = referenceQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [card.title, card.whenToUse, card.whatChanges, card.noviceTrap].some((field) =>
      field.toLowerCase().includes(query),
    );
  });
  const quizResult = useMemo(
    () => scoreKnobologyQuiz(knobologyQuestions, quizAnswers),
    [quizAnswers],
  );
  const moduleSaved = isBookmarked(state, module.id, 'module');
  const effectiveQuizScore = moduleProgress.quizScore ?? quizResult.correctCount;

  function moveToStep(stepId: KnobologyStepId) {
    setCurrentStep(stepId);
  }

  function goToNextStep() {
    if (currentStep === 'quiz' && quizResult.answeredCount < knobologyQuestions.length) {
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

  function handleExerciseControlChange(key: KnobologyControlKey, value: number) {
    setExerciseStates((currentStates) => ({
      ...currentStates,
      [selectedExercise.id]: updateControlValue(currentStates[selectedExercise.id], key, value),
    }));
  }

  function handleExerciseToggle(key: 'colorDoppler' | 'calipers' | 'frozen' | 'saved') {
    setExerciseStates((currentStates) => ({
      ...currentStates,
      [selectedExercise.id]: toggleUtilityControl(currentStates[selectedExercise.id], key),
    }));
  }

  function resetExercise(exerciseId: string) {
    const exercise = knobologyContent.controlLabExercises.find((item) => item.id === exerciseId);

    if (!exercise) {
      return;
    }

    setExerciseStates((currentStates) => ({
      ...currentStates,
      [exercise.id]: createControlState(exercise.start),
    }));
  }

  function handleQuizAnswer(questionId: string, optionId: string) {
    setQuizAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: optionId,
    }));
  }

  function finishQuiz() {
    const result = scoreKnobologyQuiz(knobologyQuestions, quizAnswers);

    setQuizSubmitted(true);
    setQuizScore('knobology', result.correctCount);
    setCurrentStep('completion-summary');
  }

  function renderPrimerStep() {
    return (
      <SectionCard
        title="Primer"
        subtitle="Short teaching cards explain what each control changes before the learner enters the lab.">
        {knobologyContent.primerSections.map((section) => (
          <View key={section.id} style={styles.lessonCard}>
            <View style={styles.lessonHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <StatusPill label="Control" tone="teal" />
            </View>
            <Text style={styles.bodyText}>{section.summary}</Text>
            <Text style={styles.supportingText}>Best move: {section.bestMove}</Text>
            <Text style={styles.supportingText}>Novice trap: {section.pitfall}</Text>
          </View>
        ))}
      </SectionCard>
    );
  }

  function renderControlLabStep() {
    return (
      <SectionCard
        title="Control Lab"
        subtitle="Three bad-image rescue tasks with immediate feedback. This remains an educational approximation, not a physics simulation.">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.exerciseSelectorRow}>
            {knobologyContent.controlLabExercises.map((exercise, index) => {
              const solved = evaluateCorrectionExercise(exercise, exerciseStates[exercise.id]).isSolved;

              return (
                <Pressable
                  key={exercise.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Open correction exercise ${index + 1}: ${exercise.title}`}
                  onPress={() => setSelectedExerciseId(exercise.id)}
                  style={({ pressed }) => [
                    styles.exerciseSelector,
                    selectedExercise.id === exercise.id && styles.exerciseSelectorActive,
                    pressed && styles.pressed,
                  ]}>
                  <Text
                    style={[
                      styles.exerciseSelectorTitle,
                      selectedExercise.id === exercise.id && styles.exerciseSelectorTitleActive,
                    ]}>
                    {exercise.title}
                  </Text>
                  <Text
                    style={[
                      styles.exerciseSelectorMeta,
                      selectedExercise.id === exercise.id && styles.exerciseSelectorMetaActive,
                    ]}>
                    {solved ? 'Solved' : `Focus: ${exercise.focusControl}`}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <Text style={styles.bodyText}>{selectedExercise.symptom}</Text>
        <Text style={styles.supportingText}>{selectedExercise.instructions}</Text>
        <KnobologyFrame frame={selectedExerciseEvaluation.frame} />

        <View style={styles.feedbackRow}>
          <StatusPill
            label={selectedExerciseEvaluation.isSolved ? 'Improved frame' : `Score ${selectedExerciseEvaluation.score}/100`}
            tone={selectedExerciseEvaluation.isSolved ? 'gold' : 'accent'}
          />
          <StatusPill label={`${solvedCount}/3 rescues complete`} tone="teal" />
        </View>

        <Text style={styles.bodyText}>{selectedExerciseEvaluation.feedback}</Text>

        <KnobologySlider
          disabled={selectedExerciseState.frozen}
          hint="Adjust framing first if the target is cut off or buried in empty space."
          label="Depth"
          onValueChange={(value) => handleExerciseControlChange('depth', value)}
          value={selectedExerciseState.depth}
        />
        <KnobologySlider
          disabled={selectedExerciseState.frozen}
          hint="Use gain to brighten or darken the whole frame."
          label="Gain"
          onValueChange={(value) => handleExerciseControlChange('gain', value)}
          value={selectedExerciseState.gain}
        />
        <KnobologySlider
          disabled={selectedExerciseState.frozen}
          hint="Use contrast once framing and brightness are close."
          label="Contrast"
          onValueChange={(value) => handleExerciseControlChange('contrast', value)}
          value={selectedExerciseState.contrast}
        />

        <View style={styles.utilityRow}>
          {[
            { key: 'calipers' as const, label: 'Calipers' },
            { key: 'frozen' as const, label: selectedExerciseState.frozen ? 'Unfreeze' : 'Freeze' },
            { key: 'saved' as const, label: selectedExerciseState.saved ? 'Saved' : 'Save' },
          ].map((item) => (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => handleExerciseToggle(item.key)}
              style={({ pressed }) => [
                styles.utilityButton,
                selectedExerciseState[item.key] && styles.utilityButtonActive,
                pressed && styles.pressed,
              ]}>
              <Text
                style={[
                  styles.utilityButtonText,
                  selectedExerciseState[item.key] && styles.utilityButtonTextActive,
                ]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <ActionButton
          label="Reset current rescue"
          onPress={() => resetExercise(selectedExercise.id)}
          variant="secondary"
        />
      </SectionCard>
    );
  }

  function renderDopplerStep() {
    return (
      <SectionCard
        title="Doppler Mini-Lab"
        subtitle={knobologyContent.dopplerLab.brief}>
        <KnobologyFrame frame={dopplerFrame} />
        <ActionButton
          label={dopplerOn ? 'Turn Doppler Off' : 'Turn Doppler On'}
          onPress={() => setDopplerOn((current) => !current)}
          variant={dopplerOn ? 'primary' : 'secondary'}
        />
        <Text style={styles.bodyText}>{knobologyContent.dopplerLab.prompt}</Text>

        {knobologyContent.dopplerLab.paths.map((path) => (
          <Pressable
            key={path.id}
            accessibilityRole="button"
            accessibilityLabel={`Choose ${path.label}`}
            onPress={() => setSelectedPathId(path.id)}
            style={({ pressed }) => [
              styles.pathCard,
              selectedPathId === path.id && styles.pathCardActive,
              pressed && styles.pressed,
            ]}>
            <Text style={styles.sectionTitle}>{path.label}</Text>
            <Text style={styles.supportingText}>{path.description}</Text>
          </Pressable>
        ))}

        <StatusPill
          label={
            dopplerFeedback.status === 'correct'
              ? 'Safe path found'
              : dopplerFeedback.status === 'incorrect'
                ? 'Unsafe path'
                : 'Awaiting selection'
          }
          tone={dopplerFeedback.status === 'correct' ? 'gold' : dopplerFeedback.status === 'incorrect' ? 'accent' : 'neutral'}
        />
        <Text style={styles.bodyText}>{dopplerFeedback.feedback}</Text>
      </SectionCard>
    );
  }

  function renderQuickReferenceStep() {
    return (
      <SectionCard
        title="Quick-Reference Cards"
        subtitle="Search or swipe through one card per control.">
        <TextInput
          accessibilityLabel="Search knobology quick-reference cards"
          onChangeText={setReferenceQuery}
          placeholder="Search depth, gain, Doppler..."
          placeholderTextColor={colors.inkSoft}
          style={styles.searchInput}
          value={referenceQuery}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.referenceRow}>
            {filteredCards.map((card) => (
              <View key={card.id} style={styles.referenceCard}>
                <Text style={styles.sectionTitle}>{card.title}</Text>
                <Text style={styles.bodyText}>When to use: {card.whenToUse}</Text>
                <Text style={styles.supportingText}>What changes: {card.whatChanges}</Text>
                <Text style={styles.supportingText}>Novice trap: {card.noviceTrap}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {filteredCards.length === 0 ? (
          <Text style={styles.supportingText}>No cards match that search yet.</Text>
        ) : null}
      </SectionCard>
    );
  }

  function renderQuizStep() {
    return (
      <SectionCard
        title="5-Question Quiz"
        subtitle="Choose an answer to get immediate feedback. Finish the quiz to save the score locally.">
        {knobologyQuestions.map((question, index) => {
          const selectedOptionId = quizAnswers[question.id];
          const showFeedback = Boolean(selectedOptionId);
          const selectedIsCorrect = selectedOptionId === question.correctOptionId;

          return (
            <View key={question.id} style={styles.quizCard}>
              <View style={styles.quizHeader}>
                <Text style={styles.sectionTitle}>Question {index + 1}</Text>
                <StatusPill label={question.type.replace(/-/g, ' ')} tone="teal" />
              </View>
              <Text style={styles.bodyText}>{question.prompt}</Text>

              {question.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isCorrect = question.correctOptionId === option.id;

                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${option.label}`}
                    onPress={() => handleQuizAnswer(question.id, option.id)}
                    style={({ pressed }) => [
                      styles.optionButton,
                      isSelected && styles.optionButtonSelected,
                      showFeedback && isCorrect && styles.optionButtonCorrect,
                      showFeedback && isSelected && !isCorrect && styles.optionButtonIncorrect,
                      pressed && styles.pressed,
                    ]}>
                    <Text
                      style={[
                        styles.optionLabel,
                        (showFeedback && isCorrect) || (showFeedback && isSelected && !isCorrect)
                          ? styles.optionLabelInverse
                          : null,
                      ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}

              {showFeedback ? (
                <Text style={styles.supportingText}>
                  {selectedIsCorrect ? 'Correct. ' : 'Not quite. '}
                  {question.explanation}
                </Text>
              ) : null}
            </View>
          );
        })}

        <View style={styles.feedbackRow}>
          <StatusPill label={`${quizResult.answeredCount}/${knobologyQuestions.length} answered`} tone="teal" />
          <StatusPill label={`${quizResult.correctCount}/${knobologyQuestions.length} correct`} tone="accent" />
        </View>

        <ActionButton
          disabled={quizResult.answeredCount < knobologyQuestions.length}
          label={quizSubmitted ? 'Recalculate score' : 'Finish quiz'}
          onPress={finishQuiz}
        />
        {quizResult.answeredCount < knobologyQuestions.length ? (
          <Text style={styles.supportingText}>Answer all five questions to complete the module.</Text>
        ) : null}
      </SectionCard>
    );
  }

  function renderSummaryStep() {
    return (
      <>
        <SectionCard
          title="Completion Summary"
          subtitle="The learner can return here after restart because the module stores the last screen and quiz score locally.">
          <View style={styles.metricRow}>
            <MetricTile label="Quiz score" tone="accent" value={`${effectiveQuizScore}/${knobologyQuestions.length}`} />
            <MetricTile label="Image rescues" tone="teal" value={`${solvedCount}/3`} />
            <MetricTile label="Progress" tone="gold" value={`${moduleProgress.percentComplete}%`} />
          </View>
          <Text style={styles.bodyText}>
            The module now covers depth, gain, contrast, color Doppler, calipers, freeze, and save through a primer, interactive lab, reference cards, quiz, and summary.
          </Text>
          <View style={styles.actionColumn}>
            <ActionButton label="Retake quiz" onPress={() => moveToStep('quiz')} variant="secondary" />
            <ActionButton label="Revisit control lab" onPress={() => moveToStep('control-lab')} variant="secondary" />
          </View>
        </SectionCard>

        <SectionCard
          title="Placeholder assets"
          subtitle="These visuals are still app-owned placeholders and should be swapped later with approved teaching art.">
          {knobologyContent.assetPlaceholders.map((asset) => (
            <View key={asset.key} style={styles.assetRow}>
              <Text style={styles.sectionTitle}>{asset.label}</Text>
              <Text style={styles.supportingText}>{asset.note}</Text>
            </View>
          ))}
        </SectionCard>
      </>
    );
  }

  const renderedStepContent = (() => {
    switch (currentStep) {
      case 'primer':
        return renderPrimerStep();
      case 'control-lab':
        return renderControlLabStep();
      case 'doppler-mini-lab':
        return renderDopplerStep();
      case 'quick-reference':
        return renderQuickReferenceStep();
      case 'quiz':
        return renderQuizStep();
      case 'completion-summary':
        return renderSummaryStep();
      default:
        return null;
    }
  })();

  return (
    <Screen
      eyebrow="features/knobology"
      title={module.title}
      subtitle="Portrait-first training flow with local content, immediate interaction feedback, and persisted module progress.">
      <SectionCard
        title="Module rail"
        subtitle={`Resume point: ${resumedStep ?? 'primer'}. The quiz score and last visited step persist locally.`}
        tone="navy">
        <View style={styles.feedbackRow}>
          <StatusPill label={`${moduleProgress.percentComplete}% complete`} tone="gold" />
          <StatusPill label={moduleSaved ? 'Saved to review' : 'Not saved'} tone="teal" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.stepRail}>
            {STEP_SEQUENCE.map((step, index) => {
              const isActive = step.id === currentStep;
              const isComplete = STEP_PROGRESS[step.id] < moduleProgress.percentComplete || step.id === 'completion-summary' && Boolean(moduleProgress.completedAt);

              return (
                <Pressable
                  key={step.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${step.label}`}
                  onPress={() => moveToStep(step.id)}
                  style={({ pressed }) => [
                    styles.stepChip,
                    isActive && styles.stepChipActive,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.stepChipIndex, isActive && styles.stepChipIndexActive]}>{index + 1}</Text>
                  <Text style={[styles.stepChipText, isActive && styles.stepChipTextActive]}>{step.label}</Text>
                  <Text style={[styles.stepChipMeta, isActive && styles.stepChipMetaActive]}>
                    {isComplete ? 'Done' : 'Next'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.actionColumn}>
          <ActionButton
            label={moduleSaved ? 'Remove from review' : 'Save module to review'}
            onPress={() =>
              toggleBookmark({
                id: module.id,
                kind: 'module',
                label: module.title,
                moduleId: 'knobology',
              })
            }
            variant="secondary"
          />
        </View>
      </SectionCard>

      {renderedStepContent}

      <SectionCard
        title="Navigation"
        subtitle="Learners can move step by step, but the rail also allows quick review after the first pass.">
        <View style={styles.navRow}>
          <ActionButton
            disabled={currentStepIndex === 0}
            label="Back"
            onPress={goToPreviousStep}
            variant="secondary"
          />
          <ActionButton
            disabled={currentStep === 'quiz' && quizResult.answeredCount < knobologyQuestions.length}
            label={currentStep === 'completion-summary' ? 'Stay on summary' : 'Next'}
            onPress={currentStep === 'completion-summary' ? () => undefined : goToNextStep}
          />
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actionColumn: {
    gap: 10,
  },
  assetRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 4,
    paddingBottom: 12,
  },
  bodyText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 21,
  },
  exerciseSelector: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 188,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  exerciseSelectorActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  exerciseSelectorMeta: {
    color: colors.inkSoft,
    fontSize: 12,
    marginTop: 4,
  },
  exerciseSelectorMetaActive: {
    color: '#C9DAE2',
  },
  exerciseSelectorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  exerciseSelectorTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 13,
  },
  exerciseSelectorTitleActive: {
    color: colors.white,
  },
  feedbackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  lessonCard: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 6,
    paddingBottom: 14,
  },
  lessonHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  navRow: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionButtonCorrect: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  optionButtonIncorrect: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  optionButtonSelected: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  optionLabel: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  optionLabelInverse: {
    color: colors.white,
  },
  pathCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    padding: 16,
  },
  pathCardActive: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.88,
  },
  quizCard: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 10,
    paddingBottom: 18,
  },
  quizHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  referenceCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
    padding: 18,
    width: 268,
  },
  referenceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
  stepChip: {
    backgroundColor: '#F1E7DA',
    borderRadius: 24,
    minWidth: 126,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  stepChipActive: {
    backgroundColor: colors.accent,
  },
  stepChipIndex: {
    color: colors.accent,
    fontFamily: 'SpaceMono',
    fontSize: 11,
  },
  stepChipIndexActive: {
    color: colors.white,
  },
  stepChipMeta: {
    color: colors.inkSoft,
    fontSize: 11,
  },
  stepChipMetaActive: {
    color: '#F8E6DE',
  },
  stepChipText: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 13,
    marginTop: 6,
  },
  stepChipTextActive: {
    color: colors.white,
  },
  stepRail: {
    flexDirection: 'row',
    gap: 10,
  },
  supportingText: {
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  utilityButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  utilityButtonActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  utilityButtonText: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  utilityButtonTextActive: {
    color: colors.white,
  },
  utilityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
