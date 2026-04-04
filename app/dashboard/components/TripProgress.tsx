"use client";

import { memo } from "react";
import { ROUTE_STATIONS } from "@/config/constants";
import { formatMetricValue } from "@/lib/formatters";

interface TripProgressProps {
  progressPercent: number;
  distanceTraveled: number;
  totalDistance: number;
  etaMinutes: number;
  nextStation: { name: string; distanceKm: number };
}

function TripProgressInner({ progressPercent, distanceTraveled, totalDistance, etaMinutes, nextStation }: TripProgressProps) {
  const etaHours = Math.floor(etaMinutes / 60);
  const etaMins = Math.round(etaMinutes % 60);

  return (
    <div className="glass-card p-4" role="region" aria-label="Прогресс маршрута">
      <p className="text-[10px] text-white/70 uppercase tracking-widest mb-3">Маршрут</p>

      {/* Progress bar with station dots */}
      <div className="relative mb-3">
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-hud-success transition-all duration-700"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
        {/* Station dots */}
        <div className="absolute inset-x-0 -top-1">
          {ROUTE_STATIONS.map((s) => {
            const pct = (s.km / totalDistance) * 100;
            const passed = pct <= progressPercent;
            return (
              <div
                key={s.name}
                className="absolute -translate-x-1/2"
                style={{ left: `${pct}%` }}
                title={s.name}
              >
                <div className={`w-3 h-3 rounded-full border-2 ${
                  passed ? "bg-hud-success border-hud-success" : "bg-white/20 border-white/30"
                }`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Station labels - first and last */}
      <div className="flex justify-between text-[9px] text-white/50 mb-3">
        <span>{ROUTE_STATIONS[0].name}</span>
        <span>{ROUTE_STATIONS[ROUTE_STATIONS.length - 1].name}</span>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-white/60">Пройдено</span>
          <span className="font-mono text-white">{formatMetricValue(distanceTraveled, 0)} из {totalDistance} км</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/60">След. станция</span>
          <span className="font-mono text-white">{nextStation.name} <span className="text-white/40">(~{formatMetricValue(nextStation.distanceKm, 0)} км)</span></span>
        </div>
        {etaMinutes > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-white/60">Прибытие через</span>
            <span className="font-mono text-hud-success">
              ~{etaHours > 0 ? `${etaHours} ч ` : ""}{etaMins} мин
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const TripProgress = memo(TripProgressInner);
export default TripProgress;
