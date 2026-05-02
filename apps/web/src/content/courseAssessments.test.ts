import { describe, expect, it } from 'vitest';

import { finalPostTestAssessment } from '@/content/courseAssessments';
import { pretestContent } from '@/content/pretest';

function getOptionLabels(options: Array<{ label: string }>) {
  return options.map((option) => option.label);
}

describe('course assessment content', () => {
  it('uses the final 25-question set while keeping pretest order and option letters distinct', () => {
    expect(finalPostTestAssessment).not.toBeNull();

    const postTestQuestions = finalPostTestAssessment?.questions ?? [];
    const postTestByPrompt = new Map(postTestQuestions.map((question) => [question.prompt, question]));

    expect(pretestContent.questions).toHaveLength(25);
    expect(postTestQuestions).toHaveLength(25);
    expect(pretestContent.questions.map((question) => question.prompt)).not.toEqual(
      postTestQuestions.map((question) => question.prompt),
    );
    expect(new Set(pretestContent.questions.map((question) => question.prompt))).toEqual(
      new Set(postTestQuestions.map((question) => question.prompt)),
    );
    expect(pretestContent.questions.filter((question) => question.imageAssetKey).map((question) => question.imageAssetKey)).toEqual([
      'ebus-2026-final-station-4r',
      'ebus-2026-final-reverberation',
      'ebus-2026-final-mediastinal-pet',
    ]);
    expect(postTestQuestions.filter((question) => question.imageAsset).map((question) => question.imageAsset?.src)).toEqual([
      '/media/assessments/ebus-2026-final/question-figure-1.png',
      '/media/assessments/ebus-2026-final/question-figure-2.png',
      '/media/assessments/ebus-2026-final/question-figure-3.png',
    ]);

    for (const postTestQuestion of postTestQuestions) {
      expect(postTestQuestion.options).toHaveLength(4);
      expect(postTestQuestion.explanation.length).toBeGreaterThan(0);
      expect(postTestQuestion.options.some((option) => postTestQuestion.correctOptionIds.includes(option.id))).toBe(
        true,
      );
    }

    for (const pretestQuestion of pretestContent.questions) {
      const matchingPostTestQuestion = postTestByPrompt.get(pretestQuestion.prompt);

      expect(matchingPostTestQuestion).toBeDefined();
      expect('explanation' in pretestQuestion).toBe(false);
      expect(pretestQuestion.options).toHaveLength(4);
      expect(pretestQuestion.options.some((option) => option.id === pretestQuestion.correctOptionId)).toBe(true);
      expect(pretestQuestion.correctOptionId).not.toBe(matchingPostTestQuestion?.correctOptionIds[0]);
      expect(new Set(getOptionLabels(pretestQuestion.options))).toEqual(
        new Set(getOptionLabels(matchingPostTestQuestion?.options ?? [])),
      );
      expect(getOptionLabels(pretestQuestion.options)).not.toEqual(
        getOptionLabels(matchingPostTestQuestion?.options ?? []),
      );
    }
  });
});
