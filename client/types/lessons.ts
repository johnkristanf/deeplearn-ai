export interface LessonContent {
  hook: string;
  objectives: string[];
  lecture: string;
  analogy: string;
  real_world_example: string;
  summary: string;
}

export interface Lesson {
  title: string;
  content?: LessonContent;
}
