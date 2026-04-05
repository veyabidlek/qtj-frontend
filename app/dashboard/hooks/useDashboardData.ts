"use client";

import { useMemo } from "react";
import { useWebSocketContext } from "@/app/providers";
import { useHealth, useAlerts, useHistory } from "@/hooks/useApi";
import type { TelemetrySnapshot, TelemetryAlert } from "@/types/telemetry";
import type { HealthIndex } from "@/types/health";

export function useDashboardData() {
  const { snapshot, history: wsHistory, status, isConnected } = useWebSocketContext();

  const { data: healthData } = useHealth(3000);
  const { data: alertsData } = useAlerts(undefined, 50);
  const { data: historyData } = useHistory(5);

  // Backend health → frontend HealthIndex (camelCase aliases match)
  const health: HealthIndex | null = healthData
    ? (healthData as unknown as HealthIndex)
    : null;

  // Backend alerts → frontend TelemetryAlert[] (camelCase aliases match)
  const backendAlerts: TelemetryAlert[] = useMemo(
    () => (alertsData?.data as unknown as TelemetryAlert[]) ?? [],
    [alertsData],
  );

  // Merge backend history (for page-refresh data) with live WS snapshots.
  // Backend history provides initial data; WS history appends real-time points.
  const history: TelemetrySnapshot[] = useMemo(() => {
    const backend = (historyData?.data as unknown as TelemetrySnapshot[]) ?? [];
    if (backend.length === 0) return wsHistory;
    if (wsHistory.length === 0) return backend;

    // Find where WS history starts after backend history ends
    const lastBackendTs = backend[backend.length - 1]?.timestamp ?? 0;
    const newFromWs = wsHistory.filter((s) => s.timestamp > lastBackendTs);
    return [...backend, ...newFromWs].slice(-300);
  }, [historyData, wsHistory]);

  return {
    snapshot,
    history,
    alerts: backendAlerts,
    status,
    isConnected,
    health,
  };
}
