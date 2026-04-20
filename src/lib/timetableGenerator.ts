/**
 * Timetable Generator — Greedy + Backtracking Constraint-Satisfaction Algorithm
 *
 * Generates a whole-school timetable given:
 *   - Years & classes
 *   - Subjects with period-per-week allocations per year group
 *   - Teachers with subject expertise, max load, and availability
 *   - Configurable constraints (consecutive limits, room needs, split classes)
 *
 * Runs entirely client-side. Designed for ~500-2000 lessons.
 */

import type { SchoolPeriod } from "./schoolPeriods";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

export interface GenYear {
  id: string;
  name: string;
  classes: GenClass[];
}

export interface GenClass {
  id: string;
  name: string;
  yearId: string;
}

export interface GenSubjectAllocation {
  subjectId: string;
  subjectName: string;
  yearId: string;
  periodsPerWeek: number;
  /** optional room requirement, e.g. "Science Lab" */
  room?: string;
}

export interface GenTeacher {
  id: string;
  name: string;
  /** IDs of subjects this teacher can teach */
  subjectIds: string[];
  /** Max teaching periods per week */
  maxPeriodsPerWeek: number;
  /**
   * Availability grid.  Key = day name (e.g. "Sunday"), value = array of
   * booleans aligned with the teaching-periods array (true = available).
   * If a day key is missing, teacher is available for all periods that day.
   */
  availability: Record<string, boolean[]>;
}

export interface GenSplitClassRule {
  classId: string;
  subjectId: string;
  /** How many groups the class is split into for this subject */
  groups: number;
}

export interface GenConstraints {
  /** Max consecutive teaching periods for a single teacher (default 4) */
  maxConsecutivePerTeacher: number;
  /** Try to spread a subject's lessons across different days (default true) */
  spreadSubjectsAcrossDays: boolean;
  /** Split-class rules */
  splitClassRules: GenSplitClassRule[];
  /** Max backtrack depth before giving up on a branch (default 200) */
  maxBacktrackDepth: number;
}

export interface GeneratorInput {
  years: GenYear[];
  allocations: GenSubjectAllocation[];
  teachers: GenTeacher[];
  periods: SchoolPeriod[];
  /** School days, e.g. ["Sunday","Monday","Tuesday","Wednesday","Thursday"] */
  days: string[];
  constraints: GenConstraints;
}

export interface GeneratorSlot {
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  yearId: string;
  classId: string;
  className: string;
  day: string;
  periodIndex: number;
  periodLabel: string;
  startTime: string;
  endTime: string;
  room: string;
  /** Group number (1-based) if class is split, else 0 */
  group: number;
}

export interface UnplacedLesson {
  subjectName: string;
  yearId: string;
  classId: string;
  className: string;
  reason: string;
  group: number;
}

export interface GeneratorOutput {
  slots: GeneratorSlot[];
  unplaced: UnplacedLesson[];
  stats: {
    totalLessons: number;
    placed: number;
    unplacedCount: number;
    teacherUtilization: Record<string, { assigned: number; max: number }>;
    durationMs: number;
  };
}

export type ProgressCallback = (pct: number, message: string) => void;

// ────────────────────────────────────────────────────────────────────────────
// Internal types
// ────────────────────────────────────────────────────────────────────────────

interface Lesson {
  id: number;
  subjectId: string;
  subjectName: string;
  yearId: string;
  classId: string;
  className: string;
  room: string;
  group: number; // 0 = no split
  /** Candidate teachers (ids) who can teach this subject */
  candidateTeacherIds: string[];
}

interface SlotCoord {
  dayIdx: number;
  periodIdx: number;
}

interface Assignment {
  lessonId: number;
  teacherId: string;
  dayIdx: number;
  periodIdx: number;
}

// ────────────────────────────────────────────────────────────────────────────
// Default constraints
// ────────────────────────────────────────────────────────────────────────────

export const DEFAULT_CONSTRAINTS: GenConstraints = {
  maxConsecutivePerTeacher: 4,
  spreadSubjectsAcrossDays: true,
  splitClassRules: [],
  maxBacktrackDepth: 200,
};

// ────────────────────────────────────────────────────────────────────────────
// Main entry
// ────────────────────────────────────────────────────────────────────────────

export function generateTimetable(
  input: GeneratorInput,
  onProgress?: ProgressCallback,
): GeneratorOutput {
  const t0 = performance.now();

  const teachingPeriods = input.periods.filter((p) => p.isTeaching);
  const days = input.days;
  const constraints = { ...DEFAULT_CONSTRAINTS, ...input.constraints };
  const teacherMap = new Map(input.teachers.map((t) => [t.id, t]));

  // ── 1. Expand allocations into individual lessons ──────────────────────

  onProgress?.(5, "Expanding lessons…");

  const lessons = expandLessons(input, teacherMap);
  const totalLessons = lessons.length;

  if (totalLessons === 0) {
    return emptyOutput(0, performance.now() - t0);
  }

  // ── 2. Build occupancy grids ───────────────────────────────────────────

  // teacher  → [dayIdx][periodIdx] = lessonId | null
  const teacherGrid: Map<string, (number | null)[][]> = new Map();
  for (const t of input.teachers) {
    teacherGrid.set(
      t.id,
      days.map(() => teachingPeriods.map(() => null)),
    );
  }

  // class(+group) → [dayIdx][periodIdx] = lessonId | null
  const classGrid: Map<string, (number | null)[][]> = new Map();
  for (const yr of input.years) {
    for (const cls of yr.classes) {
      classGrid.set(
        cls.id,
        days.map(() => teachingPeriods.map(() => null)),
      );
      // split groups get separate grids keyed as "classId:group"
      for (const rule of constraints.splitClassRules) {
        if (rule.classId === cls.id) {
          for (let g = 1; g <= rule.groups; g++) {
            const key = `${cls.id}:${g}`;
            if (!classGrid.has(key)) {
              classGrid.set(
                key,
                days.map(() => teachingPeriods.map(() => null)),
              );
            }
          }
        }
      }
    }
  }

  // room → [dayIdx][periodIdx] = lessonId | null  (only for lessons with room)
  const roomGrid: Map<string, (number | null)[][]> = new Map();

  // track teacher period count
  const teacherPeriodCount: Map<string, number> = new Map();
  for (const t of input.teachers) {
    teacherPeriodCount.set(t.id, 0);
  }

  // track subject-per-class-per-day for spreading
  // key = `${classId}:${subjectId}` → Set of dayIdx
  const subjectDaysMap: Map<string, Set<number>> = new Map();

  // ── 3. Sort lessons by MRV (most constrained first) ───────────────────

  onProgress?.(10, "Sorting by constraints…");

  sortByMRV(lessons, days, teachingPeriods, teacherMap, constraints);

  // ── 4. Greedy + backtracking assignment ────────────────────────────────

  const assignments: Assignment[] = [];
  const unplaced: UnplacedLesson[] = [];
  let backtracks = 0;

  // Stack-based iterative assignment with backtracking
  let cursor = 0;
  const tried: Map<number, Set<string>>[] = []; // per-cursor: set of "dI:pI:tId" tried

  while (cursor < lessons.length) {
    const pct = 15 + Math.round((cursor / lessons.length) * 75);
    if (cursor % 20 === 0) {
      onProgress?.(pct, `Placing lesson ${cursor + 1}/${lessons.length}…`);
    }

    const lesson = lessons[cursor];
    if (!tried[cursor]) tried[cursor] = new Map();
    const triedSet = tried[cursor].get(lesson.id) ?? new Set<string>();
    tried[cursor].set(lesson.id, triedSet);

    const result = findBestSlot(
      lesson,
      days,
      teachingPeriods,
      teacherMap,
      teacherGrid,
      classGrid,
      roomGrid,
      teacherPeriodCount,
      subjectDaysMap,
      constraints,
      triedSet,
    );

    if (result) {
      // Place
      const { dayIdx, periodIdx, teacherId } = result;
      const key = `${dayIdx}:${periodIdx}:${teacherId}`;
      triedSet.add(key);

      placeLesson(lesson, teacherId, dayIdx, periodIdx, teacherGrid, classGrid, roomGrid, teacherPeriodCount, subjectDaysMap);
      assignments.push({ lessonId: lesson.id, teacherId, dayIdx, periodIdx });
      cursor++;
    } else {
      // Backtrack
      if (assignments.length > 0 && backtracks < constraints.maxBacktrackDepth) {
        backtracks++;
        const last = assignments.pop()!;
        const prevLesson = lessons[cursor - 1];
        removeLesson(prevLesson, last.teacherId, last.dayIdx, last.periodIdx, teacherGrid, classGrid, roomGrid, teacherPeriodCount, subjectDaysMap);
        cursor--;
      } else {
        // Cannot place — mark as unplaced and move on
        unplaced.push({
          subjectName: lesson.subjectName,
          yearId: lesson.yearId,
          classId: lesson.classId,
          className: lesson.className,
          group: lesson.group,
          reason: lesson.candidateTeacherIds.length === 0
            ? "No teacher available for this subject"
            : "No free slot found (all teacher/class/room combinations exhausted)",
        });
        cursor++;
      }
    }
  }

  // ── 5. Build output ────────────────────────────────────────────────────

  onProgress?.(95, "Building output…");

  const slots: GeneratorSlot[] = assignments.map((a) => {
    const lesson = lessons.find((l) => l.id === a.lessonId);
    const teacher = teacherMap.get(a.teacherId);
    const period = teachingPeriods[a.periodIdx];
    if (!lesson || !teacher || !period) return null;
    return {
      subjectId: lesson.subjectId,
      subjectName: lesson.subjectName,
      teacherId: a.teacherId,
      teacherName: teacher.name,
      yearId: lesson.yearId,
      classId: lesson.classId,
      className: lesson.className,
      day: days[a.dayIdx],
      periodIndex: a.periodIdx,
      periodLabel: period.label,
      startTime: period.startTime,
      endTime: period.endTime,
      room: lesson.room,
      group: lesson.group,
    };
  }).filter((s): s is GeneratorSlot => s !== null);

  // Teacher utilization
  const teacherUtilization: Record<string, { assigned: number; max: number }> = {};
  for (const t of input.teachers) {
    teacherUtilization[t.id] = {
      assigned: teacherPeriodCount.get(t.id) ?? 0,
      max: t.maxPeriodsPerWeek,
    };
  }

  onProgress?.(100, "Done");

  return {
    slots,
    unplaced,
    stats: {
      totalLessons,
      placed: assignments.length,
      unplacedCount: unplaced.length,
      teacherUtilization,
      durationMs: performance.now() - t0,
    },
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Step 1: Expand allocations into individual lesson objects
// ────────────────────────────────────────────────────────────────────────────

function expandLessons(
  input: GeneratorInput,
  teacherMap: Map<string, GenTeacher>,
): Lesson[] {
  const lessons: Lesson[] = [];
  let nextId = 1;
  const splitRules = input.constraints.splitClassRules;

  for (const alloc of input.allocations) {
    // Find all classes in this year
    const year = input.years.find((y) => y.id === alloc.yearId);
    if (!year) continue;

    // Which teachers can teach this subject?
    const candidateTeacherIds = input.teachers
      .filter((t) => t.subjectIds.includes(alloc.subjectId))
      .map((t) => t.id);

    for (const cls of year.classes) {
      const splitRule = splitRules.find(
        (r) => r.classId === cls.id && r.subjectId === alloc.subjectId,
      );
      const groups = splitRule ? splitRule.groups : 1;

      for (let g = 1; g <= groups; g++) {
        for (let lessonNum = 0; lessonNum < alloc.periodsPerWeek; lessonNum++) {
          lessons.push({
            id: nextId++,
            subjectId: alloc.subjectId,
            subjectName: alloc.subjectName,
            yearId: alloc.yearId,
            classId: cls.id,
            className: cls.name,
            room: alloc.room ?? "",
            group: groups > 1 ? g : 0,
            candidateTeacherIds,
          });
        }
      }
    }
  }

  return lessons;
}

// ────────────────────────────────────────────────────────────────────────────
// Step 2: MRV sort — most constrained lessons first
// ────────────────────────────────────────────────────────────────────────────

function sortByMRV(
  lessons: Lesson[],
  days: string[],
  teachingPeriods: SchoolPeriod[],
  teacherMap: Map<string, GenTeacher>,
  constraints: GenConstraints,
) {
  // Score = number of candidate teachers × available slots (lower = more constrained)
  const scoreCache = new Map<number, number>();
  for (const lesson of lessons) {
    let totalSlots = 0;
    for (const tId of lesson.candidateTeacherIds) {
      const teacher = teacherMap.get(tId);
      if (!teacher) continue;
      for (let d = 0; d < days.length; d++) {
        const avail = teacher.availability[days[d]];
        for (let p = 0; p < teachingPeriods.length; p++) {
          if (!avail || avail[p] !== false) totalSlots++;
        }
      }
    }
    scoreCache.set(lesson.id, totalSlots);
  }

  lessons.sort((a, b) => (scoreCache.get(a.id) ?? 0) - (scoreCache.get(b.id) ?? 0));
}

// ────────────────────────────────────────────────────────────────────────────
// Step 3: Find best slot for a lesson
// ────────────────────────────────────────────────────────────────────────────

interface SlotCandidate {
  dayIdx: number;
  periodIdx: number;
  teacherId: string;
  softScore: number;
}

function findBestSlot(
  lesson: Lesson,
  days: string[],
  teachingPeriods: SchoolPeriod[],
  teacherMap: Map<string, GenTeacher>,
  teacherGrid: Map<string, (number | null)[][]>,
  classGrid: Map<string, (number | null)[][]>,
  roomGrid: Map<string, (number | null)[][]>,
  teacherPeriodCount: Map<string, number>,
  subjectDaysMap: Map<string, Set<number>>,
  constraints: GenConstraints,
  triedSet: Set<string>,
): SlotCandidate | null {
  const candidates: SlotCandidate[] = [];
  const classKey = lesson.group > 0 ? `${lesson.classId}:${lesson.group}` : lesson.classId;

  for (const tId of lesson.candidateTeacherIds) {
    const teacher = teacherMap.get(tId);
    if (!teacher) continue;

    // Check teacher hasn't exceeded weekly max
    const currentCount = teacherPeriodCount.get(tId) ?? 0;
    if (currentCount >= teacher.maxPeriodsPerWeek) continue;

    const tGrid = teacherGrid.get(tId);
    if (!tGrid) continue;

    for (let d = 0; d < days.length; d++) {
      // Teacher availability
      const avail = teacher.availability[days[d]];

      for (let p = 0; p < teachingPeriods.length; p++) {
        if (avail && avail[p] === false) continue;

        const key = `${d}:${p}:${tId}`;
        if (triedSet.has(key)) continue;

        // Hard: teacher not already booked
        if (tGrid[d][p] !== null) continue;

        // Hard: class not already booked (for non-split, check base class; for split, check group grid)
        const cGrid = classGrid.get(classKey);
        if (cGrid && cGrid[d][p] !== null) continue;

        // Also check base class grid for split lessons — group can't overlap base class slots
        if (lesson.group > 0) {
          const baseGrid = classGrid.get(lesson.classId);
          if (baseGrid && baseGrid[d][p] !== null) continue;
        }

        // Hard: room not double-booked (if room specified)
        if (lesson.room) {
          if (!roomGrid.has(lesson.room)) {
            roomGrid.set(
              lesson.room,
              days.map(() => teachingPeriods.map(() => null)),
            );
          }
          const rGrid = roomGrid.get(lesson.room)!;
          if (rGrid[d][p] !== null) continue;
        }

        // Hard: consecutive period limit for teacher
        if (!checkConsecutiveLimit(tGrid, d, p, teachingPeriods.length, constraints.maxConsecutivePerTeacher)) {
          continue;
        }

        // ── Soft scoring ──
        let softScore = 0;

        // Prefer spreading subject across different days
        if (constraints.spreadSubjectsAcrossDays) {
          const sdKey = `${classKey}:${lesson.subjectId}`;
          const usedDays = subjectDaysMap.get(sdKey);
          if (usedDays && usedDays.has(d)) {
            softScore -= 10; // penalize same-day placement
          }
        }

        // Prefer filling earlier periods first (avoids gaps)
        softScore -= p * 0.5;

        // Slight randomness to diversify solutions
        softScore += Math.random() * 0.3;

        candidates.push({ dayIdx: d, periodIdx: p, teacherId: tId, softScore });
      }
    }
  }

  if (candidates.length === 0) return null;

  // Pick highest soft score
  candidates.sort((a, b) => b.softScore - a.softScore);
  return candidates[0];
}

// ────────────────────────────────────────────────────────────────────────────
// Consecutive-period check
// ────────────────────────────────────────────────────────────────────────────

function checkConsecutiveLimit(
  grid: (number | null)[][],
  dayIdx: number,
  periodIdx: number,
  totalPeriods: number,
  maxConsecutive: number,
): boolean {
  // Count how many consecutive would result if we place at periodIdx
  let count = 1;
  // Look backward
  for (let p = periodIdx - 1; p >= 0; p--) {
    if (grid[dayIdx][p] !== null) count++;
    else break;
  }
  // Look forward
  for (let p = periodIdx + 1; p < totalPeriods; p++) {
    if (grid[dayIdx][p] !== null) count++;
    else break;
  }
  return count <= maxConsecutive;
}

// ────────────────────────────────────────────────────────────────────────────
// Place / Remove helpers (for backtracking)
// ────────────────────────────────────────────────────────────────────────────

function placeLesson(
  lesson: Lesson,
  teacherId: string,
  dayIdx: number,
  periodIdx: number,
  teacherGrid: Map<string, (number | null)[][]>,
  classGrid: Map<string, (number | null)[][]>,
  roomGrid: Map<string, (number | null)[][]>,
  teacherPeriodCount: Map<string, number>,
  subjectDaysMap: Map<string, Set<number>>,
) {
  const tGrid = teacherGrid.get(teacherId)!;
  tGrid[dayIdx][periodIdx] = lesson.id;

  const classKey = lesson.group > 0 ? `${lesson.classId}:${lesson.group}` : lesson.classId;
  const cGrid = classGrid.get(classKey);
  if (cGrid) cGrid[dayIdx][periodIdx] = lesson.id;

  if (lesson.room) {
    const rGrid = roomGrid.get(lesson.room);
    if (rGrid) rGrid[dayIdx][periodIdx] = lesson.id;
  }

  teacherPeriodCount.set(teacherId, (teacherPeriodCount.get(teacherId) ?? 0) + 1);

  const sdKey = `${classKey}:${lesson.subjectId}`;
  if (!subjectDaysMap.has(sdKey)) subjectDaysMap.set(sdKey, new Set());
  subjectDaysMap.get(sdKey)!.add(dayIdx);
}

function removeLesson(
  lesson: Lesson,
  teacherId: string,
  dayIdx: number,
  periodIdx: number,
  teacherGrid: Map<string, (number | null)[][]>,
  classGrid: Map<string, (number | null)[][]>,
  roomGrid: Map<string, (number | null)[][]>,
  teacherPeriodCount: Map<string, number>,
  subjectDaysMap: Map<string, Set<number>>,
) {
  const tGrid = teacherGrid.get(teacherId)!;
  tGrid[dayIdx][periodIdx] = null;

  const classKey = lesson.group > 0 ? `${lesson.classId}:${lesson.group}` : lesson.classId;
  const cGrid = classGrid.get(classKey);
  if (cGrid) cGrid[dayIdx][periodIdx] = null;

  if (lesson.room) {
    const rGrid = roomGrid.get(lesson.room);
    if (rGrid) rGrid[dayIdx][periodIdx] = null;
  }

  teacherPeriodCount.set(teacherId, Math.max(0, (teacherPeriodCount.get(teacherId) ?? 0) - 1));

  // Note: we don't remove from subjectDaysMap during backtrack for performance.
  // The soft-score impact is minor and recalculated on re-placement.
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function emptyOutput(totalLessons: number, durationMs: number): GeneratorOutput {
  return {
    slots: [],
    unplaced: [],
    stats: {
      totalLessons,
      placed: 0,
      unplacedCount: 0,
      teacherUtilization: {},
      durationMs,
    },
  };
}
