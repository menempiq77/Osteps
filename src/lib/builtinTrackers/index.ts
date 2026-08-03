import { getSubjectFamilyKey } from "@/lib/subjectSimilarity";
import type { BuiltInLesson, BuiltInTracker } from "./types";
import { PROPHETS_PART_1 } from "./prophets/part1";
import { PROPHETS_PART_2 } from "./prophets/part2";
import { PROPHETS_PART_3 } from "./prophets/part3";
import { PROPHETS_PART_4 } from "./prophets/part4";
import { PROPHETS_PART_5 } from "./prophets/part5";

export type { BuiltInLesson, BuiltInTracker, BuiltInQuizQuestion } from "./types";

export const STORIES_OF_THE_PROPHETS_ID = "stories-of-the-prophets";

export const QUESTIONS_PER_LESSON = 10;

const PROPHETS: BuiltInLesson[] = [
  ...PROPHETS_PART_1,
  ...PROPHETS_PART_2,
  ...PROPHETS_PART_3,
  ...PROPHETS_PART_4,
  ...PROPHETS_PART_5,
];

export const STORIES_OF_THE_PROPHETS: BuiltInTracker = {
  id: STORIES_OF_THE_PROPHETS_ID,
  name: "Stories of the Prophets",
  description:
    "Read the story of each of the 25 prophets mentioned in the Qur'an, then answer 10 questions to earn coins.",
  emoji: "📖",
  accent: "from-emerald-500 to-teal-600",
  lessonLabel: "Prophet",
  lessonLabelPlural: "Prophets",
  passMark: 7,
  coinReward: 15,
  lessons: PROPHETS,
};

export const BUILT_IN_TRACKERS: BuiltInTracker[] = [STORIES_OF_THE_PROPHETS];

export const getBuiltInTracker = (
  trackerId: string | undefined | null
): BuiltInTracker | undefined =>
  BUILT_IN_TRACKERS.find((tracker) => tracker.id === String(trackerId ?? ""));

export const getBuiltInLesson = (
  tracker: BuiltInTracker | undefined,
  lessonId: string | undefined | null
): BuiltInLesson | undefined =>
  tracker?.lessons.find((lesson) => lesson.id === String(lessonId ?? ""));

export const supportsBuiltInTrackers = (subjectName: unknown): boolean =>
  getSubjectFamilyKey(subjectName) === "islamic";
