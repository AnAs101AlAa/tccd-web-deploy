import React from "react";
import { useParams } from "react-router-dom";
import { ProfileContainer } from "../components";
import WithNavbar from "@/shared/components/hoc/WithNavbar";
import type { AnyUser } from "@/shared/types";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // TODO: Fetch user data based on id from API using the id parameter
  console.log("Profile id:", id);

  // TODO: Check if this is the current user's profile
  const isOwnProfile = true; // Hardcoded for now - should check against logged-in user

  // For now, using mock data
  const mockUser: AnyUser = {
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
    gpa: "3.7",
    graduationYear: "2025",
    department: "Computer Engineering",
    faculty: "Engineering",
    university: "Cairo University",
    profilePicture: "https://avatars.githubusercontent.com/u/583231?v=40",
    cv: undefined,
    linkedin: undefined,
    gitHub: undefined,
    experience: undefined,
  };

  return (
    <WithNavbar>
      <div className="min-h-screen bg-background-contrast -mb-5 md:mb-0">
        <ProfileContainer user={mockUser} isOwnProfile={isOwnProfile} />
      </div>
    </WithNavbar>
  );
};

export default ProfilePage;
