import { api } from "@/lib/api";

export interface GenerateCoursePayload {
  topic: string;
}

export const CourseService = {
  generateCourse: async (payload: GenerateCoursePayload) => {
    const response = await api.post("/api/v1/courses/generate", payload);
    return response.data;
  },
};
