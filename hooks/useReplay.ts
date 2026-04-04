"use client";

import { useState, useMemo } from "react";
import type { TelemetrySnapshot, TelemetryAlert } from "@/types/telemetry";

export interface UseReplayReturn {
  isReplaying: boolean;
  replayTimestamp: number | null;
  setReplayTimestamp: (ts: number | null) => void;
  effectiveSnapshot: TelemetrySnapshot | null;
  effectiveHistory: TelemetrySnapshot[];
  effectiveAlerts: TelemetryAlert[];
}

export function useReplay(
  history: TelemetrySnapshot[],
  snapshot: TelemetrySnapshot | null,
  alerts: TelemetryAlert[],
): UseReplayReturn {
  const [replayTimestamp, setReplayTimestamp] = useState<number | null>(null);

  const isReplaying = replayTimestamp !== null;

  const effectiveSnapshot = useMemo(() => {
    if (!isReplaying || history.length === 0) return snapshot;
    let closest = history[0];
    for (const s of history) {
      if (Math.abs(s.timestamp - replayTimestamp) < Math.abs(closest.timestamp - replayTimestamp)) {
        closest = s;
      }
    }
    return closest;
  }, [isReplaying, replayTimestamp, history, snapshot]);

  const effectiveHistory = useMemo(() => {
    if (!isReplaying) return history;
    return history.filter((s) => s.timestamp <= replayTimestamp);
  }, [isReplaying, replayTimestamp, history]);

  const effectiveAlerts = useMemo(() => {
    if (!isReplaying) return alerts;
    return alerts.filter((a) => a.timestamp <= replayTimestamp);
  }, [isReplaying, replayTimestamp, alerts]);

  return {
    isReplaying,
    replayTimestamp,
    setReplayTimestamp,
    effectiveSnapshot,
    effectiveHistory,
    effectiveAlerts,
  };
}
