"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Alert, Card, Col, Row, Select, Space, Spin, Statistic, Table, Tag, Typography } from "antd";
import { fetchStudentProfileData, fetchStudents } from "@/services/studentsApi";
import { readStudentProfileOverride } from "@/lib/studentProfileOverrides";
import ExamIncidentHistoryCard from "@/components/students/ExamIncidentHistoryCard";

type AnyObj = Record<string, any>;

const asArray = <T = AnyObj,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const normalizeSubjectName = (value: unknown) => String(value ?? "").replace(/islamiat/gi, "Islamic").trim();

const extractBehaviourSubjectName = (row: AnyObj): string => {
	const raw =
		row?.subject?.name ??
		row?.subject?.subject_name ??
		row?.subject_name ??
		row?.behaviour?.subject?.name ??
		row?.behaviour?.subject_name ??
		"";
	const normalized = normalizeSubjectName(raw);
	return normalized || "No Subject";
};

const toFiniteNumber = (value: unknown) => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeSenFlag = (value: unknown): boolean => {
	if (typeof value === "boolean") return value;
	if (typeof value === "number") return value === 1;
	if (typeof value === "string") {
		const normalized = value.trim().toLowerCase();
		return normalized === "1" || normalized === "true" || normalized === "yes";
	}
	return false;
};

const resolveSenDetails = (student: AnyObj): string => {
	const details = student?.sen_details ?? student?.senDetails ?? "";
	return String(details ?? "").trim();
};

const extractSubjectNamesFromRecord = (record: AnyObj | null | undefined): string[] => {
	if (!record || typeof record !== "object") return [];

	const rawSubjects = [
		...asArray<AnyObj>(record?.subjects),
		...asArray<AnyObj>(record?.assigned_subjects),
		...asArray<AnyObj>(record?.active_subjects),
		...(record?.subject_name ? [record.subject_name] : []),
		...(record?.subject ? [record.subject] : []),
	];

	const names = rawSubjects
		.map((item) => {
			if (typeof item === "string") return normalizeSubjectName(item);
			if (item && typeof item === "object") {
				return normalizeSubjectName(
					item?.name ??
					item?.subject_name ??
					item?.subject?.name ??
					item?.subject?.subject_name ??
					""
				);
			}
			return "";
		})
		.filter(Boolean);

	return Array.from(new Set(names));
};

export default function GlobalStudentProfilePage() {
	const params = useParams<{ studentId?: string }>();
	const studentId = String(params?.studentId ?? "").trim();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["global-student-profile", studentId],
		queryFn: () => fetchStudentProfileData(studentId, 0),
		enabled: Boolean(studentId),
	});

	const student = useMemo(() => {
		if (!data || typeof data !== "object" || Array.isArray(data)) return null;
		const baseStudent = data as AnyObj;
		const override = readStudentProfileOverride([
			studentId,
			baseStudent?.id,
			baseStudent?.student_id,
			baseStudent?.user_id,
			baseStudent?.profile_id,
			baseStudent?.student?.id,
		]);
		if (!override) return baseStudent;

		return {
			...baseStudent,
			is_sen: typeof override.isSen === "boolean" ? override.isSen : baseStudent?.is_sen,
			sen_details:
				typeof override.senDetails === "string"
					? override.senDetails
					: baseStudent?.sen_details ?? baseStudent?.senDetails,
		} as AnyObj;
	}, [data, studentId]);

	const classIdForSubjectFallback = Number(student?.class_id ?? student?.class?.id ?? 0);

	const { data: classStudentsForSubjectFallback = [] } = useQuery({
		queryKey: ["global-student-profile-class-subjects", classIdForSubjectFallback],
		queryFn: () => fetchStudents(classIdForSubjectFallback, 0),
		enabled: classIdForSubjectFallback > 0,
	});

	const classStudentSubjectFallback = useMemo(() => {
		const rows = asArray<AnyObj>(classStudentsForSubjectFallback);
		if (rows.length === 0) return null;

		return (
			rows.find(
				(row) =>
					String(row?.id ?? "").trim() === studentId ||
					String(row?.student_id ?? "").trim() === studentId ||
					String(row?.profile_id ?? "").trim() === studentId
			) ?? null
		);
	}, [classStudentsForSubjectFallback, studentId]);

	const subjectTags = useMemo(() => {
		return Array.from(
			new Set([
				...extractSubjectNamesFromRecord(student),
				...extractSubjectNamesFromRecord(classStudentSubjectFallback),
			])
		);
	}, [student, classStudentSubjectFallback]);

	const behaviorRows = useMemo(() => {
		const rows = asArray<AnyObj>(student?.behaviour);
		return rows
			.slice()
			.sort((a, b) => new Date(String(b?.date ?? b?.created_at ?? 0)).getTime() - new Date(String(a?.date ?? a?.created_at ?? 0)).getTime())
			.map((row, index) => ({
				key: String(row?.id ?? index),
				date: String(row?.date ?? row?.created_at ?? "N/A"),
				subject: extractBehaviourSubjectName(row),
				type: String(row?.behaviour?.name ?? "Behaviour"),
				points: toFiniteNumber(row?.behaviour?.points),
				description: String(row?.description ?? ""),
			}));
	}, [student]);

	const availableSubjects = useMemo(() => {
		const behaviorSubjects = behaviorRows.map((row) => normalizeSubjectName(row.subject)).filter(Boolean);
		const names = [...subjectTags, ...behaviorSubjects];
		return Array.from(new Set(names));
	}, [behaviorRows, subjectTags]);

	const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

	useEffect(() => {
		setSelectedSubjects(availableSubjects);
	}, [availableSubjects]);

	const filteredBehaviorRows = useMemo(() => {
		if (selectedSubjects.length === 0) return behaviorRows;
		const selected = new Set(selectedSubjects.map((item) => normalizeSubjectName(item)));
		return behaviorRows.filter((row) => selected.has(normalizeSubjectName(row.subject)));
	}, [behaviorRows, selectedSubjects]);

	const visibleSubjectTags = useMemo(() => {
		if (selectedSubjects.length === 0) return subjectTags;
		const selected = new Set(selectedSubjects.map((item) => normalizeSubjectName(item)));
		return subjectTags.filter((name) => selected.has(normalizeSubjectName(name)));
	}, [selectedSubjects, subjectTags]);

	if (isLoading) {
		return (
			<div className="min-h-[320px] flex items-center justify-center">
				<Spin size="large" />
			</div>
		);
	}

	if (isError) {
		return (
			<Alert
				type="error"
				showIcon
				message="Could not load student profile"
				description={error instanceof Error ? error.message : "Unknown error"}
			/>
		);
	}

	if (!student) {
		return <Alert type="warning" showIcon message="Student profile not found." />;
	}

	return (
		<div className="space-y-4">
			<Card className="rounded-2xl">
				<Typography.Title level={3} style={{ marginBottom: 4 }}>
					{String(student?.student_name ?? "Student")}
				</Typography.Title>
				<Typography.Text type="secondary">{String(student?.email ?? "No email")}</Typography.Text>

				<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
					<Space wrap>
						<Tag color="blue">ID: {String(student?.id ?? studentId)}</Tag>
						<Tag color={String(student?.status ?? "").toLowerCase() === "active" ? "green" : "default"}>
							{String(student?.status ?? "unknown").toUpperCase()}
						</Tag>
						{(visibleSubjectTags.length > 0 ? visibleSubjectTags : ["No Subject"]).map((name) => (
							<Tag key={name} color="gold">
								{name}
							</Tag>
						))}
					</Space>

					<Select
						size="small"
						mode="multiple"
						allowClear
						placeholder="Filter subjects"
						value={selectedSubjects}
						onChange={(values) => setSelectedSubjects(values)}
						options={availableSubjects.map((subject) => ({
							label: subject,
							value: subject,
						}))}
						style={{ minWidth: 220, maxWidth: 360 }}
						maxTagCount="responsive"
					/>
				</div>
			</Card>

			<Row gutter={[16, 16]}>
				<Col xs={24} md={8}>
					<Card title="Class" className="rounded-2xl">
						<Typography.Text>{String(student?.class?.class_name ?? "N/A")}</Typography.Text>
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card title="Gender" className="rounded-2xl">
						<Typography.Text>{String(student?.gender ?? student?.student_gender ?? "Unknown")}</Typography.Text>
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card title="Nationality" className="rounded-2xl">
						<Typography.Text>{String(student?.nationality ?? "Not set")}</Typography.Text>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				<Col xs={24} md={8}>
					<Card title="SEN Status" className="rounded-2xl">
						<Tag color={normalizeSenFlag(student?.is_sen ?? student?.isSen) ? "gold" : "default"}>
							{normalizeSenFlag(student?.is_sen ?? student?.isSen) ? "SEN Student" : "No SEN Flag"}
						</Tag>
					</Card>
				</Col>
				<Col xs={24} md={16}>
					<Card title="SEN Details" className="rounded-2xl">
						<Typography.Text>{resolveSenDetails(student) || "No SEN details saved."}</Typography.Text>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				<Col xs={24} md={8}>
					<Card className="rounded-2xl">
						<Statistic title="Tracker Points" value={toFiniteNumber(student?.tracker_points ?? student?.total_marks)} />
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card className="rounded-2xl">
						<Statistic title="Mind-upgrade Points" value={toFiniteNumber(student?.mind_points)} />
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card className="rounded-2xl">
						<Statistic title="Combined Points" value={toFiniteNumber(student?.total_points)} />
					</Card>
				</Col>
			</Row>

			<ExamIncidentHistoryCard studentId={studentId} title="Exam Exit History" />

			<Card title="Behaviour History" className="rounded-2xl">
				<Table
					rowKey="key"
					dataSource={filteredBehaviorRows}
					pagination={{ pageSize: 10 }}
					columns={[
						{ title: "Date", dataIndex: "date", key: "date" },
						{ title: "Subject", dataIndex: "subject", key: "subject" },
						{ title: "Type", dataIndex: "type", key: "type" },
						{ title: "Points", dataIndex: "points", key: "points" },
						{ title: "Description", dataIndex: "description", key: "description" },
					]}
				/>
			</Card>
		</div>
	);
}
