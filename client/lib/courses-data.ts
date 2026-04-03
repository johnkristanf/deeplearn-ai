import {
  Calculator,
  Beaker,
  Laptop,
  History as HistoryIcon,
  LucideIcon,
} from "lucide-react";

export type LessonContent = {
  hook: string;
  objectives: string[];
  lecture: string;
  analogy: string;
  real_world_example: string;
  summary: string;
};

export type Lesson = {
  id?: string | number;
  tag?: string;
  title: string;
  content?: LessonContent;
};

export type Module = {
  id?: string | number;
  tag?: string;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id?: string | number;
  tag?: string;
  topic: string;
  description?: string;
  icon?: LucideIcon;
  color?: string;
  modules: Module[];
};

