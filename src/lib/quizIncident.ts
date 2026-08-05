export type QuizIncidentContext = "fullscreen" | "screen" | "leave";

export const normalizeIncidentContext = (
  value: unknown
): QuizIncidentContext => {
  if (value === "screen" || value === "leave") return value;
  return "fullscreen";
};
