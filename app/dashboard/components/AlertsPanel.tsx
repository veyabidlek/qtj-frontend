"use client";

import { memo } from "react";
import { ExclamationTriangleIcon, ExclamationCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TelemetryAlert } from "@/types/telemetry";
import { formatTimestamp, formatMetricValue } from "@/lib/formatters";

interface AlertsPanelProps {
  alerts: TelemetryAlert[];
  maxItems?: number;
  onViewAll?: () => void;
}

const SEVERITY_CONFIG = {
  critical: {
    icon: ExclamationTriangleIcon,
    color: "text-hud-danger",
    bg: "bg-red-500/15",
  },
  warning: {
    icon: ExclamationCircleIcon,
    color: "text-hud-warning",
    bg: "bg-amber-500/15",
  },
  info: {
    icon: InformationCircleIcon,
    color: "text-white/70",
    bg: "bg-white/10",
  },
} as const;

function AlertsPanelFull({ alerts, maxItems = 20 }: AlertsPanelProps) {
  const visible = alerts.slice(0, maxItems);

  return (
    <div className="glass-card px-5 py-4 h-full flex flex-col">
      <h3 className="text-sm font-medium text-hud-muted uppercase tracking-widest mb-3">
        Все алерты
      </h3>
      <ScrollArea className="flex-1">
        {visible.length === 0 ? (
          <p className="text-hud-muted text-sm text-center py-6">Нет активных алертов</p>
        ) : (
          <div className="space-y-1 pr-3">
            {visible.map((alert) => {
              const config = SEVERITY_CONFIG[alert.severity];
              const Icon = config.icon;
              return (
                <div key={alert.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-md ${config.bg}`}>
                    <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-hud-text truncate">{alert.message}</p>
                    <p className="text-[10px] text-hud-muted">{formatTimestamp(alert.timestamp)}</p>
                  </div>
                  <span className={`text-[10px] font-mono ${config.color}`}>
                    {formatMetricValue(alert.value, 1)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function LatestAlertInner({ alerts, onViewAll }: AlertsPanelProps) {
  const latest = alerts[0];

  if (!latest) {
    return (
      <div className="glass-card px-5 py-4">
        <h3 className="text-sm font-medium text-hud-muted uppercase tracking-widest mb-2">
          Последний алерт
        </h3>
        <p className="text-hud-muted text-sm py-2">Нет активных алертов</p>
      </div>
    );
  }

  const config = SEVERITY_CONFIG[latest.severity];
  const Icon = config.icon;

  return (
    <div className="glass-card px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-hud-muted uppercase tracking-widest">
          Последний алерт
        </h3>
        {alerts.length > 1 && (
          <span className="text-[10px] text-white/30 font-mono">
            +{alerts.length - 1}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${config.bg} shrink-0`}>
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white">{latest.message}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-hud-muted">{formatTimestamp(latest.timestamp)}</span>
            <span className={`text-xs font-mono font-medium ${config.color}`}>
              {formatMetricValue(latest.value, 1)}
            </span>
          </div>
        </div>
      </div>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white transition-colors border border-white/10"
        >
          Все алерты ({alerts.length})
        </button>
      )}
    </div>
  );
}

export const LatestAlert = memo(LatestAlertInner);
export const AlertsPanel = memo(AlertsPanelFull);
export default AlertsPanel;
