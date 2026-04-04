"use client";

import { memo } from "react";
import { getHealthColor, TANK_CAPACITY } from "@/config/constants";
import { formatMetricValue } from "@/lib/formatters";

interface FuelGaugeProps {
  level: number;
  consumption: number;
  speed: number;
}

function FuelGaugeInner({ level, consumption, speed }: FuelGaugeProps) {
  const color = getHealthColor(level);
  const fillPct = Math.max(0, Math.min(100, level));
  const litersRemaining = (level / 100) * TANK_CAPACITY;
  const rangeKm = consumption > 0 && speed > 5
    ? (litersRemaining / consumption) * speed
    : 0;

  return (
    <div className="glass-card p-4 flex flex-col items-center gap-3 h-full" role="img" aria-label={`Топливо: ${level.toFixed(0)}%`}>
      <p className="text-[10px] text-white/70 uppercase tracking-widest self-start">Топливо</p>

      {/* Tank visualization */}
      <div className="relative w-14 flex-1 min-h-[120px] rounded-lg border border-white/20 overflow-hidden bg-white/5">
        <div
          className="absolute bottom-0 left-0 right-0 rounded-b-md transition-all duration-700"
          style={{ height: `${fillPct}%`, backgroundColor: color, opacity: 0.7 }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-lg font-bold text-white drop-shadow-lg">{Math.round(level)}%</span>
        </div>
      </div>

      {/* Stats below */}
      <div className="text-center space-y-1 w-full">
        <div className="flex justify-between text-[10px]">
          <span className="text-white/50">Расход</span>
          <span className="font-mono text-white/90">{formatMetricValue(consumption, 0)} л/ч</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-white/50">Объём</span>
          <span className="font-mono text-white/90">{formatMetricValue(litersRemaining, 0)} л</span>
        </div>
        {rangeKm > 0 && (
          <div className="flex justify-between text-[10px]">
            <span className="text-white/50">Запас</span>
            <span className="font-mono text-hud-success">~{formatMetricValue(rangeKm, 0)} км</span>
          </div>
        )}
      </div>
    </div>
  );
}

const FuelGauge = memo(FuelGaugeInner);
export default FuelGauge;
