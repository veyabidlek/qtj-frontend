"use client";

import { memo } from "react";
import { PlayIcon, SignalIcon } from "@heroicons/react/24/solid";
import type { TelemetrySnapshot } from "@/types/telemetry";
import { formatTimestamp } from "@/lib/formatters";

interface ReplaySliderProps {
  history: TelemetrySnapshot[];
  replayTimestamp: number | null;
  onTimestampChange: (ts: number | null) => void;
}

function ReplaySliderInner({ history, replayTimestamp, onTimestampChange }: ReplaySliderProps) {
  if (history.length < 2) return null;

  const min = history[0].timestamp;
  const max = history[history.length - 1].timestamp;
  const current = replayTimestamp ?? max;
  const isLive = replayTimestamp === null;

  return (
    <div className="glass-card px-4 py-2.5 flex items-center gap-4" role="region" aria-label="Перемотка времени">
      <button
        onClick={() => onTimestampChange(null)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
          isLive
            ? "bg-hud-success/20 text-hud-success"
            : "bg-white/10 text-white/60 hover:text-white"
        }`}
        aria-label="Переключить на живые данные"
      >
        <SignalIcon className="h-3 w-3" />
        LIVE
      </button>

      <input
        type="range"
        min={min}
        max={max}
        value={current}
        onChange={(e) => {
          const ts = Number(e.target.value);
          onTimestampChange(ts >= max - 500 ? null : ts);
        }}
        className="flex-1 h-1.5 rounded-full appearance-none bg-white/15 cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
        aria-label="Перемотка данных"
      />

      <span className="font-mono text-xs text-white/70 shrink-0 min-w-[65px] text-right">
        {isLive ? "Сейчас" : formatTimestamp(current)}
      </span>

      {!isLive && (
        <button
          onClick={() => onTimestampChange(null)}
          className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
          aria-label="Вернуться к живым данным"
        >
          <PlayIcon className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

const ReplaySlider = memo(ReplaySliderInner);
export default ReplaySlider;
