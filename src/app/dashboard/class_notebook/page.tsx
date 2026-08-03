"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { extractSubjectIdFromPath } from "@/lib/subjectRouting";
import {
  createNotebookPage,
  fetchNotebook,
  fetchNotebookClass,
  saveNotebookPage,
  deleteNotebookPage,
  uploadNotebookImage,
  reorderNotebookPages,
} from "@/services/classNotebookApi";
import NotebookPageCanvas from "@/components/notebook/NotebookPageCanvas";
import type { NotebookAnnotation, NotebookBackground, NotebookPage } from "@/lib/classNotebook";

const teacherRoles = new Set(["TEACHER", "HOD", "SCHOOL_ADMIN", "ADMIN"]);

export default function ClassNotebookPage() {
  const pathname = usePathname();
  const params = useSearchParams();
  const { activeSubjectId, activeSubject } = useSubjectContext();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const subjectId = Number(extractSubjectIdFromPath(pathname) || params.get("subject_id") || activeSubjectId || 0);
  const subjectClassId = Number(params.get("subjectClassId") || 0);
  const classId = Number(params.get("classId") || 0);
  const role = String(currentUser?.role || "").toUpperCase();
  const isTeacher = teacherRoles.has(role);
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState<{ id: string; name: string; pageCount: number }[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [pages, setPages] = useState<NotebookPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<"saved" | "saving" | "failed">("saved");
  const [error, setError] = useState("");
  const [background, setBackground] = useState<NotebookBackground>({});
  const [annotations, setAnnotations] = useState<NotebookAnnotation[]>([]);
  const [teacherAnnotations, setTeacherAnnotations] = useState<NotebookAnnotation[]>([]);
  const [pageTitle, setPageTitle] = useState("");
  const [pageDirty, setPageDirty] = useState(false);

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === selectedPageId) || pages[0] || null,
    [pages, selectedPageId]
  );
  const notebookStudentId = isTeacher ? selectedStudentId : String((currentUser as any)?.student || (currentUser as any)?.student_id || "");

  const loadNotebook = async (studentId?: string) => {
    setLoading(true);
    setError("");
    try {
      if (isTeacher && !studentId) {
        const result = await fetchNotebookClass({ subjectId, subjectClassId, classId });
        setClassName(result.className);
        setStudents(result.students);
        if (result.students[0]) setSelectedStudentId(result.students[0].id);
      } else {
        const result = await fetchNotebook({ subjectId, subjectClassId, classId, studentId });
        setClassName(result.className);
        setPages(result.pages);
        setSelectedPageId(result.pages[0]?.id ?? null);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load notebook.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!subjectId || (isTeacher && (!subjectClassId || !classId))) return;
    void loadNotebook(isTeacher ? undefined : notebookStudentId);
    // The selected student is intentionally loaded by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId, subjectClassId, classId, isTeacher, notebookStudentId]);

  useEffect(() => {
    if (!isTeacher || !selectedStudentId || !subjectId || !subjectClassId || !classId) return;
    void loadNotebook(selectedStudentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudentId]);

  useEffect(() => {
    if (!selectedPage) return;
    setBackground(selectedPage.background || {});
    setAnnotations(selectedPage.studentAnnotations || []);
    setTeacherAnnotations(selectedPage.teacherAnnotations || []);
    setPageTitle(selectedPage.title || "");
    setPageDirty(false);
  }, [selectedPage]);

  const save = async (
    nextAnnotations: NotebookAnnotation[],
    nextTeacher = teacherAnnotations,
    nextBackground = background,
    nextTitle = pageTitle
  ) => {
    if (!selectedPage) return;
    setSaving("saving");
    try {
      await saveNotebookPage({
        pageId: selectedPage.id,
        studentAnnotations: nextAnnotations,
        teacherAnnotations: isTeacher ? nextTeacher : undefined,
        background: isTeacher ? nextBackground : undefined,
        title: nextTitle,
      });
      setSaving("saved");
    } catch (saveError) {
      setSaving("failed");
      setError(saveError instanceof Error ? saveError.message : "Notebook save failed.");
    }
  };

  useEffect(() => {
    if (!selectedPage || loading || !pageDirty) return;
    const timer = window.setTimeout(() => {
      void save(annotations, teacherAnnotations, background, pageTitle);
      setPageDirty(false);
    }, 700);
    return () => window.clearTimeout(timer);
    // Autosave is intentionally keyed to the editable page state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotations, teacherAnnotations, background, pageTitle, pageDirty, selectedPage]);

  const addPage = async (allStudents = false) => {
    try {
      await createNotebookPage({ subjectId, subjectClassId, classId, studentId: selectedStudentId, allStudents, title: "New page", background: {} });
      if (isTeacher && allStudents) {
        await loadNotebook(selectedStudentId);
      } else {
        await loadNotebook(notebookStudentId);
      }
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to add page.");
    }
  };

  const handleImage = async (file: File) => {
    try {
      const uploaded = await uploadNotebookImage(file);
      const next = { ...background, imageUrl: uploaded.url, imageName: uploaded.name, imageMime: uploaded.mime };
      setBackground(next);
      setPageDirty(true);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    }
  };

  const movePage = async (direction: -1 | 1) => {
    if (!selectedPage || pages.length < 2) return;
    const index = pages.findIndex((page) => page.id === selectedPage.id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= pages.length) return;
    const next = [...pages];
    [next[index], next[target]] = [next[target], next[index]];
    setPages(next.map((page, pageIndex) => ({ ...page, pageIndex })));
    try {
      await reorderNotebookPages(selectedPage.notebookId, next.map((page) => page.id));
    } catch (reorderError) {
      setError(reorderError instanceof Error ? reorderError.message : "Unable to reorder pages.");
      await loadNotebook(notebookStudentId);
    }
  };

  if (!subjectId || (isTeacher && (!subjectClassId || !classId))) {
    return <div className="p-6 text-sm text-amber-800">Open Class Notebook from a subject class so its class context is available.</div>;
  }

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      <h1 className="mb-6 text-center text-5xl font-black tracking-tight text-slate-900">{className || activeSubject?.name || "Class"} Notebook</h1>
      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>}
      {loading ? <div className="py-16 text-center text-slate-500">Loading notebook…</div> : (
        <div className="grid gap-5 lg:grid-cols-[250px_1fr]">
          {isTeacher && (
            <aside className="rounded-xl border bg-white p-3 shadow-sm">
              <div className="mb-2 text-sm font-semibold text-slate-600">Students</div>
              <div className="space-y-1">
                {students.map((student) => (
                  <button key={student.id} type="button" onClick={() => setSelectedStudentId(student.id)} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${selectedStudentId === student.id ? "bg-emerald-100 text-emerald-800" : "hover:bg-slate-100"}`}>
                    <div className="font-medium">{student.name}</div><div className="text-xs text-slate-500">{student.pageCount} pages</div>
                  </button>
                ))}
              </div>
            </aside>
          )}
          <section className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => void addPage(false)} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Add page</button>
              {isTeacher && <button type="button" onClick={() => void addPage(true)} className="rounded-lg border border-emerald-600 px-3 py-2 text-sm font-semibold text-emerald-700">Add to whole class</button>}
              {isTeacher && selectedPage && <label className="rounded-lg border px-3 py-2 text-sm">Worksheet image <input type="file" accept="image/png,image/jpeg,image/webp" className="ml-2 max-w-[180px] text-xs" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleImage(file); }} /></label>}
              <span className={`ml-auto text-xs ${saving === "failed" ? "text-red-600" : saving === "saving" ? "text-amber-600" : "text-emerald-700"}`}>{saving === "saving" ? "Saving…" : saving === "failed" ? "Save failed" : "Saved"}</span>
            </div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {selectedPage && isTeacher ? <input value={pageTitle} onChange={(event) => { setPageTitle(event.target.value); setPageDirty(true); }} className="rounded-lg border px-3 py-1.5 text-sm font-semibold" placeholder="Page title" /> : null}
              {selectedPage ? <span className="text-sm text-slate-500">Page {selectedPage.pageIndex + 1} of {pages.length}</span> : null}
              <button type="button" disabled={!selectedPage || pages.findIndex((page) => page.id === selectedPage.id) <= 0} onClick={() => { const index = pages.findIndex((page) => page.id === selectedPage?.id); if (index > 0) setSelectedPageId(pages[index - 1].id); }} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40">Previous</button>
              <button type="button" disabled={!selectedPage || pages.findIndex((page) => page.id === selectedPage.id) >= pages.length - 1} onClick={() => { const index = pages.findIndex((page) => page.id === selectedPage?.id); if (index >= 0 && index < pages.length - 1) setSelectedPageId(pages[index + 1].id); }} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40">Next</button>
              {pages.map((page) => <button key={page.id} type="button" onClick={() => setSelectedPageId(page.id)} className={`rounded-lg border px-3 py-1.5 text-sm ${selectedPage?.id === page.id ? "border-emerald-500 bg-emerald-50" : "bg-white"}`}>{page.title || `Page ${page.pageIndex + 1}`}</button>)}
              {selectedPage && <button type="button" onClick={() => void movePage(-1)} className="rounded-lg border px-3 py-1.5 text-sm">↑</button>}
              {selectedPage && <button type="button" onClick={() => void movePage(1)} className="rounded-lg border px-3 py-1.5 text-sm">↓</button>}
              {selectedPage && isTeacher && <button type="button" onClick={async () => { await deleteNotebookPage(selectedPage.id); await loadNotebook(notebookStudentId); }} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600">Delete page</button>}
            </div>
            {selectedPage && isTeacher ? <textarea value={background.text || ""} onChange={(event) => { setBackground({ ...background, text: event.target.value }); setPageDirty(true); }} placeholder="Optional worksheet text/content" className="mb-3 min-h-16 w-full rounded-lg border p-2 text-sm" /> : null}
            {selectedPage ? <NotebookPageCanvas background={background} annotations={isTeacher ? teacherAnnotations : annotations} displayAnnotations={isTeacher ? [...annotations, ...teacherAnnotations] : annotations} readOnly={false} onChange={(next) => { if (isTeacher) setTeacherAnnotations(next); else setAnnotations(next); setPageDirty(true); }} /> : <div className="rounded-xl border bg-white p-8 text-center text-slate-500">No pages yet. Add a page to begin.</div>}
          </section>
        </div>
      )}
    </main>
  );
}
