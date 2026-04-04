"use client";

import { memo } from "react";
import { BoltIcon, SignalIcon } from "@heroicons/react/24/outline";
import { ThermometerIcon, GaugeIcon, FuelIcon } from "@/components/icons/TrainIcons";
import { formatMetricValue } from "@/lib/formatters";
import type { TelemetrySnapshot } from "@/types/telemetry";

interface QuickMetricsProps {
  snapshot: TelemetrySnapshot;
}

const METRICS = [
  { key: "temperature" as const, label: "Температура", unit: "°C", icon: ThermometerIcon, decimals: 1 },
  { key: "vibration" as const, label: "Вибрация", unit: "мм/с", icon: SignalIcon, decimals: 1 },
  { key: "voltage" as const, label: "Напряжение", unit: "кВ", icon: BoltIcon, decimals: 1 },
  { key: "fuelLevel" as const, label: "Топливо", unit: "%", icon: FuelIcon, decimals: 0 },
  { key: "current" as const, label: "Ток", unit: "А", icon: BoltIcon, decimals: 0 },
  { key: "brakePressure" as const, label: "Тормоза", unit: "МПа", icon: GaugeIcon, decimals: 2 },
] as const;

function QuickMetricsInner({ snapshot }: QuickMetricsProps) {
  return (
    <div className="glass-card px-6 py-4">
      <h3 className="text-sm font-medium text-hud-muted uppercase tracking-widest mb-4">
        Vehicle Data
      </h3>
      <div className="grid grid-cols-3 gap-x-8 gap-y-4">
        {METRICS.map((m) => {
          const Icon = m.icon;
          const value = snapshot[m.key] as number;

          return (
            <div key={m.key} className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-hud-muted shrink-0" />
              <div>
                <p className="text-xs text-hud-muted uppercase tracking-wider">{m.label}</p>
                <p className="font-mono text-lg font-semibold text-hud-text leading-tight">
                  {formatMetricValue(value, m.decimals)}
                  <span className="text-hud-muted text-xs font-normal ml-1">{m.unit}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const QuickMetrics = memo(QuickMetricsInner);
export default QuickMetrics;
