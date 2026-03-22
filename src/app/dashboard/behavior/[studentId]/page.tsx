"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, Tag, Select, List, Avatar, Statistic, Breadcrumb } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchBehaviourType } from "@/services/behaviorApi";
import { fetchStudentProfileData } from "@/services/studentsApi";
import { useSubjectContext } from "@/contexts/SubjectContext";
import Link from "next/link";

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
  created_at?: string;
  teacher?: string;
  points: number;
  teacher_name: string;
  subject_name?: string;
  class_name?: string;
  subject?: {
    name?: string;
    subject_name?: string;
  };
  class?: {
    class_name?: string;
    name?: string;
  };
  classes?: {
    class_name?: string;
    name?: string;
  };
  behaviour?: {
    id?: string;
    name?: string;
    points?: number;
    color?: string;
    subject_name?: string;
    class_name?: string;
    subject?: {
      name?: string;
      subject_name?: string;
    };
  };
  __subjectName?: string;
  __className?: string;
};

interface CurrentUser {
  student?: string;
  avatar?: string;
  name?: string;
  class?: string;
  role?: string;
}

const normalizeSubjectName = (value: unknown) =>
  String(value ?? "").replace(/islamiat/gi, "Islamic").trim();

const normalizeStudentId = (value: unknown) => String(value ?? "").trim();

const extractBehaviorSubjectName = (behavior: Behavior): string => {
  const raw =
    behavior?.__subjectName ??
    behavior?.subject?.name ??
    behavior?.subject?.subject_name ??
    behavior?.subject_name ??
    behavior?.behaviour?.subject?.name ??
    behavior?.behaviour?.subject_name ??
    "";
  return normalizeSubjectName(raw) || "No Subject";
};

const extractBehaviorClassName = (behavior: Behavior): string => {
  const raw =
    behavior?.__className ??
    behavior?.class?.class_name ??
    behavior?.class?.name ??
    behavior?.classes?.class_name ??
    behavior?.classes?.name ??
    behavior?.class_name ??
    behavior?.behaviour?.class_name ??
    "";
  return String(raw || "").trim() || "No Class";
};

const resolveBehaviorMeta = (
  behavior: Behavior,
  behaviorTypes: BehaviorType[]
) => {
  const fallback = behaviorTypes.find((t) => t.id === behavior.behaviour_id);
  return {
    name: String(behavior?.behaviour?.name ?? fallback?.name ?? "Unknown"),
    points: Number(behavior?.behaviour?.points ?? fallback?.points ?? 0),
    color: String(behavior?.behaviour?.color ?? fallback?.color ?? "gray"),
  };
};

const StudentBehaviorPage = () => {
  const [filter, setFilter] = useState("all");
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);
  // const { currentUser } = useSelector((state: RootState) => state.auth);
  const { currentUser } = useSelector((state: RootState) => state.auth) as {
    currentUser: CurrentUser;
  };
  const { subjects } = useSubjectContext();
  const [behaviorTypes, setBehaviorTypes] = useState<BehaviorType[]>([]);
  const [behaviors, setBehaviors] = useState<Behavior[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjectEntries, setSubjectEntries] = useState<
    { key: string; subjectId: number; subjectName: string; className: string }[]
  >([]);

  const loadBehaviorTypes = async () => {
    try {
      setIsLoading(true);
      // Student self-view should aggregate behavior across all assigned subjects.
      const behaviourType = await fetchBehaviourType(0);
      setBehaviorTypes(behaviourType);
    } catch (err) {
      setError("Failed to load behaviour Type");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const loadBehavior = async () => {
    try {
      setIsLoading(true);
      const studentId = String(currentUser?.student ?? "").trim();
      if (!studentId) {
        setBehaviors([]);
        return;
      }

      const assignedSubjects = Array.isArray(subjects) && subjects.length > 0 ? subjects : [];
      if (assignedSubjects.length === 0) {
        const studentProfile = await fetchStudentProfileData(studentId, 0);
        const behaviourData = Array.isArray(studentProfile?.behaviour)
          ? studentProfile.behaviour
          : [];
        setBehaviors(behaviourData);
        return;
      }

      // Use class_label from subject context (returned by backend for students).
      // Fallback to the student's base class name from Redux.
      const studentBaseClassName = String((currentUser as any)?.studentClassName || "").trim();

      const subjectClassMap = new Map<number, { subjectName: string; className: string; profileData: any }>();

      for (const subject of assignedSubjects) {
        const subjectName =
          normalizeSubjectName(subject?.name) || `Subject ${subject.id}`;
        const className = String(subject?.class_label || "").trim() || studentBaseClassName || "No Class";

        const studentProfile = await fetchStudentProfileData(studentId, subject.id);
        subjectClassMap.set(subject.id, { subjectName, className, profileData: studentProfile });
      }

      // Build subject entries from the resolved map.
      const entries = assignedSubjects.map((subject) => {
        const info = subjectClassMap.get(subject.id) ?? {
          subjectName: normalizeSubjectName(subject?.name) || `Subject ${subject.id}`,
          className: "No Class",
        };
        return {
          key: `${info.subjectName}::${info.className}`,
          subjectId: subject.id,
          subjectName: info.subjectName,
          className: info.className,
        };
      });
      setSubjectEntries(entries);

      // Collect behaviors from the already-fetched profile data.
      // Tag each row with __subjectName/__className, honouring the
      // behavior's own metadata when present.
      const seenIds = new Set<string>();
      const allBehaviors: Behavior[] = [];

      for (const subject of assignedSubjects) {
        const info = subjectClassMap.get(subject.id);
        const subjectName = info?.subjectName ?? normalizeSubjectName(subject?.name);
        const className = info?.className ?? "No Class";
        const studentProfile = info?.profileData;

        const rows: Behavior[] = Array.isArray(studentProfile?.behaviour)
          ? studentProfile.behaviour
          : [];

        for (const row of rows) {
          const rowKey = String(
            row?.id ?? `${row?.behaviour_id}-${row?.date}-${row?.description}`
          );
          if (seenIds.has(rowKey)) continue;
          seenIds.add(rowKey);

          // Use the behavior's own subject metadata when present;
          // fall back to the queried subject info.
          const ownSubjectName = normalizeSubjectName(
            row?.subject?.name ??
              row?.subject?.subject_name ??
              row?.subject_name ??
              row?.behaviour?.subject?.name ??
              row?.behaviour?.subject_name ??
              ""
          );
          const ownClassName = String(
            row?.class?.class_name ??
              row?.class?.name ??
              row?.classes?.class_name ??
              row?.classes?.name ??
              row?.class_name ??
              row?.behaviour?.class_name ??
              ""
          ).trim();

          // If the behavior carries a recognised subject name that matches
          // a different assigned subject, attribute it there instead.
          let matchedSubjectName = subjectName;
          let matchedClassName = className;

          if (ownSubjectName) {
            const matchedEntry = entries.find(
              (e) => e.subjectName.toLowerCase() === ownSubjectName.toLowerCase()
            );
            if (matchedEntry) {
              matchedSubjectName = matchedEntry.subjectName;
              matchedClassName = ownClassName || matchedEntry.className;
            } else {
              matchedSubjectName = ownSubjectName;
              matchedClassName = ownClassName || className;
            }
          }

          allBehaviors.push({
            ...row,
            __subjectName: matchedSubjectName,
            __className: matchedClassName,
          });
        }
      }

      setBehaviors(allBehaviors);
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
  }, [currentUser?.student, (currentUser as any)?.studentClass, subjects]);

  const filteredBehaviors = behaviors?.filter((behavior) => {
    const behaviorType = resolveBehaviorMeta(behavior, behaviorTypes);

    if (filter === "positive") return behaviorType.points > 0;
    if (filter === "negative") return behaviorType.points < 0;
    if (filter === "neutral") return behaviorType.points === 0;
    return true; // 'all'
  });

  const behaviorGroups = useMemo(() => {
    const groups = new Map<
      string,
      {
        key: string;
        subjectName: string;
        className: string;
        totalPoints: number;
        positivePoints: number;
        negativePoints: number;
        count: number;
      }
    >();

    behaviors.forEach((behavior) => {
      const behaviorType = resolveBehaviorMeta(behavior, behaviorTypes);

      const subjectName = extractBehaviorSubjectName(behavior);
      const className = extractBehaviorClassName(behavior);
      const key = `${subjectName}::${className}`;
      const points = behaviorType.points;

      const existing = groups.get(key) ?? {
        key,
        subjectName,
        className,
        totalPoints: 0,
        positivePoints: 0,
        negativePoints: 0,
        count: 0,
      };

      existing.totalPoints += points;
      existing.count += 1;

      if (points > 0) {
        existing.positivePoints += points;
      } else if (points < 0) {
        existing.negativePoints += points;
      }

      groups.set(key, existing);
    });

    return Array.from(groups.values()).sort((a, b) => {
      if (a.subjectName !== b.subjectName) return a.subjectName.localeCompare(b.subjectName);
      if (a.className !== b.className) return a.className.localeCompare(b.className);
      return b.totalPoints - a.totalPoints;
    });
  }, [behaviors, behaviorTypes]);

  useEffect(() => {
    if (subjectEntries.length === 0) {
      setSelectedGroupKey(null);
      return;
    }

    setSelectedGroupKey((current) => {
      if (current && subjectEntries.some((e) => e.key === current)) {
        return current;
      }
      return subjectEntries[0].key;
    });
  }, [subjectEntries]);

  const selectedGroup = useMemo(
    () => behaviorGroups.find((group) => group.key === selectedGroupKey) ?? null,
    [behaviorGroups, selectedGroupKey]
  );

  const selectedGroupBehaviors = useMemo(() => {
    if (!selectedGroup) return filteredBehaviors;
    return filteredBehaviors.filter(
      (behavior) =>
        extractBehaviorSubjectName(behavior) === selectedGroup.subjectName &&
        extractBehaviorClassName(behavior) === selectedGroup.className
    );
  }, [filteredBehaviors, selectedGroup]);

  const {
    totalPoints,
    totalPositivePoints,
    totalNegativePoints,
  } = useMemo(() => {
    let total = 0;
    let totalPositive = 0;
    let totalNegative = 0;

    behaviors.forEach((behavior) => {
      const behaviorType = resolveBehaviorMeta(behavior, behaviorTypes);
      const points = behaviorType.points;
      total += points;

      if (points > 0) {
        totalPositive += points;
      } else if (points < 0) {
        totalNegative += points;
      }
    });

    return {
      totalPoints: total,
      totalPositivePoints: totalPositive,
      totalNegativePoints: totalNegative,
    };
  }, [behaviors, behaviorTypes]);

  return (
    <div className="p-3 md:p-6 max-w-6xl mx-auto">
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>Behavior</span>,
          },
        ]}
        className="!mb-6"
      />

      <h1 className="text-2xl font-bold mb-6">Student Behavior</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        {subjectEntries.map((entry) => {
          const isActive = entry.key === selectedGroupKey;
          const group = behaviorGroups.find((g) => g.key === entry.key);
          const count = group?.count ?? 0;
          return (
            <button
              key={entry.key}
              type="button"
              onClick={() => setSelectedGroupKey(entry.key)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                isActive
                  ? "border-[var(--theme-dark)] bg-[var(--theme-soft-2)] text-[var(--theme-dark)] shadow-sm"
                  : "border-[var(--theme-border)] bg-white text-slate-700 hover:bg-[var(--theme-soft)]"
              }`}
            >
              <div className="text-sm font-semibold">
                {entry.subjectName} / {entry.className}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {count} record{count === 1 ? "" : "s"}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <Statistic
            title="Total Points"
            value={selectedGroup?.totalPoints ?? totalPoints}
            valueStyle={{
              color: (selectedGroup?.totalPoints ?? totalPoints) >= 0 ? "#3f8600" : "#cf1322",
            }}
            prefix={
              (selectedGroup?.totalPoints ?? totalPoints) >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />
            }
          />
        </Card>
        <Card>
          <Statistic
            title="Positive Points"
            value={selectedGroup?.positivePoints ?? totalPositivePoints}
            valueStyle={{ color: "#3f8600" }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="Negative Points"
            value={selectedGroup?.negativePoints ?? totalNegativePoints}
            valueStyle={{ color: "#cf1322" }}
            prefix={<ArrowDownOutlined />}
          />
        </Card>
      </div>

      <Card
        title={
          <div className="flex items-center gap-2">
            <Avatar
              src={currentUser?.avatar || null}
              size="large"
              className="mr-4"
            >
              {currentUser?.name?.charAt(0) || "U"}
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{currentUser?.name}</h2>
              <p className="text-gray-500">{currentUser?.class || ""}</p>
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
          dataSource={selectedGroupBehaviors}
          renderItem={(item) => (
            <List.Item>
              <div className="flex justify-between w-full">
                <div>
                  {(() => {
                    const behaviorType = resolveBehaviorMeta(item, behaviorTypes);
                    return (
                      <>
                        <Tag color={behaviorType.color}>
                          {behaviorType.name}(
                          {behaviorType.points > 0 ? "+" : ""}
                          {behaviorType.points})
                        </Tag>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Tag color="blue">{extractBehaviorSubjectName(item)}</Tag>
                          <Tag>{extractBehaviorClassName(item)}</Tag>
                        </div>
                        <p className="mt-2 font-medium">{item.description}</p>
                        <p className="text-sm text-gray-500">
                          Recorded by {item.teacher?.teacher_name || "Teacher"}{" "}
                          on {item.date}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </List.Item>
          )}
          locale={{
            emptyText: selectedGroup
              ? `No behavior comments for ${selectedGroup.subjectName} / ${selectedGroup.className}.`
              : "No behavior comments.",
          }}
        />
      </Card>
    </div>
  );
};

export default StudentBehaviorPage;
