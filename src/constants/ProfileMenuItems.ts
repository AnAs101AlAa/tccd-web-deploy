import type { IconType } from "react-icons";
import { HiOutlineUser, HiOutlineLockClosed } from "react-icons/hi2";
import { BiMessageSquareDetail } from "react-icons/bi";

export interface ProfileMenuItem {
  icon: IconType;
  title: string;
  description: string;
  iconColor: string;
  height?: string;
}

export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  {
    icon: HiOutlineUser,
    title: "Account",
    description: "Security notifications, change mail id",
    iconColor: "#263238",
    height: "72px",
  },
  {
    icon: HiOutlineLockClosed,
    title: "Privacy",
    description: "Security notifications, change mail id",
    iconColor: "#263238",
    height: "72px",
  },
  {
    icon: BiMessageSquareDetail,
    title: "Help & Support",
    description: "Get assistance and answers",
    iconColor: "#353535",
    height: "72px",
  },
];
