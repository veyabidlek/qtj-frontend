"use client";

import { memo, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { TelemetrySnapshot } from "@/types/telemetry";
import { TIME_WINDOWS, CHART_COLORS } from "@/config/constants";
import { formatTimestamp } from "@/lib/formatters";

interface ChartSeries {
  key: keyof TelemetrySnapshot;
  label: string;
  color: string;
  unit: string;
}

interface TrendChartsProps {
  history: TelemetrySnapshot[];
  series: ChartSeries[];
  title: string;
}

function TrendChartsInner({ history, series, title }: TrendChartsProps) {
  const [windowIdx, setWindowIdx] = useState(1);
  const window = TIME_WINDOWS[windowIdx];

  const filteredData = useMemo(() => {
    if (history.length === 0) return [];
    const latest = history[history.length - 1].timestamp;
    const cutoff = latest - window.seconds * 1000;
    return history
      .filter((s) => s.timestamp >= cutoff)
      .map((s) => ({
        ...s,
        time: formatTimestamp(s.timestamp),
      }));
  }, [history, window.seconds]);

  return (
    <div className="glass-card px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-medium text-hud-muted uppercase tracking-widest">
          {title}
        </h3>
        <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
          {TIME_WINDOWS.map((tw, i) => (
            <button
              key={tw.label}
              onClick={() => setWindowIdx(i)}
              className={`px-2 py-0.5 text-[10px] rounded-md transition-colors ${
                i === windowIdx
                  ? "bg-white/15 text-white font-medium"
                  : "text-hud-muted hover:text-white"
              }`}
            >
              {tw.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={filteredData}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            width={35}
            tickFormatter={(v: number) => v.toFixed(0)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15,23,42,0.9)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px",
              color: "#ffffff",
              fontSize: 11,
            }}
            formatter={(value) => Number(value).toFixed(2)}
          />
          <Legend wrapperStyle={{ fontSize: 10, color: "rgba(255,255,255,0.7)", paddingTop: 4 }} />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              name={`${s.label} (${s.unit})`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const TrendCharts = memo(TrendChartsInner);
export default TrendCharts;

export const TRACTION_SERIES: ChartSeries[] = [
  { key: "speed", label: "Скорость", color: CHART_COLORS.primary, unit: "км/ч" },
  { key: "tractionEffort", label: "Тяга", color: CHART_COLORS.secondary, unit: "кН" },
  { key: "brakePressure", label: "Тормоза", color: CHART_COLORS.tertiary, unit: "МПа" },
];

export const RESOURCES_SERIES: ChartSeries[] = [
  { key: "fuelLevel", label: "Топливо", color: CHART_COLORS.primary, unit: "%" },
  { key: "voltage", label: "Напряжение", color: CHART_COLORS.secondary, unit: "кВ" },
  { key: "current", label: "Ток", color: CHART_COLORS.tertiary, unit: "А" },
];

export const ENGINE_SERIES: ChartSeries[] = [
  { key: "temperature", label: "Температура", color: CHART_COLORS.primary, unit: "°C" },
  { key: "oilTemperature", label: "Масло", color: CHART_COLORS.secondary, unit: "°C" },
  { key: "vibration", label: "Вибрация", color: CHART_COLORS.tertiary, unit: "мм/с" },
];
