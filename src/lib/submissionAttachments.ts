import { IMG_BASE_URL } from "@/lib/config";

export type SubmissionAttachment = {
  path: string;
  url: string;
  name: string;
  size?: number | null;
  type?: string | null;
  uploaded_at?: string | null;
};

const isPlainObject = (value: unknown): value is Record<string, any> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const buildStorageUrl = (path: string | null | undefined) => {
  const rawPath = String(path || "").trim();
  if (!rawPath) return "";
  if (/^https?:\/\//i.test(rawPath)) return rawPath;

  const cleanPath = rawPath.replace(/^\/+/, "");
  return cleanPath.startsWith("storage/")
    ? `${IMG_BASE_URL}/${cleanPath}`
    : `${IMG_BASE_URL}/storage/${cleanPath}`;
};

export const getFileNameFromPath = (path: string | null | undefined) => {
  const rawPath = String(path || "").trim();
  if (!rawPath) return "Uploaded file";

  const cleanPath = rawPath.split("?")[0].split("#")[0];
  const fileName = cleanPath.split("/").filter(Boolean).pop();
  return decodeURIComponent(fileName || "Uploaded file");
};

const parseAttachmentInput = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [trimmed];
  }
};

export const parseSubmissionAttachments = (
  value: unknown,
  fallbackPath?: string | null
): SubmissionAttachment[] => {
  const items = parseAttachmentInput(value);
  if (items.length === 0 && fallbackPath) {
    items.push(fallbackPath);
  }

  const byPath = new Map<string, SubmissionAttachment>();
  for (const item of items) {
    const path = isPlainObject(item)
      ? String(item.path ?? item.file_path ?? item.url ?? "").trim()
      : String(item ?? "").trim();
    if (!path) continue;

    const attachment: SubmissionAttachment = {
      path,
      url: buildStorageUrl(path),
      name: isPlainObject(item)
        ? String(item.name ?? item.original_name ?? getFileNameFromPath(path)).trim()
        : getFileNameFromPath(path),
      size: isPlainObject(item) && item.size != null ? Number(item.size) : null,
      type: isPlainObject(item) ? String(item.type ?? item.mime ?? "").trim() || null : null,
      uploaded_at: isPlainObject(item)
        ? String(item.uploaded_at ?? item.uploadedAt ?? "").trim() || null
        : null,
    };

    if (!byPath.has(path)) byPath.set(path, attachment);
  }

  return Array.from(byPath.values());
};

export const serializeKeptSubmissionAttachments = (
  attachments: SubmissionAttachment[]
) =>
  JSON.stringify(
    attachments.map((attachment) => ({
      path: attachment.path,
      name: attachment.name,
      size: attachment.size ?? null,
      type: attachment.type ?? null,
      uploaded_at: attachment.uploaded_at ?? null,
    }))
  );