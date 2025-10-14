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
          className="relative h-[176px] bg-cover bg-center bg-no-repeat text-white"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 bg-[linear-gradient(135deg,rgba(68,105,126,0.78)_30%,rgba(205,58,56,0.78))]">
            <div className="translate-y-[10px]">
              <h1 className="text-[24px] font-bold mb-2">{title}</h1>
              <p className="text-[12px] font-semibold max-w-[80%] break-words mx-auto">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex items-center justify-start gap-10 px-[60px] py-[80px] text-white bg-[linear-gradient(135deg,#44697E_30%,#CD3A38)] h-1 ">
          <div className="relative z-10 flex items-start flex-1">
          <div className="w-2 bg-[#CD3A38] mr-5 self-stretch"></div>            
            <div >
              <h1 className="text-[40px] font-bold mb-0 -mt-3">{title}</h1>
              <p className="text-[14px] font-semibold max-w-[700px] break-words">
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
