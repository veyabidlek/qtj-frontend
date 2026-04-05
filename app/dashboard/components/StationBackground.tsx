"use client";

import { memo, useMemo } from "react";

interface BgAsset {
  type: "image" | "video";
  src: string;
}

const BACKGROUNDS: Record<string, BgAsset> = {
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

// For each key, which keys should be preloaded next
const PRELOAD_NEXT: Record<string, string[]> = {
  "qulsary-image":      ["qulsary-moving"],
  "qulsary-moving":     ["aqtau-approaching", "aqtau-image"],
  "aqtau-approaching":  ["aqtau-image", "aqtau-moving"],
  "aqtau-image":        ["aqtau-moving"],
  "aqtau-moving":       ["almaty-approaching", "almaty-image"],
  "almaty-approaching": ["almaty-image", "almaty-moving"],
  "almaty-image":       ["almaty-moving"],
  "almaty-moving":      ["astana-approaching", "astana-image"],
  "astana-approaching": ["astana-image"],
  "astana-image":       [],
};

// Build the full set of keys that should be loaded by a given point in the route.
// Once a key has been seen, it stays loaded (assets only accumulate).
const ALL_KEYS = Object.keys(BACKGROUNDS);
const KEY_ORDER = [
  "qulsary-image", "qulsary-moving",
  "aqtau-approaching", "aqtau-image", "aqtau-moving",
  "almaty-approaching", "almaty-image", "almaty-moving",
  "astana-approaching", "astana-image",
];

function getKeysToLoad(activeKey: string): Set<string> {
  const result = new Set<string>();
  const activeIdx = KEY_ORDER.indexOf(activeKey);
  // Load everything up to and including the active key
  for (let i = 0; i <= Math.max(activeIdx, 0); i++) {
    result.add(KEY_ORDER[i]);
  }
  // Plus look-ahead
  for (const key of PRELOAD_NEXT[activeKey] ?? []) {
    result.add(key);
  }
  return result;
}

interface StationBackgroundProps {
  backgroundKey: string;
}

function StationBackgroundInner({ backgroundKey }: StationBackgroundProps) {
  const active = BACKGROUNDS[backgroundKey];
  const loaded = useMemo(() => getKeysToLoad(backgroundKey), [backgroundKey]);

  return (
    <>
      {ALL_KEYS.map((key) => {
        if (!loaded.has(key)) return null;
        const bg = BACKGROUNDS[key];
        const isActive = bg === active;

        if (bg.type === "image") {
          return (
            <img
              key={key}
              src={bg.src}
              alt=""
              className="fixed inset-0 z-0 h-full w-full object-cover transition-opacity duration-500"
              style={{ opacity: isActive ? 1 : 0 }}
            />
          );
        }

        return (
          <video
            key={key}
            className="fixed inset-0 z-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: isActive ? 1 : 0 }}
            src={bg.src}
            autoPlay
            loop
            muted
            playsInline
          />
        );
      })}

      <div className="fixed inset-0 z-0 bg-black/20 dark:bg-black/50" />
    </>
  );
}

const StationBackground = memo(StationBackgroundInner);
export default StationBackground;
