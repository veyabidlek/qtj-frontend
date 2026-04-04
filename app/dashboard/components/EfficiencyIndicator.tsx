"use client";

import { memo } from "react";

interface EfficiencyIndicatorProps {
  efficiency: number;
}

function EfficiencyIndicatorInner({ efficiency }: EfficiencyIndicatorProps) {
  const pct = Math.max(0, Math.min(100, efficiency));
  const color = pct >= 80 ? "#22c55e" : pct >= 60 ? "#eab308" : "#ef4444";

  return (
    <div className="glass-card p-4" role="img" aria-label={`КПД: ${Math.round(efficiency)}%`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] text-white/70 uppercase tracking-widest">КПД</p>
        <span className="font-mono text-lg font-bold text-white">{Math.round(efficiency)}%</span>
      </div>

      {/* Gradient bar */}
      <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
      </div>
      {/* Marker */}
      <div className="relative h-0">
        <div
          className="absolute -top-[18px] w-3 h-5 flex flex-col items-center transition-all duration-500"
          style={{ left: `calc(${pct}% - 6px)` }}
        >
          <div className="w-3 h-3 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: color }} />
        </div>
      </div>

      {/* Scale */}
      <div className="flex justify-between mt-3 text-[9px] text-white/40 font-mono">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

const EfficiencyIndicator = memo(EfficiencyIndicatorInner);
export default EfficiencyIndicator;
