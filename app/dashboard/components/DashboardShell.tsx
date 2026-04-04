"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import ErrorBoundary from "./ErrorBoundary";
import HealthGauge from "./HealthGauge";
import SpeedGauge from "./SpeedGauge";
import SpeedCard from "./SpeedCard";
import MetricsPanel from "./MetricsPanel";
import TrendCharts, {
  TRACTION_SERIES,
  RESOURCES_SERIES,
  ENGINE_SERIES,
} from "./TrendCharts";
import AlertsPanel, { LatestAlert } from "./AlertsPanel";
import MetricCard from "./MetricCard";
import Sidebar from "./Sidebar";
import QuickMetrics from "./QuickMetrics";
import SystemStatus from "./SystemStatus";
import {
  ThermometerIcon,
  GaugeIcon,
  FuelIcon,
} from "@/components/icons/TrainIcons";
import { formatMetricValue } from "@/lib/formatters";
import HealthIndexPanel from "./HealthIndexPanel";

const RouteMap = dynamic(() => import("./RouteMap"), { ssr: false });

export default function DashboardShell() {
  const { snapshot, history, alerts, status, health } = useDashboardData();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!snapshot || !health) {
    return (
      <div className="flex items-center justify-center h-screen">
        <video
          className="fixed inset-0 z-0 h-full w-full object-cover"
          src="/background-videos/bg-train.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="fixed inset-0 z-0 bg-black/20 dark:bg-black/50" />
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="h-10 w-10 rounded-full border-2 border-white border-t-transparent animate-spin" />
          <p className="text-white/60 text-sm">Ожидание данных телеметрии...</p>
        </div>
      </div>
    );
  }

  const positionHistory = history.map((s) => s.position);

  return (
    <div className="flex min-h-screen text-white transition-colors duration-200">
      {/* Full-screen background video */}
      <video
        className="fixed inset-0 z-0 h-full w-full object-cover"
        src="/background-videos/bg-train.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="fixed inset-0 z-0 bg-black/20 dark:bg-black/50" />

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        connectionStatus={status}
        mounted={mounted}
      />

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-[72px] h-full">
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
              connectionStatus={status}
              mounted={mounted}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 relative z-10">
        {/* Floating theme toggle — top right */}
        <div className="absolute top-4 right-4 z-40">
          {mounted && (
            <button
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="flex items-center justify-center w-9 h-9 rounded-xl glass-card text-white/70 hover:text-white transition-all"
              aria-label="Переключить тему"
            >
              {resolvedTheme === "dark" ? (
                <SunIcon className="h-4 w-4" />
              ) : (
                <MoonIcon className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden absolute top-4 left-4 z-40 flex items-center justify-center w-9 h-9 rounded-xl glass-card text-white/70 hover:text-white"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Bars3Icon className="h-5 w-5" />
        </button>

        {/* Disconnected banner */}
        {status === "disconnected" && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 glass-card px-4 py-2">
            <span className="text-sm text-red-400">
              Данные устарели — переподключение...
            </span>
          </div>
        )}

        {/* ═══ OVERVIEW: HUD — left column | center open | right column ═══ */}
        {activeTab === "overview" && (
          <div className="h-screen p-4 lg:p-5 flex gap-3">
            {/* ── LEFT COLUMN ── */}
            <div className="w-[320px] shrink-0 flex flex-col gap-3">
              {/* Speed */}
              <ErrorBoundary>
                <SpeedCard
                  speed={snapshot.speed}
                  sparklineData={history.slice(-30).map((s) => s.speed)}
                />
              </ErrorBoundary>

              {/* Health Index */}
              <ErrorBoundary>
                <HealthIndexPanel health={health} />
              </ErrorBoundary>

              {/* Latest Alert */}
              <ErrorBoundary>
                <LatestAlert
                  alerts={alerts}
                  onViewAll={() => setActiveTab("monitoring")}
                />
              </ErrorBoundary>
            </div>

            {/* ── CENTER — open for train background ── */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              {/* Top center: Vehicle Data */}
              <ErrorBoundary>
                <QuickMetrics snapshot={snapshot} />
              </ErrorBoundary>

              {/* Bottom center: Route */}
              <div className="flex flex-col gap-3">
                <div className="glass-card px-5 py-3 flex items-center gap-6">
                  <MapPinIcon className="h-5 w-5 text-white/50 shrink-0" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">
                      Маршрут
                    </p>
                    <p className="text-sm font-semibold text-white">
                      Алматы → Астана
                    </p>
                  </div>
                  <div className="h-6 w-px bg-white/15" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">
                      Регион
                    </p>
                    <p className="text-sm font-medium text-white">
                      Алматинская обл.
                    </p>
                  </div>
                  <div className="h-6 w-px bg-white/15" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">
                      След. станция
                    </p>
                    <p className="text-sm font-medium text-white">Капшагай</p>
                  </div>
                  <div className="flex-1" />
                  <button
                    onClick={() => setActiveTab("context")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white/80 hover:text-white transition-colors border border-white/10 shrink-0"
                  >
                    <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                    Карта
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="w-[320px] shrink-0 flex flex-col gap-3">
              {/* System Analysis */}
              <ErrorBoundary>
                <SystemStatus breakdown={health.breakdown} />
              </ErrorBoundary>

              {/* Trend Charts */}
              <ErrorBoundary>
                <TrendCharts
                  history={history}
                  series={ENGINE_SERIES}
                  title="Тренды двигателя"
                />
              </ErrorBoundary>

              {/* Efficiency + Traction + Current row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="glass-card px-3 py-2.5 text-center">
                  <p className="text-[9px] text-white/50 uppercase tracking-widest">
                    КПД
                  </p>
                  <p className="font-mono text-xl font-bold text-white leading-none mt-1">
                    {Math.round(snapshot.efficiency)}
                    <span className="text-white/40 text-xs">%</span>
                  </p>
                </div>
                <div className="glass-card px-3 py-2.5 text-center">
                  <p className="text-[9px] text-white/50 uppercase tracking-widest">
                    Тяга
                  </p>
                  <p className="font-mono text-xl font-bold text-white leading-none mt-1">
                    {formatMetricValue(snapshot.tractionEffort, 0)}
                    <span className="text-white/40 text-xs">кН</span>
                  </p>
                </div>
                <div className="glass-card px-3 py-2.5 text-center">
                  <p className="text-[9px] text-white/50 uppercase tracking-widest">
                    Ток
                  </p>
                  <p className="font-mono text-xl font-bold text-white leading-none mt-1">
                    {formatMetricValue(snapshot.current, 0)}
                    <span className="text-white/40 text-xs">А</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ OTHER TABS ═══ */}
        {activeTab !== "overview" && (
          <div className="p-4 lg:p-5 pt-14">
            {activeTab === "traction" && (
              <div className="space-y-4">
                <ErrorBoundary>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="glass-card p-6 flex items-center justify-center">
                      <SpeedGauge speed={snapshot.speed} />
                    </div>
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <MetricCard
                        label="Скорость"
                        value={snapshot.speed}
                        unit="км/ч"
                        icon="Gauge"
                        decimals={0}
                        sparklineData={history.slice(-20).map((s) => s.speed)}
                      />
                      <MetricCard
                        label="Тяговое усилие"
                        value={snapshot.tractionEffort}
                        unit="кН"
                        icon="Activity"
                        decimals={0}
                        sparklineData={history
                          .slice(-20)
                          .map((s) => s.tractionEffort)}
                      />
                      <MetricCard
                        label="Давление тормозов"
                        value={snapshot.brakePressure}
                        unit="МПа"
                        icon="Gauge"
                        decimals={2}
                        sparklineData={history
                          .slice(-20)
                          .map((s) => s.brakePressure)}
                      />
                    </div>
                  </div>
                </ErrorBoundary>
                <ErrorBoundary>
                  <TrendCharts
                    history={history}
                    series={TRACTION_SERIES}
                    title="Тяга и движение"
                  />
                </ErrorBoundary>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="space-y-4">
                <ErrorBoundary>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                    <MetricCard
                      label="Топливо"
                      value={snapshot.fuelLevel}
                      unit="%"
                      icon="Fuel"
                      decimals={0}
                      sparklineData={history.slice(-20).map((s) => s.fuelLevel)}
                    />
                    <MetricCard
                      label="Расход топлива"
                      value={snapshot.fuelConsumption}
                      unit="л/ч"
                      icon="Fuel"
                      decimals={0}
                      sparklineData={history
                        .slice(-20)
                        .map((s) => s.fuelConsumption)}
                    />
                    <MetricCard
                      label="Напряжение"
                      value={snapshot.voltage}
                      unit="кВ"
                      icon="Zap"
                      decimals={1}
                      sparklineData={history.slice(-20).map((s) => s.voltage)}
                    />
                    <MetricCard
                      label="Ток"
                      value={snapshot.current}
                      unit="А"
                      icon="Zap"
                      decimals={0}
                      sparklineData={history.slice(-20).map((s) => s.current)}
                    />
                  </div>
                </ErrorBoundary>
                <ErrorBoundary>
                  <TrendCharts
                    history={history}
                    series={RESOURCES_SERIES}
                    title="Ресурсы"
                  />
                </ErrorBoundary>
              </div>
            )}

            {activeTab === "monitoring" && (
              <div className="space-y-4">
                <ErrorBoundary>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="glass-card p-6 flex items-center justify-center">
                      <HealthGauge score={health.score} grade={health.grade} />
                    </div>
                    <SystemStatus
                      breakdown={health.breakdown}
                      health={health}
                    />
                  </div>
                </ErrorBoundary>
                <ErrorBoundary>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                    <MetricCard
                      label="Температура двигателя"
                      value={snapshot.temperature}
                      unit="°C"
                      icon="Thermometer"
                      decimals={1}
                      sparklineData={history
                        .slice(-20)
                        .map((s) => s.temperature)}
                    />
                    <MetricCard
                      label="Температура масла"
                      value={snapshot.oilTemperature}
                      unit="°C"
                      icon="Thermometer"
                      decimals={1}
                      sparklineData={history
                        .slice(-20)
                        .map((s) => s.oilTemperature)}
                    />
                    <MetricCard
                      label="Вибрация"
                      value={snapshot.vibration}
                      unit="мм/с"
                      icon="Activity"
                      decimals={1}
                      sparklineData={history.slice(-20).map((s) => s.vibration)}
                    />
                    <MetricCard
                      label="КПД"
                      value={snapshot.efficiency}
                      unit="%"
                      icon="Gauge"
                      decimals={0}
                      sparklineData={history
                        .slice(-20)
                        .map((s) => s.efficiency)}
                    />
                  </div>
                </ErrorBoundary>
                <ErrorBoundary>
                  <TrendCharts
                    history={history}
                    series={ENGINE_SERIES}
                    title="Мониторинг узлов"
                  />
                </ErrorBoundary>
                <ErrorBoundary>
                  <AlertsPanel alerts={alerts} maxItems={50} />
                </ErrorBoundary>
              </div>
            )}

            {activeTab === "context" && (
              <div className="space-y-4">
                <ErrorBoundary>
                  <RouteMap
                    position={snapshot.position}
                    positionHistory={positionHistory}
                  />
                </ErrorBoundary>
                <ErrorBoundary>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <MetricCard
                      label="Скорость"
                      value={snapshot.speed}
                      unit="км/ч"
                      icon="Gauge"
                      decimals={0}
                    />
                    <MetricCard
                      label="КПД"
                      value={snapshot.efficiency}
                      unit="%"
                      icon="Gauge"
                      decimals={0}
                    />
                    <MetricCard
                      label="Топливо"
                      value={snapshot.fuelLevel}
                      unit="%"
                      icon="Fuel"
                      decimals={0}
                    />
                  </div>
                </ErrorBoundary>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
