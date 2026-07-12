"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Coins,
  LockKeyhole,
  PlayCircle,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button, Progress, Spin, message } from "antd";
import {
  updateTopicStatus,
  fetchTrackerStudentTopics,
  addTopicMark,
} from "@/services/api";
import {
  fetchTrackers,
  fetchStudentTrackerPoints,
} from "@/services/trackersApi";
import { DeadlineCountdown } from "@/components/common/DeadlineCountdown";
import { STUDENT_COINS_UPDATED_EVENT } from "@/components/dashboard/StudentCoinWallet";

interface Status {
  id: number;
  name: string;
}

interface StatusProgress {
  id: number;
  topic_id: number;
  status_id: number;
  is_completed: number;
  status: Status;
}

interface QuizSubmission {
  id: number;
  student_id: number;
  type: string;
  status: string;
  obtained_marks?: number;
}

interface Quiz {
  id: number;
  name: string;
  total_marks?: number;
  submissions?: QuizSubmission[];
}

interface TopicMark {
  id: number;
  student_id: number;
  marks: number;
}

interface Topic {
  id: number;
  tracker_id: number;
  title: string;
  type: string;
  marks?: number;
  quiz_id?: number;
  quiz?: Quiz;
  topic_mark?: TopicMark[];
  status_progress: StatusProgress[];
}

interface TrackerData {
  id: number;
  name: string;
  type: string;
  topics: Topic[];
  claim_certificate?: number;
  status_progress?: Status[];
}

const normalizeProgressOption = (value: string) =>
  String(value || "")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\uFE0F\u200D]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

const playCoinRewardSound = () => {
  if (typeof window === "undefined") return;

  const AudioContextConstructor =
    window.AudioContext ||
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContextConstructor) return;

  const context = new AudioContextConstructor();
  const gain = context.createGain();
  gain.connect(context.destination);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.65);

  [659.25, 783.99, 1046.5].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    oscillator.start(context.currentTime + index * 0.1);
    oscillator.stop(context.currentTime + 0.28 + index * 0.1);
  });

  window.setTimeout(() => void context.close(), 800);
};

export default function TrackerTopicsPage() {
  const { trackerId, classId } = useParams();
  const router = useRouter();
  const [trackerData, setTrackerData] = useState<TrackerData | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [visibleTopics, setVisibleTopics] = useState(10);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [progressPoints, setProgressPoints] = useState<{
    earned_points: number;
    total_points: number;
    percentage: number;
  } | null>(null);

  const [completingTopicId, setCompletingTopicId] = useState<number | null>(
    null
  );
  const [celebration, setCelebration] = useState<{
    topicId: number;
    amount: number;
  } | null>(null);

  const [messageApi, contextHolder] = message.useMessage();
  const isStudent = currentUser?.role === "STUDENT";
  const currentStudentId = Number(currentUser?.student);
  const [deadline, setDeadline] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser?.student || !trackerId) return;
    loadStudentTrackerData();
  }, [trackerId, currentUser?.student]);

  useEffect(() => {
    if (!classId || !trackerId) return;
    (async () => {
      try {
        const list = await fetchTrackers(Number(classId));
        const match = list?.find((t: any) => {
          const id = Number(t?.tracker_id ?? t?.id);
          return id === Number(trackerId);
        });
        const d =
          match?.tracker?.deadline ??
          match?.tracker?.deadline_at ??
          match?.tracker?.deadline_date ??
          match?.tracker?.last_updated ??
          match?.deadline ??
          match?.deadline_at ??
          match?.deadline_date ??
          match?.last_updated ??
          null;
        setDeadline(d ? String(d).slice(0, 10) : null);
      } catch {
        setDeadline(null);
      }
    })();
  }, [classId, trackerId]);


  const loadStudentTrackerData = async (opts?: { showLoading?: boolean }) => {
    try {
      const showLoading = opts?.showLoading ?? true;
      if (showLoading) setLoading(true);
      if (!Number.isFinite(currentStudentId) || currentStudentId <= 0) {
        return;
      }
      const response = await fetchTrackerStudentTopics(
        currentStudentId,
        Number(trackerId)
      );

      let trackerData;
      if (Array.isArray(response)) {
        trackerData = response[0] || { topics: [] };
      } else {
        trackerData = response || { topics: [] };
      }

      setTrackerData(trackerData);
      setTopics(trackerData.topics || []);
    } catch (error) {
      console.error("Failed to load tracker data", error);
    } finally {
      if (opts?.showLoading ?? true) setLoading(false);
    }
  };

  useEffect(() => {
    if (isStudent && trackerId) {
      loadStudentProgressPoints();
    }
  }, [trackerId]);

  const loadStudentProgressPoints = async () => {
    try {
      const data = await fetchStudentTrackerPoints(Number(trackerId));
      setProgressPoints(data);
    } catch (error) {
      console.error("Failed to load progress points", error);
    }
  };

  const getStudentTopicMark = (topic: Topic) =>
    topic.topic_mark?.find(
      (mark) => Number(mark.student_id) === currentStudentId
    );

  const isTopicDone = (topic: Topic) =>
    topic.type !== "quiz" && Boolean(getStudentTopicMark(topic));

  const handleDone = async (topic: Topic) => {
    if (completingTopicId || isTopicDone(topic)) return;

    if (!Number.isFinite(currentStudentId) || currentStudentId <= 0) {
      messageApi.error("Student profile not found");
      return;
    }

    const rawReward = Number(topic.marks ?? 0);
    const reward = Number.isFinite(rawReward) ? Math.max(0, rawReward) : 0;
    setCompletingTopicId(topic.id);

    try {
      const incompleteStatuses = topic.status_progress.filter(
        (status) => status.is_completed !== 1
      );

      await Promise.all(
        incompleteStatuses.map(async (status) => {
          const response = await updateTopicStatus(
            topic.id,
            status.status_id,
            true
          );
          if (Number(response?.status_code ?? 200) >= 400) {
            throw new Error(response?.msg || "Could not update topic progress");
          }
        })
      );
      await addTopicMark(
        topic.id,
        reward,
        currentStudentId,
        Number(trackerId),
        classId ? Number(classId) : undefined
      );

      setTopics((current) =>
        current.map((row) =>
          row.id === topic.id
            ? {
                ...row,
                status_progress: row.status_progress.map((status) => ({
                  ...status,
                  is_completed: 1,
                })),
                topic_mark: [
                  ...(row.topic_mark ?? []).filter(
                    (mark) => Number(mark.student_id) !== currentStudentId
                  ),
                  {
                    id: Date.now(),
                    student_id: currentStudentId,
                    marks: reward,
                  },
                ],
              }
            : row
        )
      );

      playCoinRewardSound();
      setCelebration({ topicId: topic.id, amount: reward });
      window.setTimeout(() => setCelebration(null), 2200);
      window.dispatchEvent(
        new CustomEvent(STUDENT_COINS_UPDATED_EVENT, {
          detail: { amount: reward },
        })
      );
      messageApi.success(`Great work! +${reward} coins added to your pocket.`);

      await Promise.all([
        loadStudentTrackerData({ showLoading: false }),
        loadStudentProgressPoints(),
      ]);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        "Could not complete this topic";
      messageApi.error(errorMessage);
      console.error("Failed to complete tracker topic:", error);
    } finally {
      setCompletingTopicId(null);
    }
  };

  const configuredStatusTypes =
    trackerData?.status_progress?.map((status) => status.name) ?? [];
  const statusTypes = configuredStatusTypes.length
    ? configuredStatusTypes
    : Array.from(
        new Set(
          topics.flatMap((topic) =>
            topic.status_progress.map((status) => status.status.name)
          )
        )
      );
  const learningTopics = topics.filter((topic) => topic.type !== "quiz");
  const quizTopics = topics.filter((topic) => topic.type === "quiz");
  const completedLearningTopics = learningTopics.filter(isTopicDone).length;
  const learningComplete =
    learningTopics.length === 0 ||
    completedLearningTopics === learningTopics.length;
  const isQuizCompleted = (topic: Topic) =>
    topic.quiz?.submissions?.some(
      (submission) =>
        Number(submission.student_id) === currentStudentId &&
        submission.type === "tracker" &&
        submission.status === "completed"
    ) ?? false;
  const completedQuizTopics = quizTopics.filter(isQuizCompleted).length;
  const completedJourneyItems =
    completedLearningTopics + completedQuizTopics;
  const journeyPercent = topics.length
    ? Math.round((completedJourneyItems / topics.length) * 100)
    : 0;

  if (loading && !trackerData)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl p-3 text-slate-900 md:p-6">
      {contextHolder}
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <Button
          onClick={() => router.back()}
          className="flex !h-11 items-center gap-2 !rounded-xl !border-slate-300 !px-4 !text-sm !font-bold !text-slate-700 hover:!border-emerald-600 hover:!text-emerald-700"
        >
          <ArrowLeft size={18} />
          Back to Trackers
        </Button>
        <div className="text-sm font-medium text-slate-700">
          <span className="mr-2 font-bold text-slate-900">Deadline:</span>
          <DeadlineCountdown deadline={deadline} showDate />
        </div>
      </div>

      <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-6 text-white shadow-xl md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-50">
              <Sparkles className="h-5 w-5 text-amber-300" />
              Learning adventure
            </div>
            <h1 className="text-3xl font-black leading-tight text-white md:text-4xl">
              {trackerData?.name || "Tracker Progress"}
            </h1>
            <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-white/90">
              Finish each topic, tap Done once, and earn spendable coins plus
              permanent points.
            </p>
            <div className="mt-6 max-w-2xl">
              <div className="mb-2 flex items-center justify-between text-sm font-extrabold text-white">
                <span>Your journey</span>
                <span>{journeyPercent}%</span>
              </div>
              <Progress
                percent={journeyPercent}
                showInfo={false}
                strokeColor={{ from: "#fbbf24", to: "#fde68a" }}
                trailColor="rgba(255,255,255,0.16)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[390px]">
            <div className="rounded-2xl border border-white/70 bg-white/95 p-4 text-slate-900 shadow-lg backdrop-blur">
              <span className="text-xs font-extrabold uppercase tracking-wide text-slate-600">
                Topics done
              </span>
              <p className="mt-1 text-3xl font-black text-emerald-800">
                {completedLearningTopics}/{learningTopics.length}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-slate-900 shadow-lg backdrop-blur">
              <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-amber-900">
                <Coins className="h-4 w-4" />
                This tracker
              </span>
              <p className="mt-1 text-3xl font-black text-amber-800">
                {(progressPoints?.earned_points ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="col-span-2 rounded-2xl border border-white/70 bg-white/95 p-4 text-slate-900 shadow-lg backdrop-blur sm:col-span-1">
              <span className="text-xs font-extrabold uppercase tracking-wide text-slate-600">
                Available
              </span>
              <p className="mt-1 text-3xl font-black text-teal-800">
                {(progressPoints?.total_points ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {quizTopics.length ? (
        <div
          className={`mb-5 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
            completedQuizTopics === quizTopics.length
              ? "border-emerald-200 bg-emerald-50"
              : learningComplete
                ? "border-violet-200 bg-gradient-to-r from-violet-50 to-amber-50"
                : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                completedQuizTopics === quizTopics.length
                  ? "bg-emerald-600 text-white"
                  : learningComplete
                    ? "bg-violet-600 text-white"
                    : "bg-slate-200 text-slate-500"
              }`}
            >
              {completedQuizTopics === quizTopics.length ? (
                <Trophy className="h-5 w-5" />
              ) : learningComplete ? (
                <PlayCircle className="h-5 w-5" />
              ) : (
                <LockKeyhole className="h-5 w-5" />
              )}
            </span>
            <div>
              <p className="font-black text-slate-800">
                {completedQuizTopics === quizTopics.length
                  ? "Final test completed"
                  : learningComplete
                    ? "Final test unlocked"
                    : "Final test is locked"}
              </p>
              <p className="mt-0.5 text-sm text-slate-600">
                {completedQuizTopics === quizTopics.length
                  ? "Your teacher can now review your result and issue your certificate."
                  : learningComplete
                    ? "You finished every learning topic. You are ready for your teacher's test."
                    : `Complete ${learningTopics.length - completedLearningTopics} more topic${
                        learningTopics.length - completedLearningTopics === 1
                          ? ""
                          : "s"
                      } to unlock it.`}
              </p>
            </div>
          </div>
        </div>
      ) : learningComplete && learningTopics.length ? (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-amber-950">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <p className="font-black text-slate-800">
              All learning topics completed
            </p>
            <p className="mt-0.5 text-sm text-slate-600">
              Your teacher will add the final test before your certificate can
              be issued.
            </p>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-300 bg-slate-100">
              <tr>
                <th className="p-4 text-left text-sm font-extrabold uppercase tracking-wide text-slate-700">
                  Topics
                </th>
                {statusTypes.map((statusName) => (
                  <th
                    key={statusName}
                    className="p-4 text-center text-sm font-extrabold uppercase tracking-wide text-slate-700"
                  >
                    {normalizeProgressOption(statusName)}
                  </th>
                ))}
                <th className="p-4 text-center text-sm font-extrabold uppercase tracking-wide text-slate-700">
                  Reward
                </th>
                <th className="p-4 text-center text-sm font-extrabold uppercase tracking-wide text-slate-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {topics.slice(0, visibleTopics).map((topic, index) => {
                const topicDone = isTopicDone(topic);
                const quizCompleted = isQuizCompleted(topic);
                const quizLocked = topic.type === "quiz" && !learningComplete;
                const rawReward = Number(
                  topic.marks ?? topic.quiz?.total_marks ?? 0
                );
                const reward = Number.isFinite(rawReward) ? rawReward : 0;

                return (
                  <tr
                    key={topic.id ?? `${topic.title}-${index}`}
                    className={`relative transition ${
                      topicDone || quizCompleted
                        ? "bg-emerald-50"
                        : topic.type === "quiz"
                          ? quizLocked
                            ? "bg-slate-50"
                            : "bg-violet-50 hover:bg-violet-100/70"
                          : "bg-white hover:bg-amber-50"
                    }`}
                  >
                    <td className="min-w-[320px] p-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-base font-black shadow-sm ${
                            topicDone || quizCompleted
                              ? "bg-emerald-600 text-white"
                              : topic.type === "quiz"
                                ? "bg-violet-100 text-violet-800"
                                : "border border-slate-200 bg-slate-100 text-slate-700"
                          }`}
                        >
                          {topicDone || quizCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div>
                          <p className="text-base font-extrabold leading-6 text-slate-950">
                            {topic.title || topic.quiz?.name}
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-600">
                            {topic.type === "quiz"
                              ? "Teacher's final test"
                              : topicDone
                                ? "Completed and locked"
                                : "Ready when you finish learning"}
                          </p>
                        </div>
                      </div>
                    </td>
                    {statusTypes.map((statusName) => {
                      const statusProgress = topic.status_progress.find(
                        (status) => status.status.name === statusName
                      );
                      return (
                        <td
                          key={`${topic.id}-${statusName}`}
                          className="p-4 text-center"
                        >
                          {topic.type === "quiz" ? (
                            <span className="text-lg font-bold text-slate-400">—</span>
                          ) : statusProgress?.is_completed === 1 ? (
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">
                              <CheckCircle2 className="h-5 w-5" />
                            </span>
                          ) : (
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-300 bg-white">
                              <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-base font-black shadow-sm ${
                          topicDone
                            ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                            : "border-amber-300 bg-amber-100 text-amber-900"
                        }`}
                      >
                        <Coins className="h-4 w-4" />
                        {topic.type === "quiz"
                          ? quizCompleted
                            ? `${
                                topic.quiz?.submissions?.find(
                                  (submission) =>
                                    Number(submission.student_id) ===
                                      currentStudentId &&
                                    submission.type === "tracker"
                                )?.obtained_marks ?? 0
                              }/${reward}`
                            : reward
                          : topicDone
                            ? `+${getStudentTopicMark(topic)?.marks ?? reward}`
                            : `+${reward}`}
                      </span>
                    </td>
                    <td className="relative p-4 text-center">
                      {topic.type !== "quiz" ? (
                        topicDone ? (
                          <Button
                            disabled
                            icon={<CheckCircle2 className="h-4 w-4" />}
                            className="!h-11 !min-w-[110px] !rounded-xl !border-emerald-300 !bg-white !px-5 !text-sm !font-black !text-emerald-800 !shadow-sm disabled:!opacity-100"
                          >
                            Done
                          </Button>
                        ) : (
                          <Button
                            loading={completingTopicId === topic.id}
                            disabled={!isStudent || completingTopicId !== null}
                            icon={<Coins className="h-4 w-4" />}
                            onClick={() => handleDone(topic)}
                            className="!h-11 !min-w-[110px] !rounded-xl !border-amber-500 !bg-amber-400 !px-5 !text-sm !font-black !text-slate-950 !shadow-[0_8px_20px_rgba(245,158,11,0.28)] hover:!border-amber-600 hover:!bg-amber-300 hover:!text-slate-950 disabled:!border-slate-300 disabled:!bg-slate-200 disabled:!text-slate-500"
                          >
                            Done
                          </Button>
                        )
                      ) : quizCompleted ? (
                        <Button
                          onClick={() =>
                            router.push(
                              `${trackerId}/quiz/${topic.quiz_id}/quiz-result`
                            )
                          }
                          className="!h-10 !rounded-xl !border-emerald-200 !font-bold !text-emerald-700"
                        >
                          View result
                        </Button>
                      ) : quizLocked ? (
                        <Button
                          disabled
                          icon={<LockKeyhole className="h-4 w-4" />}
                          className="!h-10 !rounded-xl !font-bold"
                        >
                          Locked
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          icon={<PlayCircle className="h-4 w-4" />}
                          onClick={() =>
                            router.push(
                              `${trackerId}/quiz/${topic.quiz_id}`
                            )
                          }
                          className="!h-10 !rounded-xl !border-violet-600 !bg-violet-600 !font-black hover:!bg-violet-500"
                        >
                          Start test
                        </Button>
                      )}

                      {celebration?.topicId === topic.id
                        ? [
                            <span
                              key="reward"
                              className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 animate-bounce rounded-full bg-amber-300 px-2 py-0.5 text-xs font-black text-amber-950 shadow-lg"
                            >
                              +{celebration.amount}
                            </span>,
                            ...[0, 1, 2, 3, 4, 5].map((coin) => (
                              <span
                                key={coin}
                                className="pointer-events-none absolute left-1/2 top-1/2 animate-ping text-xl"
                                style={{
                                  marginLeft: `${(coin - 2.5) * 13}px`,
                                  marginTop: `${-28 - (coin % 2) * 12}px`,
                                  animationDelay: `${coin * 80}ms`,
                                }}
                              >
                                🪙
                              </span>
                            )),
                          ]
                        : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-300 bg-slate-100 p-4 text-sm font-medium text-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            Showing {Math.min(visibleTopics, topics.length)} of {topics.length}{" "}
            topics
            <span className="ml-2 font-extrabold text-slate-900">
              Done is final and cannot be undone.
            </span>
          </div>
          {visibleTopics < topics.length ? (
            <Button onClick={() => setVisibleTopics((current) => current + 10)}>
              Load More (10)
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
