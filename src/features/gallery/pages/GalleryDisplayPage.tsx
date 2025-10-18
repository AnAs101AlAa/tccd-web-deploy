import { useParams } from "react-router-dom";
import FullscreenMediaViewer from "@/shared/components/MediaViewer/FullscreenMediaViewer";
import { FaChevronLeft } from "react-icons/fa6";
import tccdLogo from "@/assets/TCCD_logo.svg";
import { useGetGalleryById } from "@/shared/queries/gallery";
import toast from "react-hot-toast";
import { useEffect } from "react";
export default function GalleryDisplayPage() {
  const { id } = useParams();
  const { data: galleryData, isLoading, isError } = useGetGalleryById(id || "");

  useEffect (() => {
    if (isError) {
      toast.error("Failed to load gallery data. Please try again later.");
    }
  }, [isError]);

  return (
    <div className="w-full">
        <div className="bg-background p-4 shadow-lg flex justify-between items-center mb-2">
            <div>
                <div className="flex items-center gap-2">
                    <FaChevronLeft className="cursor-pointer size-5" onClick={() => window.history.back()} />
                    <p className="font-bold text-[26px] text-secondary">Event Gallery</p>
                </div>
                <p className="text-contrast font-medium text-[14px] md:text-[16px] mt-1">Explore the collection of media from the <span className="font-bold">{galleryData?.eventName}</span> event.</p>
            </div>
            <img src={tccdLogo} alt="TCCD Logo" className="md:block hidden h-9 md:mr-6 mr-3" />
        </div>
        {isLoading && <p>Loading...</p>}
      <FullscreenMediaViewer items={galleryData?.media || []} />
    </div>
  );
}