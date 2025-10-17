import React, { useState } from "react";
import { Clock, Calendar } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

interface Props {
  imageSrc: string;
  title: string;
  date: string;
  time: string;
  description: string;
  onBookNow?: () => void;
  onLearnMore?: () => void;
}
const UpcomingEventCard: React.FC<Props> = ({
  imageSrc,
  title,
  date,
  time,
  description,
  onBookNow,
  onLearnMore,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleClick = () => setIsExpanded((prev) => !prev);

  return (
    <div
      onClick={handleClick}
      className="w-full sm:w-1/3 max-w-[412px] h-[367px] bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transition-transform duration-300 active:scale-[0.99] hover:scale-[1.01] flex flex-col"
    >
      <div
        className={`relative w-full transition-all duration-500 ease-in-out ${isExpanded ? "h-[163px]" : "h-[281px]"}`}
      >
        <LazyLoadImage
          src={imageSrc}
          alt={title}
          effect="blur"
          className="w-full h-full object-cover transition-all duration-500 ease-in-out"
          wrapperClassName="w-full h-full"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/event-image.jpg";}}
        />
        <span
          className="absolute top-2 left-2 text-white text-xs px-3 py-1 rounded-2xl"
          style={{ backgroundColor: "#285D7E" }}
        >
          Workshops
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-start p-2 transition-all duration-500 ease-in-out">
        <div className="space-y-2">
          <h2 className="font-bold text-[#285D7E] leading-tight text-[clamp(16px,2vw,26px)]">
            {title}
          </h2>

          <div className="flex items-center gap-6 text-[clamp(13px,2vw,16px)]  text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar strokeWidth={1} className="w-[17px] h-[17px]" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1 ">
              <Clock strokeWidth={1} className="w-[17px] h-[17px]" />
              <span>{time}</span>
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out transform ${
            isExpanded
              ? "opacity-100 translate-y-0 mt-3"
              : "opacity-0 translate-y-2 mt-0 pointer-events-none"
          }`}
        >
          <p className="text-[12px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[14px] leading-relaxed text-gray-700">
            {description}
          </p>

          <div className="flex gap-3 mt-3">
            <button onClick={onBookNow ? () => onBookNow() : undefined}
              className="text-white h-8 w-1/5 sm:w-1/4 rounded-full font-semibold text-xs hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-[#CD3A38]"
              style={{ backgroundColor: "#CD3A38" }}
            >
              Book Now
            </button>
            <button onClick={onLearnMore ? () => onLearnMore() : undefined}
              className="text-white h-8 w-1/5 sm:w-1/4  rounded-full font-semibold text-xs hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-[#285D7E]"
              style={{ backgroundColor: "#285D7E" }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventCard;
