export interface CourseSurveyItem {
  id: string;
  label: string;
  options: string[];
}

export const preCourseSurveyItems: CourseSurveyItem[] = [
  {
    id: 'baseline-confidence',
    label: 'Current confidence with cpEBUS fundamentals',
    options: ['High', 'Moderate', 'Low'],
  },
  {
    id: 'prior-exposure',
    label: 'Prior EBUS exposure before this course',
    options: ['Observed only', 'Performed with supervision', 'Independent basic cases'],
  },
  {
    id: 'primary-goal',
    label: 'Primary goal for the prep curriculum',
    options: ['Station recognition', 'Sampling technique', 'TNM staging workflow'],
  },
];

export const postCourseSurveyItems: CourseSurveyItem[] = [
  {
    id: 'confidence',
    label: 'Confidence after the course',
    options: ['More confident with cpEBUS fundamentals', 'About the same', 'Less confident'],
  },
  {
    id: 'pacing',
    label: 'Online curriculum pacing',
    options: ['About right', 'Too compressed', 'Too slow'],
  },
  {
    id: 'readiness',
    label: 'Readiness for the live simulation day',
    options: ['Ready to practice deliberately', 'Need more review time', 'Unsure'],
  },
];
