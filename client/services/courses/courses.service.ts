import { api } from "@/lib/api";
import type {
  GenerateCoursePayload,
  CourseResponse,
  CourseSavePayload,
} from "@/types/courses";

export const CourseService = {
  generateCourse: async (
    payload: GenerateCoursePayload,
  ): Promise<CourseResponse> => {
    const response = await api.post("/api/v1/courses/generate", payload);
    return response.data;
  },
  saveCourse: async (
    payload: CourseSavePayload,
  ): Promise<{ status: string }> => {
    const response = await api.post("/api/v1/courses/save", payload);
    return response.data;
  },
  getCourses: async (): Promise<CourseResponse[]> => {
    const response = await api.get("/api/v1/courses");
    return response.data;
  },
};
