import React from "react";
import { useParams } from "react-router-dom";
import { ProfileContainer } from "../components";
import WithLayout from "@/shared/components/hoc/WithLayout";
import { useCurrentUser } from "@/shared/queries/user/userHooks";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = useCurrentUser();

  // TODO: Fetch user data based on id from API using the id parameter
  console.log("Profile id:", id);

  // TODO: Check if this is the current user's profile
  // const isOwnProfile = currentUser?.id === id;
  const isOwnProfile = true;

  if (!currentUser) {
    return (
      <WithLayout>
        <div className="min-h-screen bg-background-contrast flex items-center justify-center">
          <p className="text-contrast">Loading user data...</p>
        </div>
      </WithLayout>
    );
  }

  return (
    <WithLayout>
      <div className="min-h-screen bg-background-contrast pb-8 -mb-5">
        <ProfileContainer user={currentUser} isOwnProfile={isOwnProfile} />
      </div>
    </WithLayout>
  );
};

export default ProfilePage;
