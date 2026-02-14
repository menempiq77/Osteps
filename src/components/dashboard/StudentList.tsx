"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Breadcrumb,
  Button,
  Form,
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
const SEAT_CARD_WIDTH = 180;
const SEAT_CARD_HEIGHT = 100;
const MARKER_WIDTH_HORIZONTAL = 170;
const MARKER_HEIGHT_HORIZONTAL = 40;
const MARKER_WIDTH_VERTICAL = 56;
const MARKER_HEIGHT_VERTICAL = 170;
const EMPTY_LIST: any[] = [];
const DEFAULT_ROOM_MARKERS: RoomMarkers = {
  teacher: { x: 24, y: 380 },
  screen: { x: 560, y: 8 },
  door: { x: 1030, y: 8 },
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

const buildAutoLayout = (students: Student[]): SeatingStateItem[] => {
  const columns = [90, 300, 800, 1010];
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
  const [isBehaviorModalOpen, setIsBehaviorModalOpen] = useState(false);
  const [behaviorIntent, setBehaviorIntent] = useState<"positive" | "negative">(
    "positive"
  );
  const [behaviorForm] = Form.useForm();
  const [avatarPreviewMap, setAvatarPreviewMap] = useState<Record<string, string>>(
    {}
  );
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
  const [roomMarkers, setRoomMarkers] = useState<RoomMarkers>(
    DEFAULT_ROOM_MARKERS
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
  const [isAttendanceMode, setIsAttendanceMode] = useState(false);
  const [attendanceByStudent, setAttendanceByStudent] = useState<
    Record<string, AttendanceState>
  >({});
  const [attendanceSyncing, setAttendanceSyncing] = useState(false);
  const dragStartedRef = useRef(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({});
  const actionAvatarInputRef = useRef<HTMLInputElement | null>(null);
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
      queryClient.invalidateQueries({ queryKey: ["students", classIdStr] });
      queryClient.invalidateQueries({
        queryKey: ["class-students-behavior-summary", classIdStr],
      });
      setEditStudent(null);
      messageApi.success("Student updated successfully.");
    },
    onError: () => {
      messageApi.error("Failed to update student.");
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
    mutationFn: ({
      studentId,
      file,
    }: {
      studentId: string;
      file: File;
    }) => uploadStudentAvatar(classIdStr as string, studentId, file),
    onSuccess: (response, variables) => {
      const studentId = variables.studentId;
      const serverPath = extractAvatarPath(response);
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
    onError: (_, variables) => {
      setAvatarPreviewMap((prev) => {
        if (prev[variables.studentId]) URL.revokeObjectURL(prev[variables.studentId]);
        const next = { ...prev };
        delete next[variables.studentId];
        return next;
      });
      messageApi.error("Failed to update avatar.");
    },
  });

  const saveSeatingMutation = useMutation({
    mutationFn: (items: SeatingLayoutItem[]) =>
      saveClassSeatingLayout(classIdStr as string, {
        items,
        room_meta: {
          width: 1240,
          height: 820,
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
        return {
        id: toStudentId(s.id),
        student_name: s.student_name,
        user_name: s.user_name,
        email: s.email,
        class_id: s.class_id,
        class_name: s.class_name,
        status: s.status || "active",
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
    if (!orderedStudents.length) return;
    if (canArrangeSeats && seatingQuery.data?.items?.length) {
      const fromApi = seatingQuery.data.items.map((item, index) => ({
        student_id: toStudentId(item.student_id),
        x: safeNumber(item.x),
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
        setRoomMarkers({
          teacher: markers.teacher || DEFAULT_ROOM_MARKERS.teacher,
          screen: markers.screen || DEFAULT_ROOM_MARKERS.screen,
          door: markers.door || DEFAULT_ROOM_MARKERS.door,
        });
        setMarkerOrientations({
          teacher: savedOrientations?.teacher || DEFAULT_MARKER_ORIENTATIONS.teacher,
          screen: savedOrientations?.screen || DEFAULT_MARKER_ORIENTATIONS.screen,
          door: savedOrientations?.door || DEFAULT_MARKER_ORIENTATIONS.door,
        });
      } else {
        setRoomMarkers(DEFAULT_ROOM_MARKERS);
        setMarkerOrientations(DEFAULT_MARKER_ORIENTATIONS);
      }
      setLocalSeatingDirty(false);
      return;
    }
    const auto = buildAutoLayout(orderedStudents);
    setSeatingItems((prev) => (areSeatLayoutsEqual(prev, auto) ? prev : auto));
    setRoomMarkers(DEFAULT_ROOM_MARKERS);
    setMarkerOrientations(DEFAULT_MARKER_ORIENTATIONS);
    setLocalSeatingDirty(false);
  }, [orderedStudents, seatingQuery.data, canArrangeSeats]);

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
    if (!editStudent) return;
    updateStudentMutation.mutate({
      id: editStudent.id,
        values: {
          student_name: values.student_name,
          email: values.email,
          user_name: values.user_name,
          class_id: Number(classIdStr),
          password: values.password,
          status: values.status,
          gender: values.gender,
          student_gender: values.gender,
        },
      });
  };

  const showDeleteConfirm = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteStudent = () => {
    if (!studentToDelete) return;
    deleteStudentMutation.mutate(studentToDelete.id);
  };

  const handleAvatarPick = (studentId: string, file?: File) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreviewMap((prev) => {
      if (prev[studentId]) URL.revokeObjectURL(prev[studentId]);
      return { ...prev, [studentId]: previewUrl };
    });
    avatarMutation.mutate({ studentId, file });
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

  const handleInlineBehaviorSave = async () => {
    if (!selectedStudentAction?.id) return;
    try {
      const values = await behaviorForm.validateFields();
      const selectedType = behaviorTypes.find(
        (type) => String(type.id) === String(values.type)
      );
      if (!selectedType) {
        messageApi.error("Please select a valid behavior type.");
        return;
      }
      addBehaviorMutation.mutate({
        student_id: selectedStudentAction.id,
        behaviour_id: selectedType.id,
        description: values.description,
        date: values.date || new Date().toISOString().split("T")[0],
        teacher_id: currentUser?.id,
      });
    } catch {
      // validation handled by form
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
    setSeatingItems(buildAutoLayout(orderedStudents));
    setRoomMarkers(DEFAULT_ROOM_MARKERS);
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
            <div className="rounded-3xl bg-white border border-gray-200 p-4 shadow-sm">
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
            </div>

            {orderedStudents.map((student) => {
              const studentId = toStudentId(student.id);
              const imageSrc =
                avatarPreviewMap[studentId] || getStudentImagePath(student) || "";
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
                      : "opacity-65 border-red-200 bg-red-50/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="h-16 w-16 rounded-full bg-emerald-100 overflow-hidden flex items-center justify-center text-2xl text-emerald-700 font-semibold uppercase">
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
                        student.status === "active"
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
                    onChange={(e) => handleAvatarPick(studentId, e.target.files?.[0])}
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

          <div className="overflow-auto rounded-xl border border-gray-200">
            <div
              ref={canvasRef}
              className="relative mx-auto min-w-[1240px] h-[820px]"
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

                return (
                  <div
                    key={student.id}
                    className="absolute rounded-xl border border-slate-300 bg-white shadow-sm px-3 py-2 select-none cursor-move"
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
                        {getStudentImagePath(student) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={getStudentImagePath(student) || ""}
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
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  setEditStudent(selectedStudentAction);
                  setSelectedStudentAction(null);
                }}
              >
                Edit
              </Button>
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
              <input
                ref={actionAvatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleAvatarPick(selectedStudentAction.id, e.target.files?.[0])
                }
              />
              <Button
                icon={<PictureOutlined />}
                onClick={() => actionAvatarInputRef.current?.click()}
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
          setIsBehaviorModalOpen(false);
          behaviorForm.resetFields();
        }}
        onOk={handleInlineBehaviorSave}
        studentName={selectedStudentAction?.student_name || "Student"}
        behaviorTypes={filteredModalBehaviorTypes}
        form={behaviorForm}
        isEditing={false}
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
