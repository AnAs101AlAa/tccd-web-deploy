import type { AnyUser } from "@/shared/types";

export const mockUser: AnyUser = {
  id: "1",
  englishFullName: "Ahmed Fathy",
  arabicFullName: "أحمد فتحي",
  phoneNumber: "+201234567890",
  email: "ahmed.fathy@example.com",
  gender: "Male",
  role: "Student",
  status: "Approved",
  createdAt: "2024-01-01",
  updatedAt: "2024-10-22",
  isDeleted: false,
  gpa: 3.7,
  graduationYear: 2025,
  department: "Computer Engineering",
  faculty: "Engineering",
  university: "Cairo University",
  cv: undefined,
  linkedin: undefined,
  gitHub: undefined,
};
