import type { IconType } from "react-icons";
import { HiOutlineUser } from "react-icons/hi2";
import { BiMessageSquareDetail } from "react-icons/bi";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdDashboard, MdPostAdd } from "react-icons/md";
import type { AnyUser } from "@/shared/types/users";
import { isAdmin, isVolunteer } from "@/shared/types/users";

export interface ProfileMenuItem {
  icon: IconType;
  title: string;
  description: string;
  iconColor: string;
  height?: string;
  action?: string; // For navigation or actions like 'logout'
}

export const getProfileMenuItems = (
  user: AnyUser | null
): ProfileMenuItem[] => {
  if (!user) return [];
  const menuItems: ProfileMenuItem[] = [];
  menuItems.push({
    icon: HiOutlineUser,
    title: "Profile",
    description: "View and edit your profile",
    iconColor: "var(--color-contrast)",
    height: "72px",
    action: "/profile",
  });

  if (isAdmin(user) || (isVolunteer(user) && user.position !== "Member")) {
    menuItems.push({
      icon: MdDashboard,
      title: "Admin Dashboard",
      description: "Manage system settings",
      iconColor: "var(--color-contrast)",
      height: "72px",
      action: "/admin",
    });
  }

  if (isVolunteer(user) || isAdmin(user)) {
    menuItems.push({
      icon: MdPostAdd,
      title: "Manage Posts",
      description: "Create and edit posts",
      iconColor: "var(--color-contrast)",
      height: "72px",
      action: "/manage-posts",
    });
  }

  menuItems.push({
    icon: BiMessageSquareDetail,
    title: "Help & Support",
    description: "Get assistance and answers",
    iconColor: "var(--color-contrast)",
    height: "72px",
    action: "/support",
  });

  menuItems.push({
    icon: RiLogoutBoxLine,
    title: "Logout",
    description: "Sign out of your account",
    iconColor: "var(--color-error)",
    height: "72px",
    action: "logout",
  });

  return menuItems;
};

// Deprecated: Use getProfileMenuItems() instead
// Kept for backward compatibility, but will be removed
export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [];
