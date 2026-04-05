"use client";

import { memo } from "react";
import type { HealthBreakdown, HealthIndex } from "@/types/health";
import { getHealthColor } from "@/config/constants";

interface SystemStatusProps {
  breakdown: HealthBreakdown;
  health?: HealthIndex;
}

const SYSTEMS: { key: keyof HealthBreakdown; label: string }[] = [
  { key: "engine", label: "Двигатель" },
  { key: "electrical", label: "Электрика" },
  { key: "brakes", label: "Тормоза" },
  { key: "fuel", label: "Топливо" },
];

function MiniGauge({ score }: { score: number }) {
  const color = getHealthColor(score);
  const size = 100;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 135;
  const totalAngle = 270;
  const circumference = (totalAngle / 360) * 2 * Math.PI * radius;
  const filledLength = (score / 100) * circumference;
  const dashOffset = circumference - filledLength;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const startX = cx + radius * Math.cos(toRad(startAngle));
  const startY = cy + radius * Math.sin(toRad(startAngle));
  const endX = cx + radius * Math.cos(toRad(startAngle + totalAngle));
  const endY = cy + radius * Math.sin(toRad(startAngle + totalAngle));
  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`;

  return (
    <div className="relative shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path d={arcPath} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={strokeWidth} strokeLinecap="round" />
        <path
          d={arcPath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-bold text-hud-text leading-none">{Math.round(score)}</span>
        <span className="text-[9px] text-hud-muted uppercase tracking-wider mt-0.5">индекс</span>
      </div>
    </div>
  );
}

function SystemStatusInner({ breakdown, health }: SystemStatusProps) {
  return (
    <div className="glass-card px-5 py-4">
      <h3 className="text-sm font-medium text-hud-muted uppercase tracking-widest mb-3">
        System Analysis
      </h3>
      <div className="flex gap-5 items-center">
        {health && <MiniGauge score={health.score} />}
        <div className="space-y-3 flex-1">
          {SYSTEMS.map((sys) => {
            const value = breakdown[sys.key];
            const color = getHealthColor(value);

            return (
              <div key={sys.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-hud-muted">{sys.label}</span>
                  <span className="text-xs font-mono font-medium text-hud-text">{Math.round(value)}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${value}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const SystemStatus = memo(SystemStatusInner);
export default SystemStatus;
