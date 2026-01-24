import React, { useState, useEffect } from "react";

interface UpperHeaderProps {
  image: string;
  title: string;
  subtitle: string;
}

const UpperHeader: React.FC<UpperHeaderProps> = ({ image, title, subtitle }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full">
      {isMobile ? (
        <div
          className="relative h-[152px] sm:h-[176px] bg-cover bg-center bg-no-repeat text-white"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 bg-[linear-gradient(135deg,rgba(68,105,126,0.78)_30%,rgba(205,58,56,0.78))]">
              <h1 className="text-[28px] sm:text-[36px] font-bold mb-2">{title}</h1>
              <p className="text-[12px] sm:text-[15px] font-semibold max-w-[80%] break-words mx-auto">
                {subtitle}
              </p>
          </div>
        </div>
      ) : (
        <div className="relative flex items-center justify-start gap-10 px-[60px] py-[33px] lg:py-[40px] text-white bg-[linear-gradient(135deg,#44697E_40%,#CD3A38)]">
          <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",backgroundSize: "60px 60px",}}/>
          </div>
          <div className="relative z-10 flex items-start flex-1">
          <div className="w-3 bg-[#CD3A38] mr-5 self-stretch "></div>            
            <div>
              <h1 className="text-[42px] lg:text-[42px] font-bold mb-0 -mt-3 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">{title}</h1>
              <p className="text-[16px] lg:text-[17px] font-semibold max-w-[700px] break-words ">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpperHeader;
