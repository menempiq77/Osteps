export const NOTEBOOK_PAGE_WIDTH = 794;
export const NOTEBOOK_PAGE_HEIGHT = 1123;
export const NOTEBOOK_DOCX_FLOW = {
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 16,
  lineHeight: 1.35,
  padding: 24,
  columnWidth: NOTEBOOK_PAGE_WIDTH,
  columnGap: 0,
  columnFill: "auto" as const,
} as const;

export type NotebookPoint = { x: number; y: number };

export type NotebookPenAnnotation = {
  id: string;
  type: "pen";
  tool: "pen" | "highlighter";
  color: string;
  width: number;
  points: NotebookPoint[];
};

export type NotebookTextAnnotation = {
  id: string;
  type: "text";
  x: number;
  y: number;
  width: number;
  text: string;
  color: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  underline: boolean;
  textAlign: "left" | "center" | "right";
};

export type NotebookImageAnnotation = {
  id: string;
  type: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  url: string;
  name?: string;
};

export type NotebookAnnotation =
  | NotebookPenAnnotation
  | NotebookTextAnnotation
  | NotebookImageAnnotation;

export type NotebookBackground = {
  imageUrl?: string;
  imageName?: string;
  imageMime?: string;
  imageWidth?: number;
  imageHeight?: number;
  text?: string;
  materialId?: number;
  materialPage?: number;
};

export type NotebookMaterialKind = "docx" | "pdf" | "image";

export type NotebookMaterialPage = {
  html?: string;
  imageUrl?: string;
  width?: number;
  height?: number;
};

export type NotebookMaterial = {
  id: number;
  schoolId: number;
  subjectId: number;
  name: string;
  kind: NotebookMaterialKind;
  pages: NotebookMaterialPage[];
  pageCount: number;
  createdBy: number;
  createdAt?: string;
};

export type NotebookPage = {
  id: number;
  notebookId: number;
  pageIndex: number;
  title: string;
  heading: string | null;
  background: NotebookBackground;
  material?: NotebookMaterial | null;
  studentAnnotations: NotebookAnnotation[];
  teacherAnnotations: NotebookAnnotation[];
  createdAt?: string;
  updatedAt?: string;
};

export type NotebookStudent = {
  id: string;
  name: string;
  email?: string;
  notebookId: number;
  pageCount: number;
};

export type NotebookClassResponse = {
  subjectId: number;
  subjectClassId: number;
  classId: number;
  className: string;
  students: NotebookStudent[];
};

export type NotebookPageResponse = {
  notebook: {
    id: number;
    studentId: number;
    subjectId: number;
    subjectClassId: number;
    classId: number;
  };
  className: string;
  pages: NotebookPage[];
};
