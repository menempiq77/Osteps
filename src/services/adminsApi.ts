// src/services/adminsApi.ts
import { createApiClient } from "@/lib/apiClient";

const api = createApiClient();

// fetche admins
export const fetchAdmins = async () => {
  const response = await api.get('/get-admin');
  return response.data.data;
};
// add admin
export const addAdmin = async (adminData: any) => {
  const response = await api.post('/add-admin', adminData);
  return response.data;
};
// edit admin
export const updateAdmin = async (id: string, adminData: any) => {
  const response = await api.post(`/update-admin/${id}`, adminData);
  return response.data;
};
// delete admin
export const deleteAdmin = async (id: string) => {
  const response = await api.post(`/delete-admin/${id}`);
  return response.data;
};

export default api;