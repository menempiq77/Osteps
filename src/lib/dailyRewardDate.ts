export const DAILY_REWARD_TIME_ZONE = "Asia/Dubai";

const DAILY_REWARD_UTC_OFFSET_MS = 4 * 60 * 60 * 1000;

export const getDailyRewardDate = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: DAILY_REWARD_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: "year" | "month" | "day") =>
    parts.find((candidate) => candidate.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
};

export const millisecondsUntilNextDailyRewardDay = () => {
  const [year, month, day] = getDailyRewardDate().split("-").map(Number);
  const nextMidnight =
    Date.UTC(year, month - 1, day + 1) - DAILY_REWARD_UTC_OFFSET_MS;
  return Math.max(1000, nextMidnight - Date.now() + 1000);
};
