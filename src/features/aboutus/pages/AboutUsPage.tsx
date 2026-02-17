import { useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import toast from "react-hot-toast";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";
import boardMembers from "@/assets/boardMembers.json";
import websiteFounders from "@/assets/websiteFounders.json";
import type { BoardMember, WebsiteFounder } from "@/shared/types";
import VisionIcon from "@/assets/vision.svg";
import MissionIcon from "@/assets/mission.svg";
import GoalIcon from "@/assets/goal.svg";
import WithLayout from "@/shared/components/hoc/WithLayout";
import ABOUT_US_HEADER_IMAGE from "@/assets/aboutusTopHeader.jpg";
import ABOUT_US_IMAGE from "/user.jpg";

export const AboutUsPage = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const foundersRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollBoard = (direction: number) => {
    if (carouselRef.current) {
      const scrollAmount = 290;
      const maxScrollLeft =
        carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
      const newScrollLeft =
        carouselRef.current.scrollLeft + direction * scrollAmount;

      if (newScrollLeft < 0) {
        carouselRef.current.scrollLeft = 0;
      } else if (newScrollLeft > maxScrollLeft) {
        carouselRef.current.scrollLeft = maxScrollLeft;
      } else {
        carouselRef.current.scrollBy({
          left: direction * scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  const scrollFounders = (direction: number) => {
    if (foundersRef.current) {
      const scrollAmount = 290;
      const maxScrollLeft =
        foundersRef.current.scrollWidth - foundersRef.current.clientWidth;
      const newScrollLeft =
        foundersRef.current.scrollLeft + direction * scrollAmount;

      if (newScrollLeft < 0) {
        foundersRef.current.scrollLeft = 0;
      } else if (newScrollLeft > maxScrollLeft) {
        foundersRef.current.scrollLeft = maxScrollLeft;
      } else {
        foundersRef.current.scrollBy({
          left: direction * scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${type} copied to clipboard!`);
      })
      .catch(() => {
        toast.error(`Failed to copy ${type}`);
      });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (errors[id as keyof typeof errors]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = { name: "", email: "", subject: "", message: "" };
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email Address is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WithLayout>
      <div className="relative font-sans bg-gray-50">
        <UpperHeader
          image={ABOUT_US_HEADER_IMAGE}
          title="About Us"
          subtitle="Catch a brief hint of TCCD, Our vision, mission, and goals, why we do what we do and our teams."
        />

        <div className="mx-auto text-center mt-8 md:mt-16">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 bg-linear-to-r from-[#295E7E] to-[#CD3A38] bg-clip-text text-transparent">
            Board members
          </h1>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-3xl mx-auto px-4 mb-4">
            Meet the dedicated leaders who guide TCCD's strategic vision and
            ensure our commitment to empowering students and graduates in their
            career journeys.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-5 relative pb-8 md:pb-12">
          <button
            onClick={() => scrollBoard(-1)}
            className="absolute left-2 md:left-0 lg:left-0 top-1/2 -translate-y-1/2 bg-white rounded-full w-9 h-9 md:w-10 md:h-10 shadow-lg z-10 hover:cursor-pointer hover:bg-gray-50 flex items-center justify-center transition-all duration-300"
          >
            <FaArrowLeft className="text-gray-800 text-sm md:text-base" />
          </button>
          <button
            onClick={() => scrollBoard(1)}
            className="absolute right-2 md:right-0 lg:right-0 top-1/2 -translate-y-1/2 bg-white rounded-full w-9 h-9 md:w-10 md:h-10 shadow-lg z-10 hover:cursor-pointer hover:bg-gray-50 flex items-center justify-center transition-all duration-300"
          >
            <FaArrowRight className="text-gray-800 text-sm md:text-base" />
          </button>
          <div
            ref={carouselRef}
            className="flex overflow-x-scroll snap-x snap-mandatory scroll-smooth gap-4 md:gap-6 py-6 md:py-8 px-2 mx-8 md:mx-10"
          >
            {(boardMembers as BoardMember[]).map((member, i) => (
              <div
                key={i}
                className="shrink-0 w-56 md:w-64 bg-white p-5 md:p-6 rounded-xl shadow-md hover:-translate-y-2 transition-transform snap-center"
              >
                <img
                  src={member.ImgSrc || ABOUT_US_IMAGE}
                  alt={`${member.Name} - Board Member`}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover object-center mx-auto mb-3 md:mb-4 bg-gray-200"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== ABOUT_US_IMAGE) {
                      target.src = ABOUT_US_IMAGE;
                    }
                  }}
                />
                <h3 className="font-semibold text-gray-800 text-center text-base md:text-lg">
                  {member.Name}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm text-center">
                  {member.Role}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto text-center mt-4 md:mt-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 bg-linear-to-r from-[#295E7E] to-[#CD3A38] bg-clip-text text-transparent">
            Website Founders
          </h1>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-3xl mx-auto px-4 mb-4">
            With a passion for technology and a commitment to excellence, our
            founders have been instrumental in shaping the vision and mission of
            TCCD. giving up their time and effort to make this website a reality
            and proving that you can make a difference.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-5 relative pb-8 md:pb-16">
          <button
            onClick={() => scrollFounders(-1)}
            className="absolute left-2 md:left-0 lg:left-0 top-1/2 -translate-y-1/2 bg-white rounded-full w-9 h-9 md:w-10 md:h-10 shadow-lg z-10 hover:cursor-pointer hover:bg-gray-50 flex items-center justify-center transition-all duration-300"
          >
            <FaArrowLeft className="text-gray-800 text-sm md:text-base" />
          </button>
          <button
            onClick={() => scrollFounders(1)}
            className="absolute right-2 md:right-0 lg:right-0 top-1/2 -translate-y-1/2 bg-white rounded-full w-9 h-9 md:w-10 md:h-10 shadow-lg z-10 hover:cursor-pointer hover:bg-gray-50 flex items-center justify-center transition-all duration-300"
          >
            <FaArrowRight className="text-gray-800 text-sm md:text-base" />
          </button>
          <div
            ref={foundersRef}
            className="flex overflow-x-scroll snap-x snap-mandatory scroll-smooth gap-4 md:gap-6 py-6 md:py-8 px-2 mx-8 md:mx-10"
          >
            {(websiteFounders as WebsiteFounder[]).map((founder, i) => (
              <div
                key={i}
                className="shrink-0 w-56 md:w-64 bg-white p-5 md:p-6 rounded-xl shadow-md hover:-translate-y-2 transition-transform snap-center"
              >
                <img
                  src={founder.ImgSrc || ABOUT_US_IMAGE}
                  alt={`${founder.Name} - Website Founder`}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover object-center mx-auto mb-3 md:mb-4 bg-gray-200"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== ABOUT_US_IMAGE) {
                      target.src = ABOUT_US_IMAGE;
                    }
                  }}
                />
                <h3 className="font-semibold text-gray-800 text-center mb-1 text-base md:text-lg">
                  {founder.Name}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm text-center mb-3 md:mb-4">
                  {founder.Role}
                </p>

                <div className="flex items-center justify-center gap-3 md:gap-4 mt-3 md:mt-4">
                  {founder.email && (
                    <button
                      onClick={() => copyToClipboard(founder.email!, "Email")}
                      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-[#EA4335] text-white rounded-full hover:bg-[#d33426] transition-all hover:scale-110 cursor-pointer shadow-md"
                      title="Copy email to clipboard"
                    >
                      <SiGmail size={16} className="md:w-4.5 md:h-4.5" />
                    </button>
                  )}
                  {founder.linkedin && (
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-[#0077B5] text-white rounded-full hover:bg-[#006396] transition-all hover:scale-110 shadow-md"
                      title="Open LinkedIn profile"
                    >
                      <FaLinkedin
                        size={16}
                        className="md:w-4.5 md:h-4.5"
                      />
                    </a>
                  )}
                  {founder.github && (
                    <button
                      onClick={() =>
                        copyToClipboard(founder.github!, "GitHub URL")
                      }
                      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-[#333333] text-white rounded-full hover:bg-[#222222] transition-all hover:scale-110 cursor-pointer shadow-md"
                      title="Copy GitHub URL to clipboard"
                    >
                      <FaGithub size={16} className="md:w-4.5 md:h-4.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative py-12 md:py-16 px-4 md:px-5 bg-linear-to-br from-[#44697E] via-[#5a7a8f] to-[#CD3A38] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 mb-12 md:mb-16">
              <div className="relative order-1 md:order-2">
                <div
                  className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 bg-white/90 flex flex-col items-center justify-center shadow-2xl"
                  style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
                >
                  <img
                    src={VisionIcon}
                    alt="Vision"
                    className="w-9 h-10 mb-1 md:mb-3 md:w-13.5 md:h-14"
                  />
                  <h3 className="text-[#44697E] text-lg md:text-2xl font-bold">
                    Vision
                  </h3>
                </div>
              </div>
              <div className="flex-1 text-white md:pr-6 lg:pr-8 order-2 md:order-1">
                <p className="text-base md:text-lg lg:text-xl leading-relaxed text-center md:text-left font-bold">
                  Fostering students to pursue rewarding career paths and
                  offering continual learning opportunities to faculty
                  graduates.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
              <div className="relative order-1">
                <div
                  className="w-36 h-36 md:w-56 md:h-56 bg-white/90 flex flex-col items-center justify-center shadow-2xl"
                  style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
                >
                  <img
                    src={MissionIcon}
                    alt="Mission"
                    className="w-9 h-9 mb-1 md:mb-3 md:w-12 md:h-12"
                  />
                  <h3 className="text-[#CD3A38] text-lg md:text-2xl font-bold">
                    Mission
                  </h3>
                </div>
              </div>
              <div className="flex-1 text-white md:pl-6 lg:pl-8 order-2">
                <p className="text-base md:text-lg lg:text-xl leading-relaxed text-center md:text-left font-bold">
                  To empower students and graduates to excel by fostering a
                  supportive environment that address workplace demands and
                  create a lasting positive impact on society.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-8">
              <div className="relative order-1 md:order-2 mx-auto md:mx-0">
                <div
                  className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 bg-white/90 flex flex-col items-center justify-center shadow-2xl"
                  style={{ borderRadius: "70% 30% 50% 50% / 40% 60% 40% 60%" }}
                >
                  <img
                    src={GoalIcon}
                    alt="Goals"
                    className="w-9 h-9 mb-1 md:mb-3 md:w-12 md:h-12"
                  />
                  <h3 className="text-[#44697E] text-lg md:text-2xl font-bold">
                    Goals
                  </h3>
                </div>
              </div>
              <div className="flex-1 text-white order-2 md:order-1 font-bold">
                <ul className="space-y-2 md:space-y-3 list-none">
                  <li className="flex items-start">
                    <span className="mr-2 md:mr-3 mt-1">•</span>
                    <span className="text-sm md:text-base lg:text-lg">
                      Provide quality services and training to boost
                      employability
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 md:mr-3 mt-1">•</span>
                    <span className="text-sm md:text-base lg:text-lg">
                      Partner with public and private entities to support
                      initiatives
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 md:mr-3 mt-1">•</span>
                    <span className="text-sm md:text-base lg:text-lg">
                      Develop career services to improve employability
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 md:mr-3 mt-1">•</span>
                    <span className="text-sm md:text-base lg:text-lg">
                      Launch initiatives to serve TCCD stakeholders and partners
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 md:mr-3 mt-1">•</span>
                    <span className="text-sm md:text-base lg:text-lg">
                      Strengthen TCCD's network and resources
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 md:mr-3 mt-1">•</span>
                    <span className="text-sm md:text-base lg:text-lg">
                      Generate revenue for sustainability and growth
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <section className="bg-linear-to-br from-gray-50 to-white py-8 md:py-16 px-4 md:px-5">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-linear-to-r from-[#295E7E] to-[#CD3A38] bg-clip-text text-transparent mb-3 md:mb-4">
                Get in Touch
              </h2>
              <p className="text-[#295E7E] text-sm md:text-base ">
                We'd love to hear from you! Send us a message and we'll respond
                as soon as possible.
              </p>
            </div>

            <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    className={`w-full px-4 py-3 border-2 ${
                      errors.name ? "border-red-500" : "border-gray-200"
                    } rounded-lg peer focus:outline-none focus:border-[#295E7E] transition-colors`}
                    placeholder=" "
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="name"
                    className={`absolute left-4 ${
                      formData.name ? "-top-3" : "top-3"
                    } px-1 text-gray-400 transition-all peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[#295E7E] bg-white text-sm`}
                  >
                    Full Name
                  </label>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    className={`w-full px-4 py-3 border-2 ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    } rounded-lg peer focus:outline-none focus:border-[#295E7E] transition-colors`}
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-4 ${
                      formData.email ? "-top-3" : "top-3"
                    } px-1 text-gray-400 transition-all peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[#295E7E] bg-white text-sm`}
                  >
                    Email Address
                  </label>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="relative">
                <input
                  id="subject"
                  type="text"
                  className={`w-full px-4 py-3 border-2 ${
                    errors.subject ? "border-red-500" : "border-gray-200"
                  } rounded-lg peer focus:outline-none focus:border-[#295E7E] transition-colors`}
                  placeholder=" "
                  value={formData.subject}
                  onChange={handleChange}
                />
                <label
                  htmlFor="subject"
                  className={`absolute left-4 ${
                    formData.subject ? "-top-3" : "top-3"
                  } px-1 text-gray-400 transition-all peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[#295E7E] bg-white text-sm`}
                >
                  Subject
                </label>
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              <div className="relative">
                <textarea
                  id="message"
                  rows={6}
                  className={`w-full px-4 py-3 border-2 ${
                    errors.message ? "border-red-500" : "border-gray-200"
                  } rounded-lg peer resize-none focus:outline-none focus:border-[#295E7E] transition-colors`}
                  placeholder=" "
                  value={formData.message}
                  onChange={handleChange}
                />
                <label
                  htmlFor="message"
                  className={`absolute left-4 ${
                    formData.message ? "-top-3" : "top-3"
                  } px-1 text-gray-400 transition-all peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[#295E7E] bg-white text-sm`}
                >
                  Your Message
                </label>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-linear-to-r transition-all duration-300 cursor-pointer from-[#295E7E] to-[#CD3A38] text-white rounded-full font-semibold hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </WithLayout>
  );
};
