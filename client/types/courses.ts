import { Module } from "./modules";

export interface GenerateCoursePayload {
  topic: string;
}

export interface CourseResponse {
  id?: number;
  topic: string;
  modules: Module[];
}

export interface CourseSavePayload {
  user_id?: string;
  course: CourseResponse;
}
