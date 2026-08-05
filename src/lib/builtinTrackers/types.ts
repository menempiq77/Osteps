export type BuiltInQuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

export type BuiltInLesson = {
  id: string;
  name: string;
  arabicName: string;
  title: string;
  emoji: string;
  accent: string;
  summary: string;
  story: string[];
  lessons: string[];
  questions: BuiltInQuizQuestion[];
};

export type BuiltInTracker = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  accent: string;
  lessonLabel: string;
  lessonLabelPlural: string;
  passMark: number;
  coinReward: number;
  courseKey?: string;
  lessons: BuiltInLesson[];
};
