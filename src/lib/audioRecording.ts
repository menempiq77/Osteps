// Shared audio-recording helpers, mirroring the proven logic in AssignmentDrawer.tsx
// so quiz "Recording" questions behave exactly like assessment task recordings.

export const getSupportedAudioMimeType = (): string => {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
    return "";
  }

  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
    "audio/ogg",
  ];

  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
};

export const getAudioFileExtension = (mimeType: string): string => {
  if (mimeType.includes("mp4")) return "m4a";
  if (mimeType.includes("ogg")) return "ogg";
  return "webm";
};

export const formatRecordingTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const pad = (value: number) => value.toString().padStart(2, "0");

// Builds a File from recorded chunks using a stable, filesystem-safe name.
export const createRecordingFile = (
  chunks: BlobPart[],
  mimeType: string,
  prefix = "quiz-recording"
): File => {
  const finalMimeType = mimeType || "audio/webm";
  const blob = new Blob(chunks, { type: finalMimeType });
  const extension = getAudioFileExtension(finalMimeType || blob.type);
  const now = new Date();
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate()
  )}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const safePrefix =
    prefix
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "quiz-recording";
  const fileName = `${safePrefix}-${stamp}.${extension}`;
  return new File([blob], fileName, {
    type: finalMimeType || blob.type || "audio/webm",
  });
};
