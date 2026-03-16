export type SubjectMode = "all" | "single";

export interface StudentProfileSummary {
  student_id: number;
  student_name: string;
  admission_no?: string | null;
  current_class_id?: number | null;
  current_class_name?: string | null;
  active_subjects: Array<{ id: number; name: string }>;
}

export interface ReportFilterContext {
  subject_mode: SubjectMode;
  subject_id?: number | null;
  class_id?: number | null;
  date_from?: string | null;
  date_to?: string | null;
  term_id?: number | null;
}

export interface AttendanceMonthlyItem {
  month: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percent: number;
}

export interface AttendanceBySubjectItem {
  subject_id: number;
  subject_name: string;
  present: number;
  absent: number;
  late: number;
  percent: number;
}

export interface AttendanceSummary {
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  attendance_percent: number;
  monthly: AttendanceMonthlyItem[];
  by_subject: AttendanceBySubjectItem[];
}

export interface BehaviorCategoryTotal {
  category_key: string;
  label: string;
  count: number;
  points_total: number;
}

export interface BehaviorTrendItem {
  period: string;
  positive_points: number;
  negative_points: number;
  incidents: number;
}

export interface BehaviorLatestEvent {
  event_id: number;
  occurred_at: string;
  subject_id?: number | null;
  subject_name?: string | null;
  class_id?: number | null;
  actor_id?: number | null;
  actor_name?: string | null;
  actor_role?: string | null;
  behavior_type?: string | null;
  points: number;
  note?: string | null;
}

export interface BehaviorSummary {
  positive_points: number;
  negative_points: number;
  net_points: number;
  incident_count: number;
  category_totals: BehaviorCategoryTotal[];
  trend: BehaviorTrendItem[];
  latest_events: BehaviorLatestEvent[];
}

export interface AcademicAssessmentItem {
  assessment_id: number;
  title: string;
  subject_id?: number | null;
  class_id?: number | null;
  score?: number | null;
  max_score?: number | null;
  percent?: number | null;
  submitted_at?: string | null;
  status?: string | null;
}

export interface AcademicTaskItem {
  task_id: number;
  title: string;
  subject_id?: number | null;
  class_id?: number | null;
  status?: string | null;
  due_date?: string | null;
  submitted_at?: string | null;
}

export interface AcademicBySubjectItem {
  subject_id: number;
  subject_name: string;
  average_score: number;
  completion_rate: number;
  missing_count: number;
}

export interface AcademicSummary {
  overall_average_score: number;
  completion_rate: number;
  missing_work_count: number;
  assessments: AcademicAssessmentItem[];
  tasks: AcademicTaskItem[];
  by_subject: AcademicBySubjectItem[];
}

export interface ReportCommentItem {
  comment_id: number;
  body: string;
  created_at: string;
  subject_id?: number | null;
  class_id?: number | null;
  author_id?: number | null;
  author_name?: string | null;
  author_role?: string | null;
  visibility?: string | null;
}

export interface CommentsSummary {
  total_comments: number;
  latest_comments: ReportCommentItem[];
}

export interface SubjectBreakdownItem {
  subject_id: number;
  subject_name: string;
  classes: Array<{ class_id: number; class_name: string }>;
  attendance_percent: number;
  net_behavior_points: number;
  average_score: number;
  completion_rate: number;
  missing_work_count: number;
  rank_label?: string | null;
}

export interface ReportTimelineItem {
  event_type: string;
  event_id: number;
  occurred_at: string;
  subject_id?: number | null;
  class_id?: number | null;
  title?: string | null;
  description?: string | null;
  actor_name?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface ComprehensiveReportPayload {
  student_profile: StudentProfileSummary;
  filter_context: ReportFilterContext;
  attendance_summary: AttendanceSummary;
  behavior_summary: BehaviorSummary;
  academic_summary: AcademicSummary;
  comments_summary: CommentsSummary;
  subject_breakdown: SubjectBreakdownItem[];
  timeline: ReportTimelineItem[];
  meta?: {
    warnings?: string[];
  };
}
