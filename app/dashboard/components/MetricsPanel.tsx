"use client";

import { memo, useMemo } from "react";
import MetricCard from "./MetricCard";
import { METRIC_DEFINITIONS } from "@/config/constants";
import type { TelemetrySnapshot } from "@/types/telemetry";

interface MetricsPanelProps {
  snapshot: TelemetrySnapshot;
  history: TelemetrySnapshot[];
}

function MetricsPanelInner({ snapshot, history }: MetricsPanelProps) {
  const sparklines = useMemo(() => {
    const result: Record<string, number[]> = {};
    const tail = history.slice(-20);
    for (const def of METRIC_DEFINITIONS) {
      result[def.key] = tail.map((s) => s[def.key as keyof TelemetrySnapshot] as number);
    }
    return result;
  }, [history]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {METRIC_DEFINITIONS.map((def) => (
        <MetricCard
          key={def.key}
          label={def.label}
          value={snapshot[def.key as keyof TelemetrySnapshot] as number}
          unit={def.unit}
          icon={def.icon}
          decimals={def.decimals}
          sparklineData={sparklines[def.key]}
        />
      ))}
    </div>
  );
}

const MetricsPanel = memo(MetricsPanelInner);
export default MetricsPanel;
