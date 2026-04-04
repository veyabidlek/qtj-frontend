"use client";

import { memo, useMemo } from "react";
import { ShieldExclamationIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import type { TelemetrySnapshot } from "@/types/telemetry";
import type { HealthIndex } from "@/types/health";
import { getRecommendations } from "@/lib/recommendations";

interface RecommendationsPanelProps {
  snapshot: TelemetrySnapshot;
  health: HealthIndex;
}

const PRIORITY_CONFIG = {
  high: { icon: ShieldExclamationIcon, color: "text-hud-danger", bg: "bg-red-500/15", label: "Высокий" },
  medium: { icon: ExclamationTriangleIcon, color: "text-hud-warning", bg: "bg-amber-500/15", label: "Средний" },
  low: { icon: InformationCircleIcon, color: "text-white/70", bg: "bg-white/10", label: "Низкий" },
} as const;

function RecommendationsPanelInner({ snapshot, health }: RecommendationsPanelProps) {
  const recommendations = useMemo(
    () => getRecommendations(snapshot, health).slice(0, 5),
    [snapshot, health]
  );

  return (
    <div className="glass-card px-5 py-4 h-full flex flex-col">
      <h3 className="text-sm font-medium text-hud-muted uppercase tracking-widest mb-3">
        Рекомендации
      </h3>
      {recommendations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-hud-muted text-sm">Нет рекомендаций — все в норме</p>
        </div>
      ) : (
        <div className="space-y-2 flex-1 overflow-y-auto">
          {recommendations.map((rec) => {
            const cfg = PRIORITY_CONFIG[rec.priority];
            const Icon = cfg.icon;
            return (
              <div key={rec.id} className="flex gap-2.5 p-2.5 rounded-lg bg-white/5">
                <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${cfg.bg} shrink-0`}>
                  <Icon className={`h-4 w-4 ${cfg.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-white truncate">{rec.title}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color} shrink-0`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/50 mt-0.5 line-clamp-2">{rec.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const RecommendationsPanel = memo(RecommendationsPanelInner);
export default RecommendationsPanel;
