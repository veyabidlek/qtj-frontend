"use client";

import { memo } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import type { HealthIndex } from "@/types/health";
import { getHealthColor, HEALTH_WEIGHTS } from "@/config/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HealthIndexPanelProps {
  health: HealthIndex;
}

const SYSTEM_LABELS: Record<string, string> = {
  engine: "Двигатель",
  electrical: "Электрика",
  brakes: "Тормоза",
  fuel: "Топливо",
};

const WEIGHT_PERCENT: Record<string, number> = {
  engine: HEALTH_WEIGHTS.engine * 100,
  electrical: HEALTH_WEIGHTS.electrical * 100,
  brakes: HEALTH_WEIGHTS.brakes * 100,
  fuel: HEALTH_WEIGHTS.fuel * 100,
};

function getStatusLabel(score: number): string {
  if (score >= 80) return "Норма";
  if (score >= 50) return "Внимание";
  return "Критично";
}

function getStatusColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

function HealthIndexPanelInner({ health }: HealthIndexPanelProps) {
  const color = getHealthColor(health.score);

  return (
    <div className="glass-card px-4 xl:px-5 py-3 xl:py-4 flex-1 min-h-0 overflow-y-auto">
      <div className="flex items-center justify-between mb-2 xl:mb-4">
        <h3 className="text-xs xl:text-sm font-medium text-white/80 uppercase tracking-widest">
          Индекс здоровья
        </h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-white/30 hover:text-white/60 transition-colors cursor-pointer">
                <InformationCircleIcon className="h-4 w-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs text-xs leading-relaxed">
              Формула: Σ(вес × оценка подсистемы) − штраф за алерты. Веса: двигатель 30%, электрика 25%, тормоза 25%, топливо 20%.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Score + Grade */}
      <div className="flex items-center gap-4 xl:gap-5 mb-2 xl:mb-4">
        {/* Gauge */}
        <div className="relative shrink-0">
          <svg className="w-[70px] h-[70px] xl:w-[90px] xl:h-[90px]" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={7} />
            <circle
              cx="45" cy="45" r="36" fill="none"
              stroke={color}
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray={`${(health.score / 100) * 226} 226`}
              transform="rotate(-90 45 45)"
              style={{ transition: "stroke-dasharray 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-bold text-white leading-none">{Math.round(health.score)}</span>
            <span className="font-mono text-sm font-bold mt-0.5" style={{ color }}>
              {health.grade}
            </span>
          </div>
        </div>

        {/* Status + category */}
        <div className="flex-1">
          <p className={`text-lg font-semibold ${getStatusColor(health.score)}`}>
            {getStatusLabel(health.score)}
          </p>
          <p className="text-xs text-white/70 mt-1">
            Интегральный показатель состояния локомотива на основе взвешенных параметров подсистем
          </p>
        </div>
      </div>

      {/* Breakdown with weights */}
      <div className="space-y-1.5 xl:space-y-2.5 mb-2 xl:mb-4">
        {(Object.keys(SYSTEM_LABELS) as (keyof typeof SYSTEM_LABELS)[]).map((key) => {
          const value = health.breakdown[key as keyof typeof health.breakdown];
          const barColor = getHealthColor(value);
          const weight = WEIGHT_PERCENT[key];

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/90">{SYSTEM_LABELS[key]}</span>
                  <span className="text-[10px] text-white/50 font-mono">({weight}%)</span>
                </div>
                <span className="text-xs font-mono font-medium text-white">{Math.round(value)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${value}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top factors */}
      {health.topFactors.length > 0 && (
        <div>
          <p className="text-xs text-white/70 uppercase tracking-wider mb-2">Ключевые факторы</p>
          <div className="space-y-1.5">
            {health.topFactors.slice(0, 3).map((factor, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5">
                <span className="text-xs text-white/90">{factor.parameter}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium ${
                    factor.status === "normal" ? "text-green-400" :
                    factor.status === "warning" ? "text-amber-400" : "text-red-400"
                  }`}>
                    {factor.status === "normal" ? "Норма" :
                     factor.status === "warning" ? "Внимание" : "Критично"}
                  </span>
                  <span className="text-[10px] font-mono text-white/60">
                    {factor.impact > 0 ? "−" : "+"}{Math.abs(factor.impact).toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

const HealthIndexPanel = memo(HealthIndexPanelInner);
export default HealthIndexPanel;
