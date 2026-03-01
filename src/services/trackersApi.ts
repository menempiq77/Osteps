// src/services/trackersApi.ts
import axios from "axios";
import { store } from "@/store/store";
import { API_BASE_URL } from "@/lib/config";
import { withSubjectPayload, withSubjectQuery } from "@/lib/subjectScope";

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
export const fetchAllTrackers = async (schoolId: number, subjectId?: number) => {
  const response = await api.get(`/get-school-trackers/${schoolId}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data;
};


// fetch trackers
export const fetchTrackers = async (classId: number, subjectId?: number) => {
  const response = await api.get(`/get-trackers/${classId}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data;
};

// add tracker
export const addTracker = async (trackerData: {
  school_id: number;
  name: string;
  type: string;
  progress: string[];
  claim_certificate: boolean;
  deadline?: string | null;
}, subjectId?: number) => {
  const response = await api.post("/add-trackers", withSubjectPayload(trackerData, subjectId));
  return response.data;
};
// update tracker
export const updateTracker = async (
  id: string,
  trackerData: {
    school_id: number;
    name: string;
    type: string;
    progress: string[];
    deadline?: string | null;
  },
  subjectId?: number
) => {
  const response = await api.post(`/update-trackers/${id}`, withSubjectPayload(trackerData, subjectId));
  return response.data;
};
// Delete tracker
export const deleteTracker = async (id: number) => {
  const response = await api.post(`/delete-trackers/${id}`);
  return response.data;
};

// assign tracker to class
export const assignTrackerToClass = async (trackerId: number, classId: number, subjectId?: number) => {
  const response = await api.post(`/assign-tracker-class`, withSubjectPayload({
    tracker_id: trackerId,
    class_id: classId,
  }, subjectId));
  return response.data;
};

// unassign tracker from class
export const unassignTrackerFromClass = async (trackerId: number, classId: number, subjectId?: number) => {
  const response = await api.post(`/unassign-tracker-class`, withSubjectPayload({
    tracker_id: trackerId,
    class_id: classId,
  }, subjectId));
  return response.data;
};

// Fetch Tracker approval requests
export const fetchTrackerRequests = async (subjectId?: number) => {
  const response = await api.get('/fetch-tracker-requests', {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data;
};

// Approve Tracker request
export const approveTrackerRequest = async (id: number, subjectId?: number) => {
  const response = await api.get(`/accept-tracker/${id}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data;
};

// Reject Tracker request
export const rejectTrackerRequest = async (id: number, subjectId?: number) => {
  const response = await api.get(`/reject-tracker/${id}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data;
};

// Student: claim certificate
export const claimCertificate = async (trackerId: number) => {
  const response = await api.post("/claim-certificate", {
    tracker_id: trackerId,
  });
  return response.data;
};

// Teacher: check certificate requests
export const checkCertificateRequest = async (payload: {
  tracker_id: number;
  student_id: number;
}) => {
  const response = await api.post("/check-certificate-request", payload);
  return response.data.data;
};

// Teacher: upload certificate and approve
export const uploadCertificate = async (payload: {
  claim_id: number;
  certificate: File;
  remarks?: string;
}) => {
  const formData = new FormData();
  formData.append("claim_id", payload.claim_id.toString());
  formData.append("certificate", payload.certificate);

  if (payload.remarks) {
    formData.append("remarks", payload.remarks);
  }

  const response = await api.post("/upload-certificate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Student: download certificate
export const downloadCertificate = async (claimId: number) => {
  const response = await api.get(`/download-certificate/${claimId}`);
  return response.data;
};
// Student: fetch my claimed certificates
export const fetchMyClaimedCertificates = async () => {
  const response = await api.get("/myclaim-certificate");
  return response.data.data;
};

// Student: tracker progress points
export const fetchStudentTrackerPoints = async (trackerId: number) => {
  const response = await api.get(
    `/student-trackerProgress-points/${trackerId}`
  );
  return response.data.data;
};

// Teacher: tracker points for a student
export const fetchTeacherTrackerPoints = async (
  trackerId: number,
  studentId: number
) => {
  const response = await api.get(
    `/teacher-track-points/${trackerId}/${studentId}`
  );
  return response.data.data;
};

// Student: check certificate eligibility
export const fetchCertificateEligibility = async (trackerId: number) => {
  const response = await api.get(
    `/tracker/certificate-eligibility/${trackerId}`
  );
  return response.data;
};

// Student: claim tracker points for teacher verification
export const submitTrackerPointsClaim = async (payload: {
  tracker_id: number;
  class_id?: number;
  bucket_marks?: Record<string, number>;
  bucket_total?: number;
}) => {
  const attempts = [
    { path: "/claim-tracker-points", body: payload },
    { path: "/tracker/claim-points", body: payload },
    // fallback to existing claim flow so teacher still receives request
    { path: "/claim-certificate", body: { tracker_id: payload.tracker_id } },
  ];

  const errors: string[] = [];
  for (const attempt of attempts) {
    try {
      const response = await api.post(attempt.path, attempt.body);
      return response.data;
    } catch (error: any) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.message ||
        "request_failed";
      errors.push(`${attempt.path} -> ${status ?? "ERR"} ${message}`);
    }
  }

  throw new Error(`Failed to submit tracker points claim. Tried: ${errors.join(" | ")}`);
};

// Student: fetch my tracker point claims
export const fetchMyTrackerPointClaims = async () => {
  const attempts = ["/my-tracker-point-claims", "/tracker-point-claims/my"];
  const errors: string[] = [];

  for (const path of attempts) {
    try {
      const response = await api.get(path);
      return response.data?.data ?? response.data ?? [];
    } catch (error: any) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.message ||
        "request_failed";
      errors.push(`${path} -> ${status ?? "ERR"} ${message}`);
    }
  }

  throw new Error(
    `Failed to fetch tracker point claims. Tried: ${errors.join(" | ")}`
  );
};

export default api;
