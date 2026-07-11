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
      const response = await fetchTrackerStudentTopics(
        currentUser?.student,
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
    <div className="mx-auto max-w-7xl p-3 md:p-6">
      {contextHolder}
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:!border-green-500 hover:!text-green-500"
        >
          <ArrowLeft size={18} />
          Back to Trackers
        </Button>
        <div className="text-sm text-gray-600">
          <span className="mr-2 font-medium text-gray-700">Deadline:</span>
          <DeadlineCountdown deadline={deadline} showDate />
        </div>
      </div>

      <section className="relative mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-600 p-5 text-white shadow-xl md:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Learning adventure
            </div>
            <h1 className="text-2xl font-black md:text-3xl">
              {trackerData?.name || "Tracker Progress"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-100">
              Finish each topic, tap Done once, and collect its coins. Every
              coin also counts toward your leaderboard score.
            </p>
            <div className="mt-5 max-w-2xl">
              <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-emerald-100">
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
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200">
                Topics done
              </span>
              <p className="mt-1 text-2xl font-black">
                {completedLearningTopics}/{learningTopics.length}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200/25 bg-amber-300/15 p-3 backdrop-blur">
              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-200">
                <Coins className="h-3.5 w-3.5" />
                This tracker
              </span>
              <p className="mt-1 text-2xl font-black text-amber-100">
                {(progressPoints?.earned_points ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="col-span-2 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur sm:col-span-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200">
                Available
              </span>
              <p className="mt-1 text-2xl font-black">
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

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                  Topics
                </th>
                {statusTypes.map((statusName) => (
                  <th
                    key={statusName}
                    className="p-4 text-center text-xs font-black uppercase tracking-wider text-slate-500"
                  >
                    {normalizeProgressOption(statusName)}
                  </th>
                ))}
                <th className="p-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                  Reward
                </th>
                <th className="p-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
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
                        ? "bg-emerald-50/50"
                        : topic.type === "quiz"
                          ? quizLocked
                            ? "bg-slate-50/70"
                            : "bg-violet-50/60 hover:bg-violet-50"
                          : "hover:bg-amber-50/40"
                    }`}
                  >
                    <td className="min-w-[280px] p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-black ${
                            topicDone || quizCompleted
                              ? "bg-emerald-600 text-white"
                              : topic.type === "quiz"
                                ? "bg-violet-100 text-violet-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {topicDone || quizCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {topic.title || topic.quiz?.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
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
                            <span className="text-slate-300">—</span>
                          ) : statusProgress?.is_completed === 1 ? (
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                              <CheckCircle2 className="h-4 w-4" />
                            </span>
                          ) : (
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-200 bg-white">
                              <span className="h-2 w-2 rounded-full bg-slate-300" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-black ${
                          topicDone
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-800"
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
                            className="!h-10 !rounded-xl !border-emerald-200 !bg-emerald-50 !px-5 !font-black !text-emerald-700 disabled:!opacity-100"
                          >
                            Done
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            loading={completingTopicId === topic.id}
                            disabled={!isStudent || completingTopicId !== null}
                            icon={<Coins className="h-4 w-4" />}
                            onClick={() => handleDone(topic)}
                            className="!h-10 !rounded-xl !border-amber-400 !bg-gradient-to-r !from-amber-400 !to-yellow-500 !px-5 !font-black !text-amber-950 !shadow-[0_8px_20px_rgba(245,158,11,0.25)] hover:!from-amber-300 hover:!to-yellow-400"
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

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            Showing {Math.min(visibleTopics, topics.length)} of {topics.length}{" "}
            topics
            <span className="ml-2 font-semibold text-slate-600">
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
