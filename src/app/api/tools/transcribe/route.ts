import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

export const runtime = "nodejs";
export const maxDuration = 300;

const execFileAsync = promisify(execFile);

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const GROQ_WHISPER_MODEL =
  process.env.GROQ_WHISPER_MODEL || "whisper-large-v3-turbo";

// Groq audio endpoint accepts up to 25MB on the free tier. We compress audio to
// mono 16kHz so a chunk holds a lot of speech while staying well under the cap.
const SEGMENT_SECONDS = Number(process.env.TRANSCRIBE_SEGMENT_SECONDS || 600);
const MAX_TOTAL_CHUNKS = Number(process.env.TRANSCRIBE_MAX_CHUNKS || 24);
const MAX_UPLOAD_BYTES = 1024 * 1024 * 1024; // 1GB hard ceiling for uploads

type Diagnostics = Record<string, unknown>;

const sanitizeError = (raw: string): string => {
  const text = String(raw || "").trim();
  if (!text) return "Transcription failed.";
  // Surface the most useful single line for the user.
  const firstError =
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => /error|unsupported|unable|failed|not available/i.test(line)) ||
    text.split(/\r?\n/)[0];
  return firstError.slice(0, 300);
};

const makeTempDir = async (): Promise<string> => {
  const dir = path.join(
    os.tmpdir(),
    `transcribe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
  await fs.mkdir(dir, { recursive: true });
  return dir;
};

const removeDir = async (dir: string) => {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    /* ignore cleanup errors */
  }
};

// Download the bestaudio stream for any supported site (YouTube, Instagram,
// Facebook, TikTok, X, direct media links, …) via yt-dlp.
const downloadAudioFromUrl = async (
  url: string,
  tempDir: string,
  diagnostics: Diagnostics
): Promise<string> => {
  const outputTpl = path.join(tempDir, "source.%(ext)s");
  const customBin = (process.env.YT_DLP_PATH || "").trim();
  const args = [
    "--no-playlist",
    "--no-warnings",
    "--force-ipv4",
    "-f",
    "bestaudio/best",
    "-o",
    outputTpl,
    url,
  ];

  const candidates: Array<{ bin: string; prefix: string[]; label: string }> = [];
  if (customBin) {
    const parts = customBin.split(" ").filter(Boolean);
    candidates.push({ bin: parts[0], prefix: parts.slice(1), label: customBin });
  }
  candidates.push(
    { bin: "yt-dlp", prefix: [], label: "yt-dlp" },
    { bin: "python3", prefix: ["-m", "yt_dlp"], label: "python3 -m yt_dlp" },
    { bin: "python", prefix: ["-m", "yt_dlp"], label: "python -m yt_dlp" }
  );

  const attempts: Array<{ command: string; error: string }> = [];
  let succeeded = false;
  let lastError = "";

  for (const candidate of candidates) {
    try {
      const result = await execFileAsync(
        candidate.bin,
        [...candidate.prefix, ...args],
        { windowsHide: true, timeout: 240000, maxBuffer: 1024 * 1024 * 16 }
      );
      diagnostics.ytDlpCommand = candidate.label;
      diagnostics.ytDlpStderr = String(result.stderr || "").slice(0, 800);
      succeeded = true;
      break;
    } catch (err) {
      const e = err as { message?: string; stderr?: string };
      lastError = e?.stderr || e?.message || "yt-dlp failed";
      attempts.push({
        command: candidate.label,
        error: String(lastError).slice(0, 300),
      });
    }
  }

  diagnostics.ytDlpAttempts = attempts;

  if (!succeeded) {
    throw new Error(
      sanitizeError(lastError) ||
        "Could not download media from that link. The site may require login or the link is private."
    );
  }

  const files = await fs.readdir(tempDir);
  const downloaded = files.find((f) => f.startsWith("source."));
  if (!downloaded) {
    throw new Error("Download finished but no audio file was produced.");
  }
  return path.join(tempDir, downloaded);
};

// Convert any input media to compressed mono 16kHz mp3 chunks for Whisper.
const buildAudioChunks = async (
  inputPath: string,
  tempDir: string,
  diagnostics: Diagnostics
): Promise<string[]> => {
  const chunkTpl = path.join(tempDir, "chunk_%03d.mp3");
  const args = [
    "-y",
    "-i",
    inputPath,
    "-vn",
    "-ac",
    "1",
    "-ar",
    "16000",
    "-b:a",
    "64k",
    "-f",
    "segment",
    "-segment_time",
    String(SEGMENT_SECONDS),
    chunkTpl,
  ];

  try {
    const result = await execFileAsync("ffmpeg", args, {
      windowsHide: true,
      timeout: 240000,
      maxBuffer: 1024 * 1024 * 16,
    });
    diagnostics.ffmpegStderr = String(result.stderr || "").slice(-800);
  } catch (err) {
    const e = err as { message?: string; stderr?: string };
    throw new Error(
      sanitizeError(e?.stderr || e?.message || "Audio conversion failed.")
    );
  }

  const chunks = (await fs.readdir(tempDir))
    .filter((f) => /^chunk_\d+\.mp3$/.test(f))
    .sort();

  if (chunks.length === 0) {
    throw new Error("No audio could be extracted from this media.");
  }
  if (chunks.length > MAX_TOTAL_CHUNKS) {
    throw new Error(
      `This media is too long to transcribe here (${chunks.length} segments). Please use a shorter clip.`
    );
  }
  return chunks.map((c) => path.join(tempDir, c));
};

const transcribeChunkWithGroq = async (chunkPath: string): Promise<string> => {
  const buffer = await fs.readFile(chunkPath);
  const form = new FormData();
  form.append(
    "file",
    new Blob([buffer], { type: "audio/mpeg" }),
    path.basename(chunkPath)
  );
  form.append("model", GROQ_WHISPER_MODEL);
  form.append("response_format", "text");
  form.append("temperature", "0");

  const response = await fetch(
    "https://api.groq.com/openai/v1/audio/transcriptions",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
      body: form,
    }
  );

  const raw = await response.text();
  if (!response.ok) {
    let detail = raw;
    try {
      const parsed = JSON.parse(raw);
      detail = parsed?.error?.message || raw;
    } catch {
      /* keep raw text */
    }
    throw new Error(sanitizeError(detail) || "Groq transcription failed.");
  }
  return raw.trim();
};

const transcribeFile = async (
  inputPath: string,
  tempDir: string,
  diagnostics: Diagnostics
): Promise<string> => {
  const chunks = await buildAudioChunks(inputPath, tempDir, diagnostics);
  diagnostics.chunkCount = chunks.length;
  const parts: string[] = [];
  for (const chunk of chunks) {
    const text = await transcribeChunkWithGroq(chunk);
    if (text) parts.push(text);
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
};

export async function POST(req: NextRequest) {
  if (!GROQ_API_KEY) {
    return NextResponse.json(
      { message: "Transcription is not configured (missing API key)." },
      { status: 500 }
    );
  }

  const contentType = req.headers.get("content-type") || "";
  const diagnostics: Diagnostics = {};
  let tempDir = "";

  try {
    tempDir = await makeTempDir();
    let inputPath = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");
      if (!file || typeof file === "string") {
        return NextResponse.json(
          { message: "No file was uploaded." },
          { status: 400 }
        );
      }
      const blob = file as File;
      if (blob.size > MAX_UPLOAD_BYTES) {
        return NextResponse.json(
          { message: "File is too large (max 1GB)." },
          { status: 413 }
        );
      }
      const arrayBuffer = await blob.arrayBuffer();
      const safeName = (blob.name || "upload").replace(/[^\w.-]+/g, "_");
      inputPath = path.join(tempDir, `upload-${safeName}`);
      await fs.writeFile(inputPath, Buffer.from(arrayBuffer));
      diagnostics.mode = "file";
    } else {
      const body = await req.json().catch(() => ({}));
      const url = String(body?.url || "").trim();
      if (!url || !/^https?:\/\//i.test(url)) {
        return NextResponse.json(
          { message: "Please provide a valid http(s) media URL." },
          { status: 400 }
        );
      }
      diagnostics.mode = "url";
      inputPath = await downloadAudioFromUrl(url, tempDir, diagnostics);
    }

    const text = await transcribeFile(inputPath, tempDir, diagnostics);
    if (!text) {
      return NextResponse.json(
        {
          message:
            "No speech could be detected in this media.",
          debug: diagnostics,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ text, status: "done", debug: diagnostics });
  } catch (error) {
    const e = error as { message?: string };
    return NextResponse.json(
      { message: sanitizeError(e?.message || "Transcription failed."), debug: diagnostics },
      { status: 500 }
    );
  } finally {
    if (tempDir) await removeDir(tempDir);
  }
}
