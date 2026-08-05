// src/services/behaviorApi.ts
import { createApiClient } from "@/lib/apiClient";
import { withSubjectPayload, withSubjectQuery } from '@/lib/subjectScope';
import { recordAuditEvent } from "@/services/auditLogApi";

const api = createApiClient();

//behaviourType apis Started
// fetch BehaviourType
export const fetchBehaviourType = async (subjectId?: number) => {
  const response = await api.get('/get-behaviour', {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data;
};
// add BehaviourType
export const addBehaviourType = async (
  behaviourTypeData: Record<string, unknown>,
  subjectId?: number
) => {
  const response = await api.post('/add-behaviour', withSubjectPayload(behaviourTypeData, subjectId));
  recordAuditEvent({ actorId: "current-user", actorRole: "unknown", action: "create_behaviour_type", targetId: "unknown", description: "Created behaviour type" });
  return response.data;
};
// edit BehaviourType
export const updateBehaviourType = async (id: string, behaviourTypeData: Record<string, unknown>, subjectId?: number) => {
  const response = await api.put(`/update-behaviour/${id}`, withSubjectPayload(behaviourTypeData, subjectId));
  recordAuditEvent({ actorId: "current-user", actorRole: "unknown", action: "edit_behaviour_type", targetId: id, description: `Edited behaviour type ${id}` });
  return response.data;
};
// delete BehaviourType
export const deleteBehaviourType = async (id: number, subjectId?: number) => {
  const response = await api.delete(`/delete-behaviour/${id}`, {
    params: withSubjectQuery({}, subjectId),
  });
  recordAuditEvent({ actorId: "current-user", actorRole: "unknown", action: "delete_behaviour_type", targetId: id, description: `Deleted behaviour type ${id}` });
  return response.data;
};

//behaviour apis Started
// fetch behaviour
export const fetchBehaviour = async (studentId: number, subjectId?: number) => {
  const response = await api.get(`/get-studentBehaviour/${studentId}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data;
};
// add behaviour
export const addBehaviour = async (
  behaviourData: Record<string, unknown>,
  subjectId?: number
) => {
  const response = await api.post('/add-studentBehaviour', withSubjectPayload(behaviourData, subjectId));
  recordAuditEvent({ actorId: "current-user", actorRole: "unknown", action: "create_behaviour", targetId: "unknown", description: "Created student behaviour" });
  return response.data;
};
// edit behaviour
export const updateBehaviour = async (id: string, behaviourData: Record<string, unknown>, subjectId?: number) => {
  const response = await api.put(`/update-studentBehaviour/${id}`, withSubjectPayload(behaviourData, subjectId));
  recordAuditEvent({ actorId: "current-user", actorRole: "unknown", action: "edit_behaviour", targetId: id, description: `Edited student behaviour ${id}` });
  return response.data;
};
// delete behaviour
export const deleteBehaviour = async (id: number, subjectId?: number) => {
  const response = await api.delete(`/delete-studentBehaviour/${id}`, {
    params: withSubjectQuery({}, subjectId),
  });
  recordAuditEvent({ actorId: "current-user", actorRole: "unknown", action: "delete_behaviour", targetId: id, description: `Deleted student behaviour ${id}` });
  return response.data;
};
