import {
  ApartmentOutlined,
  AppstoreOutlined,
  BookOutlined,
  FileTextOutlined,
  HomeOutlined,
  ProfileOutlined,
  SearchOutlined,
  TableOutlined,
  TeamOutlined,
  UpOutlined,
  UserOutlined,
} from "@ant-design/icons";

type TimetableManagerSidebarProps = {
  className?: string;
  referenceDate?: Date;
  activeKey?: TimetableManagerSidebarKey;
  enabledKeys?: TimetableManagerSidebarKey[];
  onSelect?: (key: TimetableManagerSidebarKey) => void;
};

type SidebarItem = {
  key: TimetableManagerSidebarKey;
  label: string;
  Icon: typeof SearchOutlined;
  tint: {
    background: string;
    border: string;
    color: string;
  };
};

export type TimetableManagerSidebarKey =
  | "free-objects"
  | "spreadsheets"
  | "department"
  | "pupil"
  | "room"
  | "subject"
  | "teacher"
  | "teaching-form"
  | "teaching-set"
  | "year-group";

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    key: "free-objects",
    label: "Locate Free Objects & Periods",
    Icon: SearchOutlined,
    tint: { background: "#eef6ff", border: "#bfdbfe", color: "#3b82f6" },
  },
  {
    key: "spreadsheets",
    label: "Timetable Spreadsheets",
    Icon: FileTextOutlined,
    tint: { background: "#eef2ff", border: "#c7d2fe", color: "#6366f1" },
  },
  {
    key: "department",
    label: "View Department Timetable",
    Icon: ApartmentOutlined,
    tint: { background: "#ecfeff", border: "#a5f3fc", color: "#0891b2" },
  },
  {
    key: "pupil",
    label: "View Pupil Timetable",
    Icon: TeamOutlined,
    tint: { background: "#f0fdf4", border: "#bbf7d0", color: "#65a30d" },
  },
  {
    key: "room",
    label: "View Room Timetable",
    Icon: HomeOutlined,
    tint: { background: "#ecfdf5", border: "#a7f3d0", color: "#0f766e" },
  },
  {
    key: "subject",
    label: "View Subject Timetable",
    Icon: BookOutlined,
    tint: { background: "#fffbeb", border: "#fde68a", color: "#d97706" },
  },
  {
    key: "teacher",
    label: "View Teacher Timetable",
    Icon: UserOutlined,
    tint: { background: "#fff7ed", border: "#fdba74", color: "#ea580c" },
  },
  {
    key: "teaching-form",
    label: "View Teaching Form Timetable",
    Icon: ProfileOutlined,
    tint: { background: "#fff1f2", border: "#f9a8d4", color: "#db2777" },
  },
  {
    key: "teaching-set",
    label: "View Teaching Set Timetable",
    Icon: AppstoreOutlined,
    tint: { background: "#faf5ff", border: "#d8b4fe", color: "#9333ea" },
  },
  {
    key: "year-group",
    label: "View Year Group Timetable",
    Icon: TableOutlined,
    tint: { background: "#eff6ff", border: "#93c5fd", color: "#3b82f6" },
  },
];

const getAcademicYearLabel = (referenceDate: Date) => {
  const month = referenceDate.getMonth();
  const year = referenceDate.getFullYear();
  const startYear = month >= 7 ? year : year - 1;
  const endYear = startYear + 1;
  return `${startYear}-${endYear}`;
};

export default function TimetableManagerSidebar({
  className = "",
  referenceDate = new Date(),
  activeKey = "spreadsheets",
  enabledKeys,
  onSelect,
}: TimetableManagerSidebarProps) {
  const academicYearLabel = getAcademicYearLabel(referenceDate);
  const enabledSet = new Set(enabledKeys ?? SIDEBAR_ITEMS.map((item) => item.key));

  return (
    <aside
      className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`.trim()}
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-lg"
            style={{ background: "#faf5ff", borderColor: "#e9d5ff", color: "#7e22ce" }}
          >
            <TableOutlined />
          </span>
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold text-slate-800">
              Timetable Manager ({academicYearLabel})
            </div>
            <div className="text-xs text-slate-500">iSAMS-style sidebar workspace</div>
          </div>
        </div>
        <UpOutlined className="text-slate-400" />
      </div>

      <div className="p-2.5">
        <div className="space-y-1.5">
          {SIDEBAR_ITEMS.map((item) => {
            const isCurrent = item.key === activeKey;
            const isEnabled = enabledSet.has(item.key);

            return (
              <button
                type="button"
                key={item.key}
                disabled={!isEnabled}
                onClick={() => {
                  if (isEnabled) onSelect?.(item.key);
                }}
                className={[
                  "flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors",
                  isCurrent
                    ? "border-blue-200 bg-blue-50/70 shadow-sm"
                    : isEnabled
                      ? "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
                      : "border-transparent bg-slate-50/70 opacity-70",
                ].join(" ")}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-lg"
                  style={{
                    background: item.tint.background,
                    borderColor: item.tint.border,
                    color: item.tint.color,
                  }}
                >
                  <item.Icon />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-medium ${isCurrent ? "text-slate-900" : "text-slate-600"}`}>
                      {item.label}
                    </span>
                    {isCurrent ? (
                      <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600 ring-1 ring-blue-200">
                        Current
                      </span>
                    ) : !isEnabled ? (
                      <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 ring-1 ring-slate-200">
                        Soon
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}