import {
  fetchAssessmentDocument,
  type AssessmentDocumentAnnotation,
  type PenAnnotation,
  type TextAnnotation,
} from "@/services/documentAssessmentApi";

type PageInfo = {
  pageNumber: number;
  width: number;
  height: number;
  previewUrl: string;
};

const renderPageImage = (url: string, width: number, height: number): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load page image"));
    img.src = url;
  });

const drawPenAnnotation = (ctx: CanvasRenderingContext2D, ann: PenAnnotation) => {
  const points = ann.points ?? [];
  if (points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = ann.color || "#000000";
  ctx.lineWidth = ann.width || 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  ctx.restore();
};

const drawTextAnnotation = (ctx: CanvasRenderingContext2D, ann: TextAnnotation) => {
  const text = String(ann.text ?? "").trim();
  if (!text) return;
  ctx.save();
  ctx.fillStyle = ann.color || "#000000";
  const fontSize = ann.fontSize || 16;
  ctx.font = `${fontSize}px Arial, sans-serif`;
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], ann.x, ann.y + fontSize * (i + 1));
  }
  ctx.restore();
};

const drawAnnotationsOnCanvas = (
  ctx: CanvasRenderingContext2D,
  annotations: AssessmentDocumentAnnotation[],
  pageNumber: number,
) => {
  for (const ann of annotations) {
    if (ann.page !== pageNumber) continue;
    if (ann.type === "pen") drawPenAnnotation(ctx, ann);
    if (ann.type === "text") drawTextAnnotation(ctx, ann);
  }
};

export interface BulkPdfDownloadTask {
  assessmentId: string | number;
  taskId: string | number;
  studentId: string | number;
  studentName: string;
  taskName: string;
  pdfUrl: string;
}

export const downloadAnnotatedPdf = async (
  task: BulkPdfDownloadTask,
  onProgress?: (status: string) => void,
): Promise<void> => {
  const { assessmentId, taskId, studentId, studentName, taskName, pdfUrl } = task;

  onProgress?.("Loading PDF...");

  const pdfjs = await import("pdfjs-dist");
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
  }

  const proxyUrl = `/api/assessment-document/pdf?url=${encodeURIComponent(pdfUrl)}`;
  const pdfResponse = await fetch(proxyUrl);
  if (!pdfResponse.ok) throw new Error(`Failed to load PDF: ${pdfResponse.status}`);
  const pdfData = new Uint8Array(await pdfResponse.arrayBuffer());

  const pdfDoc = await pdfjs.getDocument({ data: pdfData, cMapUrl: "/cmaps/", cMapPacked: true }).promise;
  const numPages = pdfDoc.numPages;

  let annotations: AssessmentDocumentAnnotation[] = [];
  try {
    const docState = await fetchAssessmentDocument(assessmentId, taskId, studentId);
    annotations = [
      ...(docState.studentAnnotations || []),
      ...(docState.teacherAnnotations || []),
    ];
  } catch {
    // No annotations found; download plain PDF
  }

  onProgress?.("Rendering pages...");

  const pages: PageInfo[] = [];
  const canvases: HTMLCanvasElement[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");

    await page.render({ canvasContext: ctx, viewport }).promise;

    drawAnnotationsOnCanvas(ctx, annotations, i);

    pages.push({ pageNumber: i, width: viewport.width, height: viewport.height, previewUrl: "" });
    canvases.push(canvas);
  }

  onProgress?.("Creating PDF...");

  const { jsPDF } = await import("jspdf");
  let pdf: InstanceType<typeof jsPDF> | null = null;

  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i];
    const pageInfo = pages[i];
    const orientation = pageInfo.width >= pageInfo.height ? "landscape" : "portrait";
    if (!pdf) {
      pdf = new jsPDF({ orientation, unit: "pt", format: [pageInfo.width, pageInfo.height] });
    } else {
      pdf.addPage([pageInfo.width, pageInfo.height], orientation);
    }
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pageInfo.width, pageInfo.height);
  }

  const sanitize = (s: string) =>
    s.replace(/[^\w\s\-.()]/g, "").replace(/\s+/g, " ").trim().slice(0, 80) || "document";

  const fileName = `${sanitize(studentName)} - ${sanitize(taskName)}.pdf`;
  pdf?.save(fileName);
};

export const downloadFileAsBlob = async (url: string, fileName: string): Promise<void> => {
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
};
