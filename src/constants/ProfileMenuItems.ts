import type { IconType } from "react-icons";
import { HiOutlineUser } from "react-icons/hi2";
import { BiMessageSquareDetail } from "react-icons/bi";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdDashboard, MdPostAdd } from "react-icons/md";
import { isAdmin, isVolunteer } from "@/shared/types/users";
import type { User } from "@/shared/types";

export interface ProfileMenuItem {
  icon: IconType;
  title: string;
  iconColor: string;
  action?: string; // For navigation or actions like 'logout'
}

export const getProfileMenuItems = (
  user: User | null
): ProfileMenuItem[] => {
  if (!user) return [];
  const menuItems: ProfileMenuItem[] = [];
  menuItems.push({
    icon: HiOutlineUser,
    title: "Profile",
    iconColor: "#4A4A4A",
    action: "/profile",
  });
  
  if (isAdmin(user) || (isVolunteer(user) && user.position !== "Member")) {
    menuItems.push({
      icon: MdDashboard,
      title: "Admin Dashboard",
      iconColor: "#4A4A4A",
      action: "/admin/events",
    });
  }

  if (isVolunteer(user) || isAdmin(user)) {
    menuItems.push({
      icon: MdPostAdd,
      title: "Manage Posts",
      iconColor: "#4A4A4A",
      action: "/manage-posts",
    });
  }

  menuItems.push({
    icon: BiMessageSquareDetail,
    title: "Help & Support",
    iconColor: "#4A4A4A",
    action: "/support",
  });

  menuItems.push({
    icon: RiLogoutBoxLine,
    title: "Logout",
    iconColor: "var(--color-primary)",
    action: "logout",
  });

  return menuItems;
};

// Deprecated: Use getProfileMenuItems() instead
// Kept for backward compatibility, but will be removed
export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [];
