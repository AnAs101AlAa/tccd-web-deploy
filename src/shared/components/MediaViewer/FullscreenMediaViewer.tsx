import React, { useEffect, useRef, useState } from "react";
import { FaXmark, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";

export type MediaItem = {
  id: string | number;
  type: string;
  src: string;
  thumb?: string;
  alt?: string;
};

type Props = {
  items: MediaItem[];
  onClose?: () => void;
  trapScroll?: boolean;
  isOpen?: boolean;
  hideGallery?: boolean;
};

export default function FullscreenMediaViewer({
  items,
  onClose,
  trapScroll = true,
  isOpen: externalOpen,
  hideGallery = false,
}: Props) {
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen =
    externalOpen !== undefined
      ? (val: boolean) => {
          if (!val) onClose?.();
        }
      : setInternalOpen;
  const [index, setIndex] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const startX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + 20, items.length));
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
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      e.preventDefault();
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === " " || e.code === "Space") {
        const v = videoRef.current;
        if (v) v.paused ? v.play() : v.pause();
      }
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.1, 3));
      if (e.key === "-" || e.key === "_")
        setZoom((z) => Math.max(z - 0.1, 0.5));
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index]);

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
    setTimeout(() => containerRef.current?.focus(), 50);
  };

  const handleClose = () => {
    setOpen(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    onClose?.();
  };

  const prev = () => setIndex((s) => (s - 1 + items.length) % items.length);
  const next = () => setIndex((s) => (s + 1) % items.length);

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

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) < 40) return;
    dx > 0 ? prev() : next();
  }

  function renderCurrent() {
    const m = items[index];
    if (!m) return null;

    const handleDoubleClick = () => setZoom((z) => (z === 1 ? 2 : 1));

    if (m.type === "image") {
      return (
        <img
          src={m.src}
          alt={m.alt || `image-${index + 1}`}
          className="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
          draggable={false}
          onDoubleClick={handleDoubleClick}
        />
      );
    }

    return (
      <video
        key={m.id}
        ref={videoRef}
        src={m.src}
        controls
        autoPlay
        playsInline
        className="max-w-full max-h-[80vh] rounded-lg shadow-2xl select-none transition-transform duration-200"
        style={{ transform: `scale(${zoom})` }}
        onMouseDown={(e) => {
          const v = videoRef.current;
          if (!v) return;
          if (e.button === 0) v.currentTime = Math.max(0, v.currentTime - 5);
          if (e.button === 2)
            v.currentTime = Math.min(v.duration, v.currentTime + 5);
        }}
        onContextMenu={(e) => e.preventDefault()}
        onDoubleClick={handleDoubleClick}
      />
    );
  }

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
      {!hideGallery && Gallery}

      {open && (
        <div
          ref={containerRef}
          tabIndex={-1}
          aria-modal
          role="dialog"
          aria-label="Media viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="absolute inset-0"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose();
            }}
          />

          <div className="z-10 flex w-full max-w-6xl items-center justify-center">
            <div
              ref={contentRef}
              className="flex max-h-[85vh] items-center justify-center md:px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {renderCurrent()}
            </div>

            <div className="absolute top-2 right-2 flex items-center gap-2 w-fit">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}
                aria-label="Zoom in"
                className="rounded-full p-2 md:p-3 bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors text-text"
              >
                <FiZoomIn className="size-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
                aria-label="Zoom out"
                className="rounded-full p-2 md:p-3 bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors text-text"
              >
                <FiZoomOut className="size-4" />
              </button>
              <button
                onClick={handleClose}
                aria-label="Close"
                className="rounded-full p-2 md:p-3 bg-primary/50 hover:bg-primary cursor-pointer transition-colors text-text"
              >
                <FaXmark className="size-4" />
              </button>
            </div>
            <div className="absolute flex gap-2 items-center justify-center bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[14px] md:text-[16px] text-white">
              <button onClick={prev} disabled={index <= 0}>
                <FaChevronLeft
                  className={`size-4 md:size-5 ${
                    index > 0
                      ? "text-text cursor-pointer"
                      : "text-text/50 cursor-not-allowed"
                  }`}
                />
              </button>
              {index + 1} / {items.length}
              <button onClick={next} disabled={index >= items.length - 1}>
                <FaChevronRight
                  className={`size-4 md:size-5 ${
                    index < items.length - 1
                      ? "text-text cursor-pointer"
                      : "text-text/50 cursor-not-allowed"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
