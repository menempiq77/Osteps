export const calculateAttendancePercent = (
  present: number,
  total: number
): number => {
  return total > 0 ? Math.round((present / total) * 100) : 0;
};

export const calculateNetPoints = (points: number[]): number =>
  points.reduce((total, pointsValue) => total + pointsValue, 0);

export const calculateCompletionRate = (
  completed: number,
  total: number
): number => {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};
