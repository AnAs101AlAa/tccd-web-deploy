export interface LoginCredentials {
  email: string;
  password: string;
}

export interface StudentSignupCredentials {
  email: string;
  password: string;
  englishName: string;
  arabicName: string;
  gender: "Male" | "Female";
  phoneNumber: string;
}

export interface BusinessRepSignupCredentials {
  englishName: string;
  arabicName: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: "Male" | "Female";
  role?: string;
  companyId?: string;
  newCompany?: {
    companyName: string;
    businessType: string;
    description: string;
    website: string;
    brief: string;
  };
  position: string;
  proofFile: File;
}

export interface FacultySignupCredentials {
  englishName: string;
  arabicName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  gender: "Male" | "Female";
  universityName: string;
  facultyName: string;
  department: string;
  proofFile: File;
}

export interface ForgotPasswordCredentials {
  email: string;
}
