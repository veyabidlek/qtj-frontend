"use client";

import { memo } from "react";

const BACKGROUNDS: Record<string, { type: "image" | "video"; src: string }> = {
  "qulsary-image":       { type: "image", src: "/backgrounds/qulsary.png" },
  "qulsary-moving":      { type: "video", src: "/background-videos/qulsary-moving.mp4" },
  "aqtau-approaching":   { type: "video", src: "/background-videos/aqtau-approaching.mp4" },
  "aqtau-image":         { type: "image", src: "/backgrounds/aqtau.png" },
  "aqtau-moving":        { type: "video", src: "/background-videos/aqtau-moving.mp4" },
  "almaty-approaching":  { type: "video", src: "/background-videos/almaty-approaching.mp4" },
  "almaty-image":        { type: "image", src: "/backgrounds/almaty.png" },
  "almaty-moving":       { type: "video", src: "/background-videos/almaty-moving.mp4" },
  "astana-approaching":  { type: "video", src: "/background-videos/astana-approaching.mp4" },
  "astana-image":        { type: "image", src: "/backgrounds/astana.png" },
};

const ALL_IMAGES = Object.values(BACKGROUNDS).filter((b) => b.type === "image");
const ALL_VIDEOS = Object.values(BACKGROUNDS).filter((b) => b.type === "video");

interface StationBackgroundProps {
  backgroundKey: string;
}

function StationBackgroundInner({ backgroundKey }: StationBackgroundProps) {
  const active = BACKGROUNDS[backgroundKey];

  return (
    <>
      {/* All images preloaded, only active visible */}
      {ALL_IMAGES.map((bg) => (
        <img
          key={bg.src}
          src={bg.src}
          alt=""
          className="fixed inset-0 z-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: active === bg ? 1 : 0 }}
        />
      ))}

      {/* All videos preloaded, only active visible */}
      {ALL_VIDEOS.map((bg) => (
        <video
          key={bg.src}
          className="fixed inset-0 z-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: active === bg ? 1 : 0 }}
          src={bg.src}
          autoPlay
          loop
          muted
          playsInline
        />
      ))}

      {/* Overlay */}
      <div className="fixed inset-0 z-0 bg-black/20 dark:bg-black/50" />
    </>
  );
}

const StationBackground = memo(StationBackgroundInner);
export default StationBackground;
