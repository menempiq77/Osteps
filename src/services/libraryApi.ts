// src/services/libraryApi.ts
import axios from 'axios';
import { store } from '@/store/store';
import { API_BASE_URL } from '@/lib/config';

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

//Library Categories apis Started
// fetch Categories
export const fetchCategories = async () => {
  const response = await api.get('/get-category');
  return response.data.data;
};
// add Category
export const addCategory = async (categoryData: { name: string }) => {
  const response = await api.post('/add-category', categoryData);
  return response.data;
};
// edit Category
export const updateCategory = async (id: string, categoryData: any) => {
  const response = await api.post(`/update-category/${id}`, categoryData);
  return response.data;
};
// delete Category
export const deleteCategory = async (id: number) => {
  const response = await api.post(`/delete-category/${id}`);
  return response.data;
};

//Library Resource apis Started
// fetch Resources
export const fetchResources = async () => {
  const response = await api.get('/get-resources');
  return response.data.data;
};
// add Resource
export const addResource = async (resourcesData: { name: string }) => {
  const response = await api.post('/add-resource', resourcesData);
  return response.data;
};
// edit Resource
export const updateResource = async (id: string, resourcesData: any) => {
  const response = await api.post(`/update-resource/${id}`, resourcesData);
  return response.data;
};
// delete Resource
export const deleteResource = async (id: number) => {
  const response = await api.post(`/delete-resource/${id}`);
  return response.data;
};

//Library apis Started
// fetch Library items
export const fetchLibrary = async () => {
  const response = await api.get('/get-library');
  return response.data.data;
};
// add Library item
export const addLibrary = async (libraryData: FormData): Promise<any> => {
  const response = await api.post('/add-library', libraryData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
// edit Library item
export const updateLibrary = async (id: string, libraryData: FormData) => {
  const response = await api.post(`/update-library/${id}`, libraryData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// delete Library item
export const deleteLibrary = async (id: number, filePath?: string) => {
  const formData = new FormData();
  if (filePath) {
    formData.append('file_path', filePath);
  }
  const response = await api.post(`/delete-library/${id}`, formData);
  return response.data;
};

// Library Request Approval APIs
export const fetchLibraryRequests = async () => {
  const response = await api.get('/fetch-library-requests');
  return response.data.data;
};

// Library Request Approval API
export const approveLibraryRequest = async (id: number) => {
  const response = await api.get(`/approve-library-request/${id}`);
  return response.data;
};

// Library Request Reject API
export const rejectLibraryRequest = async (id: number) => {
  const response = await api.get(`/reject-library-request/${id}`);
  return response.data;
};


export default api;