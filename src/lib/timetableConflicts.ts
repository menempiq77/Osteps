export interface SlotLike {
  id?: number | string;
  day_of_week: string;        // e.g. "Monday"
  start_time: string;         // "HH:mm" or "HH:mm:ss"
  end_time: string;
  teacher_id?: number | null;
  class_id?: number | null;
  room?: string | null;
  subject_id?: number | null;
}

export interface Conflict {
  type: "teacher" | "class" | "room";
  message: string;
  conflictingSlotId?: number | string;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function overlaps(
  startA: string, endA: string,
  startB: string, endB: string
): boolean {
  const sA = toMinutes(startA);
  const eA = toMinutes(endA);
  const sB = toMinutes(startB);
  const eB = toMinutes(endB);
  return sA < eB && eA > sB;
}

/** Detects scheduling conflicts between a candidate slot and existing slots. */
export function detectConflicts(
  allSlots: SlotLike[],
  candidate: SlotLike
): Conflict[] {
  const conflicts: Conflict[] = [];

  const peers = allSlots.filter(
    (s) =>
      s.id !== candidate.id &&
      s.day_of_week === candidate.day_of_week &&
      overlaps(candidate.start_time, candidate.end_time, s.start_time, s.end_time)
  );

  for (const peer of peers) {
    if (
      candidate.teacher_id &&
      peer.teacher_id &&
      candidate.teacher_id === peer.teacher_id
    ) {
      conflicts.push({
        type: "teacher",
        message: `Teacher already has a slot at this time on ${candidate.day_of_week}`,
        conflictingSlotId: peer.id,
      });
    }

    if (
      candidate.class_id &&
      peer.class_id &&
      candidate.class_id === peer.class_id
    ) {
      conflicts.push({
        type: "class",
        message: `Class already has a slot at this time on ${candidate.day_of_week}`,
        conflictingSlotId: peer.id,
      });
    }

    if (
      candidate.room &&
      peer.room &&
      candidate.room.trim().toLowerCase() === peer.room.trim().toLowerCase()
    ) {
      conflicts.push({
        type: "room",
        message: `Room "${candidate.room}" is already in use at this time on ${candidate.day_of_week}`,
        conflictingSlotId: peer.id,
      });
    }
  }

  return conflicts;
}

/** Returns true if a slot has any hard conflict (teacher/class). */
export function hasHardConflict(conflicts: Conflict[]): boolean {
  return conflicts.some((c) => c.type === "teacher" || c.type === "class");
}

/** Returns true if a slot has only soft (room) conflicts. */
export function hasSoftConflict(conflicts: Conflict[]): boolean {
  return conflicts.length > 0 && !hasHardConflict(conflicts);
}
