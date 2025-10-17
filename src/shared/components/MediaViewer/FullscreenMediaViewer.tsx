import React, { useEffect, useRef, useState } from "react";

export type MediaItem = {
  id: string | number;
  type: "image" | "video";
  src: string;
  thumb?: string;
  alt?: string;
};

type Props = {
  items: MediaItem[];
  onClose?: () => void;
  trapScroll?: boolean;
};

export default function FullscreenMediaViewer({
  items,
  onClose,
  trapScroll = true,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const startX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      if (e.key === "-" || e.key === "_") setZoom((z) => Math.max(z - 0.1, 0.5));
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
          if (e.button === 2) v.currentTime = Math.min(v.duration, v.currentTime + 5);
        }}
        onContextMenu={(e) => e.preventDefault()}
        onDoubleClick={handleDoubleClick}
      />
    );
  }

  const Gallery = (
    <div className="flex flex-wrap gap-3 p-3">
      {items.map((it, i) => (
        <button
          key={it.id}
          onClick={() => openAt(i)}
          className="group relative w-36 h-24 overflow-hidden rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <img
            src={it.thumb || it.src}
            alt={it.alt || `thumb-${i + 1}`}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            draggable={false}
          />
          {it.type === "video" && (
            <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
              Video
            </span>
          )}
        </button>
      ))}
    </div>
  );

  return (

    <div className="w-full">
      {Gallery}

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

          <div className="relative z-10 flex w-full max-w-6xl items-center justify-center">
            {index > 0 &&
            (<button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg bg-white/6 p-3 shadow-md backdrop-blur-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>)}

            <div ref={contentRef} className="flex max-h-[85vh] items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
              {renderCurrent()}
            </div>

            
            {index < items.length - 1 &&
               ( <button
              onClick={next}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg bg-white/6 p-3 shadow-md backdrop-blur-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>)}
            <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-15 top-0 w-10 h-10 rounded-md shadow-md hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: "#CD3A38" }} 
            >
             ×
            </button>
            <button
            onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}
            aria-label="Zoom in"
            className="absolute right-28 top-0 w-10 h-10 rounded-full shadow-md hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: "#295E7E" }} 
            >
            +
            </button>
            <button
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
            aria-label="Zoom out"
            className="absolute right-40 top-0 w-10 h-10 rounded-full shadow-md hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: "#295E7E" }} 
            >
            -
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {index + 1} / {items.length}
            </div>
          </div>

          <div className="absolute bottom-4 z-20 w-full max-w-4xl px-4">
            <div className="mx-auto flex max-w-full items-center justify-center gap-3 overflow-x-auto rounded-full bg-black/40 py-2 px-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {items.map((it, i) => (
                <button
                  key={it.id}
                  onClick={() => setIndex(i)}
                  className={`h-12 w-20 flex-shrink-0 overflow-hidden rounded-md ring-2 ring-transparent transition-all focus:outline-none focus:ring-indigo-500 ${
                    i === index ? "ring-white/40 scale-105" : "hover:scale-105"
                  }`}
                >
                  <img src={it.thumb || it.src} alt={it.alt || `thumb-${i + 1}`} className="h-full w-full object-cover" draggable={false} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
