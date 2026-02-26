import React from "react";
import type { AnyUser, CompanyUser } from "@/shared/types";

interface UserInfoProps {
  user: AnyUser | CompanyUser;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const normalUser = user as AnyUser; // Type assertion for easier access to common fields
  const companyUser = user as CompanyUser; // Type assertion for company-specific fields

  const getDisplayName = () => {
    if ("englishFullName" in normalUser) {
      return normalUser.englishFullName;
    }
    if ("companyName" in companyUser) {
      return companyUser.companyName;
    }
    return "Unknown User";
  };

  const getUsername = () => {
    if ("englishFullName" in normalUser) {
      return `@${normalUser.englishFullName.toLowerCase().replace(/\s+/g, "")}`;
    }
    if ("companyName" in companyUser) {
      return `@${companyUser.companyName.toLowerCase().replace(/\s+/g, "")}`;
    }
    return "@unknown";
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold text-contrast">{getDisplayName()}</h1>
      <span className="text-sm text-label">{getUsername()}</span>
    </div>
  );
};

export default UserInfo;
