"use client";

import { memo, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { HealthBreakdown } from "@/types/health";
import { getHealthColor } from "@/config/constants";

interface SystemAnalysisProps {
  breakdown: HealthBreakdown;
}

const LABELS: Record<keyof HealthBreakdown, string> = {
  engine: "Двигатель",
  electrical: "Электрика",
  brakes: "Тормоза",
  fuel: "Топливо",
};

function SystemAnalysisInner({ breakdown }: SystemAnalysisProps) {
  const data = useMemo(
    () =>
      (Object.keys(LABELS) as (keyof HealthBreakdown)[]).map((key) => ({
        name: LABELS[key],
        value: breakdown[key],
        color: getHealthColor(breakdown[key]),
      })),
    [breakdown]
  );

  return (
    <div className="glass-card p-4">
      <h3 className="text-hud-muted text-xs uppercase tracking-wider mb-3">
        Анализ систем
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: "var(--hud-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "var(--hud-muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Bar
            dataKey="value"
            radius={[0, 6, 6, 0]}
            isAnimationActive={false}
            barSize={20}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const SystemAnalysis = memo(SystemAnalysisInner);
export default SystemAnalysis;
