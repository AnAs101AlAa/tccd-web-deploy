import React from "react";
import { useParams } from "react-router-dom";
import { ProfileContainer } from "../components";
import WithLayout from "@/shared/components/hoc/WithLayout";
import { mockUser } from "../mocks/mockUser";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // TODO: Fetch user data based on id from API using the id parameter
  console.log("Profile id:", id);

  // TODO: Check if this is the current user's profile
  const isOwnProfile = true; // Hardcoded for now - should check against logged-in user

  return (
    <WithLayout>
      <div className="min-h-screen bg-background-contrast -mb-5 md:mb-0">
        <ProfileContainer user={mockUser} isOwnProfile={isOwnProfile} />
      </div>
    </WithLayout>
  );
};

export default ProfilePage;
