// Shared audio-recording helpers, mirroring the proven logic in AssignmentDrawer.tsx
// so quiz "Recording" questions behave exactly like assessment task recordings.

export type AudioInputDeviceOption = {
  deviceId: string;
  label: string;
};

export const AUTO_AUDIO_INPUT_ID = "__auto_microphone__";

// Constraints proven to capture audible audio across browsers/devices.
export const BASE_AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: false,
  noiseSuppression: false,
  autoGainControl: true,
};

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

export const getAudioInputOptions = async (): Promise<AudioInputDeviceOption[]> => {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) {
    return [];
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices
    .filter((device) => device.kind === "audioinput")
    .map((device, index) => ({
      deviceId: device.deviceId,
      label: device.label || `Microphone ${index + 1}`,
    }));
};

export const isGenericMicrophoneLabel = (label: string): boolean =>
  /^Microphone \d+$/i.test(label.trim());

// Smart microphone selection: prefer the real default device, avoid
// monitors/output/stereo-mix/communications devices that record silence.
export const chooseAutoAudioInputDevice = (
  devices: AudioInputDeviceOption[]
): AudioInputDeviceOption | null => {
  const defaultDevice = devices.find((device) =>
    device.label.toLowerCase().startsWith("default")
  );

  if (defaultDevice) {
    const defaultTargetLabel = defaultDevice.label
      .replace(/^default\s*-\s*/i, "")
      .trim()
      .toLowerCase();
    const matchingPhysicalDevice = devices.find((device) => {
      const label = device.label.toLowerCase();
      return (
        device.deviceId !== defaultDevice.deviceId &&
        !label.startsWith("default") &&
        !label.startsWith("communications") &&
        defaultTargetLabel &&
        (label === defaultTargetLabel ||
          defaultTargetLabel.includes(label) ||
          label.includes(defaultTargetLabel))
      );
    });

    if (matchingPhysicalDevice) return matchingPhysicalDevice;
  }

  const scoredDevices = devices
    .filter((device) => device.deviceId)
    .map((device, index) => {
      const label = device.label.toLowerCase();
      let score = 0;

      if (label.startsWith("default")) score += 100;
      if (label.includes("microphone")) score += 20;
      if (label.includes("array") || label.includes("built-in") || label.includes("internal")) score += 8;
      if (label.includes("communications")) score -= 35;
      if (label.includes("cast")) score -= 70;
      if (label.includes("monitor") || label.includes("output") || label.includes("stereo mix")) score -= 60;
      if (isGenericMicrophoneLabel(device.label)) score -= 5;

      return { device, score, index };
    });

  scoredDevices.sort((a, b) => b.score - a.score || a.index - b.index);
  return scoredDevices[0]?.device || null;
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
