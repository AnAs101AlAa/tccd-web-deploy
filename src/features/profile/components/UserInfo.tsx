import React from "react";
import type { AnyUser } from "@/shared/types";

interface UserInfoProps {
  user: AnyUser;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const getDisplayName = () => {
    if ("englishFullName" in user) {
      return user.englishFullName;
    }
    if ("companyName" in user) {
      return user.companyName;
    }
    return "Unknown User";
  };

  const getUsername = () => {
    if ("englishFullName" in user) {
      return `@${user.englishFullName.toLowerCase().replace(/\s+/g, "")}`;
    }
    if ("companyName" in user) {
      return `@${user.companyName.toLowerCase().replace(/\s+/g, "")}`;
    }
    return "@unknown";
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold text-gray-900">{getDisplayName()}</h1>
      <span className="text-sm text-gray-500">{getUsername()}</span>
    </div>
  );
};

export default UserInfo;
