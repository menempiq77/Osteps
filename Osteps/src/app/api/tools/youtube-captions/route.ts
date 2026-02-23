import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

export const runtime = "nodejs";
const execFileAsync = promisify(execFile);

const YT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.youtube.com/",
  Origin: "https://www.youtube.com",
};

const parseYoutubeVideoId = (rawUrl: string): string | null => {
  try {
    const url = new URL(rawUrl.trim());
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "").trim() || null;
    }
    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/")[2] || null;
      }
      return url.searchParams.get("v");
    }
    return null;
  } catch {
    return null;
  }
};

const decodeHtml = (input: string): string =>
  input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

const withQueryParam = (rawUrl: string, key: string, value: string): string => {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set(key, value);
    return url.toString();
  } catch {
    const separator = rawUrl.includes("?") ? "&" : "?";
    return `${rawUrl}${separator}${encodeURIComponent(key)}=${encodeURIComponent(
      value
    )}`;
  }
};

const extractJsonObject = (content: string, marker: string): any | null => {
  const markerIndex = content.indexOf(marker);
  if (markerIndex === -1) return null;

  const start = content.indexOf("{", markerIndex);
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < content.length; i += 1) {
    const ch = content[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") depth += 1;
    if (ch === "}") depth -= 1;

    if (depth === 0) {
      const jsonText = content.slice(start, i + 1);
      try {
        return JSON.parse(jsonText);
      } catch {
        return null;
      }
    }
  }

  return null;
};

const parseJson3Transcript = (payload: any): string => {
  const events = Array.isArray(payload?.events) ? payload.events : [];
  const parts: string[] = [];

  for (const event of events) {
    const segs = Array.isArray(event?.segs) ? event.segs : [];
    for (const seg of segs) {
      const text = String(seg?.utf8 || "").trim();
      if (text) parts.push(text);
    }
  }

  return decodeHtml(parts.join(" ").replace(/\s+/g, " ").trim());
};

const stripTags = (input: string): string =>
  input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const parseXmlTextTranscript = (xml: string): string => {
  const parts: string[] = [];

  // Legacy timedtext format: <text ...>...</text>
  const textRegex = /<text[^>]*>([\s\S]*?)<\/text>/gi;
  let textMatch: RegExpExecArray | null = textRegex.exec(xml);
  while (textMatch) {
    const content = stripTags(textMatch[1] || "");
    if (content) parts.push(content);
    textMatch = textRegex.exec(xml);
  }

  // srv3 format: <p ...>...</p> and often nested <s>...</s>
  if (parts.length === 0) {
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pMatch: RegExpExecArray | null = pRegex.exec(xml);
    while (pMatch) {
      const pContent = pMatch[1] || "";
      const segs: string[] = [];

      const sRegex = /<s[^>]*>([\s\S]*?)<\/s>/gi;
      let sMatch: RegExpExecArray | null = sRegex.exec(pContent);
      while (sMatch) {
        const sContent = stripTags(sMatch[1] || "");
        if (sContent) segs.push(sContent);
        sMatch = sRegex.exec(pContent);
      }

      const line = segs.length ? segs.join(" ") : stripTags(pContent);
      if (line) parts.push(line);
      pMatch = pRegex.exec(xml);
    }
  }

  return decodeHtml(parts.join(" ").replace(/\s+/g, " ").trim());
};

const parseVttTranscript = (vtt: string): string => {
  const cleaned = vtt
    .replace(/^\uFEFF?WEBVTT.*$/gim, "")
    .replace(/^\d+\s*$/gim, "")
    .replace(
      /^\d{1,2}:\d{2}(?::\d{2})?\.\d{3}\s*-->\s*\d{1,2}:\d{2}(?::\d{2})?\.\d{3}.*$/gim,
      ""
    )
    .replace(/<[^>]+>/g, " ")
    .replace(/\n+/g, " ");
  return decodeHtml(cleaned.replace(/\s+/g, " ").trim());
};

const pickTrack = (tracks: any[]) => {
  if (!tracks.length) return null;
  return (
    tracks.find((t) => String(t?.languageCode || "").toLowerCase() === "en") ||
    tracks.find((t) => String(t?.kind || "").toLowerCase() === "asr") ||
    tracks[0]
  );
};

const INVIDIOUS_FALLBACKS = [
  "https://inv.nadeko.net",
  "https://invidious.private.coffee",
  "https://yewtu.be",
  "https://inv.perditum.com",
  "https://invidious.einfachzocken.eu",
];

const pickInvidiousLabel = (captions: any[]): string | null => {
  if (!Array.isArray(captions) || !captions.length) return null;
  const preferred =
    captions.find((c) =>
      String(c?.label || "")
        .toLowerCase()
        .includes("english")
    ) ||
    captions.find((c) => String(c?.languageCode || "").toLowerCase() === "en") ||
    captions[0];
  return preferred?.label ? String(preferred.label) : null;
};

const tryInvidiousCaptionFallback = async (videoId: string) => {
  const diagnostics: any[] = [];

  for (const base of INVIDIOUS_FALLBACKS) {
    try {
      const listRes = await fetch(`${base}/api/v1/captions/${encodeURIComponent(videoId)}`, {
        cache: "no-store",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept: "application/json,text/plain,*/*",
        },
      });
      const listText = await listRes.text();
      let listJson: any = null;
      try {
        listJson = JSON.parse(listText);
      } catch {
        diagnostics.push({
          base,
          stage: "list",
          status: listRes.status,
          note: "invalid_json",
          sample: listText.slice(0, 120),
        });
        continue;
      }

      const captions = Array.isArray(listJson?.captions) ? listJson.captions : [];
      const label = pickInvidiousLabel(captions);
      if (!label) {
        diagnostics.push({
          base,
          stage: "list",
          status: listRes.status,
          note: "no_caption_labels",
          captionsCount: captions.length,
        });
        continue;
      }

      const capUrl = `${base}/api/v1/captions/${encodeURIComponent(
        videoId
      )}?label=${encodeURIComponent(label)}`;
      const capRes = await fetch(capUrl, {
        cache: "no-store",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept: "text/vtt,text/plain,application/xml,*/*",
        },
      });
      const capBody = await capRes.text();

      const parsed =
        parseVttTranscript(capBody) || parseXmlTextTranscript(capBody) || "";
      diagnostics.push({
        base,
        stage: "caption",
        status: capRes.status,
        label,
        responseLength: capBody.length,
        parsedLength: parsed.length,
      });

      if (parsed.trim().length > 0) {
        return {
          text: parsed.trim(),
          langCode:
            captions.find((c: any) => String(c?.label || "") === label)?.languageCode ||
            null,
          source: "invidious-fallback",
          debug: diagnostics,
        };
      }
    } catch (error: any) {
      diagnostics.push({
        base,
        stage: "exception",
        note: error?.message || "request_failed",
      });
    }
  }

  return { text: "", source: "invidious-fallback", debug: diagnostics };
};

const tryYtDlpCaptionFallback = async (videoUrl: string) => {
  const diagnostics: Record<string, any> = {};
  const customBin = (process.env.YT_DLP_PATH || "").trim();
  const tempDir = path.join(
    os.tmpdir(),
    `ytcap-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );

  try {
    await fs.mkdir(tempDir, { recursive: true });
    const outputTpl = path.join(tempDir, "cap.%(ext)s");
    const args = [
      "--skip-download",
      "--write-auto-subs",
      "--write-subs",
      "--sub-langs",
      "en.*,en",
      "--sub-format",
      "vtt",
      "--output",
      outputTpl,
      videoUrl,
    ];

    const commandCandidates: Array<{ bin: string; prefix: string[]; label: string }> = [];

    if (customBin) {
      const customParts = customBin.split(" ").filter(Boolean);
      commandCandidates.push({
        bin: customParts[0],
        prefix: customParts.slice(1),
        label: `custom:${customBin}`,
      });
    }

    commandCandidates.push(
      { bin: "yt-dlp", prefix: [], label: "yt-dlp" },
      { bin: "py", prefix: ["-m", "yt_dlp"], label: "py -m yt_dlp" },
      { bin: "python", prefix: ["-m", "yt_dlp"], label: "python -m yt_dlp" },
      { bin: "python3", prefix: ["-m", "yt_dlp"], label: "python3 -m yt_dlp" }
    );

    const tried: Array<{ command: string; error: string }> = [];
    let commandUsed: string | null = null;
    let stdout = "";
    let stderr = "";

    for (const candidate of commandCandidates) {
      const commandText = `${candidate.bin} ${[...candidate.prefix, ...args].join(" ")}`;
      try {
        const result = await execFileAsync(candidate.bin, [...candidate.prefix, ...args], {
          windowsHide: true,
          timeout: 120000,
          maxBuffer: 1024 * 1024 * 8,
        });
        stdout = String(result.stdout || "");
        stderr = String(result.stderr || "");
        commandUsed = candidate.label;
        break;
      } catch (err: any) {
        tried.push({
          command: commandText.slice(0, 220),
          error: err?.message || "command failed",
        });
      }
    }

    diagnostics.commandAttempts = tried;
    if (!commandUsed) {
      diagnostics.error = "No yt-dlp command is available on this machine.";
      return { text: "", source: "yt-dlp-fallback", debug: diagnostics };
    }

    diagnostics.commandUsed = commandUsed;
    diagnostics.stdout = stdout.slice(0, 1200);
    diagnostics.stderr = stderr.slice(0, 1200);

    const files = await fs.readdir(tempDir);
    const subtitleFile =
      files.find((f) => f.toLowerCase().endsWith(".vtt")) ||
      files.find((f) => f.toLowerCase().includes(".en.") && f.toLowerCase().endsWith(".srv3"));

    if (!subtitleFile) {
      diagnostics.files = files;
      return { text: "", source: "yt-dlp-fallback", debug: diagnostics };
    }

    const fullPath = path.join(tempDir, subtitleFile);
    const body = await fs.readFile(fullPath, "utf8");
    const parsed = parseVttTranscript(body) || parseXmlTextTranscript(body) || "";
    diagnostics.files = files;
    diagnostics.selectedFile = subtitleFile;
    diagnostics.responseLength = body.length;
    diagnostics.parsedLength = parsed.length;

    return { text: parsed, source: "yt-dlp-fallback", debug: diagnostics };
  } catch (error: any) {
    diagnostics.error = error?.message || "yt-dlp failed";
    return { text: "", source: "yt-dlp-fallback", debug: diagnostics };
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
  }
};

const fetchYoutubeText = async (url: string) => {
  const res = await fetch(url, {
    headers: YT_HEADERS,
    cache: "no-store",
    redirect: "follow",
  });
  const body = await res.text();
  return {
    status: res.status,
    contentType: res.headers.get("content-type"),
    body,
    finalUrl: res.url,
  };
};

const isYoutubeBlockedResponse = (status: number, body: string): boolean => {
  const sample = (body || "").slice(0, 400).toLowerCase();
  return (
    status === 429 ||
    sample.includes("<title>sorry") ||
    sample.includes("our systems have detected unusual traffic") ||
    sample.includes("/sorry/")
  );
};

const isLikelyCaptionPayload = (body: string): boolean => {
  const sample = (body || "").slice(0, 800).toLowerCase();
  return (
    sample.includes('"events"') ||
    sample.includes("<transcript") ||
    sample.includes("<timedtext") ||
    sample.includes("<text") ||
    sample.includes("<p ")
  );
};

const summarizeTracks = (tracks: any[]) =>
  tracks.map((t) => ({
    languageCode: t?.languageCode || null,
    name:
      t?.name?.simpleText ||
      (Array.isArray(t?.name?.runs)
        ? t.name.runs.map((r: any) => r?.text || "").join("")
        : null),
    kind: t?.kind || null,
    isTranslatable: !!t?.isTranslatable,
  }));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const videoUrl = String(body?.url || "").trim();
    if (!videoUrl) {
      return NextResponse.json({ message: "URL is required." }, { status: 400 });
    }

    const videoId = parseYoutubeVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json({ message: "Invalid YouTube URL." }, { status: 400 });
    }

    const watchHtml = await fetch(
      `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&hl=en`,
      {
        headers: { ...YT_HEADERS, Accept: "text/html" },
        cache: "no-store",
      }
    ).then((r) => r.text());

    const playerResponse =
      extractJsonObject(watchHtml, "ytInitialPlayerResponse = ") ||
      extractJsonObject(watchHtml, "var ytInitialPlayerResponse = ");

    const captionTracks =
      playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
    const trackSummary = summarizeTracks(
      Array.isArray(captionTracks) ? captionTracks : []
    );

    if (!Array.isArray(captionTracks) || !captionTracks.length) {
      return NextResponse.json(
        {
          message: "No YouTube captions found for this video.",
          debug: {
            videoId,
            hasPlayerResponse: !!playerResponse,
            captionTracksCount: 0,
            tracks: trackSummary,
          },
        },
        { status: 404 }
      );
    }

    const selectedTrack = pickTrack(captionTracks);
    const baseUrl = String(selectedTrack?.baseUrl || "");
    if (!baseUrl) {
      return NextResponse.json(
        {
          message: "Caption track is missing a source URL.",
          debug: {
            videoId,
            captionTracksCount: captionTracks.length,
            tracks: trackSummary,
            selectedTrack: {
              languageCode: selectedTrack?.languageCode || null,
              kind: selectedTrack?.kind || null,
            },
          },
        },
        { status: 404 }
      );
    }

    let text = "";
    let parseSource = "";
    const parseDiagnostics: Array<Record<string, any>> = [];

    const json3Url = withQueryParam(baseUrl, "fmt", "json3");
    const json3Result = await fetchYoutubeText(json3Url);
    const json3Raw = json3Result.body;
    if (!isYoutubeBlockedResponse(json3Result.status, json3Raw) && isLikelyCaptionPayload(json3Raw)) {
      try {
        const json3Payload = JSON.parse(json3Raw);
        text = parseJson3Transcript(json3Payload);
        if (text) parseSource = "json3";
        parseDiagnostics.push({
          fmt: "json3",
          status: json3Result.status,
          contentType: json3Result.contentType,
          finalUrl: json3Result.finalUrl,
          responseLength: json3Raw.length,
          parsedLength: text.length,
        });
      } catch {
        parseDiagnostics.push({
          fmt: "json3",
          status: json3Result.status,
          contentType: json3Result.contentType,
          finalUrl: json3Result.finalUrl,
          responseLength: json3Raw.length,
          parsedLength: 0,
          parseError: "invalid JSON",
          sample: json3Raw.slice(0, 220),
        });
      }
    } else {
      parseDiagnostics.push({
        fmt: "json3",
        status: json3Result.status,
        contentType: json3Result.contentType,
        finalUrl: json3Result.finalUrl,
        responseLength: json3Raw.length,
        parsedLength: 0,
        parseError: isYoutubeBlockedResponse(json3Result.status, json3Raw)
          ? "youtube_blocked_or_rate_limited"
          : "not_caption_payload",
        sample: json3Raw.slice(0, 220),
      });
    }

    if (!text) {
      const srv3Url = withQueryParam(baseUrl, "fmt", "srv3");
      const srv3Result = await fetchYoutubeText(srv3Url);
      const srv3Xml = srv3Result.body;
      if (!isYoutubeBlockedResponse(srv3Result.status, srv3Xml) && isLikelyCaptionPayload(srv3Xml)) {
        text = parseXmlTextTranscript(srv3Xml);
      }
      if (text) parseSource = "srv3";
      parseDiagnostics.push({
        fmt: "srv3",
        status: srv3Result.status,
        contentType: srv3Result.contentType,
        finalUrl: srv3Result.finalUrl,
        responseLength: srv3Xml.length,
        parsedLength: text.length,
        parseError:
          !text && isYoutubeBlockedResponse(srv3Result.status, srv3Xml)
            ? "youtube_blocked_or_rate_limited"
            : undefined,
        sample: srv3Xml.slice(0, 220),
      });
    }

    if (!text) {
      const xmlUrl = withQueryParam(baseUrl, "fmt", "xml");
      const xmlResult = await fetchYoutubeText(xmlUrl);
      const xml = xmlResult.body;
      if (!isYoutubeBlockedResponse(xmlResult.status, xml) && isLikelyCaptionPayload(xml)) {
        text = parseXmlTextTranscript(xml);
      }
      if (text) parseSource = "xml";
      parseDiagnostics.push({
        fmt: "xml",
        status: xmlResult.status,
        contentType: xmlResult.contentType,
        finalUrl: xmlResult.finalUrl,
        responseLength: xml.length,
        parsedLength: text.length,
        parseError:
          !text && isYoutubeBlockedResponse(xmlResult.status, xml)
            ? "youtube_blocked_or_rate_limited"
            : undefined,
        sample: xml.slice(0, 220),
      });
    }

    if (!text) {
      const vttUrl = withQueryParam(baseUrl, "fmt", "vtt");
      const vttResult = await fetchYoutubeText(vttUrl);
      const vtt = vttResult.body;
      if (!isYoutubeBlockedResponse(vttResult.status, vtt) && isLikelyCaptionPayload(vtt)) {
        text = parseVttTranscript(vtt);
      }
      if (text) parseSource = "vtt";
      parseDiagnostics.push({
        fmt: "vtt",
        status: vttResult.status,
        contentType: vttResult.contentType,
        finalUrl: vttResult.finalUrl,
        responseLength: vtt.length,
        parsedLength: text.length,
        parseError:
          !text && isYoutubeBlockedResponse(vttResult.status, vtt)
            ? "youtube_blocked_or_rate_limited"
            : undefined,
        sample: vtt.slice(0, 220),
      });
    }

    if (!text) {
      // Last chance: fetch base URL as-is (some tracks already pin a working format)
      const rawResult = await fetchYoutubeText(baseUrl);
      const rawBody = rawResult.body;
      const rawAsXml =
        !isYoutubeBlockedResponse(rawResult.status, rawBody) &&
        isLikelyCaptionPayload(rawBody)
          ? parseXmlTextTranscript(rawBody)
          : "";
      const rawAsVtt =
        !isYoutubeBlockedResponse(rawResult.status, rawBody) &&
        isLikelyCaptionPayload(rawBody)
          ? parseVttTranscript(rawBody)
          : "";
      text = rawAsXml || rawAsVtt;
      if (text) parseSource = "baseUrl";
      parseDiagnostics.push({
        fmt: "baseUrl",
        status: rawResult.status,
        contentType: rawResult.contentType,
        finalUrl: rawResult.finalUrl,
        responseLength: rawBody.length,
        parsedLength: text.length,
        parseError:
          !text && isYoutubeBlockedResponse(rawResult.status, rawBody)
            ? "youtube_blocked_or_rate_limited"
            : undefined,
        sample: rawBody.slice(0, 220),
      });
    }

    if (!text) {
      const blocked = parseDiagnostics.some(
        (d) => d.parseError === "youtube_blocked_or_rate_limited"
      );
      let invidiousDiagnostics: any[] = [];

      if (blocked) {
        const inv = await tryInvidiousCaptionFallback(videoId);
        invidiousDiagnostics = Array.isArray(inv?.debug) ? inv.debug : [];
        if (inv.text) {
          return NextResponse.json({
            text: inv.text,
            source: "invidious-fallback",
            videoId,
            langCode: inv.langCode,
            debug: {
              videoId,
              captionTracksCount: captionTracks.length,
              tracks: trackSummary,
              selectedTrack: {
                languageCode: selectedTrack?.languageCode || null,
                kind: selectedTrack?.kind || null,
              },
              parseSource: "invidious-fallback",
              parseAttempts: ["json3", "srv3", "xml", "vtt", "baseUrl", "invidious"],
              parseDiagnostics,
              invidiousDiagnostics: inv.debug,
            },
          });
        }
      }

      let ytDlpDiagnostics: Record<string, any> | null = null;
      if (!text) {
        const ytDlp = await tryYtDlpCaptionFallback(videoUrl);
        ytDlpDiagnostics = ytDlp.debug || null;
        if (ytDlp.text) {
          return NextResponse.json({
            text: ytDlp.text,
            source: "yt-dlp-fallback",
            videoId,
            langCode: "en",
            debug: {
              videoId,
              captionTracksCount: captionTracks.length,
              tracks: trackSummary,
              selectedTrack: {
                languageCode: selectedTrack?.languageCode || null,
                kind: selectedTrack?.kind || null,
              },
              parseSource: "yt-dlp-fallback",
              parseAttempts: [
                "json3",
                "srv3",
                "xml",
                "vtt",
                "baseUrl",
                "invidious",
                "yt-dlp",
              ],
              parseDiagnostics,
              invidiousDiagnostics,
              ytDlpDiagnostics,
            },
          });
        }
      }

      return NextResponse.json(
        {
          message: blocked
            ? "YouTube blocked caption requests (rate-limited). Try again later or upload file."
            : "Captions were found, but transcript text is empty.",
          debug: {
            videoId,
            captionTracksCount: captionTracks.length,
            tracks: trackSummary,
            selectedTrack: {
              languageCode: selectedTrack?.languageCode || null,
              kind: selectedTrack?.kind || null,
            },
            parseAttempts: [
              "json3",
              "srv3",
              "xml",
              "vtt",
              "baseUrl",
              "invidious",
              "yt-dlp",
            ],
            parseDiagnostics,
            invidiousDiagnostics,
            ytDlpDiagnostics,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      text,
      source: "youtube-captions-server",
      videoId,
      langCode: selectedTrack?.languageCode || null,
      debug: {
        videoId,
        captionTracksCount: captionTracks.length,
        tracks: trackSummary,
        selectedTrack: {
          languageCode: selectedTrack?.languageCode || null,
          kind: selectedTrack?.kind || null,
        },
        parseSource,
        parseDiagnostics,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Failed to load YouTube captions.",
        debug: {
          note: "Unexpected route exception",
        },
      },
      { status: 500 }
    );
  }
}
