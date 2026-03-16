export type ReportSubjectMode = "all" | "single";

export interface StudentProfileSummary {
  student_id: number;
  student_name: string;
  admission_no?: string | null;
  current_class_id?: number | null;
  current_class_name?: string | null;
  active_subjects: Array<{ id: number; name: string }>;
}

export interface ReportFilterContext {
  subject_mode: ReportSubjectMode;
  subject_id?: number | null;
  class_id?: number | null;
  date_from?: string | null;
  date_to?: string | null;
  term_id?: number | null;
}

export interface AttendanceMonthlyBreakdown {
  month: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percent: number;
}

export interface AttendanceBySubject {
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
  monthly: AttendanceMonthlyBreakdown[];
  by_subject: AttendanceBySubject[];
}

export interface BehaviorCategoryTotal {
  category_key: string;
  label: string;
  count: number;
  points_total: number;
}

export interface BehaviorTrendPoint {
  period: string;
  positive_points: number;
  negative_points: number;
  incidents: number;
}

export interface LatestBehaviorEvent {
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
  trend: BehaviorTrendPoint[];
  latest_events: LatestBehaviorEvent[];
}

export interface AssessmentSummaryItem {
  assessment_id: number;
  title: string;
  subject_id?: number | null;
  class_id?: number | null;
  score: number;
  max_score: number;
  percent: number;
  submitted_at?: string | null;
  status?: string | null;
}

export interface TaskSummaryItem {
  task_id: number;
  title: string;
  subject_id?: number | null;
  class_id?: number | null;
  status?: string | null;
  due_date?: string | null;
  submitted_at?: string | null;
}

export interface AcademicBySubject {
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
  assessments: AssessmentSummaryItem[];
  tasks: TaskSummaryItem[];
  by_subject: AcademicBySubject[];
}

export interface LatestComment {
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
  latest_comments: LatestComment[];
}

export interface SubjectBreakdown {
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
  title: string;
  description?: string | null;
  actor_name?: string | null;
  metadata?: Record<string, unknown>;
}

export interface StudentComprehensiveReportResponse {
  student_profile: StudentProfileSummary;
  filter_context: ReportFilterContext;
  attendance_summary: AttendanceSummary;
  behavior_summary: BehaviorSummary;
  academic_summary: AcademicSummary;
  comments_summary: CommentsSummary;
  subject_breakdown: SubjectBreakdown[];
  timeline: ReportTimelineItem[];
  meta?: {
    warnings?: string[];
  };
}

export interface StudentComprehensiveReportQuery {
  student_id: number;
  subject_id?: number | "all";
  class_id?: number;
  date_from?: string;
  date_to?: string;
  term_id?: number;
}
