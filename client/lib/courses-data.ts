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
  title: string;
  content?: LessonContent;
};

export type Module = {
  id?: string | number;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id?: string | number;
  topic: string;
  description?: string;
  icon?: LucideIcon;
  color?: string;
  modules: Module[];
};

// export const courses: Course[] = [
//   {
//     id: "mathematics",
//     topic: "Mathematics",
//     description:
//       "Master the language of the universe through Algebra, Calculus, and Statistics.",
//     icon: Calculator,
//     color: "text-blue-500",
//     modules: [
//       {
//         id: "algebra",
//         title: "Algebra",
//         lessons: [
//           {
//             id: "variables",
//             title: "Variables & Expressions",
//             url: "/learn/mathematics/algebra/variables",
//           },
//           {
//             id: "equations",
//             title: "Solving Equations",
//             url: "/learn/mathematics/algebra/equations",
//           },
//           {
//             id: "inequalities",
//             title: "Inequalities",
//             url: "/learn/mathematics/algebra/inequalities",
//           },
//           {
//             id: "polynomials",
//             title: "Polynomials",
//             url: "/learn/mathematics/algebra/polynomials",
//           },
//         ],
//       },
//       {
//         id: "calculus",
//         title: "Calculus",
//         lessons: [
//           {
//             id: "limits",
//             title: "Limits & Continuity",
//             url: "/learn/mathematics/calculus/limits",
//           },
//           {
//             id: "derivatives",
//             title: "Derivatives",
//             url: "/learn/mathematics/calculus/derivatives",
//           },
//           {
//             id: "integrals",
//             title: "Integrals",
//             url: "/learn/mathematics/calculus/integrals",
//           },
//         ],
//       },
//       {
//         id: "statistics",
//         title: "Statistics",
//         lessons: [
//           {
//             id: "descriptive",
//             title: "Descriptive Statistics",
//             url: "/learn/mathematics/statistics/descriptive",
//           },
//           {
//             id: "probability",
//             title: "Probability",
//             url: "/learn/mathematics/statistics/probability",
//           },
//           {
//             id: "distributions",
//             title: "Distributions",
//             url: "/learn/mathematics/statistics/distributions",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "science",
//     title: "Science",
//     description:
//       "Explore the natural world with comprehensive Physics, Chemistry, and Biology courses.",
//     icon: Beaker,
//     color: "text-green-500",
//     modules: [
//       {
//         id: "physics",
//         title: "Physics",
//         lessons: [
//           {
//             id: "motion",
//             title: "Laws of Motion",
//             url: "/learn/science/physics/motion",
//           },
//           {
//             id: "energy",
//             title: "Energy & Work",
//             url: "/learn/science/physics/energy",
//           },
//           {
//             id: "waves",
//             title: "Waves & Sound",
//             url: "/learn/science/physics/waves",
//           },
//         ],
//       },
//       {
//         id: "chemistry",
//         title: "Chemistry",
//         lessons: [
//           {
//             id: "atoms",
//             title: "Atoms & Molecules",
//             url: "/learn/science/chemistry/atoms",
//           },
//           {
//             id: "reactions",
//             title: "Chemical Reactions",
//             url: "/learn/science/chemistry/reactions",
//           },
//           {
//             id: "periodic",
//             title: "Periodic Table",
//             url: "/learn/science/chemistry/periodic",
//           },
//         ],
//       },
//       {
//         id: "biology",
//         title: "Biology",
//         lessons: [
//           {
//             id: "cells",
//             title: "Cell Biology",
//             url: "/learn/science/biology/cells",
//           },
//           {
//             id: "genetics",
//             title: "Genetics",
//             url: "/learn/science/biology/genetics",
//           },
//           {
//             id: "evolution",
//             title: "Evolution",
//             url: "/learn/science/biology/evolution",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "computer-science",
//     title: "Computer Science",
//     description:
//       "Build the future with Programming, Data Structures, and Algorithms.",
//     icon: Laptop,
//     color: "text-purple-500",
//     modules: [
//       {
//         id: "programming",
//         title: "Programming",
//         lessons: [
//           {
//             id: "intro",
//             title: "Introduction to Code",
//             url: "/learn/computer-science/programming/intro",
//           },
//           {
//             id: "variables-cs",
//             title: "Variables & Types",
//             url: "/learn/computer-science/programming/variables",
//           },
//           {
//             id: "functions",
//             title: "Functions",
//             url: "/learn/computer-science/programming/functions",
//           },
//           {
//             id: "oop",
//             title: "Object-Oriented Programming",
//             url: "/learn/computer-science/programming/oop",
//           },
//         ],
//       },
//       {
//         id: "data-structures",
//         title: "Data Structures",
//         lessons: [
//           {
//             id: "arrays",
//             title: "Arrays & Lists",
//             url: "/learn/computer-science/data-structures/arrays",
//           },
//           {
//             id: "trees",
//             title: "Trees & Graphs",
//             url: "/learn/computer-science/data-structures/trees",
//           },
//           {
//             id: "hash-maps",
//             title: "Hash Maps",
//             url: "/learn/computer-science/data-structures/hash-maps",
//           },
//         ],
//       },
//       {
//         id: "algorithms",
//         title: "Algorithms",
//         lessons: [
//           {
//             id: "sorting",
//             title: "Sorting Algorithms",
//             url: "/learn/computer-science/algorithms/sorting",
//           },
//           {
//             id: "searching",
//             title: "Searching Algorithms",
//             url: "/learn/computer-science/algorithms/searching",
//           },
//           {
//             id: "dynamic",
//             title: "Dynamic Programming",
//             url: "/learn/computer-science/algorithms/dynamic",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "history",
//     title: "History",
//     description:
//       "Understand our journey from Ancient civilizations to the Modern era.",
//     icon: HistoryIcon,
//     color: "text-amber-500",
//     modules: [
//       {
//         id: "ancient",
//         title: "Ancient History",
//         lessons: [
//           {
//             id: "mesopotamia",
//             title: "Mesopotamia",
//             url: "/learn/history/ancient/mesopotamia",
//           },
//           {
//             id: "egypt",
//             title: "Ancient Egypt",
//             url: "/learn/history/ancient/egypt",
//           },
//           {
//             id: "greece",
//             title: "Ancient Greece",
//             url: "/learn/history/ancient/greece",
//           },
//           {
//             id: "rome",
//             title: "Roman Empire",
//             url: "/learn/history/ancient/rome",
//           },
//         ],
//       },
//       {
//         id: "medieval",
//         title: "Medieval History",
//         lessons: [
//           {
//             id: "feudalism",
//             title: "Feudalism",
//             url: "/learn/history/medieval/feudalism",
//           },
//           {
//             id: "crusades",
//             title: "The Crusades",
//             url: "/learn/history/medieval/crusades",
//           },
//           {
//             id: "renaissance",
//             title: "The Renaissance",
//             url: "/learn/history/medieval/renaissance",
//           },
//         ],
//       },
//       {
//         id: "modern",
//         title: "Modern History",
//         lessons: [
//           {
//             id: "revolutions",
//             title: "Age of Revolutions",
//             url: "/learn/history/modern/revolutions",
//           },
//           {
//             id: "world-wars",
//             title: "World Wars",
//             url: "/learn/history/modern/world-wars",
//           },
//           {
//             id: "cold-war",
//             title: "Cold War Era",
//             url: "/learn/history/modern/cold-war",
//           },
//         ],
//       },
//     ],
//   },
// ];
