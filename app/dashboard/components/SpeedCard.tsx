"use client";

import { memo } from "react";
import { formatMetricValue } from "@/lib/formatters";

interface SpeedCardProps {
  speed: number;
  sparklineData?: number[];
}

const MAX_SPEED = 200;
const TICKS = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200];
const START_ANGLE = 225;
const ARC_ANGLE = 270;

const toRad = (deg: number) => (deg * Math.PI) / 180;

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = toRad(angleDeg);
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToXY(cx, cy, r, startAngle);
  const end = polarToXY(cx, cy, r, endAngle);
  const sweep = startAngle - endAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${sweep} 1 ${end.x} ${end.y}`;
}

function SpeedCardInner({ speed }: SpeedCardProps) {
  const clamped = Math.min(Math.max(speed, 0), MAX_SPEED);
  const ratio = clamped / MAX_SPEED;

  const isWarning = clamped >= 160;
  const isCritical = clamped >= 180;
  const needleColor = isCritical ? "#ef4444" : isWarning ? "#f59e0b" : "#ffffff";

  const cx = 120;
  const cy = 120;
  const r = 90;

  // Needle angle: 225deg (bottom-left) → -45deg (bottom-right), counter-clockwise in math coords
  const needleAngleDeg = START_ANGLE - ratio * ARC_ANGLE;
  const needleTip = polarToXY(cx, cy, r - 16, needleAngleDeg);

  // Arcs
  const bgArc = describeArc(cx, cy, r, START_ANGLE, START_ANGLE - ARC_ANGLE);
  const fillEndAngle = START_ANGLE - ratio * ARC_ANGLE;
  const fillArc = ratio > 0.005 ? describeArc(cx, cy, r, START_ANGLE, fillEndAngle) : "";

  const fillColor = isCritical
    ? "url(#speedGradCrit)"
    : isWarning
    ? "url(#speedGradWarn)"
    : "url(#speedGradNorm)";

  return (
    <div className="glass-card px-4 py-2 flex flex-col items-center">
      <svg viewBox="0 20 240 160" className="w-full max-w-[280px]">
        <defs>
          <linearGradient id="speedGradNorm" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <linearGradient id="speedGradWarn" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="speedGradCrit" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <filter id="needleGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background arc */}
        <path d={bgArc} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" strokeLinecap="round" />

        {/* Filled arc */}
        {fillArc && (
          <path d={fillArc} fill="none" stroke={fillColor} strokeWidth="8" strokeLinecap="round" />
        )}

        {/* Ticks and labels */}
        {TICKS.map((val) => {
          const angle = START_ANGLE - (val / MAX_SPEED) * ARC_ANGLE;
          const outer = polarToXY(cx, cy, r, angle);
          const inner = polarToXY(cx, cy, r - 10, angle);
          const label = polarToXY(cx, cy, r - 24, angle);
          const isMajor = val % 40 === 0;
          const tickColor = val >= 180 ? "rgba(239,68,68,0.7)" : val >= 160 ? "rgba(245,158,11,0.6)" : "rgba(255,255,255,0.35)";

          return (
            <g key={val}>
              <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={tickColor} strokeWidth={isMajor ? 2 : 1} />
              {isMajor && (
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={val >= 180 ? "rgba(239,68,68,0.9)" : "rgba(255,255,255,0.55)"}
                  fontSize="10"
                  fontFamily="ui-monospace, monospace"
                  fontWeight="500"
                >
                  {val}
                </text>
              )}
            </g>
          );
        })}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke={needleColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#needleGlow)"
          style={{ transition: "x2 0.4s ease, y2 0.4s ease" }}
        />
        <circle cx={cx} cy={cy} r="5" fill={needleColor} style={{ transition: "fill 0.3s ease" }} />
        <circle cx={cx} cy={cy} r="2" fill="rgba(15,23,42,0.9)" />

        {/* Digital readout */}
        <text x={cx} y={cy + 30} textAnchor="middle" fill="#fff" fontSize="32" fontWeight="800" fontFamily="ui-monospace, monospace">
          {formatMetricValue(speed, 0)}
        </text>
        <text x={cx} y={cy + 46} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10">
          км/ч
        </text>
      </svg>
    </div>
  );
}

const SpeedCard = memo(SpeedCardInner);
export default SpeedCard;
