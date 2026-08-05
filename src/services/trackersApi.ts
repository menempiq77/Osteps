// src/services/trackersApi.ts
import { createApiClient } from "@/lib/apiClient";
import { withSubjectPayload, withSubjectQuery } from "@/lib/subjectScope";
import { throwOnEmbeddedFailure } from "@/lib/apiResponse";
import { addTrackerTopic, fetchTrackerTopics } from "@/services/api";
import { assignTrackerQuiz } from "@/services/quizApi";

const api = createApiClient();

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

type TrackerTopicRow = {
  title?: string | null;
  type?: string | null;
  quiz_id?: number | string | null;
  quiz?: { id?: number | string | null } | null;
  marks?: number | string | null;
  position?: number | null;
};

/**
 * Recreates a tracker (with its topics and assigned quizzes) under another
 * subject. The tracker list endpoint omits `progress`, so the progress options
 * are read from the tracker detail's `status_progress` — `/add-trackers`
 * rejects an empty list.
 */
export const copyTrackerToSubject = async (
  sourceTrackerId: number,
  trackerData: {
    school_id: number;
    name: string;
    type?: string;
    claim_certificate?: boolean;
    deadline?: string | null;
  },
  targetSubjectId?: number
): Promise<number> => {
  const source = await fetchTrackerTopics(sourceTrackerId);
  const topics: TrackerTopicRow[] = Array.isArray(source?.topics) ? source.topics : [];

  const statuses: Array<{ name?: string | null }> = Array.isArray(source?.status_progress)
    ? source.status_progress
    : [];
  const progress = Array.from(
    new Set(
      [
        ...(Array.isArray(source?.progress) ? source.progress : []),
        ...statuses.map((status) => status?.name ?? ""),
      ]
        .map((value) => String(value ?? "").trim().toUpperCase())
        .filter(Boolean)
    )
  );
  if (progress.length === 0) {
    throw new Error("the source tracker has no progress options to copy");
  }

  const created = await addTracker(
    {
      school_id: trackerData.school_id,
      name: trackerData.name,
      type: trackerData.type ?? String(source?.type ?? "topic"),
      progress,
      claim_certificate: Boolean(trackerData.claim_certificate),
      deadline: trackerData.deadline ?? null,
    },
    targetSubjectId
  );
  throwOnEmbeddedFailure(created, { fallbackMessage: "Failed to create the tracker" });
  const newTrackerId = Number(created?.data?.id ?? created?.id ?? 0);
  if (!newTrackerId) throw new Error("Tracker copy returned no id");

  const orderedTopics = [...topics].sort(
    (a, b) => Number(a.position ?? 0) - Number(b.position ?? 0)
  );
  for (const topic of orderedTopics) {
    const quizId = Number(topic.quiz_id ?? topic.quiz?.id ?? 0);
    if (topic.type === "quiz" || quizId > 0) {
      if (quizId > 0) {
        const response = await assignTrackerQuiz(newTrackerId, quizId, targetSubjectId);
        throwOnEmbeddedFailure(response, { fallbackMessage: "Failed to copy a quiz" });
      }
      continue;
    }

    const title = String(topic.title ?? "").trim();
    if (!title) continue;
    const response = await addTrackerTopic(newTrackerId, {
      title,
      marks: Number(topic.marks ?? 0) || 0,
    });
    throwOnEmbeddedFailure(response, { fallbackMessage: "Failed to copy a topic" });
  }

  return newTrackerId;
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
export const assignTracker = async (
  payload: {
    tracker_id: number;
    class_id?: number;
    class_ids?: number[];
    student_id?: number;
    student_ids?: number[];
    year_ids?: number[];
    assign_all_students?: boolean;
  },
  subjectId?: number
) => {
  const response = await api.post(`/assign-tracker-class`, withSubjectPayload(payload, subjectId));
  return response.data;
};

// unassign tracker from class
export const unassignTracker = async (
  payload: {
    tracker_id: number;
    class_id?: number;
    student_id?: number;
  },
  subjectId?: number
) => {
  const response = await api.post(`/unassign-tracker-class`, withSubjectPayload(payload, subjectId));
  return response.data;
};

export const assignTrackerToClass = async (trackerId: number, classId: number, subjectId?: number) =>
  assignTracker({ tracker_id: trackerId, class_id: classId }, subjectId);

export const unassignTrackerFromClass = async (trackerId: number, classId: number, subjectId?: number) =>
  unassignTracker({ tracker_id: trackerId, class_id: classId }, subjectId);

export type TrackerAssignmentRow = {
  id: number;
  tracker_id: number;
  class_id?: number | null;
  class_name?: string;
  student_id?: number | null;
  student_name?: string;
  year_id?: number | null;
  year_name?: string | null;
  status?: string;
};

export const fetchTrackerAssignments = async (
  trackerId: number,
  filters?: {
    class_id?: string | number;
    year_id?: string | number;
    active_only?: boolean;
  },
  subjectId?: number
): Promise<TrackerAssignmentRow[]> => {
  const response = await api.get(`/manage-tracker-assignments`, {
    params: withSubjectQuery(
      {
        tracker_id: trackerId,
        ...filters,
      },
      subjectId
    ),
  });
  const data = response?.data?.data ?? response?.data ?? [];
  return Array.isArray(data) ? data : [];
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
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; data?: { message?: string; msg?: string } };
        message?: string;
      };
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        err?.message ||
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
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; data?: { message?: string; msg?: string } };
        message?: string;
      };
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        err?.message ||
        "request_failed";
      errors.push(`${path} -> ${status ?? "ERR"} ${message}`);
    }
  }

  throw new Error(
    `Failed to fetch tracker point claims. Tried: ${errors.join(" | ")}`
  );
};

export default api;
