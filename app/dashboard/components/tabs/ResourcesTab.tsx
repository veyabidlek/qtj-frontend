"use client";

import ErrorBoundary from "../ErrorBoundary";
import FuelGauge from "../FuelGauge";
import MetricCard from "../MetricCard";
import EfficiencyIndicator from "../EfficiencyIndicator";
import PowerDistribution from "../PowerDistribution";
import DualAxisChart from "../DualAxisChart";
import TrendCharts, { RESOURCES_SERIES } from "../TrendCharts";
import type { TelemetrySnapshot } from "@/types/telemetry";
import { CHART_COLORS } from "@/config/constants";

interface ResourcesTabProps {
  snapshot: TelemetrySnapshot;
  history: TelemetrySnapshot[];
}

export default function ResourcesTab({ snapshot, history }: ResourcesTabProps) {
  return (
    <div className="space-y-4">
      {/* Row 1: Fuel gauge + Metric cards + Efficiency/Power */}
      <ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <FuelGauge level={snapshot.fuelLevel} consumption={snapshot.fuelConsumption} speed={snapshot.speed} />
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            <MetricCard label="Топливо" value={snapshot.fuelLevel} unit="%" icon="Fuel" decimals={0} sparklineData={history.slice(-20).map((s) => s.fuelLevel)} />
            <MetricCard label="Расход топлива" value={snapshot.fuelConsumption} unit="л/ч" icon="Fuel" decimals={0} sparklineData={history.slice(-20).map((s) => s.fuelConsumption)} />
            <MetricCard label="Напряжение" value={snapshot.voltage} unit="кВ" icon="Zap" decimals={1} sparklineData={history.slice(-20).map((s) => s.voltage)} />
            <MetricCard label="Ток" value={snapshot.current} unit="А" icon="Zap" decimals={0} sparklineData={history.slice(-20).map((s) => s.current)} />
          </div>
          <div className="flex flex-col gap-3">
            <EfficiencyIndicator efficiency={snapshot.efficiency} />
            <PowerDistribution voltage={snapshot.voltage} current={snapshot.current} efficiency={snapshot.efficiency} />
          </div>
        </div>
      </ErrorBoundary>

      {/* Row 2: Charts */}
      <ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DualAxisChart
            history={history}
            leftKey="voltage"
            rightKey="current"
            leftLabel="Напряжение"
            rightLabel="Ток"
            leftUnit="кВ"
            rightUnit="А"
            leftColor={CHART_COLORS.primary}
            rightColor={CHART_COLORS.tertiary}
            title="Напряжение и ток"
          />
          <TrendCharts history={history} series={RESOURCES_SERIES} title="Ресурсы" />
        </div>
      </ErrorBoundary>
    </div>
  );
}
