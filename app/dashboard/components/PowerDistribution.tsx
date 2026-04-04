"use client";

import { memo, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatMetricValue } from "@/lib/formatters";

interface PowerDistributionProps {
  voltage: number;
  current: number;
  efficiency: number;
}

const COLORS = ["#3b82f6", "#8b5cf6", "#ef4444"];

function PowerDistributionInner({ voltage, current, efficiency }: PowerDistributionProps) {
  const totalPower = (voltage * current) / 1000;

  const data = useMemo(() => {
    const tractionPct = efficiency * 0.9;
    const auxPct = 100 - efficiency - (100 - efficiency) * 0.4;
    const lossPct = 100 - tractionPct - Math.max(auxPct, 5);
    return [
      { name: "Тяга", value: Math.max(tractionPct, 1) },
      { name: "Вспомогат.", value: Math.max(100 - efficiency, 5) },
      { name: "Потери", value: Math.max(lossPct, 1) },
    ];
  }, [efficiency]);

  return (
    <div className="glass-card p-4" role="img" aria-label={`Мощность: ${formatMetricValue(totalPower, 0)} кВт`}>
      <p className="text-[10px] text-white/70 uppercase tracking-widest mb-2">Распределение мощности</p>
      <div className="relative">
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={58}
              paddingAngle={3}
              dataKey="value"
              isAnimationActive={false}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono text-xl font-bold text-white">{formatMetricValue(totalPower, 0)}</span>
          <span className="text-[9px] text-white/50">кВт</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex justify-center gap-3 mt-1">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
            <span className="text-[9px] text-white/60">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const PowerDistribution = memo(PowerDistributionInner);
export default PowerDistribution;
