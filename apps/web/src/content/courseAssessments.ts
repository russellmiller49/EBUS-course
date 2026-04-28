import courseAssessmentData from '../../../../content/course/course-assessments.json';

import type { CourseAssessmentContent } from '@/content/types';

export const courseAssessments = courseAssessmentData.assessments as CourseAssessmentContent[];

export const postLectureCourseAssessments = courseAssessments.filter(
  (assessment) => assessment.kind === 'post-lecture-quiz',
);

export const finalPostTestAssessment = courseAssessments.find((assessment) => assessment.kind === 'post-test') ?? null;

export function getCourseAssessmentById(assessmentId: string): CourseAssessmentContent | undefined {
  return courseAssessments.find((assessment) => assessment.id === assessmentId);
}
