import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { MetricTile } from '@/components/MetricTile';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { StatusPill } from '@/components/StatusPill';
import { colors, shadows } from '@/constants/theme';
import { getPretestContent } from '@/features/pretest/content';
import { getFirstUnansweredQuestionIndex, getNextUnansweredQuestionIndex, scorePretest } from '@/features/pretest/logic';
import { getPretestImageAsset } from '@/features/pretest/media';
import type { ModuleContent } from '@/lib/types';
import { useLearnerProgress } from '@/store/learner-progress';

type PretestStepId = 'intro' | 'assessment' | 'submitted';

const STEP_LABELS: Record<PretestStepId, string> = {
  intro: 'Briefing',
  assessment: 'Assessment',
  submitted: 'Saved',
};

const pretestContent = getPretestContent();

function toPretestStepId(value: string | null | undefined): PretestStepId | null {
  return value === 'intro' || value === 'assessment' || value === 'submitted' ? value : null;
}

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Not submitted yet';
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export function PretestModule({ module }: { module: ModuleContent }) {
  const { state, setModuleProgress, setPretestAnswer, setPretestQuestionIndex, setQuizScore, submitPretest } =
    useLearnerProgress();
  const moduleProgress = state.moduleProgress.pretest;
  const pretestProgress = state.pretest;
  const totalQuestions = pretestContent.questions.length;
  const currentQuestionIndex = Math.max(0, Math.min(totalQuestions - 1, pretestProgress.currentQuestionIndex));
  const [currentStep, setCurrentStep] = useState<PretestStepId>(() => {
    if (pretestProgress.submittedAt) {
      return 'submitted';
    }

    const resumedStep = toPretestStepId(moduleProgress.lastScreen);

    if (resumedStep) {
      return resumedStep;
    }

    return Object.keys(pretestProgress.answers).length > 0 ? 'assessment' : 'intro';
  });

  const pretestResult = useMemo(
    () => scorePretest(pretestContent.questions, pretestProgress.answers),
    [pretestProgress.answers],
  );
  const currentQuestion = pretestContent.questions[currentQuestionIndex];
  const currentImage = currentQuestion?.imageAssetKey ? getPretestImageAsset(currentQuestion.imageAssetKey) : null;
  const unansweredCount = totalQuestions - pretestResult.answeredCount;
  const firstUnansweredQuestionIndex = getFirstUnansweredQuestionIndex(pretestContent.questions, pretestProgress.answers);
  const nextUnansweredQuestionIndex = getNextUnansweredQuestionIndex(
    pretestContent.questions,
    pretestProgress.answers,
    currentQuestionIndex,
  );
  const assessmentProgress =
    totalQuestions === 0 ? 0 : Math.max(14, Math.round(14 + (pretestResult.answeredCount / totalQuestions) * 76));
  const progressValue =
    currentStep === 'intro' ? 8 : currentStep === 'submitted' ? 100 : assessmentProgress;
  const savedScore = pretestProgress.score ?? pretestResult.correctCount;
  const savedPercent =
    pretestProgress.totalQuestions > 0
      ? Math.round((savedScore / pretestProgress.totalQuestions) * 100)
      : pretestResult.percent;

  useEffect(() => {
    if (pretestProgress.submittedAt) {
      setCurrentStep((current) => (current === 'submitted' ? current : 'submitted'));
      return;
    }

    const resumedStep = toPretestStepId(moduleProgress.lastScreen);

    if (!resumedStep) {
      return;
    }

    setCurrentStep((current) => (current === resumedStep ? current : resumedStep));
  }, [moduleProgress.lastScreen, pretestProgress.submittedAt]);

  useEffect(() => {
    setModuleProgress('pretest', {
      completed: currentStep === 'submitted',
      lastScreen: currentStep,
      percentComplete: progressValue,
    });
  }, [currentStep, progressValue]);

  function openAssessment() {
    setCurrentStep('assessment');
  }

  function goToQuestion(index: number) {
    if (index < 0 || index >= totalQuestions) {
      return;
    }

    setCurrentStep('assessment');
    setPretestQuestionIndex(index);
  }

  function handleAnswer(optionId: string) {
    if (!currentQuestion) {
      return;
    }

    setCurrentStep('assessment');
    setPretestAnswer(currentQuestion.id, optionId);
  }

  function handleSubmit() {
    if (pretestResult.answeredCount < totalQuestions) {
      if (firstUnansweredQuestionIndex >= 0) {
        goToQuestion(firstUnansweredQuestionIndex);
      }

      return;
    }

    submitPretest({
      answeredCount: pretestResult.answeredCount,
      score: pretestResult.correctCount,
      totalQuestions,
    });
    setQuizScore('pretest', pretestResult.correctCount);
    setCurrentStep('submitted');
  }

  function renderIntroStep() {
    return (
      <>
        <SectionCard
          title="Before you begin"
          subtitle="This is a baseline assessment, so correct answers stay hidden after submission."
          tone="navy">
          <View style={styles.pillRow}>
            <StatusPill label={`${totalQuestions} questions`} tone="gold" />
            <StatusPill label="Answers hidden" tone="teal" />
            <StatusPill label="Demo local logging" tone="neutral" />
          </View>

          <View style={styles.list}>
            {pretestContent.instructions.map((instruction) => (
              <Text key={instruction} style={styles.lightListItem}>
                - {instruction}
              </Text>
            ))}
          </View>

          <Text style={styles.lightBodyText}>{pretestContent.demoPolicy}</Text>

          <ActionButton
            label="Start pretest"
            onPress={openAssessment}
            accessibilityLabel="Start the EBUS course pretest"
          />
        </SectionCard>

        <SectionCard
          title="Submission behavior"
          subtitle="Built for the demo now, ready for login-backed score logging later.">
          <Text style={styles.bodyText}>
            The current build saves the latest score and submission timestamp on this device. When login is added, the
            same submission event can attach to authenticated attendee information without changing the question flow.
          </Text>
        </SectionCard>
      </>
    );
  }

  function renderAssessmentStep() {
    if (!currentQuestion) {
      return (
        <SectionCard title="No questions loaded" subtitle="The pretest content file is empty.">
          <Text style={styles.bodyText}>Add question content to continue building the assessment.</Text>
        </SectionCard>
      );
    }

    return (
      <>
        <SectionCard
          title={`Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
          subtitle="Tap any number to jump. Your answers are saved locally as you go.">
          <View style={styles.questionSummaryRow}>
            <StatusPill label={`${pretestResult.answeredCount} answered`} tone="teal" />
            <StatusPill label={`${unansweredCount} remaining`} tone={unansweredCount === 0 ? 'gold' : 'neutral'} />
            <StatusPill label={STEP_LABELS[currentStep]} tone="accent" />
          </View>

          <ProgressBar value={(pretestResult.answeredCount / totalQuestions) * 100} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.questionRail}>
              {pretestContent.questions.map((question, index) => {
                const answered = Boolean(pretestProgress.answers[question.id]);
                const active = index === currentQuestionIndex;

                return (
                  <Pressable
                    key={question.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Open question ${index + 1}${answered ? ', answered' : ', unanswered'}`}
                    onPress={() => goToQuestion(index)}
                    style={({ pressed }) => [
                      styles.questionChip,
                      answered && styles.questionChipAnswered,
                      active && styles.questionChipActive,
                      pressed && styles.pressed,
                    ]}>
                    <Text
                      style={[
                        styles.questionChipText,
                        answered && styles.questionChipTextAnswered,
                        active && styles.questionChipTextActive,
                      ]}>
                      {index + 1}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {firstUnansweredQuestionIndex >= 0 ? (
            <ActionButton
              label={
                nextUnansweredQuestionIndex >= 0
                  ? `Jump to unanswered #${nextUnansweredQuestionIndex + 1}`
                  : `Jump to unanswered #${firstUnansweredQuestionIndex + 1}`
              }
              onPress={() =>
                goToQuestion(nextUnansweredQuestionIndex >= 0 ? nextUnansweredQuestionIndex : firstUnansweredQuestionIndex)
              }
              variant="secondary"
            />
          ) : null}
        </SectionCard>

        <SectionCard title="Prompt" subtitle={currentQuestion.type === 'image-interpretation' ? 'Image question' : 'Single best answer'}>
          <Text style={styles.questionPrompt}>{currentQuestion.prompt}</Text>

          {currentImage ? (
            <View style={styles.figureWrap}>
              <Image
                accessibilityIgnoresInvertColors
                accessibilityLabel={currentImage.alt}
                resizeMode="contain"
                source={currentImage.source}
                style={styles.figure}
              />
              <Text style={styles.figureCaption}>{currentImage.caption}</Text>
            </View>
          ) : null}

          <View style={styles.optionGroup}>
            {currentQuestion.options.map((option) => {
              const isSelected = pretestProgress.answers[currentQuestion.id] === option.id;

              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`Option ${option.id.toUpperCase()}. ${option.label}`}
                  onPress={() => handleAnswer(option.id)}
                  style={({ pressed }) => [
                    styles.optionCard,
                    shadows,
                    isSelected && styles.optionCardSelected,
                    pressed && styles.pressed,
                  ]}>
                  <View style={[styles.optionBadge, isSelected && styles.optionBadgeSelected]}>
                    <Text style={[styles.optionBadgeText, isSelected && styles.optionBadgeTextSelected]}>
                      {option.id.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </SectionCard>

        <SectionCard
          title="Navigate and submit"
          subtitle={
            unansweredCount === 0
              ? 'All questions are answered. Submit when you are ready to save the result.'
              : `${unansweredCount} question${unansweredCount === 1 ? '' : 's'} still need an answer before submission.`
          }>
          <View style={styles.navigationRow}>
            <ActionButton
              label="Previous question"
              onPress={() => goToQuestion(currentQuestionIndex - 1)}
              variant="secondary"
              disabled={currentQuestionIndex === 0}
            />
            <ActionButton
              label="Next question"
              onPress={() => goToQuestion(currentQuestionIndex + 1)}
              variant="secondary"
              disabled={currentQuestionIndex === totalQuestions - 1}
            />
          </View>

          <ActionButton
            label="Submit pretest"
            onPress={handleSubmit}
            disabled={pretestResult.answeredCount < totalQuestions}
          />
        </SectionCard>
      </>
    );
  }

  function renderSubmittedStep() {
    return (
      <>
        <SectionCard
          title="Pretest submitted"
          subtitle="Correct answers remain hidden to preserve the baseline assessment."
          tone="navy">
          <View style={styles.metricRow}>
            <MetricTile label="Saved score" tone="accent" value={`${savedScore}/${pretestProgress.totalQuestions || totalQuestions}`} />
            <MetricTile label="Percent" tone="teal" value={`${savedPercent}%`} />
            <MetricTile label="Attempts" tone="gold" value={`${pretestProgress.attemptCount}`} />
          </View>

          <Text style={styles.lightBodyText}>Latest submission: {formatTimestamp(pretestProgress.submittedAt)}</Text>
          <Text style={styles.lightBodyText}>{pretestContent.demoPolicy}</Text>
        </SectionCard>

        <SectionCard title="Demo logging note" subtitle="What this proves now and what can connect later.">
          <Text style={styles.bodyText}>
            The current demo keeps the latest score, answered count, and submission time on device. When attendee login
            is added, this same summary can be sent with authenticated learner details instead of staying local only.
          </Text>
          <Text style={styles.bodyText}>
            Your recorded attempt covered {pretestProgress.answeredCount || totalQuestions} of {pretestProgress.totalQuestions || totalQuestions}{' '}
            prompts, and the answer key is still hidden in the learner view.
          </Text>
        </SectionCard>
      </>
    );
  }

  return (
    <Screen eyebrow="Attendee baseline" title={module.title} subtitle={module.summary}>
      {currentStep === 'intro' ? renderIntroStep() : null}
      {currentStep === 'assessment' ? renderAssessmentStep() : null}
      {currentStep === 'submitted' ? renderSubmittedStep() : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bodyText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 21,
  },
  figure: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 22,
    height: 260,
    width: '100%',
  },
  figureCaption: {
    color: colors.inkSoft,
    fontSize: 12,
    lineHeight: 18,
  },
  figureWrap: {
    gap: 10,
  },
  lightBodyText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 21,
  },
  lightListItem: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 21,
  },
  list: {
    gap: 10,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  navigationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionBadge: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  optionBadgeSelected: {
    backgroundColor: colors.accent,
  },
  optionBadgeText: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
  optionBadgeTextSelected: {
    color: colors.white,
  },
  optionCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionCardSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  optionGroup: {
    gap: 12,
  },
  optionLabel: {
    color: colors.ink,
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  optionLabelSelected: {
    color: colors.ink,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pressed: {
    opacity: 0.9,
  },
  questionChip: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  questionChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  questionChipAnswered: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.teal,
  },
  questionChipText: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 13,
  },
  questionChipTextActive: {
    color: colors.white,
  },
  questionChipTextAnswered: {
    color: colors.teal,
  },
  questionPrompt: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 17,
    lineHeight: 25,
  },
  questionRail: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 8,
  },
  questionSummaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
