"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import NotebookPageThumbnail from "@/components/notebook/NotebookPageThumbnail";
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
  const [heading, setHeading] = useState<string | null>(null);
  const [pageDirty, setPageDirty] = useState(false);
  const [worksheetOpen, setWorksheetOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(!isTeacher);
  const workspaceRef = useRef<HTMLElement | null>(null);
  const loadedPageIdRef = useRef<number | null>(null);
  const [workspaceHeight, setWorkspaceHeight] = useState<number | null>(null);

  useEffect(() => {
    const measureWorkspace = () => {
      const workspace = workspaceRef.current;
      if (!workspace) return;
      setWorkspaceHeight(Math.max(360, window.innerHeight - workspace.getBoundingClientRect().top));
    };
    measureWorkspace();
    window.addEventListener("resize", measureWorkspace);
    return () => window.removeEventListener("resize", measureWorkspace);
  }, []);

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === selectedPageId) || pages[0] || null,
    [pages, selectedPageId]
  );
  const studentValue = (currentUser as any)?.student;
  const notebookStudentId = isTeacher
    ? selectedStudentId
    : String(
        (typeof studentValue === "object" ? studentValue?.id : studentValue) ||
          (currentUser as any)?.student_id ||
          ""
      );

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
        loadedPageIdRef.current = null;
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
    if (loadedPageIdRef.current === selectedPage.id) return;
    loadedPageIdRef.current = selectedPage.id;
    setBackground(selectedPage.background || {});
    setAnnotations(selectedPage.studentAnnotations || []);
    setTeacherAnnotations(selectedPage.teacherAnnotations || []);
    setPageTitle(selectedPage.title || "");
    setHeading(selectedPage.heading ?? null);
    setPageDirty(false);
  }, [selectedPage]);

  const save = async (
    nextAnnotations: NotebookAnnotation[],
    nextTeacher = teacherAnnotations,
    nextBackground = background,
    nextTitle = pageTitle,
    nextHeading = heading
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
        heading: nextHeading,
      });
      setPages((current) =>
        current.map((page) =>
          page.id === selectedPage.id
            ? {
                ...page,
                title: nextTitle,
                heading: nextHeading,
                background: nextBackground,
                studentAnnotations: nextAnnotations,
                teacherAnnotations: nextTeacher,
              }
            : page
        )
      );
      setSaving("saved");
    } catch (saveError) {
      setSaving("failed");
      setError(saveError instanceof Error ? saveError.message : "Notebook save failed.");
    }
  };

  useEffect(() => {
    if (!selectedPage || loading || !pageDirty) return;
    const timer = window.setTimeout(() => {
      void save(annotations, teacherAnnotations, background, pageTitle, heading);
      setPageDirty(false);
    }, 700);
    return () => window.clearTimeout(timer);
    // Autosave is intentionally keyed to the editable page state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotations, teacherAnnotations, background, pageTitle, heading, pageDirty, selectedPage]);

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
    <main ref={workspaceRef} className="flex min-h-[360px] w-full flex-col bg-slate-100" style={workspaceHeight ? { height: workspaceHeight } : undefined}>
      <h1 className="shrink-0 px-4 py-1.5 text-center text-2xl font-black tracking-tight text-slate-900 md:text-3xl">{className || activeSubject?.name || "Class"} Notebook</h1>
      {error && <div className="mx-4 mb-3 shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>}
      {loading ? <div className="flex min-h-0 flex-1 items-center justify-center text-slate-500">Loading notebook…</div> : (
        <div className={`grid min-h-0 flex-1 gap-4 px-4 pb-4 ${isTeacher ? "lg:grid-cols-[250px_minmax(0,1fr)]" : "grid-cols-1"}`}>
          {isTeacher && (
            <aside className="min-h-0 overflow-y-auto rounded-xl border bg-white p-3 shadow-sm">
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
          <section className="flex min-h-0 min-w-0 flex-col">
            <div className="mb-3 flex shrink-0 items-center gap-2 overflow-x-auto whitespace-nowrap">
              <button type="button" onClick={() => void addPage(false)} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Add page</button>
              {isTeacher && <button type="button" onClick={() => void addPage(true)} className="rounded-lg border border-emerald-600 px-3 py-2 text-sm font-semibold text-emerald-700">Add to whole class</button>}
              {isTeacher && selectedPage && <label className="rounded-lg border px-3 py-2 text-sm">Worksheet image <input type="file" accept="image/png,image/jpeg,image/webp" className="ml-2 max-w-[180px] text-xs" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleImage(file); }} /></label>}
              {selectedPage ? <input value={pageTitle} onChange={(event) => { setPageTitle(event.target.value); setPageDirty(true); }} className="rounded-lg border px-3 py-1.5 text-sm font-semibold" placeholder="Page title" aria-label="Page title" /> : null}
              {selectedPage ? <span className="text-sm text-slate-500">Page {selectedPage.pageIndex + 1} of {pages.length}</span> : null}
              <button type="button" disabled={!selectedPage || pages.findIndex((page) => page.id === selectedPage.id) <= 0} onClick={() => { const index = pages.findIndex((page) => page.id === selectedPage?.id); if (index > 0) setSelectedPageId(pages[index - 1].id); }} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40">Previous</button>
              <button type="button" disabled={!selectedPage || pages.findIndex((page) => page.id === selectedPage.id) >= pages.length - 1} onClick={() => { const index = pages.findIndex((page) => page.id === selectedPage?.id); if (index >= 0 && index < pages.length - 1) setSelectedPageId(pages[index + 1].id); }} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40">Next</button>
              {pages.map((page) => <button key={page.id} type="button" onClick={() => setSelectedPageId(page.id)} className={`rounded-lg border px-3 py-1.5 text-sm ${selectedPage?.id === page.id ? "border-emerald-500 bg-emerald-50" : "bg-white"}`}>{page.title || `Page ${page.pageIndex + 1}`}</button>)}
              {selectedPage && <button type="button" onClick={() => void movePage(-1)} className="rounded-lg border px-3 py-1.5 text-sm">↑</button>}
              {selectedPage && <button type="button" onClick={() => void movePage(1)} className="rounded-lg border px-3 py-1.5 text-sm">↓</button>}
              {selectedPage && isTeacher && <button type="button" onClick={async () => { await deleteNotebookPage(selectedPage.id); await loadNotebook(notebookStudentId); }} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600">Delete page</button>}
              <span className={`ml-auto text-xs ${saving === "failed" ? "text-red-600" : saving === "saving" ? "text-amber-600" : "text-emerald-700"}`}>{saving === "saving" ? "Saving…" : saving === "failed" ? "Save failed" : "Saved"}</span>
            </div>
            {selectedPage && isTeacher ? <details className="mb-3 shrink-0 rounded-lg border bg-white px-3 py-2 text-sm" open={worksheetOpen} onToggle={(event) => setWorksheetOpen(event.currentTarget.open)}><summary className="cursor-pointer font-medium text-slate-600">Worksheet text</summary><textarea value={background.text || ""} onChange={(event) => { setBackground({ ...background, text: event.target.value }); setPageDirty(true); }} placeholder="Optional worksheet text/content" className="mt-2 min-h-16 w-full rounded-lg border p-2 text-sm" /></details> : null}
            <div className="flex min-h-0 flex-1 gap-3">
              <div className={`flex min-h-0 shrink-0 flex-col ${tocOpen ? "w-36" : "w-9"}`}>
                <button type="button" onClick={() => setTocOpen((open) => !open)} className="mb-2 rounded-lg border bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  {tocOpen ? "Hide pages" : "Pages"}
                </button>
                {tocOpen ? (
                  <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                    {pages.map((page) => {
                      const live = selectedPage?.id === page.id;
                      return (
                        <NotebookPageThumbnail
                          key={page.id}
                          page={page}
                          active={live}
                          studentAnnotations={live ? annotations : undefined}
                          teacherAnnotations={live ? teacherAnnotations : undefined}
                          title={live ? pageTitle : undefined}
                          onClick={() => setSelectedPageId(page.id)}
                        />
                      );
                    })}
                  </div>
                ) : null}
              </div>
              {selectedPage ? <NotebookPageCanvas heading={heading} onHeadingChange={(next) => { setHeading(next.slice(0, 255)); setPageDirty(true); }} background={background} annotations={isTeacher ? teacherAnnotations : annotations} displayAnnotations={isTeacher ? [...annotations, ...teacherAnnotations] : annotations} readOnly={false} onChange={(next) => { if (isTeacher) setTeacherAnnotations(next); else setAnnotations(next); setPageDirty(true); }} /> : <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border bg-white p-8 text-center text-slate-500">No pages yet. Add a page to begin.</div>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
