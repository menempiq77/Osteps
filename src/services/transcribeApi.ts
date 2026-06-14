const TRANSCRIBE_ENDPOINT = "/api/tools/transcribe";

const parseResponse = async (response: Response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err: any = new Error(
      payload?.message || "Transcription failed. Please try again."
    );
    err.details = payload;
    err.status = response.status;
    throw err;
  }
  return payload;
};

export const startTranscribeFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(TRANSCRIBE_ENDPOINT, {
    method: "POST",
    body: formData,
  });
  return parseResponse(response);
};

export const startTranscribeUrl = async (url: string) => {
  const response = await fetch(TRANSCRIBE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return parseResponse(response);
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
