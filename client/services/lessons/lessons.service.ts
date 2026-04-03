import { api } from "@/lib/api";
import type { LessonQuestion } from "@/types/lessons";

export const LessonService = {
  submitAnswer: async (
    questionId: number,
    answer: string,
  ): Promise<LessonQuestion> => {
    const response = await api.post(
      `/api/v1/lessons/questions/${questionId}/grade`,
      {
        answer,
      },
    );
    return response.data;
  },
};
