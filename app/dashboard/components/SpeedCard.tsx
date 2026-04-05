"use client";

import { memo } from "react";
import { formatMetricValue } from "@/lib/formatters";

interface SpeedCardProps {
  speed: number;
  sparklineData?: number[];
}

function SpeedCardInner({ speed, sparklineData }: SpeedCardProps) {
  return (
    <div className="glass-card p-3 xl:p-6 flex flex-col justify-between min-w-[200px]">
      <p className="text-sm font-medium text-hud-muted uppercase tracking-widest">Speed</p>
      <div className="mt-2 xl:mt-3">
        <span className="font-mono text-5xl xl:text-7xl font-bold text-hud-text leading-none">
          {formatMetricValue(speed, 0)}
        </span>
        <span className="text-hud-muted text-xl xl:text-2xl font-light ml-2">км/ч</span>
      </div>
      {sparklineData && sparklineData.length > 1 && (
        <svg
          className="mt-2 xl:mt-4 w-full h-8 xl:h-10 opacity-50"
          viewBox={`0 0 ${sparklineData.length} 32`}
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
            points={sparklineData
              .map((v, i) => {
                const min = Math.min(...sparklineData);
                const max = Math.max(...sparklineData);
                const range = max - min || 1;
                const y = 30 - ((v - min) / range) * 28;
                return `${i},${y}`;
              })
              .join(" ")}
          />
        </svg>
      )}
    </div>
  );
}

const SpeedCard = memo(SpeedCardInner);
export default SpeedCard;
