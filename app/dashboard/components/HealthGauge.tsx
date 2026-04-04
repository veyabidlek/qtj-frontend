"use client";

import { memo } from "react";
import { getHealthColor, getHealthGrade } from "@/config/constants";

interface HealthGaugeProps {
  score: number;
  grade?: string;
}

function HealthGaugeInner({ score, grade }: HealthGaugeProps) {
  const displayGrade = grade ?? getHealthGrade(score);
  const color = getHealthColor(score);

  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const startAngle = 135;
  const endAngle = 405;
  const totalAngle = endAngle - startAngle;
  const circumference = (totalAngle / 360) * 2 * Math.PI * radius;
  const filledLength = (score / 100) * circumference;
  const dashOffset = circumference - filledLength;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const startX = cx + radius * Math.cos(toRad(startAngle));
  const startY = cy + radius * Math.sin(toRad(startAngle));
  const endX = cx + radius * Math.cos(toRad(endAngle));
  const endY = cy + radius * Math.sin(toRad(endAngle));

  const largeArc = totalAngle > 180 ? 1 : 0;
  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <path
            d={arcPath}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
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
          <span className="font-mono text-4xl font-bold text-white" style={{ lineHeight: 1 }}>
            {score}
          </span>
          <span className="font-mono text-lg font-bold mt-0.5" style={{ color }}>
            / {displayGrade}
          </span>
        </div>
      </div>

      <p className="text-hud-muted text-xs uppercase tracking-widest">
        Индекс здоровья
      </p>
    </div>
  );
}

const HealthGauge = memo(HealthGaugeInner);
export default HealthGauge;
