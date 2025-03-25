// School type for the Redux store and application
export interface School {
    id: string;
    name: string;
    contactPerson: string;
    adminEmail: string;
    terms: number;
    academicYear: string;
  }
  
  // Type for the school form values (includes password field)
  export type SchoolFormValues = Omit<School, 'id'> & {
    adminPassword: string;
  };
  
  // Type for term options (if you need to extend later)
  export type TermOption = 2 | 3;
  
  // If you need more detailed term configuration
  export interface Term {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    schoolId?: string;
  }
  
  // Type for school state in Redux
  export interface SchoolState {
    schools: School[];
  }