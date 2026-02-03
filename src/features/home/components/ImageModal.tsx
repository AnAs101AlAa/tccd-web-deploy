import { FiZoomOut } from "react-icons/fi";
import { LazyImageLoader } from "tccd-ui";

interface ImageModalProps {
  onClick: () => void;
  name: string;
  image: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ onClick, name, image }) => {
  return (
    <div>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-60 backdrop-blur-md transition-all duration-500"
        onClick={onClick}
      >
        <div
          className="relative max-w-4xl max-h-[90vh] p-1 bg-white/10 rounded-lg shadow-2xl overflow-hidden transform scale-100 animate-zoom-in backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-h-[85vh] max-w-full rounded-lg shadow-2xl">
            <LazyImageLoader
              src={image}
              alt={name}
              height="85vh"
              className="rounded-lg"
            />
          </div>
          <button
            className="absolute top-4 right-4 bg-black/30 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/50 transition-all backdrop-blur-sm"
            onClick={onClick}
          >
            <FiZoomOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
