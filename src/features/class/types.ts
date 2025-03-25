export interface Term {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  }
  
  export interface Class {
    id: string;
    name: string;
    schoolId: string;
    teacherId?: string;
    terms: Term[];
  }
  
  export interface ClassState {
    classes: Class[];
  }
  
  export type ClassFormValues = {
    className: string;
    gradeLevel: string;
    terms: Omit<Term, 'id'>[]; // Form doesn't submit IDs
  };