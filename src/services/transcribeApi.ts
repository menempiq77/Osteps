import api from "@/services/api";

export const startTranscribeFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("async", "1");

  const response = await api.post("/transcribe", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getTranscribeStatus = async (jobId: string) => {
  const response = await api.get(`/transcribe/${jobId}`);
  return response.data;
};
