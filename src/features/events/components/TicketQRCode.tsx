import React from "react";
import { LazyImageLoader } from "tccd-ui";
import { HiOutlineQrCode } from "react-icons/hi2";
import FullScreenViewer from "@/shared/components/MediaViewer/FullScreenDisplayer";

interface TicketQRCodeProps {
  qrCodeSrc: string;
  eventTitle: string;
}

const TicketQRCode: React.FC<TicketQRCodeProps> = ({
  qrCodeSrc,
  eventTitle,
}) => {
  const [isQROpen, setIsQROpen] = React.useState(false);

  const qrMediaItem = {
    id: "qr-code",
    type: "image",
    src: qrCodeSrc,
    alt: `QR Code for ${eventTitle}`,
  };

  const handleViewQRCode = () => {
    setIsQROpen(true);
  };

  const handleCloseQR = () => {
    setIsQROpen(false);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-secondary mb-4">
          Ticket QR Code
        </h2>
        <div
          onClick={handleViewQRCode}
          className="border-4 border-primary bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          <LazyImageLoader
            src={qrCodeSrc}
            alt="Ticket QR Code"
            className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
          />
        </div>
        <p className="text-sm text-label flex items-center gap-2">
          <HiOutlineQrCode className="w-5 h-5" />
          Click QR code to view full size
        </p>
      </div>

      <FullScreenViewer
        index={0}
        setIndex={() => {}}
        items={[qrMediaItem]}
        isOpen={isQROpen}
        onClose={handleCloseQR}
      />
    </>
  );
};

export default TicketQRCode;
