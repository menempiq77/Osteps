"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  Tag,
  Select,
  Button,
  Form,
  message,
  List,
  Avatar,
  Statistic,
  Popconfirm,
  Space,
} from "antd";
import {
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import BehaviorModal from "@/components/modals/behaviorModals/BehaviorModal";
import BehaviorTypeModal from "@/components/modals/behaviorModals/BehaviorTypeModal";
import {
  addBehaviour,
  addBehaviourType,
  deleteBehaviour,
  deleteBehaviourType,
  fetchBehaviour,
  fetchBehaviourType,
  updateBehaviour,
  updateBehaviourType,
} from "@/services/behaviorApi";
import { fetchStudents } from "@/services/studentsApi";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import { resolveSubjectClassLinkedIdWithFallback } from "@/lib/subjectClassResolution";
import { useQuery } from "@tanstack/react-query";
import { fetchClasses } from "@/services/classesApi";

const { Option } = Select;

type BehaviorType = {
  id: string;
  name: string;
  points: number;
  color: string;
};

type Behavior = {
  id: string;
  behaviour_id: string;
  description: string;
  date: string;
  points: number;
  teacher?: {
    teacher_name?: string;
  };
};

type Student = {
  id: string;
  student_name: string;
  points: number;
  class?: string;
  behaviors?: Behavior[];
  avatar?: string;
};

interface CurrentUser {
  student?: string;
  avatar?: string;
  name?: string;
  class?: string;
  role?: string;
  school?: string;
}

const StudentBehaviorPage = () => {
  const searchParams = useSearchParams();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isBehaviorModalVisible, setIsBehaviorModalVisible] = useState(false);
  const [isTypeModalVisible, setIsTypeModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [typeForm] = Form.useForm();
  const [filter, setFilter] = useState("all");
  const [editingType, setEditingType] = useState(null);
  const { currentUser } = useSelector((state: RootState) => state.auth) as {
    currentUser: CurrentUser;
  };
  const [behaviorTypes, setBehaviorTypes] = useState<BehaviorType[]>([]);
  const [behaviors, setBehaviors] = useState<Behavior[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBehavior, setEditingBehavior] = useState(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const schoolId = currentUser?.school;
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
  const [messageApi, contextHolder] = message.useMessage();
  const [pendingClassId, setPendingClassId] = useState<string | null>(null);
  const [pendingStudentId, setPendingStudentId] = useState<string | null>(null);
  const [pendingIntent, setPendingIntent] = useState<"positive" | "negative" | null>(null);
  const [pendingOpenAdd, setPendingOpenAdd] = useState(false);
  const [autoOpenedFromQuery, setAutoOpenedFromQuery] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const didInitSubject = useRef(false);
  const { subjects, activeSubjectId } = useSubjectContext();
  const roleKey = String(currentUser?.role || "").toUpperCase();
  const isSchoolAdmin = roleKey === "SCHOOL_ADMIN";
  const isHODRole = roleKey === "HOD";
  const isTeacher = roleKey === "TEACHER";
  const useAssignedYears = isTeacher || isHODRole;
  const isStudentRole = roleKey === "STUDENT";
  const canManageBehavior = roleKey === "SCHOOL_ADMIN" || roleKey === "HOD" || roleKey === "TEACHER";
  const effectiveSubjectId = selectedSubjectId === "all" ? undefined : Number(selectedSubjectId);
  const canMutateBehavior =
    isSchoolAdmin || ((isHODRole || isTeacher) && selectedSubjectId !== "all");

  useEffect(() => {
    const classId = searchParams.get("classId");
    const studentId = searchParams.get("studentId");
    const intent = searchParams.get("intent");
    const openAdd = searchParams.get("openAdd");

    if (classId) setPendingClassId(classId);
    if (studentId) setPendingStudentId(studentId);
    if (intent === "positive" || intent === "negative") setPendingIntent(intent);
    if (openAdd === "1") setPendingOpenAdd(true);
  }, [searchParams]);

  /** Load years – filtered by subject when a specific subject is selected */
  const loadYears = async (subjectIdArg: string, prevSelectedYear: string | null) => {
    try {
      setLoading(true);
      let yearsData: any[] = [];

      if (subjectIdArg !== "all") {
        // Fetch school years + subject-class assignments, then intersect
        const [schoolYears, subjectClasses] = await Promise.all([
          fetchYearsBySchool(schoolId),
          fetchSubjectClasses({ subject_id: Number(subjectIdArg) }),
        ]);
        const resolveYearId = (row: any): number =>
          Number(row?.year_id ?? row?.class?.year_id ?? row?.classes?.year_id ?? row?.base_class?.year_id ?? 0);
        const subjectYearIds = new Set(
          (Array.isArray(subjectClasses) ? subjectClasses : [])
            .map(resolveYearId)
            .filter((id) => Number.isFinite(id) && id > 0)
        );
        yearsData = (Array.isArray(schoolYears) ? schoolYears : []).filter(
          (year: any) => subjectYearIds.has(Number(year?.id))
        );
      } else if (useAssignedYears) {
        const res = await fetchAssignYears();
        const years = res
          .map((item: any) => item?.classes?.year)
          .filter((year: any) => year);
        yearsData = Array.from(
          new Map(years?.map((year: any) => [year.id, year])).values()
        );
      } else {
        // All Subjects: union of years that have active subject-class assignments
        const resolveYearId = (row: any): number =>
          Number(row?.year_id ?? row?.class?.year_id ?? row?.classes?.year_id ?? row?.base_class?.year_id ?? 0);
        const [schoolYears, allSubjectClassesArr] = await Promise.all([
          fetchYearsBySchool(schoolId),
          Promise.all(subjects.map((s) => fetchSubjectClasses({ subject_id: s.id }).catch(() => []))),
        ]);
        const validYearIds = new Set(
          allSubjectClassesArr
            .flat()
            .map(resolveYearId)
            .filter((id) => Number.isFinite(id) && id > 0)
        );
        yearsData = (Array.isArray(schoolYears) ? schoolYears : []).filter(
          (year: any) => validYearIds.has(Number(year?.id))
        );
      }

      setYears(yearsData);

      // Keep the current year selected only if it still exists in the new list;
      // otherwise fall back to the first available year.
      if (yearsData.length > 0) {
        const currentStillValid = prevSelectedYear &&
          yearsData.some((y: any) => y.id.toString() === prevSelectedYear);
        if (!currentStillValid) {
          setSelectedYear(yearsData[0].id.toString());
          setSelectedClass(null);
        }
      } else {
        setSelectedYear(null);
        setSelectedClass(null);
      }
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to load years");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadYears(selectedSubjectId, selectedYear);
    setSelectedClass(null); // class IDs differ between subject-class and school-class
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubjectId]);

  // One-time initialization: pre-select the active subject from the URL/context.
  // Uses a ref so re-renders never override the user's manual subject selection.
  useEffect(() => {
    if (didInitSubject.current) return;
    if (!subjects.length) return;
    if (activeSubjectId) {
      setSelectedSubjectId(String(activeSubjectId));
      didInitSubject.current = true;
      return;
    }
    if (!isSchoolAdmin && subjects[0]?.id) {
      setSelectedSubjectId(String(subjects[0].id));
      didInitSubject.current = true;
    }
  }, [subjects, activeSubjectId, isSchoolAdmin]);

  /** Fetch classes for selected year, scoped to subject when one is selected */
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ["classes", selectedYear, useAssignedYears, effectiveSubjectId],
    queryFn: async () => {
      if (!selectedYear) return [];
      if (useAssignedYears) {
        const res = await fetchAssignYears();
        let classesData = res
          .map((item: any) => item.classes)
          .filter((cls: any) => cls);
        classesData = Array.from(
          new Map(classesData.map((cls: any) => [cls.id, cls])).values()
        );
        return classesData.filter(
          (cls: any) => cls.year_id === Number(selectedYear)
        );
      } else if (effectiveSubjectId) {
        // Subject-specific: fetch subject-classes and resolve linked school class IDs
        // Uses resolveSubjectClassLinkedIdWithFallback for proper label-based inference
        // (same pattern as classes/page.tsx)
        const subjectClasses = await fetchSubjectClasses({
          subject_id: effectiveSubjectId,
          year_id: Number(selectedYear),
        });
        const resolved = await Promise.all(
          (Array.isArray(subjectClasses) ? subjectClasses : [])
            .filter((row: any) => Number(row.is_active ?? 1) === 1)
            .map(async (row: any) => {
              const linkedClassId = await resolveSubjectClassLinkedIdWithFallback(
                row,
                effectiveSubjectId
              );
              return {
                id: String(row.id),
                class_name: String(row.base_class_label ?? row.name ?? `Class ${row.id}`),
                year_id: Number(row.year_id ?? selectedYear),
                linked_class_id: linkedClassId,
              };
            })
        );
        return resolved;
      } else {
        return await fetchClasses(Number(selectedYear));
      }
    },
    enabled: !!selectedYear,
  });

  const loadStudents = async () => {
    if (!selectedClass) {
      setStudents([]);
      setSelectedStudentId("");
      return;
    }

    try {
      setIsLoading(true);

      // When a specific subject is selected, subject-classes are used.
      // Each class entry has a linked_class_id (base school class ID) and its own id is the subject_class_id.
      const classEntry = (classes as any[]).find(
        (c: any) => String(c.id) === String(selectedClass)
      );
      const subjectClassId =
        effectiveSubjectId && classEntry?.linked_class_id
          ? String(classEntry.id)
          : null;
      // Use the linked school class ID when available; otherwise use selectedClass directly.
      const fetchClassId =
        effectiveSubjectId && classEntry?.linked_class_id
          ? classEntry.linked_class_id
          : selectedClass;

      // Pass 1: with subject_class_id filter
      let studentsData = await fetchStudents(
        fetchClassId,
        effectiveSubjectId ?? null,
        subjectClassId,
      );

      // Pass 2: if empty and subject_class_id was applied, retry without it
      // (handles students added before enrollment row was created)
      if (!studentsData?.length && subjectClassId) {
        studentsData = await fetchStudents(
          fetchClassId,
          effectiveSubjectId ?? null,
          undefined,
        );
      }

      setStudents(studentsData);

      const preferredStudent =
        pendingStudentId &&
        studentsData.find(
          (s: any) => String(s.id).toLowerCase() === String(pendingStudentId).toLowerCase()
        );
      const initialId = preferredStudent?.id || studentsData[0]?.id || "";
      setSelectedStudentId(String(initialId));

      return studentsData;
    } catch (err) {
      setError("Failed to load students");
      console.error("Error loading students:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Load students whenever class or subject selection changes
  useEffect(() => {
    loadStudents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, selectedSubjectId, pendingStudentId]);

  useEffect(() => {
    if (isStudentRole && currentUser?.student) {
      setSelectedStudentId(String(currentUser.student));
    }
  }, [isStudentRole, currentUser?.student]);

  useEffect(() => {
    if (!pendingClassId || !classes?.length) return;
    const hasClass = classes.some(
      (cls: any) => String(cls.id).toLowerCase() === String(pendingClassId).toLowerCase()
    );
    if (hasClass && String(selectedClass || "") !== String(pendingClassId)) {
      setSelectedClass(String(pendingClassId));
    }
  }, [pendingClassId, classes, selectedClass]);

  const loadBehaviorTypes = async () => {
    try {
      setIsLoading(true);
      const behaviourType = await fetchBehaviourType(effectiveSubjectId);
      setBehaviorTypes(behaviourType);
    } catch (err) {
      setError("Failed to load behaviour Type");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const loadBehavior = async () => {
    if (!selectedStudentId) {
      setBehaviors([]);
      return;
    }
    try {
      setIsLoading(true);
      const behaviourData = await fetchBehaviour(selectedStudentId, effectiveSubjectId);
      setBehaviors(behaviourData);
    } catch (err) {
      setError("Failed to load behaviour");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBehavior();
    loadBehaviorTypes();
  }, [selectedStudentId, selectedSubjectId]);

  useEffect(() => {
    if (!pendingOpenAdd || autoOpenedFromQuery || !selectedStudentId || !behaviorTypes.length) {
      return;
    }

    const types =
      pendingIntent === "positive"
        ? behaviorTypes.filter((t) => Number(t.points) > 0)
        : pendingIntent === "negative"
        ? behaviorTypes.filter((t) => Number(t.points) < 0)
        : behaviorTypes;

    const chosen = types[0] || behaviorTypes[0];
    if (chosen) {
      form.setFieldsValue({
        type: chosen.id,
      });
    }
    if (pendingIntent) {
      setFilter(pendingIntent);
    }
    setIsBehaviorModalVisible(true);
    setAutoOpenedFromQuery(true);
  }, [
    pendingOpenAdd,
    autoOpenedFromQuery,
    selectedStudentId,
    behaviorTypes,
    pendingIntent,
    form,
  ]);

  const student = useMemo(() => {
    if (!students.length || !selectedStudentId) {
      console.log("No students or no selected ID");
      return null;
    }

    // Case-insensitive and type-agnostic comparison
    const found = students.find(
      (s) =>
        String(s.id).toLowerCase() === String(selectedStudentId).toLowerCase()
    );

    if (!found) {
      console.error("Student not found", {
        lookingFor: selectedStudentId,
        availableIds: students.map((s) => s.id),
        allStudents: students,
      });
    }

    return found || null;
  }, [students, selectedStudentId]);

  const showBehaviorModal = (behavior?: Behavior | null) => {
    setEditingBehavior(behavior);
    if (behavior) {
      form.setFieldsValue({
        type: behavior.behaviour_id,
        description: behavior.description,
        date: behavior.date,
      });
    } else {
      form.resetFields();
    }
    setIsBehaviorModalVisible(true);
  };

  const showTypeModal = (type: BehaviorType | null = null) => {
    setEditingType(type);
    if (type) {
      typeForm.setFieldsValue({
        name: type.name,
        points: type.points,
        color: type.color,
      });
    } else {
      typeForm.resetFields();
    }
    setIsTypeModalVisible(true);
  };

  const handleCancel = () => {
    setIsBehaviorModalVisible(false);
    form.resetFields();
  };

  const handleTypeModalCancel = () => {
    setIsTypeModalVisible(false);
    typeForm.resetFields();
    setEditingType(null);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const selectedType = behaviorTypes.find((b) => b.id === values.type);

      if (!selectedType) {
        message.error("Please select a valid behavior type.");
        return;
      }
      const behaviorData = {
        behaviour_id: selectedType.id,
        description: values.description,
        date: values.date || new Date().toISOString().split("T")[0],
        teacher_id: currentUser?.id,
      };

      if (!isSchoolAdmin && selectedSubjectId === "all") {
        message.error("Select a subject before saving behavior.");
        return;
      }

      if (editingBehavior) {
        await updateBehaviour(editingBehavior.id, {
          student_id: selectedStudentId,
          ...behaviorData,
        }, effectiveSubjectId);
        message.success("Behavior updated successfully!");
      } else {
        // Add new behavior
        await addBehaviour({
          student_id: selectedStudentId,
          ...behaviorData,
        }, effectiveSubjectId);
        message.success("Behavior recorded successfully!");
      }
      await loadBehavior();
      setIsBehaviorModalVisible(false);
      form.resetFields();
      setEditingBehavior(null);
    } catch (error) {
      message.error("Failed to save behavior");
      console.error(error);
    }
  };

  const handleTypeSubmit = async () => {
    try {
      const values = await typeForm.validateFields();
      if (!isSchoolAdmin && selectedSubjectId === "all") {
        message.error("Select a subject before saving behavior type.");
        return;
      }
      if (editingType) {
        // Update existing type
        const updatedType = await updateBehaviourType(editingType.id, values, effectiveSubjectId);
        setBehaviorTypes(
          behaviorTypes.map((type) =>
            type.id === editingType.id ? updatedType.data : type
          )
        );
        message.success("Behavior type updated successfully!");
      } else {
        // Add new type
        const newType = await addBehaviourType(values, effectiveSubjectId);
        setBehaviorTypes([...behaviorTypes, newType.data]);
        message.success("Behavior type added successfully!");
      }
      setIsTypeModalVisible(false);
      typeForm.resetFields();
      setEditingType(null);
    } catch (error) {
      message.error("Failed to save behavior type");
      console.error(error);
    }
  };

  const deleteBehavior = async (behaviorId: string) => {
    try {
      if (!isSchoolAdmin && selectedSubjectId === "all") {
        message.error("Select a subject before deleting behavior.");
        return;
      }
      await deleteBehaviour(behaviorId, effectiveSubjectId);
      await loadBehavior();
      message.success("Behavior deleted successfully!");
    } catch (error) {
      message.error("Failed to delete behavior");
      console.error(error);
    }
  };

  const deleteBehaviorType = async (typeId) => {
    try {
      if (!isSchoolAdmin && selectedSubjectId === "all") {
        message.error("Select a subject before deleting behavior type.");
        return;
      }
      await deleteBehaviourType(typeId, effectiveSubjectId);
      setBehaviorTypes(behaviorTypes.filter((type) => type.id !== typeId));
      message.success("Behavior type deleted successfully!");
    } catch (error) {
      message.error("Failed to delete behavior type");
      console.error(error);
    }
  };

  const filteredBehaviors = behaviors?.filter((behavior) => {
    const behaviorType = behaviorTypes.find(
      (t) => t.id === behavior.behaviour_id
    );
    if (!behaviorType) return false; // Skip if type not found
    const typeName = String(behaviorType?.name || "").toLowerCase();
    const description = String(behavior?.description || "").toLowerCase();
    const isAttendance =
      typeName.includes("attendance") ||
      typeName.includes("absent") ||
      typeName.includes("present") ||
      description.includes("[attendance]") ||
      description.includes("attendance absent") ||
      description.includes("attendance present");
    if (isAttendance) return false;

    if (filter === "positive") return behaviorType.points > 0;
    if (filter === "negative") return behaviorType.points < 0;
    if (filter === "neutral") return behaviorType.points == 0;
    return true; // 'all'
  });

  const attendanceBehaviors = behaviors?.filter((behavior) => {
    const behaviorType = behaviorTypes.find(
      (t) => t.id === behavior.behaviour_id
    );
    const typeName = String(behaviorType?.name || "").toLowerCase();
    const description = String(behavior?.description || "").toLowerCase();
    return (
      typeName.includes("attendance") ||
      typeName.includes("absent") ||
      typeName.includes("present") ||
      description.includes("[attendance]") ||
      description.includes("attendance absent") ||
      description.includes("attendance present")
    );
  });

  const sortedAttendanceBehaviors = useMemo(() => {
    return [...(attendanceBehaviors || [])].sort((a: any, b: any) => {
      const bTime = new Date(
        b?.created_at || b?.updated_at || b?.date || 0
      ).getTime();
      const aTime = new Date(
        a?.created_at || a?.updated_at || a?.date || 0
      ).getTime();
      return bTime - aTime;
    });
  }, [attendanceBehaviors]);

  const getAttendanceStatus = (item: any) => {
    const typeName = String(
      behaviorTypes.find((t) => t.id === item.behaviour_id)?.name || ""
    ).toLowerCase();
    const description = String(item?.description || "").toLowerCase();
    if (typeName.includes("absent") || description.includes("attendance] absent")) {
      return "Absent";
    }
    if (typeName.includes("present") || description.includes("attendance] present")) {
      return "Present";
    }
    return "Attendance";
  };

  const getAttendanceLocalTime = (item: any) => {
    const description = String(item?.description || "");
    const marker = " @ ";
    if (description.includes(marker)) {
      return description.split(marker).pop();
    }
    if ((item as any)?.created_at || (item as any)?.updated_at) {
      return new Date(
        (item as any)?.created_at || (item as any)?.updated_at
      ).toLocaleString(undefined, schoolTimeZone ? { timeZone: schoolTimeZone } : undefined);
    }
    return "N/A";
  };

  const sortedFilteredBehaviors = useMemo(() => {
    return [...(filteredBehaviors || [])].sort((a, b) => {
      const bTime = new Date((b as any)?.date || (b as any)?.created_at || 0).getTime();
      const aTime = new Date((a as any)?.date || (a as any)?.created_at || 0).getTime();
      return bTime - aTime;
    });
  }, [filteredBehaviors]);
  const colorOptions = [
    { value: "green", label: "Green" },
    { value: "blue", label: "Blue" },
    { value: "red", label: "Red" },
    { value: "orange", label: "Orange" },
    { value: "purple", label: "Purple" },
    { value: "cyan", label: "Cyan" },
    { value: "magenta", label: "Magenta" },
    { value: "gold", label: "Gold" },
    { value: "lime", label: "Lime" },
    { value: "volcano", label: "Volcano" },
  ];

  const {
    totalPoints,
    totalPositivePoints,
    totalNegativePoints,
    positiveBehaviors,
    negativeBehaviors,
  } = useMemo(() => {
    let total = 0;
    let totalPositive = 0;
    let totalNegative = 0;

    const positive: Behavior[] = [];
    const negative: Behavior[] = [];

    behaviors.forEach((behavior) => {
      const behaviorType = behaviorTypes.find(
        (t) => t.id === behavior.behaviour_id
      );
      if (behaviorType) {
        const points = Number(behaviorType.points);
        total += points;

        if (points > 0) {
          totalPositive += points;
          positive.push(behavior);
        } else if (points < 0) {
          totalNegative += points;
          negative.push(behavior);
        }
      }
    });

    return {
      totalPoints: total,
      totalPositivePoints: totalPositive,
      totalNegativePoints: totalNegative,
      positiveBehaviors: positive,
      negativeBehaviors: negative,
    };
  }, [behaviors, behaviorTypes]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {contextHolder}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold mb-4">Student Behavior</h1>
        {canManageBehavior && (
          <Space>
            <Button
              onClick={() => showTypeModal()}
              icon={<PlusOutlined />}
              disabled={!canMutateBehavior}
            >
              Add Behavior Type
            </Button>
            <Button
              type="primary"
              onClick={() => showBehaviorModal()}
              icon={<PlusOutlined />}
              className="!bg-primary "
              disabled={!canMutateBehavior}
            >
              Add Behavior
            </Button>
          </Space>
        )}
      </div>
      <div className="mb-6">
        <Card className="p-4">
          {canManageBehavior && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 mb-1">
                  Subject
                </label>
                <Select
                  value={selectedSubjectId}
                  onChange={(value) => setSelectedSubjectId(value)}
                  className="w-full"
                >
                  <Select.Option value="all">All Subjects</Select.Option>
                  {subjects.map((subject) => (
                    <Select.Option key={subject.id} value={String(subject.id)}>
                      {subject.name}
                    </Select.Option>
                  ))}
                </Select>
                {!isSchoolAdmin && selectedSubjectId === "all" ? (
                  <span className="mt-1 text-xs text-amber-600">
                    Select a specific subject to add/edit/delete behavior.
                  </span>
                ) : null}
              </div>

              {/* Year Select */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 mb-1">
                  Year
                </label>
                <Select
                  value={selectedYear || undefined}
                  onChange={(value) => {
                    setSelectedYear(value);
                    setSelectedClass(null); // reset class when year changes
                  }}
                  className="w-full"
                  placeholder="Select Year"
                >
                  {years?.map((year) => (
                    <Select.Option key={year.id} value={year.id.toString()}>
                      {year.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {/* Class Select */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 mb-1">
                  Class
                </label>
                <Select
                  value={selectedClass || undefined}
                  onChange={(value) => setSelectedClass(value)}
                  className="w-full"
                  placeholder="Select Class"
                  loading={classesLoading}
                  disabled={!selectedYear}
                >
                  {classes?.map((cls) => (
                    <Select.Option key={cls.id} value={cls.id.toString()}>
                      {cls.class_name}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {/* Student Select */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 mb-1">
                  Student
                </label>
                <Select
                  showSearch
                  placeholder="Select a student"
                  optionFilterProp="children"
                  value={selectedStudentId || undefined}
                  onChange={(value) => setSelectedStudentId(value)}
                  filterOption={(input, option) =>
                    String(option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  suffixIcon={<UserOutlined />}
                  className="w-full"
                >
                  {students.map((student) => (
                    <Select.Option
                      key={student.id}
                      value={student.id}
                      label={student.student_name}
                    >
                      <div className="flex items-center">
                        <span>{student.student_name}</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          )}

          {isStudentRole && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 mb-1">
                  Subject
                </label>
                <Select
                  value={selectedSubjectId}
                  onChange={(value) => setSelectedSubjectId(value)}
                  className="w-full"
                >
                  <Select.Option value="all">All Subjects</Select.Option>
                  {subjects.map((subject) => (
                    <Select.Option key={subject.id} value={String(subject.id)}>
                      {subject.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <Statistic
            title="Total Points"
            value={totalPoints}
            valueStyle={{ color: totalPoints >= 0 ? "#3f8600" : "#cf1322" }}
            prefix={
              totalPoints >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />
            }
          />
        </Card>
        <Card>
          <Statistic
            title="Positive Points"
            value={totalPositivePoints}
            valueStyle={{ color: "#3f8600" }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="Negative Points"
            value={totalNegativePoints}
            valueStyle={{ color: "#cf1322" }}
            prefix={<ArrowDownOutlined />}
          />
        </Card>
      </div>

      <Card
        title={
          <div className="flex items-center gap-2">
             <Avatar
                size="large"
                className="mr-4 text-[50px] bg-blue-500 text-white font-semibold"
              >
                {student?.student_name
                  ? student.student_name.charAt(0).toUpperCase()
                  : ""}
              </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{student?.student_name}</h2>
                <span
                  className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                    totalPoints > 0
                      ? "bg-green-100 text-green-700"
                      : totalPoints < 0
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {totalPoints > 0 ? `+${totalPoints}` : totalPoints}
                </span>
              </div>
              <p className="text-gray-500">{student?.class}</p>
            </div>
          </div>
        }
        extra={
          <Select
            value={filter}
            style={{ width: 120 }}
            onChange={(value) => setFilter(value)}
          >
            <Option value="all">All Behaviors</Option>
            <Option value="positive">Positive</Option>
            <Option value="negative">Negative</Option>
            <Option value="neutral">Neutral</Option>
          </Select>
        }
      >
        <List
          itemLayout="vertical"
          dataSource={sortedFilteredBehaviors}
          renderItem={(item) => (
            <List.Item
              actions={
                canMutateBehavior
                  ? [
                      <div className="">
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => showBehaviorModal(item)}
                          className="!border-none !shadow-none"
                        ></Button>
                        <Popconfirm
                          title="Delete this behavior?"
                          onConfirm={() => deleteBehavior(item.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            icon={<DeleteOutlined />}
                            danger
                            className="!border-none !shadow-none"
                          ></Button>
                        </Popconfirm>
                      </div>,
                    ]
                  : []
              }
            >
              <div className="flex justify-between w-full">
                <div>
                  {(() => {
                    const behaviorType = behaviorTypes.find(
                      (t) => t.id === item.behaviour_id
                    );
                    return (
                      <>
                        <Tag color={behaviorType?.color || "gray"}>
                          {behaviorType?.name || "Unknown"}(
                          {(behaviorType?.points ?? 0) > 0 ? "+" : ""}
                          {behaviorType?.points || 0})
                        </Tag>
                        <p className="mt-2 font-medium">{item.description}</p>
                        <p className="text-sm text-gray-500">
                          Recorded by {item?.teacher?.teacher_name || "Teacher"}{" "}
                          on {item.date}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>

      <Card title="Attendance Records" className="mt-6">
        <List
          itemLayout="vertical"
          dataSource={sortedAttendanceBehaviors}
          locale={{ emptyText: "No attendance records." }}
          renderItem={(item) => (
            <List.Item
              actions={
                canMutateBehavior
                  ? [
                      <div className="">
                        <Popconfirm
                          title="Delete this attendance record?"
                          onConfirm={() => deleteBehavior(item.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            icon={<DeleteOutlined />}
                            danger
                            className="!border-none !shadow-none"
                          ></Button>
                        </Popconfirm>
                      </div>,
                    ]
                  : []
              }
            >
              <div className="flex justify-between w-full">
                <div>
                  {(() => {
                    const status = getAttendanceStatus(item);
                    return (
                      <Tag color={status === "Absent" ? "volcano" : "green"}>
                        {status}
                      </Tag>
                    );
                  })()}
                  <p className="mt-2 font-medium">{item.description || "[Attendance]"}</p>
                  <p className="text-sm text-gray-500">
                    Recorded by {item?.teacher?.teacher_name || "Teacher"} on {item.date}
                  </p>
                  <p className="text-xs text-gray-500">Local time: {getAttendanceLocalTime(item)}</p>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* Behavior Types Management Section */}
      {canManageBehavior && (
        <Card title="Behavior Types" className="mt-6">
          <List
            dataSource={behaviorTypes}
            renderItem={(type) => (
              <List.Item
                actions={[
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => showTypeModal(type)}
                    disabled={!canMutateBehavior}
                  >
                    Edit
                  </Button>,
                  <Popconfirm
                    title="Delete this behavior type?"
                    onConfirm={() => deleteBehaviorType(type.id)}
                    okText="Yes"
                    cancelText="No"
                    disabled={!canMutateBehavior}
                  >
                    <Button icon={<DeleteOutlined />} danger disabled={!canMutateBehavior}>
                      Delete
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Tag color={type.color}>{type.name}</Tag>}
                  description={`${type.points > 0 ? "+" : ""}${
                    type.points
                  } points`}
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Add Behavior Modal */}
      <BehaviorModal
        visible={isBehaviorModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        studentName={student?.student_name ?? ""}
        behaviorTypes={behaviorTypes}
        form={form}
        isEditing={!!editingBehavior}
      />

      {/* Add/Edit Behavior Type Modal */}
      <BehaviorTypeModal
        visible={isTypeModalVisible}
        onCancel={handleTypeModalCancel}
        onOk={handleTypeSubmit}
        form={typeForm}
        editingType={editingType}
        colorOptions={colorOptions}
      />
    </div>
  );
};

export default StudentBehaviorPage;
