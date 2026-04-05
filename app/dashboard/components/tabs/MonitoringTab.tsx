"use client";

import { useState, useMemo } from "react";
import ErrorBoundary from "../ErrorBoundary";
import HealthGauge from "../HealthGauge";
import SystemStatus from "../SystemStatus";
import RecommendationsPanel from "../RecommendationsPanel";
import MetricCard from "../MetricCard";
import TrendCharts, { ENGINE_SERIES } from "../TrendCharts";
import AlertsPanel from "../AlertsPanel";
import AlertFilters from "../AlertFilters";
import ExportButton from "../ExportButton";
import ReplaySlider from "../ReplaySlider";
import type { TelemetrySnapshot, TelemetryAlert, AlertSeverity } from "@/types/telemetry";
import type { HealthIndex } from "@/types/health";

interface MonitoringTabProps {
  snapshot: TelemetrySnapshot;
  history: TelemetrySnapshot[];
  fullHistory: TelemetrySnapshot[];
  alerts: TelemetryAlert[];
  health: HealthIndex;
  replayTimestamp: number | null;
  onReplayChange: (ts: number | null) => void;
}

export default function MonitoringTab({ snapshot, history, fullHistory, alerts, health, replayTimestamp, onReplayChange }: MonitoringTabProps) {
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "all">("all");

  const filteredAlerts = useMemo(
    () => severityFilter === "all" ? alerts : alerts.filter((a) => a.severity === severityFilter),
    [alerts, severityFilter]
  );

  const counts = useMemo(() => ({
    all: alerts.length,
    critical: alerts.filter((a) => a.severity === "critical").length,
    warning: alerts.filter((a) => a.severity === "warning").length,
    info: alerts.filter((a) => a.severity === "info").length,
  }), [alerts]);

  return (
    <div className="space-y-4">
      {/* Row 1: Health + System + Recommendations */}
      <ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card p-6 flex items-center justify-center">
            <HealthGauge score={health.score} grade={health.grade} />
          </div>
          <SystemStatus breakdown={health.breakdown} health={health} />
          <RecommendationsPanel />
        </div>
      </ErrorBoundary>

      {/* Row 2: Metric cards */}
      <ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <MetricCard label="Температура двигателя" value={snapshot.temperature} unit="°C" icon="Thermometer" decimals={1} sparklineData={history.slice(-20).map((s) => s.temperature)} />
          <MetricCard label="Температура масла" value={snapshot.oilTemperature} unit="°C" icon="Thermometer" decimals={1} sparklineData={history.slice(-20).map((s) => s.oilTemperature)} />
          <MetricCard label="Вибрация" value={snapshot.vibration} unit="мм/с" icon="Activity" decimals={1} sparklineData={history.slice(-20).map((s) => s.vibration)} />
          <MetricCard label="КПД" value={snapshot.efficiency} unit="%" icon="Gauge" decimals={0} sparklineData={history.slice(-20).map((s) => s.efficiency)} />
        </div>
      </ErrorBoundary>

      {/* Row 3: Trend chart */}
      <ErrorBoundary>
        <TrendCharts history={history} series={ENGINE_SERIES} title="Мониторинг узлов" />
      </ErrorBoundary>

      {/* Replay slider */}
      <ReplaySlider
        history={fullHistory}
        replayTimestamp={replayTimestamp}
        onTimestampChange={onReplayChange}
      />

      {/* Row 4: Alerts */}
      <ErrorBoundary>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <AlertFilters active={severityFilter} onChange={setSeverityFilter} counts={counts} />
            <ExportButton />
          </div>
          <AlertsPanel alerts={filteredAlerts} maxItems={50} />
        </div>
      </ErrorBoundary>
    </div>
  );
}
