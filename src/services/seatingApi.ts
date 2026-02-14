import api from "./studentsApi";
import { SeatingLayoutItem, SeatingLayoutResponse, SeatingRoomMeta } from "@/types/studentViews";

type SavePayload = {
  items: SeatingLayoutItem[];
  room_meta?: SeatingRoomMeta;
};

export const fetchClassSeatingLayout = async (
  classId: string | number
): Promise<SeatingLayoutResponse> => {
  const response = await api.get(`/classes/${classId}/seating-layout`);
  return response.data?.data || { items: [], room_meta: {} };
};

export const saveClassSeatingLayout = async (
  classId: string | number,
  payload: SavePayload
) => {
  const response = await api.put(`/classes/${classId}/seating-layout`, payload);
  return response.data?.data || response.data;
};
