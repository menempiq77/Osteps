export const NOTEBOOK_PAGE_WIDTH = 794;
export const NOTEBOOK_PAGE_HEIGHT = 1123;

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
};

export type NotebookPage = {
  id: number;
  notebookId: number;
  pageIndex: number;
  title: string;
  heading: string | null;
  background: NotebookBackground;
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
