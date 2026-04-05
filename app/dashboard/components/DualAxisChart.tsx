"use client";

import { memo, useMemo, useState } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import type { TelemetrySnapshot } from "@/types/telemetry";
import { TIME_WINDOWS } from "@/config/constants";
import { formatTimestamp } from "@/lib/formatters";

interface DualAxisChartProps {
  history: TelemetrySnapshot[];
  leftKey: keyof TelemetrySnapshot;
  rightKey: keyof TelemetrySnapshot;
  leftLabel: string;
  rightLabel: string;
  leftUnit: string;
  rightUnit: string;
  leftColor: string;
  rightColor: string;
  title: string;
  referenceLine?: { y: number; label: string; color: string };
}

function DualAxisChartInner({
  history, leftKey, rightKey, leftLabel, rightLabel, leftUnit, rightUnit, leftColor, rightColor, title, referenceLine,
}: DualAxisChartProps) {
  const [windowIdx, setWindowIdx] = useState(1);
  const window = TIME_WINDOWS[windowIdx];

  const data = useMemo(() => {
    if (history.length === 0) return [];
    const latest = history[history.length - 1].timestamp;
    const cutoff = latest - window.seconds * 1000;
    return history
      .filter((s) => s.timestamp >= cutoff)
      .map((s) => ({ ...s, time: formatTimestamp(s.timestamp) }));
  }, [history, window.seconds]);

  return (
    <div className="glass-card px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-medium text-hud-muted uppercase tracking-widest">{title}</h3>
        <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
          {TIME_WINDOWS.map((tw, i) => (
            <button
              key={tw.label}
              onClick={() => setWindowIdx(i)}
              className={`px-2 py-0.5 text-[10px] rounded-md transition-colors ${
                i === windowIdx ? "bg-white/15 text-white font-medium" : "text-hud-muted hover:text-white"
              }`}
            >
              {tw.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 9 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis yAxisId="left" tick={{ fill: leftColor, fontSize: 9 }} axisLine={false} tickLine={false} width={35} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: rightColor, fontSize: 9 }} axisLine={false} tickLine={false} width={35} />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(15,23,42,0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", fontSize: 11 }}
          />
          <Legend wrapperStyle={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }} />
          {referenceLine && (
            <ReferenceLine yAxisId="left" y={referenceLine.y} stroke={referenceLine.color} strokeDasharray="6 3" label={{ value: referenceLine.label, fill: referenceLine.color, fontSize: 9, position: "insideTopRight" }} />
          )}
          <Line yAxisId="left" type="monotone" dataKey={leftKey} stroke={leftColor} strokeWidth={2} dot={false} isAnimationActive={false} name={`${leftLabel} (${leftUnit})`} />
          <Line yAxisId="right" type="monotone" dataKey={rightKey} stroke={rightColor} strokeWidth={2} dot={false} isAnimationActive={false} name={`${rightLabel} (${rightUnit})`} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

const DualAxisChart = memo(DualAxisChartInner);
export default DualAxisChart;
