"use client";

import { memo } from "react";
import type { AlertSeverity } from "@/types/telemetry";

type FilterValue = AlertSeverity | "all";

interface AlertFiltersProps {
  active: FilterValue;
  onChange: (v: FilterValue) => void;
  counts: Record<FilterValue, number>;
}

const FILTERS: { value: FilterValue; label: string; color: string }[] = [
  { value: "all", label: "Все", color: "text-white" },
  { value: "critical", label: "Критичные", color: "text-hud-danger" },
  { value: "warning", label: "Внимание", color: "text-hud-warning" },
  { value: "info", label: "Инфо", color: "text-white/70" },
];

function AlertFiltersInner({ active, onChange, counts }: AlertFiltersProps) {
  return (
    <div className="flex gap-1.5 flex-wrap" role="tablist" aria-label="Фильтр алертов">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          role="tab"
          aria-selected={active === f.value}
          onClick={() => onChange(f.value)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
            active === f.value
              ? "bg-white/15 text-white"
              : "bg-white/5 text-white/50 hover:text-white/80"
          }`}
        >
          {f.label} ({counts[f.value]})
        </button>
      ))}
    </div>
  );
}

const AlertFilters = memo(AlertFiltersInner);
export default AlertFilters;
