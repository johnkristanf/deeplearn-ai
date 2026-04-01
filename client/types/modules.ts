import { Lesson } from "./lessons";

export interface Module {
  title: string;
  lessons: Lesson[];
}
