import modulesData from '@/content/modules/modules.json';
import quizBankData from '@/content/modules/quiz-bank.json';
import stationsData from '@/content/stations/core-stations.json';
import courseInfoData from '@/content/course/course-info.json';
import type { CourseInfoContent, ModuleContent, ModuleId, QuizQuestionContent, StationContent } from '@/lib/types';

const modules = modulesData as ModuleContent[];
const stations = stationsData as StationContent[];
const quizBank = quizBankData as QuizQuestionContent[];
const courseInfo = courseInfoData as CourseInfoContent;

export function getModules(): ModuleContent[] {
  return modules;
}

export function getModuleBySlug(slug: string): ModuleContent | undefined {
  return modules.find((module) => module.slug === slug);
}

export function getModuleById(moduleId: ModuleId): ModuleContent | undefined {
  return modules.find((module) => module.id === moduleId);
}

export function getStations(): StationContent[] {
  return stations;
}

export function getStationById(stationId: string): StationContent | undefined {
  return stations.find((station) => station.id === stationId);
}

export function getQuizQuestions(moduleId?: ModuleId): QuizQuestionContent[] {
  if (!moduleId) {
    return quizBank;
  }

  return quizBank.filter((question) => question.moduleId === moduleId);
}

export function getCourseInfo(): CourseInfoContent {
  return courseInfo;
}
