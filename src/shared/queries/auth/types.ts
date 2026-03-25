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
  nationalId?: string;
  passportNumber?: string;
  university: string;
  faculty: string;
  department: string;
  graduationYear: number;
  gpa: number;
  linkedin?: string;
  cv?: string;
}

export interface BusinessRepSignupCredentials {
  englishName: string;
  arabicName: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: "Male" | "Female";
  nationalId?: string;
  passportNumber?: string;
  linkedin?: string;
  role?: string;
  companyId?: string;
  newCompany?: {
    companyName: string;
    businessType: string;
    description: string;
    website: string;
    emailDomain: string;
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
  nationalId?: string;
  passportNumber?: string;
  linkedin?: string;
  universityName: string;
  facultyName: string;
  department: string;
  proofFile: File;
}

export interface ForgotPasswordCredentials {
  email: string;
}
