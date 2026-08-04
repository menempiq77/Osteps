"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Select, Dropdown, Modal } from "antd";
import type { MenuProps } from "antd";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { ChevronLeft, ChevronRight, MoreVertical, Plus } from "lucide-react";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { extractSubjectIdFromPath } from "@/lib/subjectRouting";
import {
  createNotebookPage,
  fetchNotebook,
  fetchNotebookClass,
  saveNotebookPage,
  deleteNotebookPage,
  duplicateNotebookPage,
  reorderNotebookPages,
  uploadNotebookImage,
} from "@/services/classNotebookApi";
import NotebookPageCanvas from "@/components/notebook/NotebookPageCanvas";
import NotebookPageThumbnail from "@/components/notebook/NotebookPageThumbnail";
import NotebookMaterialModal from "@/components/notebook/NotebookMaterialModal";
import type { NotebookAnnotation, NotebookBackground, NotebookPage, NotebookStudent } from "@/lib/classNotebook";

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
  const [students, setStudents] = useState<NotebookStudent[]>([]);
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
  const [renamingPageId, setRenamingPageId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const backgroundInputRef = useRef<HTMLInputElement | null>(null);
  const workspaceRef = useRef<HTMLElement | null>(null);
  const loadedPageIdRef = useRef<number | null>(null);
  const autosaveTimerRef = useRef<number | null>(null);
  const loadGenerationRef = useRef(0);
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
    loadGenerationRef.current += 1;
    if (autosaveTimerRef.current !== null) {
      window.clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
    setPageDirty(false);
    setWorksheetOpen(false);
    setRenamingPageId(null);
    setLoading(true);
    setError("");
    try {
      if (isTeacher && !studentId) {
        const result = await fetchNotebookClass({ subjectId, subjectClassId, classId });
        setClassName(result.className);
        loadedPageIdRef.current = null;
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
    targetPageId: number,
    nextAnnotations: NotebookAnnotation[],
    nextTeacher = teacherAnnotations,
    nextBackground = background,
    nextTitle = pageTitle,
    nextHeading = heading
  ) => {
    if (!targetPageId) return;
    setSaving("saving");
    try {
      await saveNotebookPage({
        pageId: targetPageId,
        studentAnnotations: nextAnnotations,
        teacherAnnotations: isTeacher ? nextTeacher : undefined,
        background: isTeacher ? nextBackground : undefined,
        title: nextTitle,
        heading: nextHeading,
      });
      setPages((current) =>
        current.map((page) =>
          page.id === targetPageId
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
    const generation = loadGenerationRef.current;
    const timer = window.setTimeout(() => {
      autosaveTimerRef.current = null;
      if (generation !== loadGenerationRef.current) return;
      void save(selectedPage.id, annotations, teacherAnnotations, background, pageTitle, heading);
      setPageDirty(false);
    }, 700);
    autosaveTimerRef.current = timer;
    return () => {
      window.clearTimeout(timer);
      if (autosaveTimerRef.current === timer) autosaveTimerRef.current = null;
    };
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

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index) return;
    const next = [...pages];
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    const ordered = next.map((page, pageIndex) => ({ ...page, pageIndex }));
    setPages(ordered);
    try {
      await reorderNotebookPages(selectedPage?.notebookId || 0, ordered.map((page) => page.id));
    } catch (reorderError) {
      setError(reorderError instanceof Error ? reorderError.message : "Unable to reorder pages.");
      await loadNotebook(notebookStudentId);
    }
  };

  const beginRename = (page: NotebookPage) => {
    setSelectedPageId(page.id);
    setRenamingPageId(page.id);
    setRenameValue(page.title || "");
  };

  const commitRename = () => {
    if (!renamingPageId) return;
    const page = pages.find((candidate) => candidate.id === renamingPageId);
    if (!page) {
      setRenamingPageId(null);
      return;
    }
    const nextTitle = renameValue.slice(0, 255);
    setRenamingPageId(null);
    setPageTitle(nextTitle);
    setPages((current) => current.map((candidate) => candidate.id === page.id ? { ...candidate, title: nextTitle } : candidate));
    if (selectedPage?.id === page.id) setPageDirty(true);
    void save(
      page.id,
      selectedPage?.id === page.id ? annotations : page.studentAnnotations,
      selectedPage?.id === page.id ? teacherAnnotations : page.teacherAnnotations,
      selectedPage?.id === page.id ? background : page.background,
      nextTitle,
      selectedPage?.id === page.id ? heading : page.heading
    );
  };

  const duplicatePage = async (page: NotebookPage) => {
    try {
      await duplicateNotebookPage(page.id);
      await loadNotebook(notebookStudentId);
    } catch (duplicateError) {
      setError(duplicateError instanceof Error ? duplicateError.message : "Unable to duplicate page.");
    }
  };

  const deletePage = async (page: NotebookPage) => {
    try {
      await deleteNotebookPage(page.id);
      await loadNotebook(notebookStudentId);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete page.");
    }
  };

  const pageMenu = (page: NotebookPage): MenuProps["items"] => [
    { key: "rename", label: "Rename", onClick: () => beginRename(page) },
    ...(isTeacher ? [{ key: "duplicate", label: "Duplicate page", onClick: () => void duplicatePage(page) }] : []),
    ...(isTeacher ? [{ key: "worksheet", label: "Edit worksheet text", onClick: () => { setSelectedPageId(page.id); setWorksheetOpen(true); } }] : []),
    ...(isTeacher ? [{ key: "background", label: "Set page background image", onClick: () => { setSelectedPageId(page.id); backgroundInputRef.current?.click(); } }] : []),
    ...(isTeacher ? [{ type: "divider" as const }] : []),
    ...(isTeacher ? [{ key: "delete", label: "Delete", danger: true, onClick: () => void deletePage(page) }] : []),
  ];

  if (!subjectId || (isTeacher && (!subjectClassId || !classId))) {
    return <div className="p-6 text-sm text-amber-800">Open Class Notebook from a subject class so its class context is available.</div>;
  }

  return (
    <>
      <input
        ref={backgroundInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file || !isTeacher) return;
          try {
            const uploaded = await uploadNotebookImage(file);
            setBackground((current) => ({
              ...current,
              imageUrl: uploaded.url,
              imageName: file.name,
              imageMime: file.type,
            }));
            setPageDirty(true);
          } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : "Unable to upload the page background.");
          }
        }}
      />
      <main ref={workspaceRef} className="flex min-h-[360px] w-full flex-col bg-slate-100" style={workspaceHeight ? { height: workspaceHeight } : undefined}>
      <h1 className="shrink-0 px-4 py-1.5 text-center text-2xl font-black tracking-tight text-slate-900 md:text-3xl">{className || activeSubject?.name || "Class"} Notebook</h1>
      {error && <div className="mx-4 mb-3 shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>}
      {loading ? <div className="flex min-h-0 flex-1 items-center justify-center text-slate-500">Loading notebook…</div> : (
        <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4">
          <div className="flex min-h-10 shrink-0 items-center gap-3 rounded-xl border bg-white px-3 py-2 shadow-sm">
            {isTeacher ? (
              <>
                <Select
                  showSearch
                  value={selectedStudentId || undefined}
                  onChange={setSelectedStudentId}
                  optionFilterProp="label"
                  placeholder="Select a student"
                  className="w-[300px] max-w-full flex-none"
                  options={students.map((student) => ({ value: student.id, label: `${student.name} — ${student.pageCount} pages` }))}
                />
                <button type="button" onClick={() => setMaterialModalOpen(true)} className="shrink-0 rounded-lg border border-emerald-600 px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
                  Add material
                </button>
              </>
            ) : <span className="text-sm font-medium text-slate-600">My notebook</span>}
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${saving === "failed" ? "bg-red-100 text-red-700" : saving === "saving" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
              {saving === "saving" ? "Saving…" : saving === "failed" ? "Save failed" : "Saved"}
            </span>
          </div>
          <section className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="mb-2 flex shrink-0 items-center justify-end gap-1">
              {selectedPage ? <span className="mr-1 text-xs text-slate-500">Page {selectedPage.pageIndex + 1} of {pages.length}</span> : null}
              <button type="button" aria-label="Previous page" disabled={!selectedPage || pages.findIndex((page) => page.id === selectedPage.id) <= 0} onClick={() => { const index = pages.findIndex((page) => page.id === selectedPage?.id); if (index > 0) setSelectedPageId(pages[index - 1].id); }} className="rounded border bg-white p-1 text-slate-600 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
              <button type="button" aria-label="Next page" disabled={!selectedPage || pages.findIndex((page) => page.id === selectedPage.id) >= pages.length - 1} onClick={() => { const index = pages.findIndex((page) => page.id === selectedPage?.id); if (index >= 0 && index < pages.length - 1) setSelectedPageId(pages[index + 1].id); }} className="rounded border bg-white p-1 text-slate-600 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
            </div>
            <div className="flex min-h-0 flex-1 gap-3">
              <div className={`flex min-h-0 shrink-0 flex-col ${tocOpen ? "w-36" : "w-9"}`}>
                <button type="button" onClick={() => setTocOpen((open) => !open)} className="mb-2 rounded-lg border bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  {tocOpen ? "Hide pages" : "Pages"}
                </button>
                {tocOpen ? (
                  <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    {isTeacher ? (
                      <Dropdown
                        menu={{ items: [
                          { key: "new", label: "New page", onClick: () => void addPage(false) },
                          { key: "class", label: "New page for whole class", onClick: () => void addPage(true) },
                        ] }}
                        trigger={["click"]}
                      >
                        <button type="button" className="mb-2 flex w-full items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 py-1.5 text-xs font-semibold text-white"><Plus className="h-3.5 w-3.5" /> Add page</button>
                      </Dropdown>
                    ) : (
                      <button type="button" onClick={() => void addPage(false)} className="mb-2 flex w-full items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 py-1.5 text-xs font-semibold text-white"><Plus className="h-3.5 w-3.5" /> Add page</button>
                    )}
                    <DragDropContext onDragEnd={(result) => void handleDragEnd(result)}>
                      <Droppable droppableId="notebook-pages">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                            {pages.map((page, index) => {
                              const live = selectedPage?.id === page.id;
                              return (
                                <Draggable key={page.id} draggableId={String(page.id)} index={index}>
                                  {(dragProvided) => (
                                    <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} className="relative">
                                      <NotebookPageThumbnail
                                        page={page}
                                        active={live}
                                        studentAnnotations={live ? annotations : undefined}
                                        teacherAnnotations={live ? teacherAnnotations : undefined}
                                        title={live ? pageTitle : undefined}
                                        heading={live ? heading : undefined}
                                        material={live ? selectedPage?.material : page.material}
                                        titleEditing={renamingPageId === page.id}
                                        onTitleChange={setRenameValue}
                                        onTitleCommit={commitRename}
                                        dragHandleProps={dragProvided.dragHandleProps}
                                        onClick={() => setSelectedPageId(page.id)}
                                      />
                                      <Dropdown menu={{ items: pageMenu(page) }} trigger={["click"]}>
                                        <button type="button" aria-label={`Page ${index + 1} menu`} onClick={(event) => event.stopPropagation()} className="absolute right-3 top-3 rounded bg-white/90 p-1 text-slate-500 shadow hover:text-slate-800"><MoreVertical className="h-4 w-4" /></button>
                                      </Dropdown>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                ) : null}
              </div>
              {selectedPage ? <NotebookPageCanvas material={selectedPage.material} heading={heading} onHeadingChange={(next) => { setHeading(next.slice(0, 255)); setPageDirty(true); }} background={background} annotations={isTeacher ? teacherAnnotations : annotations} displayAnnotations={isTeacher ? [...annotations, ...teacherAnnotations] : annotations} readOnly={false} onChange={(next) => { if (isTeacher) setTeacherAnnotations(next); else setAnnotations(next); setPageDirty(true); }} /> : <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border bg-white p-8 text-center text-slate-500">No pages yet. Add a page to begin.</div>}
            </div>
          </section>
        </div>
      )}
      <Modal
        title="Worksheet text"
        open={worksheetOpen}
        onCancel={() => setWorksheetOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <textarea
          value={background.text || ""}
          onChange={(event) => {
            setBackground({ ...background, text: event.target.value });
            setPageDirty(true);
          }}
          placeholder="Optional worksheet text/content"
          className="min-h-32 w-full rounded-lg border p-2 text-sm"
        />
      </Modal>
      <NotebookMaterialModal
        open={materialModalOpen}
        subjectId={subjectId}
        subjectClassId={subjectClassId}
        classId={classId}
        students={students}
        onClose={() => setMaterialModalOpen(false)}
        onCompleted={() => {
          setMaterialModalOpen(false);
          void loadNotebook(notebookStudentId);
        }}
      />
      </main>
    </>
  );
}
