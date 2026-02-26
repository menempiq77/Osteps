"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Modal,
  Spin,
  message,
} from "antd";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  PictureOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddStudentModal } from "../modals/studentModals/AddStudentModal";
import { EditStudentModal } from "../modals/studentModals/EditStudentModal";
import BehaviorModal from "@/components/modals/behaviorModals/BehaviorModal";
import {
  addStudent as apiAddStudent,
  deleteStudent as apiDeleteStudent,
  fetchStudents,
  updateStudent as apiUpdateStudent,
  uploadStudentAvatar,
} from "@/services/studentsApi";
import {
  addBehaviour,
  addBehaviourType,
  fetchBehaviour,
  fetchBehaviourType,
} from "@/services/behaviorApi";
import { fetchClassStudentsBehaviorSummary } from "@/services/studentBehaviorSummaryApi";
import {
  fetchClassSeatingLayout,
  saveClassSeatingLayout,
} from "@/services/seatingApi";
import {
  SeatingLayoutItem,
  StudentBehaviorSummary,
} from "@/types/studentViews";

type Student = {
  id: string;
  student_name: string;
  user_name: string;
  email: string;
  class_id: number;
  class_name?: string;
  status: "active" | "inactive" | "suspended";
  gender?: string;
  student_gender?: string;
  sex?: string;
  student_sex?: string;
  profile_path?: string | null;
  profile_photo?: string | null;
  avatar?: string | null;
};

type SeatingStateItem = {
  student_id: string;
  x: number;
  y: number;
  z_index: number;
};

type RoomMarkerKey = "teacher" | "screen" | "door";
type RoomMarkers = Record<RoomMarkerKey, { x: number; y: number }>;
type RoomMarkerOrientations = Record<RoomMarkerKey, "horizontal" | "vertical">;

type BehaviorType = {
  id: string | number;
  name: string;
  color: string;
  points: number;
};

type AttendanceState = {
  isPresent: boolean;
  attendanceRecordId?: string | number;
};

type SeatingApiErrorShape = {
  status?: number;
  backendMessage?: string;
  message?: string;
};

const GRID = 16;
const BASE_CANVAS_WIDTH = 1240;
const CANVAS_HEIGHT = 820;
const SEAT_CARD_WIDTH = 180;
const SEAT_CARD_HEIGHT = 100;
const MARKER_WIDTH_HORIZONTAL = 170;
const MARKER_HEIGHT_HORIZONTAL = 40;
const MARKER_WIDTH_VERTICAL = 56;
const MARKER_HEIGHT_VERTICAL = 170;
const EMPTY_LIST: any[] = [];
const getDefaultRoomMarkers = (canvasWidth: number): RoomMarkers => {
  const safeWidth = Math.max(900, Math.floor(canvasWidth || BASE_CANVAS_WIDTH));
  return {
    teacher: { x: 24, y: 380 },
    screen: { x: Math.max(24, Math.round(safeWidth * 0.45)), y: 8 },
    door: { x: Math.max(24, safeWidth - 210), y: 8 },
  };
};
const DEFAULT_MARKER_ORIENTATIONS: RoomMarkerOrientations = {
  teacher: "horizontal",
  screen: "horizontal",
  door: "horizontal",
};

const getMarkerWidth = (orientation: "horizontal" | "vertical") =>
  orientation === "vertical" ? MARKER_WIDTH_VERTICAL : MARKER_WIDTH_HORIZONTAL;

const getMarkerHeight = (orientation: "horizontal" | "vertical") =>
  orientation === "vertical" ? MARKER_HEIGHT_VERTICAL : MARKER_HEIGHT_HORIZONTAL;

const safeNumber = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const toStudentId = (id: string | number) => String(id);
const normalizeText = (value: string) =>
  value.toLowerCase().replace(/[\s_-]+/g, " ").trim();
const normalizeGenderRaw = (raw: unknown): "male" | "female" | "" => {
  const value = String(raw ?? "").trim().toLowerCase();
  if (["male", "m", "boy"].includes(value)) return "male";
  if (["female", "f", "girl"].includes(value)) return "female";
  return "";
};

const getLocalTimestampLabel = (timeZone?: string) => {
  try {
    return new Date().toLocaleString(undefined, timeZone ? { timeZone } : undefined);
  } catch {
    return new Date().toISOString();
  }
};

const getLocalDateInTimeZone = (timeZone?: string) => {
  const now = new Date();
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const year = parts.find((p) => p.type === "year")?.value || "1970";
    const month = parts.find((p) => p.type === "month")?.value || "01";
    const day = parts.find((p) => p.type === "day")?.value || "01";
    return `${year}-${month}-${day}`;
  } catch {
    return now.toISOString().split("T")[0];
  }
};

const isAttendanceRecord = (record: any, behaviorTypeName: string) => {
  const typeName = normalizeText(behaviorTypeName || "");
  const description = normalizeText(record?.description || "");
  return (
    typeName.includes("attendance") ||
    typeName.includes("absent") ||
    typeName.includes("present") ||
    description.includes("[attendance]") ||
    description.includes("attendance absent") ||
    description.includes("attendance present")
  );
};

const isAbsentAttendanceRecord = (record: any, behaviorTypeName: string) => {
  const typeName = normalizeText(behaviorTypeName || "");
  const description = normalizeText(record?.description || "");
  return typeName.includes("absent") || description.includes("attendance absent");
};

const getAttendanceEventTime = (record: any) => {
  const created = new Date(record?.created_at || record?.updated_at || "").getTime();
  if (Number.isFinite(created) && created > 0) return created;

  const description = String(record?.description || "");
  if (description.includes(" @ ")) {
    const raw = description.split(" @ ").pop();
    const parsed = new Date(raw || "").getTime();
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  const dateOnly = new Date(record?.date || "").getTime();
  if (Number.isFinite(dateOnly) && dateOnly > 0) return dateOnly;
  return 0;
};

const buildAutoLayout = (students: Student[], canvasWidth: number): SeatingStateItem[] => {
  const safeWidth = Math.max(900, Math.floor(canvasWidth || BASE_CANVAS_WIDTH));
  const padding = 24;
  const maxLeft = Math.max(padding, safeWidth - SEAT_CARD_WIDTH - padding);
  const columns = [0, 1, 2, 3].map((idx) =>
    Math.round((padding + (idx / 3) * (maxLeft - padding)) / GRID) * GRID
  );
  const top = 150;
  const rowGap = 145;

  return students.map((student, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    return {
      student_id: toStudentId(student.id),
      x: columns[col],
      y: top + row * rowGap,
      z_index: index + 1,
    };
  });
};

const extractAvatarPath = (payload: any): string | null => {
  return (
    payload?.data?.profile_path ||
    payload?.data?.profile_photo ||
    payload?.profile_path ||
    payload?.profile_photo ||
    null
  );
};

const getStudentImagePath = (student: any): string | null => {
  const path =
    student?.profile_path || student?.profile_photo || student?.avatar || null;
  if (!path) return null;
  if (
    typeof path === "string" &&
    (path.trim() === "" ||
      path === "https://dashboard.osteps.com/storage" ||
      path === "http://dashboard.osteps.com/storage")
  ) {
    return null;
  }
  return path;
};

const areSeatLayoutsEqual = (
  a: SeatingStateItem[],
  b: SeatingStateItem[]
): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (
      a[i].student_id !== b[i].student_id ||
      a[i].x !== b[i].x ||
      a[i].y !== b[i].y ||
      a[i].z_index !== b[i].z_index
    ) {
      return false;
    }
  }
  return true;
};

const getSeatingApiUnavailableMessage = (error: SeatingApiErrorShape | null) => {
  const status = Number(error?.status || 0);
  if (status === 404) {
    return "Seating API route is missing (404). Backend must add GET/PUT /api/classes/{classId}/seating-layout.";
  }
  if (status === 401 || status === 403) {
    return "You do not have permission to use seating save API (401/403).";
  }
  return (
    error?.backendMessage ||
    error?.message ||
    "Seating API not available. You can still arrange seats for this session, but server save is disabled."
  );
};

export default function StudentList() {
  const router = useRouter();
  const { classId } = useParams();
  const classIdStr = Array.isArray(classId) ? classId[0] : classId;
  const queryClient = useQueryClient();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"behavior" | "seating">("behavior");
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudentAction, setSelectedStudentAction] = useState<any | null>(
    null
  );
  const [isWholeClassActionModalOpen, setIsWholeClassActionModalOpen] = useState(false);
  const [isWholeClassBehaviorMode, setIsWholeClassBehaviorMode] = useState(false);
  const [isBehaviorModalOpen, setIsBehaviorModalOpen] = useState(false);
  const [isBehaviorSubmitting, setIsBehaviorSubmitting] = useState(false);
  const [behaviorIntent, setBehaviorIntent] = useState<"positive" | "negative">(
    "positive"
  );
  const [behaviorForm] = Form.useForm();
  const [avatarPreviewMap, setAvatarPreviewMap] = useState<Record<string, string>>(
    {}
  );
  const [avatarOverrides, setAvatarOverrides] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem("students-avatar-overrides");
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });
  const [seatingItems, setSeatingItems] = useState<SeatingStateItem[]>([]);
  const [localSeatingDirty, setLocalSeatingDirty] = useState(false);
  const [dragging, setDragging] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [draggingMarker, setDraggingMarker] = useState<{
    key: RoomMarkerKey;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState<number>(BASE_CANVAS_WIDTH);
  const [roomMarkers, setRoomMarkers] = useState<RoomMarkers>(
    getDefaultRoomMarkers(BASE_CANVAS_WIDTH)
  );
  const [markerOrientations, setMarkerOrientations] = useState<RoomMarkerOrientations>(
    DEFAULT_MARKER_ORIENTATIONS
  );
  const [fallbackPointsByStudent, setFallbackPointsByStudent] = useState<
    Record<string, { total: number; positive: number; negative: number }>
  >({});
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [isPickingRandom, setIsPickingRandom] = useState(false);
  const [randomStudent, setRandomStudent] = useState<any | null>(null);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [avatarTargetStudent, setAvatarTargetStudent] = useState<any | null>(null);
  const [avatarPresetTab, setAvatarPresetTab] = useState<"emoji" | "avatar" | "symbol">(
    "emoji"
  );
  const [customAvatarChar, setCustomAvatarChar] = useState("");
  const [isAttendanceMode, setIsAttendanceMode] = useState(false);
  const [attendanceByStudent, setAttendanceByStudent] = useState<
    Record<string, AttendanceState>
  >({});
  const [attendanceSyncing, setAttendanceSyncing] = useState(false);
  const dragStartedRef = useRef(false);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({});
  const pickerAvatarInputRef = useRef<HTMLInputElement | null>(null);
  const role = currentUser?.role;
  const hasAccess = role === "SCHOOL_ADMIN";
  const canArrangeSeats =
    role === "SCHOOL_ADMIN" || role === "HOD" || role === "TEACHER";
  const schoolTimeZone = useMemo(() => {
    const userAny = currentUser as any;
    return (
      userAny?.school_timezone ||
      userAny?.schoolTimeZone ||
      userAny?.timezone ||
      userAny?.school?.timezone ||
      process.env.NEXT_PUBLIC_SCHOOL_TIMEZONE ||
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
  }, [currentUser]);
  const attendanceDate = useMemo(
    () => getLocalDateInTimeZone(schoolTimeZone),
    [schoolTimeZone]
  );

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["students", classIdStr],
    queryFn: () => fetchStudents(classIdStr as string),
    enabled: !!classIdStr,
  });
  const students = (studentsData || EMPTY_LIST) as Student[];

  const {
    data: behaviorSummaryData,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useQuery({
    queryKey: ["class-students-behavior-summary", classIdStr],
    queryFn: () => fetchClassStudentsBehaviorSummary(classIdStr as string),
    enabled: !!classIdStr,
  });
  const behaviorSummary = (behaviorSummaryData ||
    EMPTY_LIST) as StudentBehaviorSummary[];

  const { data: behaviorTypesData } = useQuery({
    queryKey: ["behavior-types"],
    queryFn: fetchBehaviourType,
    enabled: !!canArrangeSeats,
  });
  const behaviorTypes = (behaviorTypesData || EMPTY_LIST) as BehaviorType[];

  const seatingQuery = useQuery({
    queryKey: ["class-seating-layout", classIdStr],
    queryFn: () => fetchClassSeatingLayout(classIdStr as string),
    enabled: !!classIdStr && canArrangeSeats,
    retry: 1,
  });

  const seatingApiError = (seatingQuery.error || null) as SeatingApiErrorShape | null;
  const seatingApiReady = !!classIdStr && canArrangeSeats && !seatingQuery.isError;
  const seatingUnavailableMessage = getSeatingApiUnavailableMessage(seatingApiError);

  const addStudentMutation = useMutation({
    mutationFn: apiAddStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students", classIdStr] });
      queryClient.invalidateQueries({
        queryKey: ["class-students-behavior-summary", classIdStr],
      });
      setIsAddStudentModalOpen(false);
      messageApi.success("Student added successfully.");
    },
    onError: () => {
      messageApi.error("Failed to add student.");
    },
  });

  const updateStudentMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: any }) =>
      apiUpdateStudent(id, values),
    onSuccess: () => {
      console.log('[Student Update] Success - refetching student data');
      // Force immediate refetch instead of just invalidating
      queryClient.refetchQueries({ queryKey: ["students", classIdStr] });
      queryClient.refetchQueries({
        queryKey: ["class-students-behavior-summary", classIdStr],
      });
      setEditStudent(null);
      messageApi.success("Student updated successfully.");
    },
    onError: (error: unknown) => {
      console.error('[Student Update] Error:', error);
      const backendMessage =
        (error as { message?: string })?.message?.trim() || "Failed to update student.";
      messageApi.error(backendMessage);
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: apiDeleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students", classIdStr] });
      queryClient.invalidateQueries({
        queryKey: ["class-students-behavior-summary", classIdStr],
      });
      queryClient.invalidateQueries({ queryKey: ["class-seating-layout", classIdStr] });
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
      messageApi.success("Student deleted successfully.");
    },
    onError: () => {
      messageApi.error("Failed to delete student.");
    },
  });

  const avatarMutation = useMutation({
    mutationFn: async ({
      studentIds,
      cacheStudentId,
      file,
    }: {
      studentIds: string[];
      cacheStudentId: string;
      file: File;
    }) => {
      const ids = Array.from(new Set((studentIds || []).map((id) => String(id).trim()).filter(Boolean)));
      let lastError: unknown;
      for (const id of ids) {
        try {
          const response = await uploadStudentAvatar(classIdStr as string, id, file);
          return { response, usedId: id, cacheStudentId };
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError || new Error("Failed to update avatar.");
    },
    onSuccess: (result, variables) => {
      const studentId = variables.cacheStudentId;
      const serverPath = extractAvatarPath(result?.response);
      queryClient.setQueryData(
        ["class-students-behavior-summary", classIdStr],
        (old: StudentBehaviorSummary[] | undefined) => {
          if (!old) return old;
          return old.map((item) =>
            toStudentId(item.student_id) === studentId
              ? { ...item, profile_path: serverPath || item.profile_path }
              : item
          );
        }
      );
      queryClient.setQueryData(
        ["students", classIdStr],
        (old: Student[] | undefined) => {
          if (!old) return old;
          return old.map((item) =>
            toStudentId(item.id) === studentId
              ? { ...item, profile_path: serverPath || item.profile_path }
              : item
          );
        }
      );
      setAvatarPreviewMap((prev) => {
        if (prev[studentId]) URL.revokeObjectURL(prev[studentId]);
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
      messageApi.success("Avatar updated.");
    },
    onError: (error: any, variables) => {
      setAvatarPreviewMap((prev) => {
        if (prev[variables.cacheStudentId]) URL.revokeObjectURL(prev[variables.cacheStudentId]);
        const next = { ...prev };
        delete next[variables.cacheStudentId];
        return next;
      });
      const backendMessage =
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.response?.data?.data?.message ||
        error?.message ||
        "Failed to update avatar.";
      messageApi.error(String(backendMessage));
    },
  });

  const saveSeatingMutation = useMutation({
    mutationFn: (items: SeatingLayoutItem[]) =>
      saveClassSeatingLayout(classIdStr as string, {
        items,
        room_meta: {
          width: canvasWidth,
          height: CANVAS_HEIGHT,
          screen_edge: "top",
          door_edge: "right",
          room_markers: roomMarkers,
          room_marker_orientations: markerOrientations,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-seating-layout", classIdStr] });
      setLocalSeatingDirty(false);
      messageApi.success("Seating plan saved.");
    },
    onError: (error: any) => {
      const status = Number(error?.status || error?.response?.status || 0);
      const backendMessage =
        error?.backendMessage ||
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.response?.data?.data?.message ||
        error?.message ||
        "Failed to save seating plan.";
      if (status === 404) {
        messageApi.error("Save failed: seating API route missing (404).");
        return;
      }
      if (status === 401 || status === 403) {
        messageApi.error("Save failed: you do not have permission (401/403).");
        return;
      }
      messageApi.error(String(backendMessage));
    },
  });

  const addBehaviorMutation = useMutation({
    mutationFn: (payload: any) => addBehaviour(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["class-students-behavior-summary", classIdStr],
      });
      messageApi.success("Behavior recorded successfully.");
      setIsBehaviorModalOpen(false);
      behaviorForm.resetFields();
    },
    onError: () => {
      messageApi.error("Failed to save behavior.");
    },
  });

  const orderedStudents = useMemo(() => {
    if (summaryError || behaviorSummary.length === 0) {
      return (students as Student[]).map((s) => {
        const fp = fallbackPointsByStudent[toStudentId(s.id)];
        const sid = toStudentId(s.id);
        const fromApiGender = normalizeGenderRaw(
          s.gender ?? s.student_gender ?? s.sex ?? s.student_sex
        );
        const rawGender = fromApiGender;
        return {
        id: sid,
        student_name: s.student_name,
        user_name: s.user_name,
        email: s.email,
        class_id: s.class_id,
        class_name: s.class_name,
        status: s.status || "active",
        gender: rawGender,
        student_gender: rawGender,
        profile_path: getStudentImagePath(s),
        positive_points: fp?.positive ?? 0,
        negative_points: fp?.negative ?? 0,
        total_points: fp?.total ?? 0,
      };
      });
    }

    const byId = new Map((students as Student[]).map((s) => [toStudentId(s.id), s]));
    return behaviorSummary.map((item) => {
      const id = toStudentId(item.student_id);
      const fromStudents = byId.get(id);
      const fromApiGender = normalizeGenderRaw(
        (item as any)?.gender ??
          (item as any)?.student_gender ??
          (item as any)?.sex ??
          (item as any)?.student_sex ??
          fromStudents?.gender ??
          fromStudents?.student_gender ??
          fromStudents?.sex ??
          fromStudents?.student_sex
      );
      const rawGender = fromApiGender;
      return {
        id,
        student_name: item.student_name || fromStudents?.student_name || "Student",
        user_name: item.user_name || fromStudents?.user_name || "",
        email: fromStudents?.email || "",
        class_id: fromStudents?.class_id || Number(classIdStr) || 0,
        status: (item.status || fromStudents?.status || "active") as
          | "active"
          | "inactive"
          | "suspended",
        gender: rawGender,
        student_gender: rawGender,
        profile_path: getStudentImagePath(item) || getStudentImagePath(fromStudents),
        positive_points:
          safeNumber(item.positive_points) ||
          fallbackPointsByStudent[id]?.positive ||
          0,
        negative_points:
          safeNumber(item.negative_points) ||
          fallbackPointsByStudent[id]?.negative ||
          0,
        total_points:
          safeNumber(item.total_points) || fallbackPointsByStudent[id]?.total || 0,
      };
    });
  }, [behaviorSummary, students, summaryError, classIdStr, fallbackPointsByStudent]);

  useEffect(() => {
    const shouldUseFallback =
      (!!summaryError || behaviorSummary.length === 0) &&
      students.length > 0 &&
      behaviorTypes.length > 0;
    if (!shouldUseFallback) return;

    let cancelled = false;
    const pointsByType = new Map(
      behaviorTypes.map((type) => [String(type.id), Number(type.points || 0)])
    );

    const loadFallbackPoints = async () => {
      try {
        const results = await Promise.all(
          students.map(async (student) => {
            const records = await fetchBehaviour(Number(student.id));
            let total = 0;
            let positive = 0;
            let negative = 0;
            (records || []).forEach((record: any) => {
              const pts = Number(pointsByType.get(String(record?.behaviour_id)) || 0);
              total += pts;
              if (pts > 0) positive += pts;
              if (pts < 0) negative += pts;
            });
            return {
              id: toStudentId(student.id),
              total,
              positive,
              negative,
            };
          })
        );

        if (cancelled) return;
        const map: Record<string, { total: number; positive: number; negative: number }> =
          {};
        results.forEach((row) => {
          map[row.id] = {
            total: row.total,
            positive: row.positive,
            negative: row.negative,
          };
        });
        setFallbackPointsByStudent(map);
      } catch {
        // keep zero fallback if requests fail
      }
    };

    loadFallbackPoints();
    return () => {
      cancelled = true;
    };
  }, [summaryError, behaviorSummary.length, students, behaviorTypes]);

  const wholeClassSummary = useMemo(() => {
    return orderedStudents.reduce(
      (acc, student) => {
        acc.positive += safeNumber(student.positive_points);
        acc.negative += safeNumber(student.negative_points);
        acc.total += safeNumber(student.total_points);
        return acc;
      },
      { positive: 0, negative: 0, total: 0 }
    );
  }, [orderedStudents]);

  useEffect(() => {
    const savedYearId = localStorage.getItem("selectedYearId");
    if (savedYearId) setSelectedYearId(Number(savedYearId));
  }, []);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container || typeof window === "undefined") return;

    const updateCanvasWidth = () => {
      const next = Math.max(900, Math.floor(container.clientWidth || BASE_CANVAS_WIDTH));
      setCanvasWidth((prev) => (prev === next ? prev : next));
    };

    updateCanvasWidth();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateCanvasWidth);
      return () => window.removeEventListener("resize", updateCanvasWidth);
    }

    const observer = new ResizeObserver(() => updateCanvasWidth());
    observer.observe(container);
    window.addEventListener("resize", updateCanvasWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateCanvasWidth);
    };
  }, []);

  useEffect(() => {
    if (!orderedStudents.length) return;
    const clampSeatX = (x: number) =>
      Math.max(0, Math.min(Math.max(0, canvasWidth - SEAT_CARD_WIDTH), x));
    if (canArrangeSeats && seatingQuery.data?.items?.length) {
      const savedWidth =
        safeNumber((seatingQuery.data as any)?.room_meta?.width) || BASE_CANVAS_WIDTH;
      const scaleX = (x: unknown) =>
        Math.round((safeNumber(x) * canvasWidth) / savedWidth / GRID) * GRID;
      const fromApi = seatingQuery.data.items.map((item, index) => ({
        student_id: toStudentId(item.student_id),
        x: clampSeatX(scaleX(item.x)),
        y: safeNumber(item.y),
        z_index: safeNumber(item.z_index) || index + 1,
      }));
      setSeatingItems((prev) =>
        areSeatLayoutsEqual(prev, fromApi) ? prev : fromApi
      );
      const markers = seatingQuery.data?.room_meta?.room_markers;
      const savedOrientations =
        seatingQuery.data?.room_meta?.room_marker_orientations;
      if (markers) {
        const nextOrientations = {
          teacher: savedOrientations?.teacher || DEFAULT_MARKER_ORIENTATIONS.teacher,
          screen: savedOrientations?.screen || DEFAULT_MARKER_ORIENTATIONS.screen,
          door: savedOrientations?.door || DEFAULT_MARKER_ORIENTATIONS.door,
        };
        const scaleMarkerX = (x: unknown, key: RoomMarkerKey) => {
          const markerWidth = getMarkerWidth(nextOrientations[key]);
          const maxX = Math.max(0, canvasWidth - markerWidth);
          return Math.max(0, Math.min(maxX, scaleX(x)));
        };
        setRoomMarkers({
          teacher: markers.teacher
            ? { x: scaleMarkerX(markers.teacher.x, "teacher"), y: safeNumber(markers.teacher.y) }
            : getDefaultRoomMarkers(canvasWidth).teacher,
          screen: markers.screen
            ? { x: scaleMarkerX(markers.screen.x, "screen"), y: safeNumber(markers.screen.y) }
            : getDefaultRoomMarkers(canvasWidth).screen,
          door: markers.door
            ? { x: scaleMarkerX(markers.door.x, "door"), y: safeNumber(markers.door.y) }
            : getDefaultRoomMarkers(canvasWidth).door,
        });
        setMarkerOrientations(nextOrientations);
      } else {
        setRoomMarkers(getDefaultRoomMarkers(canvasWidth));
        setMarkerOrientations(DEFAULT_MARKER_ORIENTATIONS);
      }
      setLocalSeatingDirty(false);
      return;
    }
    const auto = buildAutoLayout(orderedStudents, canvasWidth);
    setSeatingItems((prev) => (areSeatLayoutsEqual(prev, auto) ? prev : auto));
    setRoomMarkers(getDefaultRoomMarkers(canvasWidth));
    setMarkerOrientations(DEFAULT_MARKER_ORIENTATIONS);
    setLocalSeatingDirty(false);
  }, [orderedStudents, seatingQuery.data, canArrangeSeats, canvasWidth]);

  useEffect(() => {
    return () => {
      Object.values(avatarPreviewMap).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [avatarPreviewMap]);

  useEffect(() => {
    if (!dragging && !draggingMarker) return;

    const handleMove = (event: MouseEvent) => {
      const container = canvasRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (dragging) {
        const maxX = Math.max(0, rect.width - SEAT_CARD_WIDTH);
        const maxY = Math.max(0, rect.height - SEAT_CARD_HEIGHT);
        const rawX = event.clientX - rect.left - dragging.offsetX;
        const rawY = event.clientY - rect.top - dragging.offsetY;
        const snappedX =
          Math.round(Math.max(0, Math.min(maxX, rawX)) / GRID) * GRID;
        const snappedY =
          Math.round(Math.max(0, Math.min(maxY, rawY)) / GRID) * GRID;
        setSeatingItems((prev) =>
          prev.map((item) =>
            item.student_id === dragging.id
              ? {
                  ...item,
                  x: snappedX,
                  y: snappedY,
                }
              : item
          )
        );
      }
      if (draggingMarker) {
        const markerOrientation = markerOrientations[draggingMarker.key];
        const markerWidth = getMarkerWidth(markerOrientation);
        const markerHeight = getMarkerHeight(markerOrientation);
        const maxX = Math.max(0, rect.width - markerWidth);
        const maxY = Math.max(0, rect.height - markerHeight);
        const rawX = event.clientX - rect.left - draggingMarker.offsetX;
        const rawY = event.clientY - rect.top - draggingMarker.offsetY;
        const snappedX =
          Math.round(Math.max(0, Math.min(maxX, rawX)) / GRID) * GRID;
        const snappedY =
          Math.round(Math.max(0, Math.min(maxY, rawY)) / GRID) * GRID;
        setRoomMarkers((prev) => ({
          ...prev,
          [draggingMarker.key]: {
            x: snappedX,
            y: snappedY,
          },
        }));
      }
      dragStartedRef.current = true;
      setIsDragging(true);
      setLocalSeatingDirty(true);
    };

    const handleUp = () => {
      setDragging(null);
      setDraggingMarker(null);
      window.setTimeout(() => setIsDragging(false), 50);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging, draggingMarker, markerOrientations]);

  const handleStudentClick = (studentId: string) => {
    if (isDragging || dragStartedRef.current) return;
    const clicked = orderedStudents.find((s) => toStudentId(s.id) === studentId);
    if (clicked) setSelectedStudentAction(clicked);
  };

  const handleAddNewStudent = async (values: any) => {
    const rows = Array.isArray(values?.students) && values.students.length
      ? values.students
      : [values];

    const payloads = rows.map((row: any) => ({
      student_name: row.student_name,
      email: row.email || "",
      user_name: row.user_name,
      class_id: Number(classIdStr),
      password: row.password,
      status: row.status || "active",
      gender: row.gender,
      student_gender: row.gender,
      nationality: row.nationality || undefined,
      is_sen: !!row.is_sen,
      sen_details: row.is_sen ? row.sen_details || "" : "",
    }));

    if (payloads.length <= 1) {
      addStudentMutation.mutate(payloads[0]);
      return;
    }

    let successCount = 0;
    let failedCount = 0;

    for (const payload of payloads) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await apiAddStudent(payload);
        successCount += 1;
      } catch {
        failedCount += 1;
      }
    }

    if (successCount > 0) {
      queryClient.invalidateQueries({ queryKey: ["students", classIdStr] });
      queryClient.invalidateQueries({
        queryKey: ["class-students-behavior-summary", classIdStr],
      });
      setIsAddStudentModalOpen(false);
    }

    if (failedCount === 0) {
      messageApi.success(`Added ${successCount} students successfully.`);
    } else if (successCount > 0) {
      messageApi.warning(`Added ${successCount} students, ${failedCount} failed.`);
    } else {
      messageApi.error("Failed to add students.");
      throw new Error("Bulk add failed");
    }
  };

  const handleSaveEdit = (values: any) => {
    if (!hasAccess) {
      messageApi.warning("Only School Admin can edit student information.");
      return;
    }
    if (!editStudent) return;
    const nextPassword = String(values.password ?? "").trim();
    
    // Only use the new gender if explicitly set, otherwise keep current
    const nextGender = values.gender
      ? String(values.gender).trim().toLowerCase()
      : String(
          (editStudent as any)?.gender ??
            (editStudent as any)?.student_gender ??
            (editStudent as any)?.sex ??
            (editStudent as any)?.student_sex ??
            ""
        )
          .trim()
          .toLowerCase();

    const payload: Record<string, any> = {
      student_name: values.student_name,
      email: values.email,
      user_name: values.user_name,
      class_id: Number(classIdStr),
      status: values.status,
      // Backend expects password key on update; empty string keeps current password.
      password: nextPassword,
    };

    // Include gender in payload if explicitly set
    if (values.gender && (nextGender === "male" || nextGender === "female")) {
      payload.gender = nextGender;
      payload.student_gender = nextGender;
      payload.sex = nextGender;
      payload.student_sex = nextGender;
      console.log('[Gender Update] Sending gender to API:', nextGender, 'for student:', editStudent.id);
    }

    // Add nationality if provided, otherwise let backend keep current
    if (values.nationality !== undefined && values.nationality !== "") {
      payload.nationality = values.nationality;
    }

    console.log('[Student Update] Payload:', payload);
    updateStudentMutation.mutate({
      id: editStudent.id,
      values: payload,
    });
  };

  const showDeleteConfirm = (student: Student) => {
    if (!hasAccess) {
      messageApi.warning("Only School Admin can delete students.");
      return;
    }
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteStudent = () => {
    if (!hasAccess) {
      messageApi.warning("Only School Admin can delete students.");
      return;
    }
    if (!studentToDelete) return;
    deleteStudentMutation.mutate(studentToDelete.id);
  };

  const handleAvatarPick = (
    studentRef: { id?: string | number; user_name?: string; student_name?: string } | string,
    file?: File
  ) => {
    if (!file) return;
    const cacheStudentId =
      typeof studentRef === "string" ? studentRef : String(studentRef?.id ?? "").trim();
    if (!cacheStudentId) return;
    const refUserName =
      typeof studentRef === "string" ? "" : String(studentRef?.user_name ?? "").trim().toLowerCase();
    const refStudentName =
      typeof studentRef === "string" ? "" : String(studentRef?.student_name ?? "").trim().toLowerCase();
    const fallbackIds = (students || [])
      .filter((s) => {
        const byUserName =
          !!refUserName && String((s as any)?.user_name ?? "").trim().toLowerCase() === refUserName;
        const byStudentName =
          !!refStudentName &&
          String((s as any)?.student_name ?? "").trim().toLowerCase() === refStudentName;
        return byUserName || byStudentName;
      })
      .map((s) => String((s as any)?.id ?? "").trim())
      .filter(Boolean);
    const candidateIds = Array.from(new Set([cacheStudentId, ...fallbackIds]));

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreviewMap((prev) => {
      if (prev[cacheStudentId]) URL.revokeObjectURL(prev[cacheStudentId]);
      return { ...prev, [cacheStudentId]: previewUrl };
    });
    avatarMutation.mutate({ studentIds: candidateIds, cacheStudentId, file });
  };

  const saveLocalAvatar = (studentId: string, dataUrl: string) => {
    if (!studentId || !dataUrl) return;
    setAvatarOverrides((prev) => {
      const next = { ...prev, [studentId]: dataUrl };
      if (typeof window !== "undefined") {
        localStorage.setItem("students-avatar-overrides", JSON.stringify(next));
      }
      return next;
    });
  };

  const fileToDataUrl = async (file: File): Promise<string> => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read avatar file."));
      reader.readAsDataURL(file);
    });
  };

  const emojiPresets: Array<{ char: string; bg: string; fg?: string }> = [
    { char: "😀", bg: "#E8F5E9" },
    { char: "😄", bg: "#ECFDF5" },
    { char: "😁", bg: "#FEFCE8" },
    { char: "😎", bg: "#E3F2FD" },
    { char: "🤓", bg: "#EEF2FF" },
    { char: "🥳", bg: "#FCE7F3" },
    { char: "🤩", bg: "#FFF7ED" },
    { char: "😊", bg: "#ECFCCB" },
    { char: "😺", bg: "#FEF3C7" },
    { char: "🐶", bg: "#F1F5F9" },
    { char: "🐱", bg: "#FDF2F8" },
    { char: "🐼", bg: "#ECEFF1" },
    { char: "🦊", bg: "#FFF3E0" },
    { char: "🦁", bg: "#FFF8E1" },
    { char: "🐯", bg: "#FCE4EC" },
    { char: "🐸", bg: "#DCFCE7" },
    { char: "🐵", bg: "#FFF7ED" },
    { char: "🐧", bg: "#E0F2FE" },
    { char: "🐨", bg: "#F3F4F6" },
    { char: "🦄", bg: "#F5F3FF" },
    { char: "🐬", bg: "#E0F2FE" },
    { char: "🦋", bg: "#FCE7F3" },
    { char: "🌟", bg: "#FFFBEB" },
    { char: "🔥", bg: "#FFF1F2" },
    { char: "⚽", bg: "#F0FDF4" },
    { char: "🏀", bg: "#FFF7ED" },
    { char: "🎨", bg: "#FCE7F3" },
    { char: "🎵", bg: "#F5F3FF" },
    { char: "🚀", bg: "#E0F2FE" },
    { char: "📚", bg: "#ECFDF5" },
  ];

  const avatarFacePresets: Array<{ char: string; bg: string; fg?: string }> = [
    { char: "👧", bg: "#F3E5F5" },
    { char: "👦", bg: "#E8EAF6" },
    { char: "🧑", bg: "#F0FDF4" },
    { char: "👩", bg: "#FDF2F8" },
    { char: "👨", bg: "#EFF6FF" },
    { char: "🧒", bg: "#FEF3C7" },
    { char: "🧕", bg: "#FFF7ED" },
    { char: "👩‍🎓", bg: "#E0F2FE" },
    { char: "🧑‍🎓", bg: "#ECFDF5" },
    { char: "👨‍🎓", bg: "#EEF2FF" },
    { char: "👩‍💻", bg: "#E0F2FE" },
    { char: "🧑‍💻", bg: "#ECFEFF" },
    { char: "👨‍💻", bg: "#EFF6FF" },
    { char: "👩‍🔬", bg: "#F0FDF4" },
    { char: "🧑‍🔬", bg: "#ECFEFF" },
    { char: "👨‍🔬", bg: "#ECFCCB" },
    { char: "👩‍🏫", bg: "#FEF3C7" },
    { char: "🧑‍🏫", bg: "#FFFBEB" },
    { char: "👨‍🏫", bg: "#FFF7ED" },
    { char: "🧑‍🎨", bg: "#FCE7F3" },
    { char: "👩‍🎨", bg: "#FDF2F8" },
    { char: "👨‍🎨", bg: "#FAF5FF" },
    { char: "🧑‍🚀", bg: "#E0F2FE" },
    { char: "👩‍🚀", bg: "#DBEAFE" },
    { char: "👨‍🚀", bg: "#EFF6FF" },
    { char: "🧑‍⚕️", bg: "#ECFEFF" },
    { char: "👩‍⚕️", bg: "#F0F9FF" },
    { char: "👨‍⚕️", bg: "#E0F2FE" },
  ];

  const symbolPresets: Array<{ char: string; bg: string; fg?: string }> = [
    { char: "★", bg: "#FFF8E1", fg: "#B45309" },
    { char: "✦", bg: "#EEF2FF", fg: "#3730A3" },
    { char: "✪", bg: "#F5F3FF", fg: "#6D28D9" },
    { char: "✧", bg: "#FDF4FF", fg: "#A21CAF" },
    { char: "⚡", bg: "#FFFBEB", fg: "#B45309" },
    { char: "☀", bg: "#FEF3C7", fg: "#B45309" },
    { char: "☾", bg: "#E0E7FF", fg: "#3730A3" },
    { char: "☘", bg: "#ECFDF5", fg: "#065F46" },
    { char: "✿", bg: "#FDF2F8", fg: "#9D174D" },
    { char: "❖", bg: "#EEF2FF", fg: "#4338CA" },
    { char: "⬢", bg: "#ECFEFF", fg: "#155E75" },
    { char: "⬡", bg: "#F0FDF4", fg: "#166534" },
    { char: "⬣", bg: "#FFFBEB", fg: "#92400E" },
    { char: "⬟", bg: "#F3F4F6", fg: "#111827" },
    { char: "♞", bg: "#F3F4F6", fg: "#111827" },
    { char: "♜", bg: "#F8FAFC", fg: "#0F172A" },
    { char: "♛", bg: "#FEF3C7", fg: "#78350F" },
    { char: "♣", bg: "#ECFDF5", fg: "#14532D" },
    { char: "♠", bg: "#E2E8F0", fg: "#1E293B" },
    { char: "♥", bg: "#FFE4E6", fg: "#BE123C" },
    { char: "♦", bg: "#FEE2E2", fg: "#B91C1C" },
    { char: "♬", bg: "#FCE7F3", fg: "#9D174D" },
    { char: "♫", bg: "#F5F3FF", fg: "#6D28D9" },
    { char: "⌘", bg: "#E0F2FE", fg: "#0C4A6E" },
    { char: "∞", bg: "#E0F2FE", fg: "#0369A1" },
    { char: "Ω", bg: "#EEF2FF", fg: "#3730A3" },
    { char: "π", bg: "#ECFEFF", fg: "#155E75" },
    { char: "∑", bg: "#ECFCCB", fg: "#3F6212" },
    { char: "✓", bg: "#DCFCE7", fg: "#166534" },
    { char: "⚑", bg: "#FFF7ED", fg: "#9A3412" },
  ];

  const createAvatarDataUrl = (
    char: string,
    bgColor: string,
    fgColor?: string
  ): string => {
    if (typeof document === "undefined") return "";
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fgColor || "#0F766E";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 260px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";
    ctx.fillText(char, canvas.width / 2, canvas.height / 2 + 6);
    return canvas.toDataURL("image/png");
  };

  const openAvatarPicker = (student: any) => {
    if (!student?.id) {
      messageApi.error("Student not found for avatar change.");
      return;
    }
    setAvatarTargetStudent(student);
    setCustomAvatarChar("");
    setAvatarPresetTab("emoji");
    setIsAvatarPickerOpen(true);
  };

  const applyPresetAvatar = async (preset: { char: string; bg: string; fg?: string }) => {
    if (!avatarTargetStudent?.id) return;
    const dataUrl = createAvatarDataUrl(preset.char, preset.bg, preset.fg);
    if (!dataUrl) {
      messageApi.error("Failed to generate avatar image.");
      return;
    }
    saveLocalAvatar(String(avatarTargetStudent.id), dataUrl);
    messageApi.success("Avatar updated.");
    setIsAvatarPickerOpen(false);
  };

  const scoreColorClass = (score: number) => {
    if (score > 0) return "text-emerald-700";
    if (score < 0) return "text-red-600";
    return "text-slate-500";
  };

  const openBehaviorModalFor = (
    student: any,
    intent: "positive" | "negative"
  ) => {
    setIsWholeClassBehaviorMode(false);
    setSelectedStudentAction(student);
    setIsBehaviorModalOpen(false);
    setBehaviorIntent(intent);
    const filtered = behaviorTypes.filter((type) =>
      intent === "positive" ? Number(type.points) > 0 : Number(type.points) < 0
    );
    const firstType = filtered[0] || behaviorTypes[0];
    behaviorForm.setFieldsValue({
      type: firstType?.id,
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsBehaviorModalOpen(true);
  };

  const openWholeClassBehaviorModalFor = (intent: "positive" | "negative") => {
    setIsWholeClassBehaviorMode(true);
    setSelectedStudentAction(null);
    setIsWholeClassActionModalOpen(false);
    setIsBehaviorModalOpen(false);
    setBehaviorIntent(intent);
    const filtered = behaviorTypes.filter((type) =>
      intent === "positive" ? Number(type.points) > 0 : Number(type.points) < 0
    );
    const firstType = filtered[0] || behaviorTypes[0];
    behaviorForm.setFieldsValue({
      type: firstType?.id,
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsBehaviorModalOpen(true);
  };

  const handleInlineBehaviorSave = async () => {
    if (isBehaviorSubmitting) return;
    setIsBehaviorSubmitting(true);
    try {
      const values = await behaviorForm.validateFields();
      const selectedType = behaviorTypes.find(
        (type) => String(type.id) === String(values.type)
      );
      if (!selectedType) {
        messageApi.error("Please select a valid behavior type.");
        return;
      }
      if (isWholeClassBehaviorMode) {
        if (!presentStudents.length) {
          messageApi.warning("No present students found in this class.");
          return;
        }
        let successCount = 0;
        let failedCount = 0;
        for (const student of presentStudents) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await addBehaviour({
              student_id: student.id,
              behaviour_id: selectedType.id,
              description: values.description,
              date: values.date || new Date().toISOString().split("T")[0],
              teacher_id: currentUser?.id,
            });
            successCount += 1;
          } catch {
            failedCount += 1;
          }
        }
        queryClient.invalidateQueries({
          queryKey: ["class-students-behavior-summary", classIdStr],
        });
        if (failedCount === 0) {
          messageApi.success(`Behavior added to all ${successCount} present students.`);
        } else if (successCount > 0) {
          messageApi.warning(
            `Added to ${successCount} present students, ${failedCount} failed.`
          );
        } else {
          messageApi.error("Failed to apply behavior to present students.");
        }
        setIsBehaviorModalOpen(false);
        setIsWholeClassBehaviorMode(false);
        behaviorForm.resetFields();
        setIsBehaviorSubmitting(false);
        return;
      }
      if (!selectedStudentAction?.id) return;
      await addBehaviorMutation.mutateAsync({
        student_id: selectedStudentAction.id,
        behaviour_id: selectedType.id,
        description: values.description,
        date: values.date || new Date().toISOString().split("T")[0],
        teacher_id: currentUser?.id,
      });
    } catch {
      // validation handled by form
    } finally {
      setIsBehaviorSubmitting(false);
    }
  };

  const filteredModalBehaviorTypes = useMemo(() => {
    const filtered = behaviorTypes.filter((type) =>
      behaviorIntent === "positive"
        ? Number(type.points) > 0
        : Number(type.points) < 0
    );
    return filtered.length ? filtered : behaviorTypes;
  }, [behaviorTypes, behaviorIntent]);

  const findAbsentBehaviorType = useMemo(() => {
    return behaviorTypes.find((type) => {
      const name = normalizeText(type.name || "");
      return name.includes("attendance absent") || name === "absent";
    });
  }, [behaviorTypes]);

  const findPresentBehaviorType = useMemo(() => {
    return behaviorTypes.find((type) => {
      const name = normalizeText(type.name || "");
      return name.includes("attendance present") || name === "present";
    });
  }, [behaviorTypes]);

  const ensureAbsentBehaviorTypeId = async (): Promise<string> => {
    if (findAbsentBehaviorType?.id) {
      return String(findAbsentBehaviorType.id);
    }

    const neutralType = behaviorTypes.find((type) => Number(type.points) === 0);
    if (neutralType?.id) {
      return String(neutralType.id);
    }

    const fallbackAnyType = behaviorTypes[0];
    if (fallbackAnyType?.id) {
      return String(fallbackAnyType.id);
    }

    let createdId: string | number | undefined;
    try {
      const created = await addBehaviourType({
        name: "Attendance Absent",
        points: 0,
        color: "volcano",
      } as any);
      createdId = created?.data?.id || created?.id;
    } catch {
      const created = await addBehaviourType({
        name: "Attendance Absent",
      } as any);
      createdId = created?.data?.id || created?.id;
    }
    if (createdId) {
      await queryClient.invalidateQueries({ queryKey: ["behavior-types"] });
      return String(createdId);
    }

    const refreshed = (await queryClient.fetchQuery({
      queryKey: ["behavior-types"],
      queryFn: fetchBehaviourType,
    })) as BehaviorType[];
    const type = refreshed.find(
      (item) => normalizeText(item.name || "") === "attendance absent"
    );
    if (!type?.id) {
      throw new Error("Attendance behavior type not available.");
    }
    return String(type.id);
  };

  const ensurePresentBehaviorTypeId = async (): Promise<string> => {
    if (findPresentBehaviorType?.id) {
      return String(findPresentBehaviorType.id);
    }

    const neutralType = behaviorTypes.find((type) => Number(type.points) === 0);
    if (neutralType?.id) {
      return String(neutralType.id);
    }

    const fallbackAnyType = behaviorTypes[0];
    if (fallbackAnyType?.id) {
      return String(fallbackAnyType.id);
    }

    let createdId: string | number | undefined;
    try {
      const created = await addBehaviourType({
        name: "Attendance Present",
        points: 0,
        color: "green",
      } as any);
      createdId = created?.data?.id || created?.id;
    } catch {
      const created = await addBehaviourType({
        name: "Attendance Present",
      } as any);
      createdId = created?.data?.id || created?.id;
    }
    if (createdId) {
      await queryClient.invalidateQueries({ queryKey: ["behavior-types"] });
      return String(createdId);
    }

    const refreshed = (await queryClient.fetchQuery({
      queryKey: ["behavior-types"],
      queryFn: fetchBehaviourType,
    })) as BehaviorType[];
    const type = refreshed.find(
      (item) => normalizeText(item.name || "") === "attendance present"
    );
    if (!type?.id) {
      throw new Error("Attendance behavior type not available.");
    }
    return String(type.id);
  };

  const loadAttendanceForToday = async () => {
    if (!orderedStudents.length || !behaviorTypes.length) return;
    try {
      setAttendanceSyncing(true);
      const behaviorTypeById = new Map(
        behaviorTypes.map((type) => [String(type.id), type])
      );

      const rows = await Promise.all(
        orderedStudents.map(async (student) => {
          const studentId = toStudentId(student.id);
          const records = await fetchBehaviour(Number(studentId));
          const attendanceRecordsToday = (records || [])
            .filter((record: any) => (record?.date || "").slice(0, 10) === attendanceDate)
            .filter((record: any) => {
              const type = behaviorTypeById.get(String(record?.behaviour_id));
              return isAttendanceRecord(record, type?.name || "");
            })
            .sort((a: any, b: any) => getAttendanceEventTime(b) - getAttendanceEventTime(a));
          const latestAttendanceRecord = attendanceRecordsToday[0];
          const latestTypeName = latestAttendanceRecord
            ? behaviorTypeById.get(String(latestAttendanceRecord?.behaviour_id))?.name || ""
            : "";
          const latestIsAbsent = latestAttendanceRecord
            ? isAbsentAttendanceRecord(latestAttendanceRecord, latestTypeName)
            : false;

          return {
            studentId,
            isPresent: latestAttendanceRecord ? !latestIsAbsent : true,
            attendanceRecordId: latestAttendanceRecord?.id,
          };
        })
      );

      setAttendanceByStudent((prev) => {
        const next = { ...prev };
        rows.forEach((row) => {
          next[row.studentId] = {
            isPresent: row.isPresent,
            attendanceRecordId: row.attendanceRecordId,
          };
        });
        return next;
      });
    } catch {
      messageApi.warning("Unable to fully sync attendance. Using current view state.");
    } finally {
      setAttendanceSyncing(false);
    }
  };

  const attendanceLoadKey = useMemo(
    () => orderedStudents.map((s) => toStudentId(s.id)).join(","),
    [orderedStudents]
  );

  useEffect(() => {
    if (!orderedStudents.length || !behaviorTypes.length) return;
    loadAttendanceForToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceLoadKey, behaviorTypes.length, attendanceDate]);

  const setStudentAttendance = async (
    student: any,
    markPresent: boolean,
    options?: { silent?: boolean; skipSyncFlag?: boolean }
  ) => {
    const studentId = toStudentId(student.id);
    const previous = attendanceByStudent[studentId];
    const previousState: AttendanceState = {
      isPresent: previous?.isPresent !== false,
      attendanceRecordId: previous?.attendanceRecordId,
    };

    setAttendanceByStudent((prev) => ({
      ...prev,
      [studentId]: {
        isPresent: markPresent,
        attendanceRecordId: previous?.attendanceRecordId,
      },
    }));

    try {
      if (!options?.skipSyncFlag) setAttendanceSyncing(true);
      const behaviorTypeId = markPresent
        ? await ensurePresentBehaviorTypeId()
        : await ensureAbsentBehaviorTypeId();
      const teacherId = Number((currentUser as any)?.id || 0);
      const localTimeLabel = getLocalTimestampLabel(schoolTimeZone);
      const localDate = getLocalDateInTimeZone(schoolTimeZone);
      const payload = {
        student_id: Number(studentId),
        behaviour_id: Number(behaviorTypeId),
        description: `[Attendance] ${markPresent ? "Present" : "Absent"} @ ${localTimeLabel}`,
        date: localDate,
        ...(teacherId ? { teacher_id: teacherId } : {}),
      };

      const response = await addBehaviour(payload as any);
      const newRecordId = response?.data?.id || response?.id;
      if (newRecordId) {
        setAttendanceByStudent((prev) => ({
          ...prev,
          [studentId]: {
            isPresent: markPresent,
            attendanceRecordId: newRecordId,
          },
        }));
      }

      if (!options?.silent) {
        messageApi.success(
          `${student.student_name} marked ${markPresent ? "present" : "absent"}.`
        );
      }
      if (!options?.silent) {
        queryClient.invalidateQueries({
          queryKey: ["class-students-behavior-summary", classIdStr],
        });
      }
    } catch (error: any) {
      setAttendanceByStudent((prev) => ({
        ...prev,
        [studentId]: previousState,
      }));
      if (!options?.silent) {
        const backendMessage =
          error?.response?.data?.message ||
          error?.response?.data?.msg ||
          error?.response?.data?.data?.message ||
          "Failed to update attendance.";
        messageApi.error(String(backendMessage));
      }
    } finally {
      if (!options?.skipSyncFlag) setAttendanceSyncing(false);
    }
  };

  const markAllAttendance = async (markPresent: boolean) => {
    if (!orderedStudents.length) return;
    setAttendanceSyncing(true);
    try {
      for (const student of orderedStudents) {
        // eslint-disable-next-line no-await-in-loop
        await setStudentAttendance(student, markPresent, {
          silent: true,
          skipSyncFlag: true,
        });
      }
      messageApi.success(
        markPresent ? "All students marked present." : "All students marked absent."
      );
      queryClient.invalidateQueries({
        queryKey: ["class-students-behavior-summary", classIdStr],
      });
    } finally {
      setAttendanceSyncing(false);
    }
  };

  const presentStudents = useMemo(() => {
    return orderedStudents.filter((student) => {
      const entry = attendanceByStudent[toStudentId(student.id)];
      return entry?.isPresent !== false;
    });
  }, [orderedStudents, attendanceByStudent]);

  const handleResetLayout = () => {
    setSeatingItems(buildAutoLayout(orderedStudents, canvasWidth));
    setRoomMarkers(getDefaultRoomMarkers(canvasWidth));
    setMarkerOrientations(DEFAULT_MARKER_ORIENTATIONS);
    setLocalSeatingDirty(true);
  };

  const handleSaveLayout = () => {
    if (!seatingApiReady) {
      messageApi.error(seatingUnavailableMessage);
      return;
    }
    const payload: SeatingLayoutItem[] = seatingItems.map((item, idx) => ({
      student_id: item.student_id,
      x: item.x,
      y: item.y,
      z_index: item.z_index || idx + 1,
    }));
    saveSeatingMutation.mutate(payload);
  };

  const handlePickRandomStudent = () => {
    if (!presentStudents.length || isPickingRandom) return;
    setIsPickingRandom(true);
    let cycles = 0;
    const maxCycles = 35;
    const timer = window.setInterval(() => {
      const next =
        presentStudents[Math.floor(Math.random() * presentStudents.length)];
      setRandomStudent(next);
      cycles += 1;
      if (cycles >= maxCycles) {
        window.clearInterval(timer);
        setIsPickingRandom(false);
        if (next) {
          messageApi.success(`Selected: ${next.student_name}`);
        }
      }
    }, 90);
  };

  const toggleMarkerOrientation = (key: RoomMarkerKey) => {
    setMarkerOrientations((prev) => ({
      ...prev,
      [key]: prev[key] === "horizontal" ? "vertical" : "horizontal",
    }));
    setLocalSeatingDirty(true);
  };

  const seatMap = useMemo(() => {
    return new Map(seatingItems.map((item) => [item.student_id, item]));
  }, [seatingItems]);

  const seatingStudents = useMemo(() => {
    return orderedStudents.map((student) => {
      const seat = seatMap.get(student.id);
      return {
        ...student,
        seat,
      };
    });
  }, [orderedStudents, seatMap]);

  const isLoading = studentsLoading || summaryLoading;
  if (isLoading) {
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <Link href="/dashboard/years">Academic Years</Link> },
          {
            title: selectedYearId ? (
              <Link href={`/dashboard/classes?year=${selectedYearId}`}>Classes</Link>
            ) : (
              <Link href="/dashboard/classes">Classes</Link>
            ),
          },
          { title: <span>Students</span> },
        ]}
        className="!mb-2"
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-sm text-gray-600 mt-1">
            Behavior board + free-canvas seating plan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full border border-emerald-200 bg-white p-1">
            <button
              onClick={() => setViewMode("behavior")}
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm transition ${
                viewMode === "behavior"
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-gray-600 hover:text-emerald-700"
              }`}
            >
              Behavior Board
            </button>
            {canArrangeSeats && (
              <button
                onClick={() => setViewMode("seating")}
                className={`px-4 py-1.5 rounded-full text-xs md:text-sm transition ${
                  viewMode === "seating"
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-600 hover:text-emerald-700"
                }`}
              >
                Seating Plan
              </button>
            )}
          </div>
          {hasAccess && (
            <Button
              type="primary"
              className="!bg-primary !text-white hover:!bg-primary/90 !border-none"
              onClick={() => setIsAddStudentModalOpen(true)}
            >
              Add Student
            </Button>
          )}
          <Button
            onClick={() => {
              setIsRandomModalOpen(true);
              if (!randomStudent && presentStudents.length) {
                setRandomStudent(presentStudents[0]);
              }
            }}
            disabled={!presentStudents.length}
          >
            Random Student
          </Button>
        </div>
      </div>

      {viewMode === "behavior" && (
        <div className="mb-4 rounded-xl border border-emerald-100 bg-white px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type={isAttendanceMode ? "primary" : "default"}
              className={isAttendanceMode ? "!bg-primary !border-none" : ""}
              onClick={() => setIsAttendanceMode((prev) => !prev)}
            >
              {isAttendanceMode ? "Attendance Mode On" : "Attendance Mode"}
            </Button>
            <Button
              onClick={() => markAllAttendance(true)}
              loading={attendanceSyncing}
              disabled={!orderedStudents.length}
            >
              Mark All Present
            </Button>
            <Button
              danger
              onClick={() => markAllAttendance(false)}
              loading={attendanceSyncing}
              disabled={!orderedStudents.length}
            >
              Mark All Absent
            </Button>
            <span className="text-xs text-slate-500 ml-1">
              Present now: {presentStudents.length} / {orderedStudents.length}
            </span>
          </div>
        </div>
      )}

      {viewMode === "behavior" && (
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/30 p-4 md:p-5 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <div
              className="rounded-3xl bg-white border border-gray-200 p-4 shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => {
                if (!orderedStudents.length) return;
                setIsWholeClassActionModalOpen(true);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl">
                  C
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${scoreColorClass(wholeClassSummary.total)}`}>
                    {wholeClassSummary.total > 0 ? `+${wholeClassSummary.total}` : wholeClassSummary.total}
                  </div>
                  <div className="text-xs text-slate-400">class total</div>
                </div>
              </div>
              <div className="text-slate-600">Whole Class</div>
              <div className="text-xs text-slate-500 mt-1">
                {presentStudents.length} present,{" "}
                {Math.max(orderedStudents.length - presentStudents.length, 0)} absent
              </div>
              <div className="mt-2 text-xs text-emerald-700">Click to give/deduct points</div>
            </div>

            {orderedStudents.map((student) => {
              const studentId = toStudentId(student.id);
              const imageSrc =
                avatarPreviewMap[studentId] ||
                avatarOverrides[studentId] ||
                getStudentImagePath(student) ||
                "";
              const attendanceEntry = attendanceByStudent[studentId];
              const isPresent = attendanceEntry?.isPresent !== false;
              return (
                <div
                  key={studentId}
                  onClick={() => {
                    if (attendanceSyncing) return;
                    if (isAttendanceMode) {
                      setStudentAttendance(student, !isPresent);
                      return;
                    }
                    handleStudentClick(studentId);
                  }}
                  className={`rounded-3xl bg-white border border-gray-200 p-4 shadow-sm transition cursor-pointer ${
                    isPresent
                      ? "hover:shadow-md"
                      : "border-red-300 bg-red-100/70 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`h-16 w-16 rounded-full overflow-hidden flex items-center justify-center text-2xl font-semibold uppercase ${
                        isPresent
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-200 text-red-700"
                      }`}
                    >
                      {imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageSrc} alt={student.student_name} className="h-full w-full object-cover" />
                      ) : (
                        student.student_name?.charAt(0) || "S"
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${scoreColorClass(safeNumber(student.total_points))}`}>
                        {safeNumber(student.total_points) > 0
                          ? `+${safeNumber(student.total_points)}`
                          : safeNumber(student.total_points)}
                      </div>
                      <div className="text-xs text-slate-400">points</div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="text-lg font-semibold text-slate-800 truncate capitalize">
                      {student.student_name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">@{student.user_name || "N/A"}</div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        !isPresent
                          ? "bg-red-100 text-red-700"
                          : student.status === "active"
                          ? "bg-green-100 text-green-700"
                          : student.status === "inactive"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.status || "active"}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (attendanceSyncing) return;
                        setStudentAttendance(student, !isPresent);
                      }}
                      disabled={attendanceSyncing}
                      className={`text-xs px-2 py-1 rounded-full border ${
                        isPresent
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-600"
                      }`}
                    >
                      {isPresent ? "Present" : "Absent"}
                    </button>
                  </div>

                  <input
                    ref={(el) => {
                      fileInputsRef.current[studentId] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleAvatarPick(
                        {
                          id: student.id,
                          user_name: student.user_name,
                          student_name: student.student_name,
                        },
                        e.target.files?.[0]
                      )
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === "seating" && canArrangeSeats && (
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 md:p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-gray-600">
              Drag student cards to arrange seats. Snap: {GRID}px.
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleResetLayout}>Reset Auto Layout</Button>
              <Button
                type="primary"
                className="!bg-primary !text-white hover:!bg-primary/90 !border-none"
                onClick={handleSaveLayout}
                loading={saveSeatingMutation.isPending}
                disabled={!localSeatingDirty || !seatingApiReady}
              >
                Save Layout
              </Button>
            </div>
          </div>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-600 mr-1">Rotate labels:</span>
            <Button size="small" onClick={() => toggleMarkerOrientation("teacher")}>
              Teacher ({markerOrientations.teacher})
            </Button>
            <Button size="small" onClick={() => toggleMarkerOrientation("screen")}>
              Screen ({markerOrientations.screen})
            </Button>
            <Button size="small" onClick={() => toggleMarkerOrientation("door")}>
              Door ({markerOrientations.door})
            </Button>
          </div>

          {seatingQuery.isError && (
            <div className="mb-3 rounded-lg border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800 flex flex-wrap items-center justify-between gap-2">
              <span>{seatingUnavailableMessage}</span>
              <Button size="small" onClick={() => seatingQuery.refetch()}>
                Retry
              </Button>
            </div>
          )}

          <div ref={canvasContainerRef} className="overflow-hidden rounded-xl border border-gray-200">
            <div
              ref={canvasRef}
              className="relative mx-auto w-full h-[820px]"
              style={{
                backgroundColor: "#f8fafc",
                backgroundImage:
                  "linear-gradient(to right, rgba(16,185,129,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.08) 1px, transparent 1px)",
                backgroundSize: `${GRID}px ${GRID}px`,
              }}
            >
              <div
                className="absolute rounded-lg bg-white/95 border border-emerald-200 px-3 py-1.5 text-sm md:text-base font-semibold text-slate-700 cursor-move shadow-sm select-none"
                style={{
                  transform: `translate(${roomMarkers.screen.x}px, ${roomMarkers.screen.y}px)`,
                  width: `${getMarkerWidth(markerOrientations.screen)}px`,
                  height: `${getMarkerHeight(markerOrientations.screen)}px`,
                }}
                onDoubleClick={() => {
                  setMarkerOrientations((prev) => ({
                    ...prev,
                    screen: prev.screen === "horizontal" ? "vertical" : "horizontal",
                  }));
                  setLocalSeatingDirty(true);
                }}
                onMouseDown={(e) => {
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  setDraggingMarker({
                    key: "screen",
                    offsetX: e.clientX - rect.left,
                    offsetY: e.clientY - rect.top,
                  });
                  dragStartedRef.current = false;
                }}
              >
                <button
                  type="button"
                  className="absolute right-1 top-1 text-[11px] leading-none px-1 rounded bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200"
                  title="Toggle orientation"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMarkerOrientations((prev) => ({
                      ...prev,
                      screen:
                        prev.screen === "horizontal" ? "vertical" : "horizontal",
                    }));
                    setLocalSeatingDirty(true);
                  }}
                >
                  <SwapOutlined />
                </button>
                <span
                  className={
                    markerOrientations.screen === "vertical"
                      ? "inline-flex flex-col items-center leading-5"
                      : "inline-flex items-center gap-2"
                  }
                >
                  <span>{"\u{1F5A5}\uFE0F"}</span>
                  <span>Screen</span>
                </span>
              </div>
              <div
                className="absolute rounded-lg bg-white/95 border border-emerald-200 px-3 py-1.5 text-sm md:text-base font-semibold text-slate-700 cursor-move shadow-sm select-none"
                style={{
                  transform: `translate(${roomMarkers.door.x}px, ${roomMarkers.door.y}px)`,
                  width: `${getMarkerWidth(markerOrientations.door)}px`,
                  height: `${getMarkerHeight(markerOrientations.door)}px`,
                }}
                onDoubleClick={() => {
                  setMarkerOrientations((prev) => ({
                    ...prev,
                    door: prev.door === "horizontal" ? "vertical" : "horizontal",
                  }));
                  setLocalSeatingDirty(true);
                }}
                onMouseDown={(e) => {
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  setDraggingMarker({
                    key: "door",
                    offsetX: e.clientX - rect.left,
                    offsetY: e.clientY - rect.top,
                  });
                  dragStartedRef.current = false;
                }}
              >
                <button
                  type="button"
                  className="absolute right-1 top-1 text-[11px] leading-none px-1 rounded bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200"
                  title="Toggle orientation"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMarkerOrientations((prev) => ({
                      ...prev,
                      door: prev.door === "horizontal" ? "vertical" : "horizontal",
                    }));
                    setLocalSeatingDirty(true);
                  }}
                >
                  <SwapOutlined />
                </button>
                <span
                  className={
                    markerOrientations.door === "vertical"
                      ? "inline-flex flex-col items-center leading-5"
                      : "inline-flex items-center gap-2"
                  }
                >
                  <span>{"\u{1F6AA}"}</span>
                  <span>Door</span>
                </span>
              </div>
              <div
                className="absolute rounded-lg bg-white/95 border border-emerald-200 px-3 py-1.5 text-sm md:text-base font-semibold text-slate-700 cursor-move shadow-sm select-none"
                style={{
                  transform: `translate(${roomMarkers.teacher.x}px, ${roomMarkers.teacher.y}px)`,
                  width: `${getMarkerWidth(markerOrientations.teacher)}px`,
                  height: `${getMarkerHeight(markerOrientations.teacher)}px`,
                }}
                onDoubleClick={() => {
                  setMarkerOrientations((prev) => ({
                    ...prev,
                    teacher:
                      prev.teacher === "horizontal" ? "vertical" : "horizontal",
                  }));
                  setLocalSeatingDirty(true);
                }}
                onMouseDown={(e) => {
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  setDraggingMarker({
                    key: "teacher",
                    offsetX: e.clientX - rect.left,
                    offsetY: e.clientY - rect.top,
                  });
                  dragStartedRef.current = false;
                }}
              >
                <button
                  type="button"
                  className="absolute right-1 top-1 text-[11px] leading-none px-1 rounded bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200"
                  title="Toggle orientation"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMarkerOrientations((prev) => ({
                      ...prev,
                      teacher:
                        prev.teacher === "horizontal" ? "vertical" : "horizontal",
                    }));
                    setLocalSeatingDirty(true);
                  }}
                >
                  <SwapOutlined />
                </button>
                <span
                  className={
                    markerOrientations.teacher === "vertical"
                      ? "inline-flex flex-col items-center leading-5"
                      : "inline-flex items-center gap-2"
                  }
                >
                  <span>{"\u{1F9D1}\u200D\u{1F3EB}"}</span>
                  <span>Teacher</span>
                </span>
              </div>
              {seatingStudents.map((student) => {
                const seat = student.seat;
                if (!seat) return null;
                const isPresent = attendanceByStudent[toStudentId(student.id)]?.isPresent !== false;
                const studentId = toStudentId(student.id);
                const seatingImageSrc =
                  avatarPreviewMap[studentId] ||
                  avatarOverrides[studentId] ||
                  getStudentImagePath(student) ||
                  "";

                return (
                  <div
                    key={student.id}
                    className={`absolute rounded-xl shadow-sm px-3 py-2 select-none cursor-move ${
                      isPresent
                        ? "border border-slate-300 bg-white"
                        : "border border-red-300 bg-red-100/70"
                    }`}
                    style={{
                      width: `${SEAT_CARD_WIDTH}px`,
                      height: `${SEAT_CARD_HEIGHT}px`,
                      transform: `translate(${seat.x}px, ${seat.y}px)`,
                      zIndex: seat.z_index,
                    }}
                    onMouseDown={(e) => {
                      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                      setDragging({
                        id: student.id,
                        offsetX: e.clientX - rect.left,
                        offsetY: e.clientY - rect.top,
                      });
                      dragStartedRef.current = false;
                    }}
                    onClick={() => handleStudentClick(student.id)}
                  >
                    <div className="text-lg font-semibold text-slate-700 truncate capitalize">
                      {student.student_name}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 overflow-hidden flex items-center justify-center text-sm font-semibold uppercase text-emerald-700">
                        {seatingImageSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={seatingImageSrc}
                            alt={student.student_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          student.student_name?.charAt(0) || "S"
                        )}
                      </div>
                      <div className="text-xs text-slate-500 truncate">@{student.user_name || "N/A"}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!canArrangeSeats && viewMode === "seating" && (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
          You do not have permission to edit seating plan.
        </div>
      )}

      <AddStudentModal
        open={isAddStudentModalOpen}
        onCancel={() => setIsAddStudentModalOpen(false)}
        onOk={handleAddNewStudent}
        classId={Number(classIdStr)}
      />

      <Modal
        title="Whole Class Actions"
        open={isWholeClassActionModalOpen}
        onCancel={() => setIsWholeClassActionModalOpen(false)}
        footer={null}
        centered
      >
        <div className="space-y-3">
          <div className="text-sm text-slate-600">
            Apply the same behavior to all students in this class.
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => openWholeClassBehaviorModalFor("positive")}
              className="!border-emerald-300 !text-emerald-700"
            >
              Give Points
            </Button>
            <Button
              onClick={() => openWholeClassBehaviorModalFor("negative")}
              className="!border-red-300 !text-red-600"
            >
              Deduct Points
            </Button>
          </div>
        </div>
      </Modal>

      <EditStudentModal
        open={!!editStudent}
        onCancel={() => setEditStudent(null)}
        onOk={handleSaveEdit}
        student={editStudent}
      />

      <Modal
        title={selectedStudentAction ? `${selectedStudentAction.student_name}` : "Student Actions"}
        open={!!selectedStudentAction}
        onCancel={() => setSelectedStudentAction(null)}
        footer={null}
        centered
      >
        {selectedStudentAction && (
          <div className="space-y-3">
            <div className="text-sm text-slate-600">
              Manage points, profile and student settings.
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  openBehaviorModalFor(selectedStudentAction, "positive");
                }}
                className="!border-emerald-300 !text-emerald-700"
              >
                Give Points
              </Button>
              <Button
                icon={<MinusCircleOutlined />}
                onClick={() => {
                  openBehaviorModalFor(selectedStudentAction, "negative");
                }}
                className="!border-red-300 !text-red-600"
              >
                Deduct Points
              </Button>
              {hasAccess && (
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditStudent(selectedStudentAction);
                    setSelectedStudentAction(null);
                  }}
                >
                  Edit
                </Button>
              )}
              {hasAccess && (
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => {
                    showDeleteConfirm(selectedStudentAction);
                    setSelectedStudentAction(null);
                  }}
                >
                  Delete
                </Button>
              )}
              <Button
                icon={<PictureOutlined />}
                onClick={() => openAvatarPicker(selectedStudentAction)}
                className="col-span-2 !border-emerald-300 !text-emerald-700"
              >
                Change Avatar
              </Button>
              <Button
                onClick={() =>
                  router.push(
                    `/dashboard/students/${classIdStr}/${selectedStudentAction.id}/student_dashboard`
                  )
                }
                className="col-span-2"
              >
                Open Student Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={`Choose Avatar${avatarTargetStudent?.student_name ? `: ${avatarTargetStudent.student_name}` : ""}`}
        open={isAvatarPickerOpen}
        onCancel={() => setIsAvatarPickerOpen(false)}
        footer={null}
        centered
      >
        <div className="space-y-3">
          <input
            ref={pickerAvatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const studentId = String(avatarTargetStudent?.id || "");
              const file = e.target.files?.[0];
              if (!studentId || !file) return;
              fileToDataUrl(file)
                .then((dataUrl) => {
                  saveLocalAvatar(studentId, dataUrl);
                  messageApi.success("Avatar updated.");
                })
                .catch(() => {
                  messageApi.error("Failed to read selected image.");
                });
              setIsAvatarPickerOpen(false);
            }}
          />
          <Button
            block
            onClick={() => pickerAvatarInputRef.current?.click()}
            className="!border-emerald-300 !text-emerald-700"
          >
            Upload Photo
          </Button>

          <div className="grid grid-cols-3 gap-2">
            <Button
              type={avatarPresetTab === "emoji" ? "primary" : "default"}
              className={avatarPresetTab === "emoji" ? "!bg-primary !border-none" : ""}
              onClick={() => setAvatarPresetTab("emoji")}
            >
              Emojis
            </Button>
            <Button
              type={avatarPresetTab === "avatar" ? "primary" : "default"}
              className={avatarPresetTab === "avatar" ? "!bg-primary !border-none" : ""}
              onClick={() => setAvatarPresetTab("avatar")}
            >
              Avatars
            </Button>
            <Button
              type={avatarPresetTab === "symbol" ? "primary" : "default"}
              className={avatarPresetTab === "symbol" ? "!bg-primary !border-none" : ""}
              onClick={() => setAvatarPresetTab("symbol")}
            >
              Symbols
            </Button>
          </div>

          <div className="text-xs text-slate-500">
            {avatarPresetTab === "emoji"
              ? `${emojiPresets.length} emojis`
              : avatarPresetTab === "avatar"
              ? `${avatarFacePresets.length} avatars`
              : `${symbolPresets.length} symbols`}
          </div>

          <div className="max-h-56 overflow-y-auto pr-1">
            <div className="grid grid-cols-4 gap-2">
              {(avatarPresetTab === "emoji"
                ? emojiPresets
                : avatarPresetTab === "avatar"
                ? avatarFacePresets
                : symbolPresets
              ).map((preset, index) => (
                <button
                  key={`${avatarPresetTab}-${preset.char}-${index}`}
                  type="button"
                  onClick={() => applyPresetAvatar(preset)}
                  className="cursor-pointer h-16 rounded-xl border border-slate-200 text-3xl flex items-center justify-center hover:scale-[1.03] transition"
                  style={{ backgroundColor: preset.bg, color: preset.fg || "#0F766E" }}
                  title={`Use ${preset.char}`}
                >
                  {preset.char}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              value={customAvatarChar}
              onChange={(e) => setCustomAvatarChar(e.target.value.slice(0, 2))}
              placeholder="Custom emoji/symbol"
              maxLength={2}
            />
            <Button
              onClick={() => {
                const value = customAvatarChar.trim();
                if (!value) return;
                applyPresetAvatar({ char: value, bg: "#ECFEFF", fg: "#155E75" });
              }}
            >
              Use
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={handleDeleteStudent}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        {studentToDelete && (
          <p>
            Are you sure you want to delete {studentToDelete.student_name}? This
            action cannot be undone.
          </p>
        )}
      </Modal>

      <BehaviorModal
        visible={isBehaviorModalOpen}
        onCancel={() => {
          if (isBehaviorSubmitting) return;
          setIsBehaviorModalOpen(false);
          setIsWholeClassBehaviorMode(false);
          behaviorForm.resetFields();
        }}
        onOk={handleInlineBehaviorSave}
        studentName={isWholeClassBehaviorMode ? "Whole Class" : selectedStudentAction?.student_name || "Student"}
        behaviorTypes={filteredModalBehaviorTypes}
        form={behaviorForm}
        isEditing={false}
        confirmLoading={isBehaviorSubmitting}
      />

      <Modal
        title="Random Student Picker"
        open={isRandomModalOpen}
        onCancel={() => {
          if (!isPickingRandom) setIsRandomModalOpen(false);
        }}
        footer={[
          <Button
            key="spin"
            type="primary"
            className="!bg-primary !text-white hover:!bg-primary/90 !border-none"
            onClick={handlePickRandomStudent}
            loading={isPickingRandom}
            disabled={!presentStudents.length}
          >
            Spin Wheel
          </Button>,
          <Button
            key="close"
            onClick={() => setIsRandomModalOpen(false)}
            disabled={isPickingRandom}
          >
            Close
          </Button>,
        ]}
        centered
      >
        <div className="py-2">
          <div className="mx-auto relative w-64 h-64">
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 text-red-500 text-lg">
              <DownOutlined />
            </div>
            <div
              className={`w-full h-full rounded-full border-8 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center shadow-inner ${
                isPickingRandom ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "900ms" }}
            >
              <div className="w-40 h-40 rounded-full bg-white border border-emerald-100 flex items-center justify-center text-center px-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Selected</div>
                  <div className="text-lg font-semibold text-slate-800 break-words capitalize">
                    {randomStudent?.student_name || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Press <strong>Spin Wheel</strong> to pick one student randomly.
            {" "}Absent students are excluded.
          </p>
          {!presentStudents.length && (
            <p className="text-center text-sm text-red-500 mt-2">
              No present students available for random selection.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
