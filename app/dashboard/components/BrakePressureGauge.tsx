"use client";

import { memo } from "react";
import { getHealthColor } from "@/config/constants";

interface BrakePressureGaugeProps {
  pressure: number;
  maxPressure?: number;
}

function BrakePressureGaugeInner({ pressure, maxPressure = 1.0 }: BrakePressureGaugeProps) {
  const pct = Math.min(pressure / maxPressure, 1);
  const score = pct * 100;
  const color = getHealthColor(score);

  const r = 52;
  const circumHalf = Math.PI * r;
  const dashLen = pct * circumHalf;

  const ticks = [0, 0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center gap-1" role="img" aria-label={`Давление тормозов: ${pressure.toFixed(2)} МПа`}>
      <svg width={140} height={85} viewBox="0 0 140 85">
        {/* Background arc */}
        <path
          d="M 15 80 A 52 52 0 0 1 125 80"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={8}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d="M 15 80 A 52 52 0 0 1 125 80"
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${dashLen} ${circumHalf}`}
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
        {/* Tick labels */}
        {ticks.map((t) => {
          const angle = Math.PI * (1 - t);
          const x = 70 + 65 * Math.cos(angle);
          const y = 80 - 65 * Math.sin(angle);
          return (
            <text key={t} x={x} y={y} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={9} fontFamily="monospace">
              {t.toFixed(2)}
            </text>
          );
        })}
        {/* Center value */}
        <text x={70} y={65} textAnchor="middle" fill="white" fontSize={22} fontWeight="bold" fontFamily="monospace">
          {pressure.toFixed(2)}
        </text>
        <text x={70} y={80} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={10}>
          МПа
        </text>
      </svg>
      <p className="text-[10px] text-white/60 uppercase tracking-widest">Давление тормозов</p>
    </div>
  );
}

const BrakePressureGauge = memo(BrakePressureGaugeInner);
export default BrakePressureGauge;
