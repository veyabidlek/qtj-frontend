"use client";

import { memo } from "react";
import { BoltIcon, SignalIcon } from "@heroicons/react/24/outline";
import { ThermometerIcon, FuelIcon, GaugeIcon } from "@/components/icons/TrainIcons";
import { formatMetricValue } from "@/lib/formatters";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Thermometer: ThermometerIcon,
  Activity: SignalIcon,
  Zap: BoltIcon,
  Fuel: FuelIcon,
  Gauge: GaugeIcon,
};

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  icon: string;
  decimals: number;
  sparklineData?: number[];
}

function MetricCardInner({ label, value, unit, icon, decimals, sparklineData }: MetricCardProps) {
  const Icon = ICON_MAP[icon] ?? GaugeIcon;

  return (
    <div className="glass-card relative p-4 flex flex-col gap-2 overflow-hidden">
      {sparklineData && sparklineData.length > 1 && (
        <svg
          className="absolute bottom-0 left-0 right-0 h-10 opacity-10"
          viewBox={`0 0 ${sparklineData.length} 40`}
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            className="stroke-dashboard-accent"
            strokeWidth="1.5"
            points={sparklineData
              .map((v, i) => {
                const min = Math.min(...sparklineData);
                const max = Math.max(...sparklineData);
                const range = max - min || 1;
                const y = 38 - ((v - min) / range) * 36;
                return `${i},${y}`;
              })
              .join(" ")}
          />
        </svg>
      )}

      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10">
          <Icon className="h-3.5 w-3.5 text-hud-muted" />
        </div>
        <span className="text-hud-muted text-xs uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-bold text-hud-text">
          {formatMetricValue(value, decimals)}
        </span>
        <span className="text-hud-muted text-sm">{unit}</span>
      </div>
    </div>
  );
}

const MetricCard = memo(MetricCardInner);
export default MetricCard;
