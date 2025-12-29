import React, { useState, useEffect } from "react";
import Avatar from "@/shared/components/Avatar";
import { useThemeColors } from "@/shared/hooks/useThemeColors";

type Feedback = {
  id: string;
  studentName: string;
  university: string;
  college: string;
  comment: string;
};

const mockFeedback: Feedback[] = [
  {
    id: "1",
    studentName: "Sarah Ahmed",
    university: "Cairo University",
    college: "Engineering",
    comment:
      "The summit was incredibly inspiring! The workshops on AI were top-notch. Can't wait for next year.",
  },
  {
    id: "2",
    studentName: "Mohamed Ali",
    university: "Ain Shams University",
    college: "Computer Science",
    comment:
      "Great organization. I learned a lot about the latest trends in cloud computing. Networking opportunities were excellent.",
  },
  {
    id: "3",
    studentName: "Nour Hassan",
    university: "AUC",
    college: "Business",
    comment:
      "Loved the diversity of speakers. The panel discussion on fintech was particularly enlightening.",
  },
];

const FeedbackCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const colors = useThemeColors();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockFeedback.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = mockFeedback[currentIndex];

  return (
    <div className="bg-gradient-to-br from-background-secondary/30 to-background/50 p-6 rounded-2xl border border-muted-primary/20 shadow-sm flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>

      <h3 className="text-lg font-semibold text-contrast mb-6 z-10">
        Student Voice
      </h3>

      <div className="flex-1 flex flex-col justify-center z-10 transition-all duration-500 ease-in-out">
        <p className="text-xl font-medium text-contrast/80 italic mb-6 leading-relaxed">
          "{current.comment}"
        </p>

        <div className="flex items-center gap-4 mt-auto">
          <Avatar
            size={48}
            fallback={current.studentName[0]}
            backgroundColor={colors.primary}
            textColor="#fff"
          />
          <div>
            <p className="font-bold text-contrast">{current.studentName}</p>
            <p className="text-xs text-contrast/50">
              {current.college}, {current.university}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-6 z-10 min-h-[6px]">
        {mockFeedback.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-8" : "w-2"
            }`}
            style={{
              backgroundColor:
                idx === currentIndex ? colors.primary : colors.secondary,
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedbackCarousel;
