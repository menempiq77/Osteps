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

export const startTranscribeUrl = async (url: string) => {
  const response = await api.post("/transcribe", {
    url,
    async: 1,
  });
  return response.data;
};

export const getTranscribeStatus = async (jobId: string) => {
  const response = await api.get(`/transcribe/${jobId}`);
  return response.data;
};

export const fetchYoutubeCaptionFallback = async (videoUrl: string) => {
  const response = await fetch("/api/tools/youtube-captions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: videoUrl }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err: any = new Error(
      payload?.message || "No YouTube captions found for this video."
    );
    err.details = payload;
    err.status = response.status;
    throw err;
  }
  return payload;
};
