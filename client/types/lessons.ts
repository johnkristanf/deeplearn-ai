export interface LessonContent {
  hook: string;
  objectives: string[];
  lecture: string;
  analogy: string;
  real_world_example: string;
  summary: string;
}

export interface LessonQuestion {
  id: number;
  question: string;
  answer?: string;
  score?: number;
  order: number;
}

export interface Lesson {
  id: number;
  tag?: string;
  title: string;
  content?: LessonContent;
  questions?: LessonQuestion[];
}
