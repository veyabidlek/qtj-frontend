"use client";

import ErrorBoundary from "../ErrorBoundary";
import SpeedGauge from "../SpeedGauge";
import SpeedLimitIndicator from "../SpeedLimitIndicator";
import BrakePressureGauge from "../BrakePressureGauge";
import MetricCard from "../MetricCard";
import DualAxisChart from "../DualAxisChart";
import TrendCharts, { TRACTION_SERIES } from "../TrendCharts";
import type { TelemetrySnapshot } from "@/types/telemetry";
import { CHART_COLORS } from "@/config/constants";

interface TractionTabProps {
  snapshot: TelemetrySnapshot;
  history: TelemetrySnapshot[];
  currentSpeedLimit: number;
}

export default function TractionTab({ snapshot, history, currentSpeedLimit }: TractionTabProps) {
  return (
    <div className="space-y-4">
      {/* Row 1: Gauges + Metrics */}
      <ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card p-6 flex items-center justify-center">
            <SpeedGauge speed={snapshot.speed} />
          </div>
          <div className="glass-card p-6 flex items-center justify-around">
            <SpeedLimitIndicator currentSpeed={snapshot.speed} speedLimit={currentSpeedLimit} />
            <div className="w-px h-24 bg-white/10" />
            <BrakePressureGauge pressure={snapshot.brakePressure} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <MetricCard label="Скорость" value={snapshot.speed} unit="км/ч" icon="Gauge" decimals={0} sparklineData={history.slice(-20).map((s) => s.speed)} />
            <MetricCard label="Тяговое усилие" value={snapshot.tractionEffort} unit="кН" icon="Activity" decimals={0} sparklineData={history.slice(-20).map((s) => s.tractionEffort)} />
            <MetricCard label="Давление тормозов" value={snapshot.brakePressure} unit="МПа" icon="Gauge" decimals={2} sparklineData={history.slice(-20).map((s) => s.brakePressure)} />
          </div>
        </div>
      </ErrorBoundary>

      {/* Row 2: Dual-axis chart */}
      <ErrorBoundary>
        <DualAxisChart
          history={history}
          leftKey="speed"
          rightKey="tractionEffort"
          leftLabel="Скорость"
          rightLabel="Тяга"
          leftUnit="км/ч"
          rightUnit="кН"
          leftColor={CHART_COLORS.primary}
          rightColor={CHART_COLORS.secondary}
          title="Скорость и тяговое усилие"
          referenceLine={{ y: currentSpeedLimit, label: `Лимит ${currentSpeedLimit}`, color: "#ef4444" }}
        />
      </ErrorBoundary>

      {/* Row 3: Trend chart */}
      <ErrorBoundary>
        <TrendCharts history={history} series={TRACTION_SERIES} title="Тяга и движение" />
      </ErrorBoundary>
    </div>
  );
}
