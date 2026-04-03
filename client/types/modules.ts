import { Lesson } from "./lessons";

export interface Module {
  title: string;
  tag?: string;
  lessons: Lesson[];
}
