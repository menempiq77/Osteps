"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { fetchTrackerStudentTopics } from "@/services/api";
import { fetchQuizQuestions } from "@/services/quizApi";
import { fetchStudentProfileData } from "@/services/studentsApi";
import { fetchTrackers } from "@/services/trackersApi";
import { RootState } from "@/store/store";

export type ArcadeQuestionOption = {
  id: string;
  text: string;
  correct: boolean;
};

export type ArcadeQuestion = {
  id: string;
  prompt: string;
  options: ArcadeQuestionOption[];
  sourceLabel: string;
};

type RawRecord = Record<string, unknown>;

const PREVIEW_QUESTIONS: ArcadeQuestion[] = [
  {
    id: "preview-1",
    prompt: "What is 7 + 5?",
    sourceLabel: "Admin preview",
    options: [
      { id: "a", text: "10", correct: false },
      { id: "b", text: "11", correct: false },
      { id: "c", text: "12", correct: true },
      { id: "d", text: "13", correct: false },
    ],
  },
  {
    id: "preview-2",
    prompt: "How many sides does a triangle have?",
    sourceLabel: "Admin preview",
    options: [
      { id: "a", text: "Three", correct: true },
      { id: "b", text: "Four", correct: false },
      { id: "c", text: "Five", correct: false },
      { id: "d", text: "Six", correct: false },
    ],
  },
  {
    id: "preview-3",
    prompt: "Which word means the same as “rapid”?",
    sourceLabel: "Admin preview",
    options: [
      { id: "a", text: "Quiet", correct: false },
      { id: "b", text: "Fast", correct: true },
      { id: "c", text: "Heavy", correct: false },
      { id: "d", text: "Late", correct: false },
    ],
  },
  {
    id: "preview-4",
    prompt: "At what temperature does water freeze in Celsius?",
    sourceLabel: "Admin preview",
    options: [
      { id: "a", text: "0°C", correct: true },
      { id: "b", text: "10°C", correct: false },
      { id: "c", text: "50°C", correct: false },
      { id: "d", text: "100°C", correct: false },
    ],
  },
  {
    id: "preview-5",
    prompt: "What is 9 × 4?",
    sourceLabel: "Admin preview",
    options: [
      { id: "a", text: "32", correct: false },
      { id: "b", text: "36", correct: true },
      { id: "c", text: "40", correct: false },
      { id: "d", text: "45", correct: false },
    ],
  },
  {
    id: "preview-6",
    prompt: "Which planet is our home?",
    sourceLabel: "Admin preview",
    options: [
      { id: "a", text: "Mars", correct: false },
      { id: "b", text: "Venus", correct: false },
      { id: "c", text: "Earth", correct: true },
      { id: "d", text: "Jupiter", correct: false },
    ],
  },
  {
    id: "preview-7",
    prompt: "What is the plural of “child”?",
    sourceLabel: "Admin preview",
    options: [
      { id: "a", text: "Childs", correct: false },
      { id: "b", text: "Childes", correct: false },
      { id: "c", text: "Children", correct: true },
      { id: "d", text: "Childrens", correct: false },
    ],
  },
  {
    id: "preview-8",
    prompt: "Which value is equal to one half?",
    sourceLabel: "Admin preview",
    options: [
      { id: "a", text: "0.2", correct: false },
      { id: "b", text: "0.5", correct: true },
      { id: "c", text: "1.5", correct: false },
      { id: "d", text: "2.0", correct: false },
    ],
  },
];

const asRecord = (value: unknown): RawRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as RawRecord)
    : {};

const asArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const numberValue = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const textValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const nestedRecord = (record: RawRecord, key: string) => asRecord(record[key]);

const extractStudentClassId = (
  profileValue: unknown,
  fallbackValue: unknown,
) => {
  const profile = asRecord(profileValue);
  const subjectContext = nestedRecord(profile, "subject_context");
  const subjectClass = nestedRecord(profile, "subject_class");
  const profileClass = nestedRecord(profile, "class");
  const student = nestedRecord(profile, "student");
  const studentClass = nestedRecord(student, "class");

  return (
    numberValue(subjectContext.class_id) ??
    numberValue(subjectContext.base_class_id) ??
    numberValue(subjectClass.class_id) ??
    numberValue(subjectClass.base_class_id) ??
    numberValue(profile.class_id) ??
    numberValue(profileClass.id) ??
    numberValue(student.class_id) ??
    numberValue(studentClass.id) ??
    numberValue(fallbackValue)
  );
};

const trackerIdFromAssignment = (value: unknown) => {
  const row = asRecord(value);
  const tracker = nestedRecord(row, "tracker");
  return (
    numberValue(row.tracker_id) ??
    numberValue(tracker.id) ??
    numberValue(row.id)
  );
};

const trackerFromStudentResponse = (value: unknown) => {
  if (Array.isArray(value)) return asRecord(value[0]);
  return asRecord(value);
};

const completedQuizTopics = (value: unknown) => {
  const tracker = trackerFromStudentResponse(value);
  return asArray(tracker.topics)
    .map(asRecord)
    .filter((topic) =>
      asArray(topic.status_progress)
        .map(asRecord)
        .some(
          (progress) =>
            progress.is_completed === true ||
            Number(progress.is_completed) === 1,
        ),
    )
    .map((topic) => {
      const quiz = nestedRecord(topic, "quiz");
      const quizId = numberValue(topic.quiz_id) ?? numberValue(quiz.id);
      if (!quizId) return null;
      return {
        quizId,
        topicTitle:
          textValue(topic.title) ||
          textValue(topic.name) ||
          `Completed topic ${quizId}`,
      };
    })
    .filter(
      (
        topic,
      ): topic is {
        quizId: number;
        topicTitle: string;
      } => topic !== null,
    );
};

const normalizeQuizQuestions = (
  responseValue: unknown,
  quizId: number,
  topicTitle: string,
) => {
  const response = asRecord(responseValue);
  const rows = Array.isArray(responseValue)
    ? asArray(responseValue)
    : asArray(response.quiz_queston);

  return rows
    .map(asRecord)
    .filter((question) =>
      ["multiple_choice", "drop_down"].includes(
        textValue(question.type).toLowerCase(),
      ),
    )
    .map((question): ArcadeQuestion | null => {
      const questionId = numberValue(question.id);
      const prompt = textValue(question.question_text);
      const options = asArray(question.options)
        .map(asRecord)
        .map((option, index) => ({
          id: String(numberValue(option.id) ?? `${quizId}-${index}`),
          text: textValue(option.option_text),
          correct:
            option.is_correct === true || Number(option.is_correct) === 1,
        }))
        .filter((option) => option.text.length > 0);

      if (
        !questionId ||
        !prompt ||
        options.length < 2 ||
        !options.some((option) => option.correct)
      ) {
        return null;
      }

      return {
        id: `${quizId}-${questionId}`,
        prompt,
        options,
        sourceLabel: topicTitle,
      };
    })
    .filter((question): question is ArcadeQuestion => question !== null);
};

const loadCompletedTopicQuestions = async (options: {
  studentId: number;
  fallbackClassId: number | null;
  subjectId: number | null;
}) => {
  let profile: unknown = {};
  try {
    profile = await fetchStudentProfileData(
      options.studentId,
      options.subjectId ?? undefined,
    );
  } catch {
    profile = {};
  }
  const classId = extractStudentClassId(profile, options.fallbackClassId);
  if (!classId) return [];

  const trackerRows = await fetchTrackers(
    classId,
    options.subjectId ?? undefined,
  );
  const trackerIds = Array.from(
    new Set(
      asArray(trackerRows)
        .map(trackerIdFromAssignment)
        .filter((id): id is number => id !== null),
    ),
  );
  if (trackerIds.length === 0) return [];

  const topicResults = await Promise.allSettled(
    trackerIds.map((trackerId) =>
      fetchTrackerStudentTopics(options.studentId, trackerId),
    ),
  );
  const completedTopics = topicResults.flatMap((result) =>
    result.status === "fulfilled" ? completedQuizTopics(result.value) : [],
  );
  const uniqueTopics = Array.from(
    new Map(
      completedTopics.map((topic) => [String(topic.quizId), topic]),
    ).values(),
  );

  const questionResults = await Promise.allSettled(
    uniqueTopics.map(async (topic) => ({
      topic,
      response: await fetchQuizQuestions(
        topic.quizId,
        options.subjectId ?? undefined,
      ),
    })),
  );
  const questions = questionResults.flatMap((result) =>
    result.status === "fulfilled"
      ? normalizeQuizQuestions(
          result.value.response,
          result.value.topic.quizId,
          result.value.topic.topicTitle,
        )
      : [],
  );

  return Array.from(
    new Map(questions.map((question) => [question.id, question])).values(),
  );
};

export default function useArcadeQuestionPool() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const {
    activeSubjectId,
    activeSubject,
    loading: subjectContextLoading,
    canUseSubjectContext,
  } = useSubjectContext();
  const role = String(currentUser?.role ?? "").toUpperCase();
  const isStudent = role === "STUDENT";
  const studentId = numberValue(currentUser?.student);
  const fallbackClassId = numberValue(currentUser?.studentClass);

  const query = useQuery({
    queryKey: [
      "arcade-completed-topic-questions",
      studentId,
      fallbackClassId,
      activeSubjectId,
    ],
    queryFn: () =>
      loadCompletedTopicQuestions({
        studentId: studentId ?? 0,
        fallbackClassId,
        subjectId: activeSubjectId,
      }),
    enabled:
      isStudent &&
      Boolean(studentId) &&
      (!canUseSubjectContext || !subjectContextLoading),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  return {
    questions: isStudent ? (query.data ?? []) : PREVIEW_QUESTIONS,
    isLoading:
      isStudent &&
      (query.isLoading || (canUseSubjectContext && subjectContextLoading)),
    errorMessage:
      isStudent && query.isError
        ? "Completed-topic questions could not be loaded. Check your connection and try again."
        : null,
    isPreview: !isStudent,
    subjectName: activeSubject?.name ?? null,
    refreshQuestions: () =>
      isStudent && (!canUseSubjectContext || !subjectContextLoading)
        ? query.refetch()
        : Promise.resolve(),
  };
}
