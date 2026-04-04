"use client";

import dynamic from "next/dynamic";
import ErrorBoundary from "../ErrorBoundary";
import TripProgress from "../TripProgress";
import ElevationProfile from "../ElevationProfile";
import SpeedLimitIndicator from "../SpeedLimitIndicator";
import MetricCard from "../MetricCard";
import type { TelemetrySnapshot } from "@/types/telemetry";
import type { RouteProgress } from "../../hooks/useRouteProgress";

const RouteMap = dynamic(() => import("../RouteMap"), { ssr: false });

interface ContextTabProps {
  snapshot: TelemetrySnapshot;
  history: TelemetrySnapshot[];
  routeProgress: RouteProgress;
}

export default function ContextTab({ snapshot, history, routeProgress }: ContextTabProps) {
  const positionHistory = history.map((s) => s.position);

  return (
    <div className="space-y-4">
      {/* Row 1: Map + Trip info */}
      <ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-[55vh] min-h-[350px]">
            <RouteMap position={snapshot.position} positionHistory={positionHistory} />
          </div>
          <div className="flex flex-col gap-3">
            <TripProgress
              progressPercent={routeProgress.progressPercent}
              distanceTraveled={routeProgress.distanceTraveled}
              totalDistance={routeProgress.totalDistance}
              etaMinutes={routeProgress.etaMinutes}
              nextStation={routeProgress.nextStation}
            />
            <ElevationProfile
              progressPercent={routeProgress.progressPercent}
              totalDistance={routeProgress.totalDistance}
            />
          </div>
        </div>
      </ErrorBoundary>

      {/* Row 2: Speed limit + Metrics */}
      <ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="glass-card p-4 flex items-center justify-center">
            <SpeedLimitIndicator currentSpeed={snapshot.speed} speedLimit={routeProgress.currentSpeedLimit} />
          </div>
          <MetricCard label="Скорость" value={snapshot.speed} unit="км/ч" icon="Gauge" decimals={0} />
          <MetricCard label="КПД" value={snapshot.efficiency} unit="%" icon="Gauge" decimals={0} />
          <MetricCard label="Топливо" value={snapshot.fuelLevel} unit="%" icon="Fuel" decimals={0} />
        </div>
      </ErrorBoundary>
    </div>
  );
}
