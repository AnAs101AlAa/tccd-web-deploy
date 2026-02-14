import {
  FaLaptopCode,
  FaBriefcase,
  FaAward,
  FaBuilding,
  FaUsers,
  FaHandshake,
} from "react-icons/fa";
import { GiPublicSpeaker } from "react-icons/gi";
import { MdOutlineEventAvailable } from "react-icons/md";

export const SERVICES_DATA = [
  {
    id: 1,
    icon: <FaLaptopCode className="h-8 w-8 md:h-10 md:w-10 text-primary" />,
    title: "Training Courses",
    description:
      "Specialized technical courses to enhance your skills and prepare you for the job market in various engineering fields.",
  },
  {
    id: 2,
    icon: (
      <GiPublicSpeaker className="h-8 w-8 md:h-10 md:w-10 text-secondary" />
    ),
    title: "Workshops",
    description:
      "Hands-on workshops led by industry professionals to develop practical skills essential for your engineering career.",
  },
  {
    id: 3,
    icon: <FaBriefcase className="h-8 w-8 md:h-10 md:w-10 text-primary" />,
    title: "Job Fairs",
    description:
      "Connect directly with potential employers at our job fairs featuring companies from various engineering sectors.",
  },
  {
    id: 4,
    icon: <FaAward className="h-8 w-8 md:h-10 md:w-10 text-secondary" />,
    title: "Competitions",
    description:
      "Showcase your talents and problem-solving abilities in engineering competitions judged by industry experts.",
  },
  {
    id: 5,
    icon: <FaBuilding className="h-8 w-8 md:h-10 md:w-10 text-primary" />,
    title: "Exhibitions",
    description:
      "Display your projects and innovations at exhibitions attended by industry leaders and potential employers.",
  },
  {
    id: 6,
    icon: (
      <MdOutlineEventAvailable className="h-8 w-8 md:h-10 md:w-10 text-secondary" />
    ),
    title: "Recruitment Events",
    description:
      "Dedicated recruitment events where companies interview and select candidates for internships and jobs.",
  },
  {
    id: 7,
    icon: <FaUsers className="h-8 w-8 md:h-10 md:w-10 text-primary" />,
    title: "Seminars & Lectures",
    description:
      "Informative sessions by industry leaders and academics covering emerging trends and technologies in engineering.",
  },
  {
    id: 8,
    icon: <FaHandshake className="h-8 w-8 md:h-10 md:w-10 text-secondary" />,
    title: "Industry Connections",
    description:
      "We establish valuable links between senior students, fresh graduates, and industry partners for career opportunities.",
  },
];
