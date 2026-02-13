import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { LazyImageLoader } from "tccd-ui";

interface ImageModalProps {
  onClick: () => void;
  name: string;
  image: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ onClick, name, image }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClick();
      }
    };
    
    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClick]);

  return (
    <div>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300 p-4 sm:p-6"
        onClick={onClick}
      >
        {/* Modal Container */}
        <div
          className="relative w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] flex flex-col bg-gradient-to-br from-white/10 to-white/5 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden transform scale-100 animate-zoom-in backdrop-blur-md border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 flex items-center justify-center transition-all backdrop-blur-md shadow-lg hover:scale-110 active:scale-95"
            onClick={onClick}
            aria-label="Close image viewer"
          >
            <FiX className="size-4 md:size-5" />
          </button>

          {/* Image Container */}
          <div className="flex items-center justify-center w-full h-full p-1 sm:p-2">
            <div className="relative w-full h-full max-h-[85vh] flex items-center justify-center">
              <LazyImageLoader
                src={image}
                alt={name}
                objectClassName="object-contain max-h-[85vh] w-auto"
                height="auto"
                width="100%"
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Hint Text */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md text-white/80 px-3 py-1 rounded-full text-xs hidden sm:block">
            Press ESC or click outside to close
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
