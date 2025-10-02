// src/services/trackersApi.ts
import axios from "axios";
import { store } from "@/store/store";
import { API_BASE_URL } from "@/lib/config";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// fetch all trackers
export const fetchAllTrackers = async (schoolId: number) => {
  const response = await api.get(`/get-school-trackers/${schoolId}`);
  return response.data.data;
};


// fetch trackers
export const fetchTrackers = async (classId: number) => {
  const response = await api.get(`/get-trackers/${classId}`);
  return response.data.data;
};

// add tracker
export const addTracker = async (trackerData: {
  school_id: number;
  name: string;
  type: string;
  status: string;
  progress: string[];
}) => {
  const response = await api.post("/add-trackers", trackerData);
  return response.data;
};
// update tracker
export const updateTracker = async (
  id: string,
  trackerData: {
    school_id: number;
    name: string;
    type: string;
    status: string;
    progress: string[];
  }
) => {
  const response = await api.post(`/update-trackers/${id}`, trackerData);
  return response.data;
};
// Delete tracker
export const deleteTracker = async (id: number) => {
  const response = await api.post(`/delete-trackers/${id}`);
  return response.data;
};

// assign tracker to class
export const assignTrackerToClass = async (trackerId: number, classId: number) => {
  const response = await api.post(`/assign-tracker-class`, {
    tracker_id: trackerId,
    class_id: classId,
  });
  return response.data;
};

// unassign tracker from class
export const unassignTrackerFromClass = async (trackerId: number, classId: number) => {
  const response = await api.post(`/unassign-tracker-class`, {
    tracker_id: trackerId,
    class_id: classId,
  });
  return response.data;
};


export default api;
