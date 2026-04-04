"use client";

import { memo } from "react";

interface SpeedGaugeProps {
  speed: number;
  maxSpeed?: number;
}

function SpeedGaugeInner({ speed, maxSpeed = 200 }: SpeedGaugeProps) {
  const size = 220;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const startAngle = 135;
  const endAngle = 405;
  const totalAngle = 270;
  const circumference = (totalAngle / 360) * 2 * Math.PI * radius;

  const clampedSpeed = Math.min(speed, maxSpeed);
  const fraction = clampedSpeed / maxSpeed;
  const filledLength = fraction * circumference;
  const dashOffset = circumference - filledLength;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const startX = cx + radius * Math.cos(toRad(startAngle));
  const startY = cy + radius * Math.sin(toRad(startAngle));
  const endX = cx + radius * Math.cos(toRad(endAngle));
  const endY = cy + radius * Math.sin(toRad(endAngle));
  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`;

  const ticks = [];
  for (let i = 0; i <= 10; i++) {
    const angle = startAngle + (totalAngle * i) / 10;
    const rad = toRad(angle);
    const outerR = radius + strokeWidth / 2 + 2;
    const innerR = radius + strokeWidth / 2 - 6;
    ticks.push({
      x1: cx + outerR * Math.cos(rad),
      y1: cy + outerR * Math.sin(rad),
      x2: cx + innerR * Math.cos(rad),
      y2: cy + innerR * Math.sin(rad),
    });
  }

  const needleAngle = startAngle + totalAngle * fraction;
  const needleLength = radius - 20;
  const needleRad = toRad(needleAngle);
  const needleX = cx + needleLength * Math.cos(needleRad);
  const needleY = cy + needleLength * Math.sin(needleRad);

  const speedColor = fraction > 0.9 ? "#ef4444" : fraction > 0.8 ? "#f59e0b" : "var(--db-accent)";

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ filter: `drop-shadow(0 0 15px var(--db-glow))` }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <path
            d={arcPath}
            fill="none"
            className="stroke-white/12"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path
            d={arcPath}
            fill="none"
            stroke={speedColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.4s ease" }}
          />

          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              className="stroke-white/30"
              strokeWidth={i % 5 === 0 ? 2 : 1}
            />
          ))}

          <line
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            className="stroke-white"
            strokeWidth={2.5}
            strokeLinecap="round"
            style={{ transition: "x2 0.4s ease, y2 0.4s ease" }}
          />
          <circle cx={cx} cy={cy} r={6} className="fill-white" />
          <circle cx={cx} cy={cy} r={3} className="fill-black/50" />
        </svg>
      </div>

      <div className="flex flex-col items-center -mt-4">
        <span className="font-mono text-4xl font-bold text-white">
          {Math.round(speed)}
        </span>
        <span className="text-white/60 text-sm uppercase tracking-wider">
          км/ч
        </span>
      </div>
    </div>
  );
}

const SpeedGauge = memo(SpeedGaugeInner);
export default SpeedGauge;
