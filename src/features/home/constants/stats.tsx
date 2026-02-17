import { IoTicketOutline } from "react-icons/io5";
import { TbChartArrowsVertical } from "react-icons/tb";
import { BiNetworkChart } from "react-icons/bi";

export const STATS_DATA = [
  {
    id: 1,
    number: <IoTicketOutline className="text-6xl mx-auto" />,
    title: "All your reservations in one place",
    text: "Register to any event in two clicks, save your tickets, keep track of all upstanding registrations all in one place",
  },
  {
    id: 2,
    number: <TbChartArrowsVertical className="text-6xl mx-auto stroke-1" />,
    title: "Our numbers and milestones on full display",
    text: "A record of our past events numbers and galleries where you can witness our goals and rise",
  },
  {
    id: 3,
    number: <BiNetworkChart className="text-6xl mx-auto" />,
    title: "Your newest and fastest point of contact",
    text: "A hub where you can learn all about what we stand for, reach into our social media platforms and official contacts",
  },
];
