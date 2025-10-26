import { useEffect, useRef, useState } from "react";
import { type MediaItem, FullScreenViewer } from "tccd-ui";


type Props = {
  items: MediaItem[];
  trapScroll?: boolean;
};

export default function FullscreenMediaViewer({
  items,
  trapScroll = true,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setTimeout(() => {
          setVisibleCount(prev => Math.min(prev + 20, items.length));
        }, 1000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items.length]);

  useEffect(() => {
    if (items.length === 0) return;
    if (index >= items.length) return;
  }, [items, index]);

  useEffect(() => {
    if (trapScroll) {
      if (open) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "";
    }
    return () => {
      if (trapScroll) document.body.style.overflow = "";
    };
  }, [open, trapScroll]);

  useEffect(() => {
    const v = videoRef.current;
    return () => {
      if (v && !v.paused) v.pause();
    };
  }, [index]);

  const openAt = (i: number) => {
    if (i < 0 || i >= items.length) return;
    setIndex(i);
    setOpen(true);
  };

  useEffect(() => {
    const prevIdx = (index - 1 + items.length) % items.length;
    const nextIdx = (index + 1) % items.length;
    [prevIdx, nextIdx].forEach((i) => {
      const it = items[i];
      if (!it) return;
      if (it.type === "image") {
        const img = new Image();
        img.src = it.src;
      }
    });
  }, [index, items]);

  const Gallery = (
    <div
      ref={galleryRef}
      className="flex flex-wrap gap-0 md:gap-[2%] lg:gap-[0.66%] space-y-4 p-2 md:p-3 overflow-y-auto"
    >
      {items.slice(0, visibleCount).map((it, i) => (
        <button
          key={it.id}
          onClick={() => openAt(i)}
          className="group relative w-full md:w-[32%] lg:w-[24.5%] h-[24vh] md:h-[32vh] lg:h-[28vh] overflow-hidden rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <img
            src={it.thumb || it.src}
            alt={it.alt || `thumb-${i + 1}`}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            draggable={false}
            loading="lazy"
          />
          {it.type === "video" && (
            <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
              Video
            </span>
          )}
        </button>
      ))}

      {visibleCount < items.length && (
        <div className="w-full text-center font-bold py-4 text-contrast text-[14px] md:text-[16px]">
          Loading more...
        </div>
      )}
    </div>
  );

  return (
    <div>
      {Gallery}
      <FullScreenViewer
        isOpen={open}
        items={items}
        index={index}
        setIndex={setIndex}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
