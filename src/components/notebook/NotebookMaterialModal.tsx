"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Popconfirm, Select, Tabs, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import {
  createNotebookMaterial,
  deleteNotebookMaterial,
  listNotebookMaterials,
  shareNotebookMaterial,
  uploadNotebookImage,
} from "@/services/classNotebookApi";
import {
  NOTEBOOK_DOCX_FLOW,
  NOTEBOOK_PAGE_HEIGHT,
  NOTEBOOK_PAGE_WIDTH,
  type NotebookMaterial,
  type NotebookStudent,
} from "@/lib/classNotebook";

const MAX_BYTES = 10 * 1024 * 1024;

type Props = {
  open: boolean;
  subjectId: number;
  subjectClassId: number;
  classId: number;
  students: NotebookStudent[];
  onClose: () => void;
  onCompleted: () => void;
};

const fileKind = (file: File) => {
  const extension = file.name.toLowerCase().split(".").pop();
  if (extension === "doc") throw new Error("Legacy .doc files are not supported. Please save the file as .docx.");
  if (extension === "docx") return "docx" as const;
  if (extension === "pdf") return "pdf" as const;
  if (["png", "jpg", "jpeg", "webp"].includes(extension || "")) return "image" as const;
  throw new Error("Use a .docx, .pdf, PNG, JPG, JPEG, or WebP file.");
};

const paginateDocxHtml = (html: string) => {
  const source = document.createElement("div");
  source.innerHTML = html;
  const measure = document.createElement("div");
  measure.style.position = "fixed";
  measure.style.left = "-100000px";
  measure.style.top = "0";
  measure.style.width = `${NOTEBOOK_PAGE_WIDTH}px`;
  measure.style.height = "auto";
  measure.style.boxSizing = "border-box";
  measure.style.overflow = "visible";
  measure.style.fontFamily = NOTEBOOK_DOCX_FLOW.fontFamily;
  measure.style.fontSize = `${NOTEBOOK_DOCX_FLOW.fontSize}px`;
  measure.style.lineHeight = String(NOTEBOOK_DOCX_FLOW.lineHeight);
  measure.style.padding = `${NOTEBOOK_DOCX_FLOW.padding}px`;
  measure.style.columnWidth = `${NOTEBOOK_DOCX_FLOW.columnWidth}px`;
  measure.style.columnGap = `${NOTEBOOK_DOCX_FLOW.columnGap}px`;
  measure.style.columnFill = NOTEBOOK_DOCX_FLOW.columnFill;
  document.body.appendChild(measure);

  const pages: string[] = [];
  let pageNodes: string[] = [];
  const flush = () => {
    if (pageNodes.length) pages.push(pageNodes.join(""));
    pageNodes = [];
  };
  const fits = (nodes: string[]) => {
    measure.innerHTML = nodes.join("");
    return measure.scrollHeight <= NOTEBOOK_PAGE_HEIGHT;
  };

  Array.from(source.childNodes).forEach((node) => {
    const markup =
      node.nodeType === Node.ELEMENT_NODE
        ? (node as HTMLElement).outerHTML
        : node.textContent || "";
    if (!markup) return;
    const candidate = [...pageNodes, markup];
    if (pageNodes.length && !fits(candidate)) {
      flush();
      pageNodes = [markup];
    } else {
      pageNodes = candidate;
    }
  });
  flush();
  measure.remove();
  return pages.length ? pages : [html];
};

export default function NotebookMaterialModal({
  open,
  subjectId,
  subjectClassId,
  classId,
  students,
  onClose,
  onCompleted,
}: Props) {
  const [activeTab, setActiveTab] = useState("upload");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [targetMode, setTargetMode] = useState<"class" | "students">("class");
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [materials, setMaterials] = useState<NotebookMaterial[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [working, setWorking] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const studentOptions = useMemo(
    () => students.map((student) => ({ value: student.id, label: student.name })),
    [students]
  );

  const loadMaterials = async () => {
    setLoadingLibrary(true);
    try {
      const result = await listNotebookMaterials(subjectId);
      setMaterials(result.materials || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load the material library.");
    } finally {
      setLoadingLibrary(false);
    }
  };

  useEffect(() => {
    if (open) {
      setError("");
      setFileList([]);
      setSelectedFile(null);
      void loadMaterials();
    }
  }, [open, subjectId]);

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    setError("");
    if (file.size > MAX_BYTES) {
      setError("This file is larger than 10MB.");
      return Upload.LIST_IGNORE;
    }
    try {
      fileKind(file);
      setName(file.name.replace(/\.[^.]+$/, ""));
      setFileList([file]);
      setSelectedFile(file);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unsupported file.");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const uploadBlob = async (blob: Blob, filename: string) => {
    const file = new File([blob], filename, { type: blob.type || "image/png" });
    return uploadNotebookImage(file);
  };

  const convertDocx = async (file: File) => {
    setProgress("Converting Word document…");
    const mammoth = await import("mammoth");
    const result = await mammoth.convertToHtml(
      { arrayBuffer: await file.arrayBuffer() },
      {
        convertImage: mammoth.images.imgElement((image) =>
          image.read("base64").then(async (base64: string) => {
            const mime = image.contentType || "image/png";
            const response = await uploadBlob(
              await (await fetch(`data:${mime};base64,${base64}`)).blob(),
              `embedded-image.${mime.split("/")[1] || "png"}`
            );
            return { src: response.url };
          })
        ),
      }
    );
    const html = result.value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/\son[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "");
    const chunks = paginateDocxHtml(html);
    return {
      pages: chunks.map((html) => ({ html })),
    };
  };

  const convertPdf = async (file: File) => {
    setProgress("Rendering PDF pages…");
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages: Array<{ imageUrl: string; width: number; height: number }> = [];
    for (let index = 1; index <= pdf.numPages; index += 1) {
      setProgress(`Rendering PDF page ${index} of ${pdf.numPages}…`);
      const page = await pdf.getPage(index);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((value) => (value ? resolve(value) : reject(new Error("Could not encode PDF page."))), "image/png")
      );
      const uploaded = await uploadBlob(blob, `${file.name}-page-${index}.png`);
      pages.push({ imageUrl: uploaded.url, width: viewport.width, height: viewport.height });
    }
    return { pages };
  };

  const convertImage = async (file: File) => {
    setProgress("Uploading image…");
    const uploaded = await uploadNotebookImage(file);
    return {
      pages: [{ imageUrl: uploaded.url, width: NOTEBOOK_PAGE_WIDTH, height: NOTEBOOK_PAGE_HEIGHT }],
    };
  };

  const shareMaterial = async (materialId: number) => {
    if (targetMode === "students" && !studentIds.length) {
      throw new Error("Select at least one student.");
    }
    return shareNotebookMaterial({
      materialId,
      subjectClassId,
      classId,
      allStudents: targetMode === "class",
      studentIds: targetMode === "students" ? studentIds : undefined,
    });
  };

  const createAndShare = async () => {
    if (!selectedFile) {
      setError("Choose a file first.");
      return;
    }
    setWorking(true);
    setError("");
    try {
      const kind = fileKind(selectedFile);
      const converted =
        kind === "docx"
          ? await convertDocx(selectedFile)
          : kind === "pdf"
            ? await convertPdf(selectedFile)
            : await convertImage(selectedFile);
      setProgress("Saving material to the library…");
      const created = await createNotebookMaterial({
        subjectId,
        name: name.trim() || selectedFile.name,
        kind,
        pages: converted.pages,
      });
      setProgress("Sharing material to students…");
      const summary = await shareMaterial(Number(created.materialId));
      messageApi.success(`Added ${summary.pagesCreated} pages to ${summary.students} students.`);
      await loadMaterials();
      setFileList([]);
      setSelectedFile(null);
      setName("");
      setProgress("");
      onCompleted();
    } catch (conversionError) {
      setError(conversionError instanceof Error ? conversionError.message : "Material conversion failed.");
      setProgress("");
    } finally {
      setWorking(false);
    }
  };

  const shareExisting = async (material: NotebookMaterial) => {
    setWorking(true);
    setError("");
    try {
      const summary = await shareMaterial(material.id);
      messageApi.success(`Added ${summary.pagesCreated} pages to ${summary.students} students.`);
      onCompleted();
    } catch (shareError) {
      setError(shareError instanceof Error ? shareError.message : "Unable to share material.");
    } finally {
      setWorking(false);
    }
  };

  const removeMaterial = async (material: NotebookMaterial) => {
    setWorking(true);
    try {
      await deleteNotebookMaterial(material.id, subjectId);
      setMaterials((current) => current.filter((item) => item.id !== material.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete material.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Add material"
        open={open}
        onCancel={onClose}
        width={640}
        destroyOnHidden
        footer={null}
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Share to</span>
          <Select
            value={targetMode}
            onChange={setTargetMode}
            options={[
              { value: "class", label: "Whole class" },
              { value: "students", label: "Selected students" },
            ]}
            className="w-44"
          />
          {targetMode === "students" ? (
            <Select
              mode="multiple"
              value={studentIds}
              onChange={setStudentIds}
              options={studentOptions}
              placeholder="Select students"
              className="min-w-56 flex-1"
            />
          ) : null}
        </div>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
          {
            key: "upload",
            label: "Add material",
            children: (
              <div className="space-y-4">
                <Upload.Dragger
                  name="file"
                  multiple={false}
                  fileList={fileList}
                  beforeUpload={beforeUpload}
                  onRemove={() => {
                    setFileList([]);
                    setSelectedFile(null);
                    return true;
                  }}
                  accept=".docx,.pdf,.png,.jpg,.jpeg,.webp"
                  disabled={working}
                >
                  <p className="ant-upload-drag-icon">Drop a Word, PDF, or image file here</p>
                  <p className="ant-upload-hint">DOCX, PDF, PNG, JPG, JPEG, or WebP; maximum 10MB.</p>
                </Upload.Dragger>
                <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Material name" />
                {progress ? <div className="text-sm text-emerald-700">{progress}</div> : null}
                {error ? <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div> : null}
                <div className="flex justify-end">
                  <Button type="primary" loading={working} onClick={() => void createAndShare()}>Convert and share</Button>
                </div>
              </div>
            ),
          },
          {
            key: "library",
            label: "Library",
            children: (
              <div className="space-y-2">
                {error ? <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div> : null}
                {loadingLibrary ? <div className="py-6 text-center text-sm text-slate-500">Loading library…</div> : materials.length ? materials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium text-slate-800">{material.name}</div>
                      <div className="text-xs text-slate-500">{material.kind.toUpperCase()} · {material.pageCount} pages</div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button size="small" loading={working} onClick={() => void shareExisting(material)}>Share</Button>
                      <Popconfirm
                        title="Delete this library material?"
                        description="Pages already shared to students will be kept."
                        okText="Delete"
                        cancelText="Cancel"
                        onConfirm={() => void removeMaterial(material)}
                      >
                        <Button size="small" danger loading={working}>Delete</Button>
                      </Popconfirm>
                    </div>
                  </div>
                )) : <div className="py-6 text-center text-sm text-slate-500">No materials in this subject library yet.</div>}
              </div>
            ),
          },
        ]} />
      </Modal>
    </>
  );
}
