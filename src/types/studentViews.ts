export type StudentBehaviorSummary = {
  student_id: string | number;
  student_name: string;
  user_name?: string;
  status?: "active" | "inactive" | "suspended";
  profile_path?: string | null;
  positive_points: number;
  negative_points: number;
  total_points: number;
};

export type SeatingLayoutItem = {
  student_id: string | number;
  x: number;
  y: number;
  z_index?: number;
};

export type SeatingRoomMeta = {
  width?: number;
  height?: number;
  screen_edge?: "top" | "bottom";
  door_edge?: "left" | "right" | "top" | "bottom";
  room_markers?: {
    teacher?: { x: number; y: number };
    screen?: { x: number; y: number };
    door?: { x: number; y: number };
  };
  room_marker_orientations?: {
    teacher?: "horizontal" | "vertical";
    screen?: "horizontal" | "vertical";
    door?: "horizontal" | "vertical";
  };
};

export type SeatingLayoutResponse = {
  version?: number;
  updated_at?: string;
  items: SeatingLayoutItem[];
  room_meta?: SeatingRoomMeta;
};
