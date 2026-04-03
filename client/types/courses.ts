import { Module } from "./modules";

export interface GenerateCoursePayload {
  topic: string;
}

export interface CourseResponse {
  id?: number;
  tag?: string;
  topic: string;
  is_active: boolean;
  modules: Module[];
}

export interface CourseSavePayload {
  user_id?: string;
  course: CourseResponse;
}
