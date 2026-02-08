import type { IconType } from "react-icons";
import { FaRegUser } from "react-icons/fa";
import { BiMessageSquareDetail } from "react-icons/bi";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdDashboard, MdPostAdd } from "react-icons/md";
import { isAdmin, isVolunteer } from "@/shared/types/users";
import type { User } from "@/shared/types";
import { LuScanBarcode } from "react-icons/lu";

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
    icon: FaRegUser,
    title: "Profile",
    iconColor: "var(--color-contrast)",
    action: "/profile",
  });
  
  if (isAdmin(user) || (isVolunteer(user) && user.position !== "Member")) {
    menuItems.push({
      icon: MdDashboard,
      title: "Admin dashboard",
      iconColor: "var(--color-contrast)",
      action: "/admin/events",
    });
  }

  if (isVolunteer(user) || isAdmin(user)) {
    menuItems.push({
      icon: MdPostAdd,
      title: "Manage posts",
      iconColor: "var(--color-contrast)",
      action: "/posts",
    });
  }
  
  if(isAdmin(user) || (isVolunteer(user))) {
    menuItems.push({
      icon: LuScanBarcode,
      title: "Scan tickets",
      iconColor: "var(--color-contrast)",
      action: "/scan-qr",
    });
  }
  
  menuItems.push({
    icon: BiMessageSquareDetail,
    title: "Help & support",
    iconColor: "var(--color-contrast)",
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
