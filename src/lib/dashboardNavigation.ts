import type { LucideIcon } from "lucide-react";
import {
  Award,
  BarChart3,
  BookOpen,
  BookText,
  Brain,
  CheckSquare,
  ClipboardList,
  FolderOpen,
  GraduationCap,
  HelpCircle,
  Home,
  Layers,
  Library,
  Megaphone,
  NotebookPen,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import { toSubjectScopedPath } from "@/lib/subjectRouting";

export type DashboardNavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
  section: "Subjects" | "Workspace" | "Teaching" | "Communication" | "Resources" | "Account";
  keywords?: string[];
  badge?: number;
};

type BuildDashboardNavigationOptions = {
  roleKey?: string | null;
  announcementUnreadCount?: number;
  questionUnreadCount?: number;
  isIslamicContext?: boolean;
  canUseSubjectContext?: boolean;
  activeSubjectId?: number | null;
  formattedActiveSubjectName?: string | null;
  studentTrackerHref?: string;
};

export const formatDashboardSubjectName = (value?: string | null) =>
  String(value || "Subject").replace(/islamiat/gi, "Islamic").trim();

export const normalizeDashboardRole = (value?: string | null) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

const buildBaseNavigation = ({
  roleKey,
  announcementUnreadCount = 0,
  questionUnreadCount = 0,
  studentTrackerHref = "/dashboard/subject-cards",
}: Required<
  Pick<
    BuildDashboardNavigationOptions,
    "roleKey" | "announcementUnreadCount" | "questionUnreadCount" | "studentTrackerHref"
  >
>): DashboardNavItem[] => {
  const safeRoleKey = roleKey || "";
  const navigation: Record<string, DashboardNavItem[]> = {
    SUPER_ADMIN: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: Home,
        description: "Return to the main platform dashboard.",
        section: "Workspace",
        keywords: ["home", "overview"],
      },
      {
        name: "Schools",
        href: "/dashboard/schools",
        icon: GraduationCap,
        description: "Manage schools and their overall setup.",
        section: "Workspace",
        keywords: ["school management"],
      },
      {
        name: "Admins",
        href: "/dashboard/admins",
        icon: Users,
        description: "Open platform administrator accounts.",
        section: "Workspace",
        keywords: ["staff", "accounts"],
      },
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
        description: "Review system-wide announcements.",
        section: "Communication",
        keywords: ["messages", "updates"],
        badge: announcementUnreadCount,
      },
      {
        name: "Settings",
        href: "/dashboard/admins/settings",
        icon: Settings,
        description: "Update admin account preferences.",
        section: "Account",
        keywords: ["preferences", "profile"],
      },
    ],
    ADMIN: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: Home,
        description: "Return to the main platform dashboard.",
        section: "Workspace",
        keywords: ["home", "overview"],
      },
      {
        name: "Schools",
        href: "/dashboard/schools",
        icon: GraduationCap,
        description: "Manage schools and their overall setup.",
        section: "Workspace",
        keywords: ["school management"],
      },
      {
        name: "Admins",
        href: "/dashboard/admins",
        icon: Users,
        description: "Open platform administrator accounts.",
        section: "Workspace",
        keywords: ["staff", "accounts"],
      },
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
        description: "Review system-wide announcements.",
        section: "Communication",
        keywords: ["messages", "updates"],
        badge: announcementUnreadCount,
      },
      {
        name: "Settings",
        href: "/dashboard/admins/settings",
        icon: Settings,
        description: "Update admin account preferences.",
        section: "Account",
        keywords: ["preferences", "profile"],
      },
    ],
    SCHOOL_ADMIN: [
      {
        name: "Dashboard",
        href: "/dashboard/subject-cards",
        icon: Home,
        description: "Open the current subject dashboard.",
        section: "Subjects",
        keywords: ["home", "subject dashboard"],
      },
      {
        name: "Manager",
        href: "/dashboard/manager",
        icon: Layers,
        description: "Manage subject trackers, content, and assignments.",
        section: "Workspace",
        keywords: ["manage", "subject management"],
      },
      {
        name: "View",
        href: "/dashboard/view",
        icon: FolderOpen,
        description: "Review subject content and shared views.",
        section: "Workspace",
        keywords: ["browse", "content"],
      },
      {
        name: "Leaderboard",
        href: "/dashboard/leaderboard/",
        icon: Award,
        description: "Check leaderboard standings for the current subject.",
        section: "Teaching",
        keywords: ["points", "ranking"],
      },
      {
        name: "Library",
        href: "/dashboard/library",
        icon: Library,
        description: "Open the shared learning library.",
        section: "Resources",
        keywords: ["books", "materials"],
      },
      {
        name: "Content Approvals",
        href: "/dashboard/approvals",
        icon: CheckSquare,
        description: "Approve or review pending subject content.",
        section: "Teaching",
        keywords: ["approvals", "review"],
      },
      {
        name: "Timetable",
        href: "/dashboard/time_table",
        icon: BookOpen,
        description: "Open the school timetable and schedules.",
        section: "Workspace",
        keywords: ["schedule", "calendar"],
      },
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
        description: "Review and publish announcements.",
        section: "Communication",
        keywords: ["messages", "updates"],
        badge: announcementUnreadCount,
      },
      {
        name: "Tools",
        href: "/dashboard/tools",
        icon: Wrench,
        description: "Access school-wide management tools.",
        section: "Workspace",
        keywords: ["utilities", "tools"],
      },
      {
        name: "Lessons",
        href: "/dashboard/lessons",
        icon: BookText,
        description: "Open lesson planning and delivery pages.",
        section: "Teaching",
        keywords: ["lesson plans", "teaching"],
      },
      {
        name: "Mind-upgrade",
        href: "/dashboard/mind-upgrade",
        icon: Brain,
        description: "Open Islamic mind-upgrade activities.",
        section: "Resources",
        keywords: ["mind upgrade", "islamic"],
      },
      {
        name: "Settings",
        href: "/dashboard/school-admin/settings",
        icon: Settings,
        description: "Update school admin preferences and account settings.",
        section: "Account",
        keywords: ["preferences", "profile"],
      },
    ],
    HOD: [
      {
        name: "Dashboard",
        href: "/dashboard/subject-cards",
        icon: Home,
        description: "Open the current subject dashboard.",
        section: "Subjects",
        keywords: ["home", "subject dashboard"],
      },
      {
        name: "Manager",
        href: "/dashboard/manager",
        icon: Layers,
        description: "Manage subject trackers, content, and assignments.",
        section: "Workspace",
        keywords: ["manage", "subject management"],
      },
      {
        name: "View",
        href: "/dashboard/view",
        icon: FolderOpen,
        description: "Review subject content and shared views.",
        section: "Workspace",
        keywords: ["browse", "content"],
      },
      {
        name: "Leaderboard",
        href: "/dashboard/leaderboard/",
        icon: Award,
        description: "Check leaderboard standings for the current subject.",
        section: "Teaching",
        keywords: ["points", "ranking"],
      },
      {
        name: "Library",
        href: "/dashboard/library",
        icon: Library,
        description: "Open the shared learning library.",
        section: "Resources",
        keywords: ["books", "materials"],
      },
      {
        name: "Content Approvals",
        href: "/dashboard/approvals",
        icon: CheckSquare,
        description: "Approve or review pending subject content.",
        section: "Teaching",
        keywords: ["approvals", "review"],
      },
      {
        name: "Timetable",
        href: "/dashboard/time_table",
        icon: BookOpen,
        description: "Open the school timetable and schedules.",
        section: "Workspace",
        keywords: ["schedule", "calendar"],
      },
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
        description: "Review and publish announcements.",
        section: "Communication",
        keywords: ["messages", "updates"],
        badge: announcementUnreadCount,
      },
      {
        name: "Tools",
        href: "/dashboard/tools",
        icon: Wrench,
        description: "Access school-wide management tools.",
        section: "Workspace",
        keywords: ["utilities", "tools"],
      },
      {
        name: "Lessons",
        href: "/dashboard/lessons",
        icon: BookText,
        description: "Open lesson planning and delivery pages.",
        section: "Teaching",
        keywords: ["lesson plans", "teaching"],
      },
      {
        name: "Mind-upgrade",
        href: "/dashboard/mind-upgrade",
        icon: Brain,
        description: "Open Islamic mind-upgrade activities.",
        section: "Resources",
        keywords: ["mind upgrade", "islamic"],
      },
      {
        name: "Settings",
        href: "/dashboard/school-admin/settings",
        icon: Settings,
        description: "Update account preferences and HOD settings.",
        section: "Account",
        keywords: ["preferences", "profile"],
      },
    ],
    TEACHER: [
      {
        name: "Dashboard",
        href: "/dashboard/subject-cards",
        icon: Home,
        description: "Open the current subject dashboard.",
        section: "Subjects",
        keywords: ["home", "subject dashboard"],
      },
      {
        name: "My Classes",
        href: "/dashboard/years",
        icon: Layers,
        description: "Jump into your assigned classes and year groups.",
        section: "Workspace",
        keywords: ["classes", "years"],
      },
      {
        name: "View",
        href: "/dashboard/view",
        icon: FolderOpen,
        description: "Review subject content and shared views.",
        section: "Workspace",
        keywords: ["browse", "content"],
      },
      {
        name: "Manage Quiz",
        href: "/dashboard/quiz",
        icon: ClipboardList,
        description: "Create and manage quizzes.",
        section: "Teaching",
        keywords: ["quiz", "assessment"],
      },
      {
        name: "Trackers",
        href: "/dashboard/all_trackers",
        icon: BarChart3,
        description: "Open tracker summaries for the current subject.",
        section: "Teaching",
        keywords: ["progress", "tracker"],
      },
      {
        name: "Leaderboard",
        href: "/dashboard/leaderboard",
        icon: Award,
        description: "Check student rankings and points.",
        section: "Teaching",
        keywords: ["points", "ranking"],
      },
      {
        name: "Library",
        href: "/dashboard/library",
        icon: Library,
        description: "Open the shared learning library.",
        section: "Resources",
        keywords: ["books", "materials"],
      },
      {
        name: "My Materials",
        href: "/dashboard/materials",
        icon: FolderOpen,
        description: "Access your uploaded teaching materials.",
        section: "Resources",
        keywords: ["materials", "files"],
      },
      {
        name: "Timetable",
        href: "/dashboard/time_table",
        icon: BookOpen,
        description: "Check your teaching timetable.",
        section: "Workspace",
        keywords: ["schedule", "calendar"],
      },
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
        description: "Read or publish announcements.",
        section: "Communication",
        keywords: ["messages", "updates"],
        badge: announcementUnreadCount,
      },
      {
        name: "Behavior",
        href: "/dashboard/student_behavior",
        icon: NotebookPen,
        description: "Open student behaviour records and notes.",
        section: "Teaching",
        keywords: ["behaviour", "conduct"],
      },
      {
        name: "Tools",
        href: "/dashboard/tools",
        icon: Wrench,
        description: "Access teacher tools and utilities.",
        section: "Workspace",
        keywords: ["utilities", "tools"],
      },
      {
        name: "Lessons",
        href: "/dashboard/lessons",
        icon: BookText,
        description: "Plan and deliver lessons.",
        section: "Teaching",
        keywords: ["lesson plans", "teaching"],
      },
      {
        name: "Answer a Question",
        href: "/dashboard/questions",
        icon: HelpCircle,
        description: "Review and reply to student questions.",
        section: "Communication",
        keywords: ["questions", "replies"],
        badge: questionUnreadCount,
      },
      {
        name: "Settings",
        href: "/dashboard/teachers/settings",
        icon: Settings,
        description: "Update teacher account settings.",
        section: "Account",
        keywords: ["preferences", "profile"],
      },
    ],
    STUDENT: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: Home,
        description: "Open your current subject dashboard.",
        section: "Subjects",
        keywords: ["home", "subject dashboard"],
      },
      {
        name: "Assesments",
        href: "/dashboard/students/assignments",
        icon: GraduationCap,
        description: "See assignments and upcoming assessments.",
        section: "Teaching",
        keywords: ["assignments", "assessments", "homework"],
      },
      {
        name: "Trackers",
        href: studentTrackerHref,
        icon: BarChart3,
        description: "Review your tracker progress for the active subject.",
        section: "Teaching",
        keywords: ["progress", "tracker"],
      },
      {
        name: "Leaderboard",
        href: "/dashboard/leaderboard",
        icon: Award,
        description: "Check your points and ranking.",
        section: "Teaching",
        keywords: ["points", "ranking"],
      },
      {
        name: "Library",
        href: "/dashboard/library",
        icon: Library,
        description: "Open the shared learning library.",
        section: "Resources",
        keywords: ["books", "materials"],
      },
      {
        name: "Shared Materials",
        href: "/dashboard/shared_materials",
        icon: FolderOpen,
        description: "Open the materials shared with your class.",
        section: "Resources",
        keywords: ["shared files", "resources"],
      },
      {
        name: "Mind-upgrade",
        href: "/dashboard/mind-upgrade",
        icon: Brain,
        description: "Open your Islamic mind-upgrade space.",
        section: "Resources",
        keywords: ["mind upgrade", "islamic"],
      },
      {
        name: "Lessons",
        href: "/dashboard/lessons",
        icon: BookText,
        description: "Review subject lessons and activities.",
        section: "Teaching",
        keywords: ["lessons", "activities"],
      },
      {
        name: "Settings",
        href: "/dashboard/students/settings",
        icon: Settings,
        description: "Update your student account settings.",
        section: "Account",
        keywords: ["preferences", "profile"],
      },
    ],
  };

  return navigation[safeRoleKey] || [];
};

export const buildDashboardNavigation = ({
  roleKey,
  announcementUnreadCount = 0,
  questionUnreadCount = 0,
  isIslamicContext = true,
  canUseSubjectContext = false,
  activeSubjectId = null,
  formattedActiveSubjectName = null,
  studentTrackerHref = "/dashboard/subject-cards",
}: BuildDashboardNavigationOptions): DashboardNavItem[] => {
  const normalizedRole = normalizeDashboardRole(roleKey);
  let items = buildBaseNavigation({
    roleKey: normalizedRole,
    announcementUnreadCount,
    questionUnreadCount,
    studentTrackerHref,
  });

  if (
    canUseSubjectContext &&
    activeSubjectId &&
    formattedActiveSubjectName &&
    ["SCHOOL_ADMIN", "HOD", "TEACHER", "STUDENT"].includes(normalizedRole)
  ) {
    items = items.map((item, index) =>
      index === 0 && item.name === "Dashboard"
        ? {
            ...item,
            name: `${formatDashboardSubjectName(formattedActiveSubjectName)} Dashboard`,
            href: toSubjectScopedPath("/dashboard", activeSubjectId, formattedActiveSubjectName),
            keywords: ["dashboard", "subject", formatDashboardSubjectName(formattedActiveSubjectName)],
          }
        : item
    );
  }

  if (!isIslamicContext) {
    items = items.filter((item) => item.name !== "Mind-upgrade");
  }

    /* Hide Library, Leaderboard, Tools, Lessons and Mind-upgrade when inside a subject workspace.
      Access via Courses card on /dashboard/subject-cards. */
    if (canUseSubjectContext && activeSubjectId) {
     items = items.filter((item) => item.name !== "Library" && item.name !== "Leaderboard" && item.name !== "Tools" && item.name !== "Lessons" && item.name !== "Mind-upgrade");
    }

/* Timetable and Announcements should not appear in the sidebar.
     Keep access via home utilities/cards only. */
  items = items.filter((item) => item.name !== "Timetable" && item.name !== "Announcements");

  /* Hide Settings from sidebar for non-super-admin roles.
     Keep access via home utilities/cards only. */
  if (normalizedRole !== "SUPER_ADMIN" && normalizedRole !== "ADMIN") {
    items = items.filter((item) => item.name !== "Settings");
  }

  return items;
};

export const buildStudentUtilityLinks = (studentId?: number | null): DashboardNavItem[] => {
  const safeBehaviorHref = studentId ? `/dashboard/behavior/${studentId}` : "/dashboard/subject-cards";

  return [
    {
      name: "Timetable",
      href: "/dashboard/time_table",
      icon: BookOpen,
      description: "Check your schedule for classes and activities.",
      section: "Workspace",
      keywords: ["schedule", "calendar", "time table"],
    },
    {
      name: "Announcements",
      href: "/dashboard/announcements",
      icon: Megaphone,
      description: "Read the latest updates sent to students.",
      section: "Communication",
      keywords: ["messages", "updates"],
    },
    {
      name: "Ask a Question",
      href: "/dashboard/questions",
      icon: HelpCircle,
      description: "Send questions and view replies from teachers.",
      section: "Communication",
      keywords: ["question", "support"],
    },
    {
      name: "Behavior",
      href: safeBehaviorHref,
      icon: NotebookPen,
      description: "Review your behaviour notes and updates.",
      section: "Teaching",
      keywords: ["behaviour", "conduct"],
    },
  ];
};
