import { Module } from "./modules";

export interface GenerateCoursePayload {
  topic: string;
}

export interface CourseResponse {
  topic: string;
  modules: Module[];
}

export interface CourseSavePayload {
  user_id?: string;
  course: CourseResponse;
}
