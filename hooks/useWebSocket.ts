"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { TelemetrySnapshot, TelemetryAlert, ConnectionStatus } from "@/types/telemetry";
import {
  WS_URL,
  BUFFER_FLUSH_INTERVAL,
  MAX_HISTORY_POINTS,
  RECONNECT,
  THRESHOLDS,
  ERROR_CODES,
} from "@/config/constants";
import { logger } from "@/lib/logger";


function checkAlerts(snapshot: TelemetrySnapshot): TelemetryAlert[] {
  const alerts: TelemetryAlert[] = [];
  const checks: { key: keyof typeof THRESHOLDS; value: number; label: string }[] = [
    { key: "temperature", value: snapshot.temperature, label: "Температура двигателя" },
    { key: "vibration", value: snapshot.vibration, label: "Вибрация" },
    { key: "voltage", value: snapshot.voltage, label: "Напряжение" },
    { key: "fuelLevel", value: snapshot.fuelLevel, label: "Уровень топлива" },
    { key: "speed", value: snapshot.speed, label: "Скорость" },
  ];

  for (const check of checks) {
    const threshold = THRESHOLDS[check.key];
    const isFuelOrVoltage = check.key === "fuelLevel" || check.key === "voltage" || check.key === "brakePressure";

    if (isFuelOrVoltage) {
      const ec = ERROR_CODES[check.key];
      if (check.value <= threshold.critical) {
        alerts.push({
          id: `${check.key}-${snapshot.timestamp}`,
          timestamp: snapshot.timestamp,
          severity: "critical",
          message: `${check.label}: критически низкое значение`,
          parameter: check.key,
          value: check.value,
          threshold: threshold.critical,
          errorCode: ec?.code,
        });
      } else if (check.value <= threshold.warning) {
        alerts.push({
          id: `${check.key}-${snapshot.timestamp}`,
          timestamp: snapshot.timestamp,
          severity: "warning",
          message: `${check.label}: требует внимания`,
          parameter: check.key,
          value: check.value,
          threshold: threshold.warning,
          errorCode: ec?.code,
        });
      }
    } else {
      const ec = ERROR_CODES[check.key];
      if (check.value >= threshold.critical) {
        alerts.push({
          id: `${check.key}-${snapshot.timestamp}`,
          timestamp: snapshot.timestamp,
          severity: "critical",
          message: `${check.label}: критически высокое значение`,
          parameter: check.key,
          value: check.value,
          threshold: threshold.critical,
          errorCode: ec?.code,
        });
      } else if (check.value >= threshold.warning) {
        alerts.push({
          id: `${check.key}-${snapshot.timestamp}`,
          timestamp: snapshot.timestamp,
          severity: "warning",
          message: `${check.label}: требует внимания`,
          parameter: check.key,
          value: check.value,
          threshold: threshold.warning,
          errorCode: ec?.code,
        });
      }
    }
  }

  return alerts;
}

export interface UseWebSocketReturn {
  snapshot: TelemetrySnapshot | null;
  history: TelemetrySnapshot[];
  alerts: TelemetryAlert[];
  status: ConnectionStatus;
  isConnected: boolean;
}

export function useWebSocket(): UseWebSocketReturn {
  const [snapshot, setSnapshot] = useState<TelemetrySnapshot | null>(null);
  const [history, setHistory] = useState<TelemetrySnapshot[]>([]);
  const [alerts, setAlerts] = useState<TelemetryAlert[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  const bufferRef = useRef<TelemetrySnapshot[]>([]);
  const historyRef = useRef<TelemetrySnapshot[]>([]);
  const lastSnapshotRef = useRef<TelemetrySnapshot | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectDelayRef = useRef<number>(RECONNECT.initialDelay);

  const processSnapshot = useCallback((data: TelemetrySnapshot) => {
    bufferRef.current.push(data);
    lastSnapshotRef.current = data;

    const newAlerts = checkAlerts(data);
    if (newAlerts.length > 0) {
      setAlerts((prev) => [...newAlerts, ...prev].slice(0, 50));
    }
  }, []);

  // Buffer flush interval
  useEffect(() => {
    const interval = setInterval(() => {
      const buffered = bufferRef.current;
      if (buffered.length === 0) return;

      bufferRef.current = [];
      const latest = buffered[buffered.length - 1];
      setSnapshot(latest);

      historyRef.current = [...historyRef.current, ...buffered].slice(-MAX_HISTORY_POINTS);
      setHistory([...historyRef.current]);
    }, BUFFER_FLUSH_INTERVAL);

    return () => clearInterval(interval);
  }, []);



  // WebSocket connection
  useEffect(() => {

    let reconnectTimeout: NodeJS.Timeout;
    let mounted = true;

    function connect() {
      if (!mounted) return;

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mounted) return;
        logger.info("WebSocket connected");
        setStatus("connected");
        reconnectDelayRef.current = RECONNECT.initialDelay;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as TelemetrySnapshot;
          if (typeof data.timestamp !== "number" || typeof data.speed !== "number") return;
          processSnapshot(data);
        } catch {
          logger.warn("Malformed WS message discarded");
        }
      };

      ws.onclose = () => {
        if (!mounted) return;
        logger.warn("WebSocket closed, reconnecting...");
        setStatus("reconnecting");
        const delay = reconnectDelayRef.current;
        reconnectDelayRef.current = Math.min(delay * RECONNECT.multiplier, RECONNECT.maxDelay);
        reconnectTimeout = setTimeout(connect, delay);
      };

      ws.onerror = (err) => {
        logger.error("WebSocket error", err);
        ws.close();
      };
    }

    connect();

    return () => {
      mounted = false;
      clearTimeout(reconnectTimeout);
      wsRef.current?.close();
    };
  }, [processSnapshot]);

  return {
    snapshot,
    history,
    alerts,
    status,
    isConnected: status === "connected",
  };
}
