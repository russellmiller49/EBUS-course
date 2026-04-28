import { courseAssessments, getCourseAssessmentById } from '@/content/courseAssessments';
import { lectureManifest } from '@/content/lectures';
import type { CourseAssessmentContent } from '@/content/types';
import type { LearnerProgressState } from '@/lib/progress';

export type CourseWorkflowStepKind =
  | 'lecture'
  | 'pretest'
  | 'practice'
  | 'assessment'
  | 'post-test'
  | 'survey'
  | 'answers'
  | 'certificate';

export interface CourseWorkflowStepDefinition {
  id: string;
  kind: CourseWorkflowStepKind;
  title: string;
  path: string;
  assessmentId?: string;
  lectureId?: string;
}

export interface CourseWorkflowStepModel extends CourseWorkflowStepDefinition {
  completed: boolean;
  lockedReason: string | null;
  percent: number;
  status: 'locked' | 'current' | 'available' | 'completed';
  unlocked: boolean;
}

export interface CourseWorkflowOptions {
  admin?: boolean;
}

function lectureStep(lectureId: string): CourseWorkflowStepDefinition {
  const lecture = lectureManifest.find((entry) => entry.id === lectureId);

  return {
    id: lectureId,
    kind: 'lecture',
    lectureId,
    title: lecture?.title ?? lectureId,
    path: '/lectures',
  };
}

function assessmentStep(assessmentId: string): CourseWorkflowStepDefinition {
  const assessment = getCourseAssessmentById(assessmentId);

  return {
    id: assessmentId,
    kind: assessment?.kind === 'post-test' ? 'post-test' : 'assessment',
    assessmentId,
    title: assessment?.title ?? assessmentId,
    path: `/lectures?assessment=${assessmentId}`,
  };
}

export const courseWorkflowSteps: CourseWorkflowStepDefinition[] = [
  lectureStep('lecture-01'),
  {
    id: 'pretest',
    kind: 'pretest',
    title: 'Pre-test',
    path: '/pretest',
  },
  {
    id: 'practice-modules',
    kind: 'practice',
    title: 'Practice modules unlocked',
    path: '/knobology',
  },
  lectureStep('lecture-02'),
  assessmentStep('post-lecture-02'),
  lectureStep('lecture-03'),
  assessmentStep('post-lecture-03'),
  lectureStep('lecture-04'),
  assessmentStep('post-lecture-04'),
  lectureStep('lecture-05'),
  assessmentStep('post-lecture-05'),
  lectureStep('lecture-06'),
  lectureStep('lecture-07'),
  assessmentStep('post-lecture-06-07'),
  lectureStep('lecture-08'),
  assessmentStep('post-lecture-08'),
  lectureStep('lecture-09'),
  assessmentStep('post-lecture-09'),
  lectureStep('lecture-10'),
  lectureStep('lecture-11'),
  assessmentStep('post-lecture-10-11'),
  lectureStep('lecture-12'),
  assessmentStep('post-lecture-12'),
  lectureStep('lecture-13'),
  assessmentStep('post-lecture-13'),
  lectureStep('lecture-14'),
  assessmentStep('post-lecture-14'),
  lectureStep('lecture-15'),
  lectureStep('lecture-16'),
  assessmentStep('post-lecture-16'),
  lectureStep('lecture-17'),
  lectureStep('lecture-18'),
  assessmentStep('post-lecture-17-18'),
  lectureStep('lecture-19'),
  assessmentStep('post-lecture-19'),
  lectureStep('lecture-20'),
  assessmentStep('post-test'),
  {
    id: 'post-course-survey',
    kind: 'survey',
    title: 'Post-course survey',
    path: '/lectures?section=course-completion',
  },
  {
    id: 'post-test-answers',
    kind: 'answers',
    title: 'Post-test answers',
    path: '/lectures?section=course-completion',
  },
  {
    id: 'certificate',
    kind: 'certificate',
    title: 'Certificate of completion',
    path: '/lectures?section=course-completion',
  },
];

export function isPretestComplete(state: Pick<LearnerProgressState, 'pretest'>) {
  return Boolean(state.pretest.submittedAt || state.pretest.unlockedByPasscodeAt);
}

export function isLectureComplete(state: Pick<LearnerProgressState, 'lectureWatchStatus' | 'pretest'>, lectureId: string) {
  if (lectureId === 'lecture-01' && isPretestComplete(state)) {
    return true;
  }

  return Boolean(state.lectureWatchStatus[lectureId]?.completed);
}

export function isCoursePretestUnlocked(
  state: Pick<LearnerProgressState, 'lectureWatchStatus' | 'pretest'>,
  options: CourseWorkflowOptions = {},
) {
  if (options.admin) {
    return true;
  }

  return isPretestComplete(state) || isLectureComplete(state, 'lecture-01');
}

export function isPracticeGateUnlocked(state: Pick<LearnerProgressState, 'pretest'>, options: CourseWorkflowOptions = {}) {
  if (options.admin) {
    return true;
  }

  return isPretestComplete(state);
}

export function getCourseAssessmentProgress(
  state: Pick<LearnerProgressState, 'courseAssessmentResults'>,
  assessmentId: string,
) {
  return state.courseAssessmentResults[assessmentId] ?? null;
}

export function isCourseAssessmentComplete(
  state: Pick<LearnerProgressState, 'courseAssessmentResults'>,
  assessmentId: string,
) {
  return Boolean(getCourseAssessmentProgress(state, assessmentId)?.completedAt);
}

export function isCourseSurveyComplete(state: Pick<LearnerProgressState, 'courseSurvey'>) {
  return Boolean(state.courseSurvey.submittedAt);
}

function getStepPercent(state: LearnerProgressState, step: CourseWorkflowStepDefinition, completed: boolean) {
  if (completed) {
    return 100;
  }

  if (step.kind === 'lecture' && step.lectureId) {
    const watchedSeconds = state.lectureWatchStatus[step.lectureId]?.watchedSeconds ?? 0;
    return Math.min(90, Math.round((watchedSeconds / 600) * 100));
  }

  if (step.kind === 'pretest') {
    return state.moduleProgress.pretest.percentComplete;
  }

  return 0;
}

export function isCourseStepComplete(state: LearnerProgressState, step: CourseWorkflowStepDefinition) {
  if (step.kind === 'lecture' && step.lectureId) {
    return isLectureComplete(state, step.lectureId);
  }

  if (step.kind === 'pretest' || step.kind === 'practice') {
    return isPretestComplete(state);
  }

  if ((step.kind === 'assessment' || step.kind === 'post-test') && step.assessmentId) {
    return isCourseAssessmentComplete(state, step.assessmentId);
  }

  if (step.kind === 'survey' || step.kind === 'answers' || step.kind === 'certificate') {
    return isCourseSurveyComplete(state);
  }

  return false;
}

function getLockedReason(previousStep: CourseWorkflowStepDefinition | null) {
  if (!previousStep) {
    return null;
  }

  if (previousStep.kind === 'lecture') {
    return `Complete ${previousStep.title} to unlock this step.`;
  }

  if (previousStep.kind === 'pretest') {
    return 'Complete the pre-test to unlock the practice modules and next lecture.';
  }

  if (previousStep.kind === 'assessment') {
    return `Complete ${previousStep.title} to unlock the next lecture.`;
  }

  if (previousStep.kind === 'post-test') {
    return 'Complete the final post-test to unlock the post-course survey.';
  }

  if (previousStep.kind === 'survey') {
    return 'Complete the post-course survey to unlock the post-test answers and certificate.';
  }

  return `Complete ${previousStep.title} to unlock this step.`;
}

export function getCourseStepModels(state: LearnerProgressState, options: CourseWorkflowOptions = {}): CourseWorkflowStepModel[] {
  if (options.admin) {
    return courseWorkflowSteps.map((step) => {
      const completed = isCourseStepComplete(state, step);

      return {
        ...step,
        completed,
        lockedReason: null,
        percent: getStepPercent(state, step, completed),
        status: completed ? 'completed' : 'available',
        unlocked: true,
      };
    });
  }

  let previousBlockingStep: CourseWorkflowStepDefinition | null = null;
  let priorStepsComplete = true;

  return courseWorkflowSteps.map((step) => {
    const completed = isCourseStepComplete(state, step);
    const unlocked = completed || priorStepsComplete;
    const status = completed ? 'completed' : unlocked && priorStepsComplete ? 'current' : unlocked ? 'available' : 'locked';
    const model: CourseWorkflowStepModel = {
      ...step,
      completed,
      lockedReason: unlocked ? null : getLockedReason(previousBlockingStep),
      percent: getStepPercent(state, step, completed),
      status,
      unlocked,
    };

    if (!completed && priorStepsComplete) {
      previousBlockingStep = step;
      priorStepsComplete = false;
    } else if (!completed) {
      priorStepsComplete = false;
    }

    return model;
  });
}

export function getNextCourseStep(state: LearnerProgressState, options: CourseWorkflowOptions = {}) {
  return getCourseStepModels(state, options).find((step) => step.unlocked && !step.completed) ?? null;
}

export function getLectureModuleProgressSummary(state: LearnerProgressState) {
  const lectureModuleSteps = courseWorkflowSteps.filter((step) =>
    ['lecture', 'assessment', 'post-test', 'survey'].includes(step.kind),
  );
  const completedCount = lectureModuleSteps.filter((step) => isCourseStepComplete(state, step)).length;
  const totalCount = lectureModuleSteps.length;

  return {
    completed: totalCount > 0 && completedCount >= totalCount,
    completedCount,
    percent: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    totalCount,
  };
}

export function getLectureWorkflowStatus(state: LearnerProgressState, lectureId: string, options: CourseWorkflowOptions = {}) {
  return getCourseStepModels(state, options).find((step) => step.lectureId === lectureId) ?? null;
}

export function getAssessmentWorkflowStatus(
  state: LearnerProgressState,
  assessment: CourseAssessmentContent,
  options: CourseWorkflowOptions = {},
) {
  return getCourseStepModels(state, options).find((step) => step.assessmentId === assessment.id) ?? null;
}

export function getUnlockedCourseAssessments(state: LearnerProgressState, options: CourseWorkflowOptions = {}) {
  return courseAssessments.filter((assessment) => getAssessmentWorkflowStatus(state, assessment, options)?.unlocked);
}
