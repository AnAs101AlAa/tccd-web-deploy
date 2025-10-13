import type { IconType } from "react-icons";
import { FiHome } from "react-icons/fi";
import { HiPhoto} from "react-icons/hi2";
import { MdEvent } from "react-icons/md";
import { IoInformationCircleOutline } from "react-icons/io5";

export const NAV_ITEMS: { to: string; icon: IconType; title: string }[] = [
  {
    to: "/",
    icon: FiHome,
    title: "Home",
  },
  {
    to: "/events",
    icon: MdEvent,
    title: "Events",
  },
  {
    to: "/gallery",
    icon: HiPhoto,
    title: "Gallery",
  },
  {
    to: "/aboutus",
    icon: IoInformationCircleOutline,
    title: "About us",
  },
];
