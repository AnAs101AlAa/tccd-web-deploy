import type { IconType } from "react-icons";
import { MdEventNote } from "react-icons/md";
import { HiOutlineHome } from "react-icons/hi";
import { FaRegImages } from "react-icons/fa";
import { GrCircleQuestion } from "react-icons/gr";

export const NAV_ITEMS: { to: string; icon: IconType; title: string }[] = [
  {
    to: "/",
    icon: HiOutlineHome,
    title: "Home",
  },
  {
    to: "/events",
    icon: MdEventNote,
    title: "Events",
  },
  {
    to: "/gallery",
    icon: FaRegImages,
    title: "Gallery",
  },
  {
    to: "/aboutus",
    icon: GrCircleQuestion,
    title: "About us",
  },
];
