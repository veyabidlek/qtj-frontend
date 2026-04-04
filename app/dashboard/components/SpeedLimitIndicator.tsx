"use client";

import { memo } from "react";

interface SpeedLimitIndicatorProps {
  currentSpeed: number;
  speedLimit: number;
}

function SpeedLimitIndicatorInner({ currentSpeed, speedLimit }: SpeedLimitIndicatorProps) {
  const diff = currentSpeed - speedLimit;
  const statusColor = diff > 0 ? "text-hud-danger" : diff > -10 ? "text-hud-warning" : "text-hud-success";
  const statusLabel = diff > 0 ? "Превышение" : diff > -10 ? "Приближение" : "В норме";

  return (
    <div className="flex flex-col items-center gap-2" role="img" aria-label={`Ограничение скорости: ${speedLimit} км/ч, текущая: ${Math.round(currentSpeed)} км/ч`}>
      {/* Speed limit sign */}
      <div className="relative w-[72px] h-[72px] rounded-full border-[5px] border-red-500 bg-white/10 flex items-center justify-center">
        <span className="font-mono text-2xl font-bold text-white">{speedLimit}</span>
      </div>

      <div className="text-center">
        <p className="font-mono text-lg font-bold text-white">{Math.round(currentSpeed)} <span className="text-white/50 text-xs font-normal">км/ч</span></p>
        <p className={`text-[10px] font-medium uppercase tracking-wider ${statusColor}`}>{statusLabel}</p>
      </div>
    </div>
  );
}

const SpeedLimitIndicator = memo(SpeedLimitIndicatorInner);
export default SpeedLimitIndicator;
