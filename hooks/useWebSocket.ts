"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { TelemetrySnapshot, TelemetryAlert, ConnectionStatus } from "@/types/telemetry";
import {
  WS_URL,
  MOCK_MODE,
  BUFFER_FLUSH_INTERVAL,
  MAX_HISTORY_POINTS,
  MOCK_TICK_INTERVAL,
  RECONNECT,
  THRESHOLDS,
  ERROR_CODES,
} from "@/config/constants";
import { clampValue } from "@/lib/smoothing";
import { logger } from "@/lib/logger";

function generateMockSnapshot(prev: TelemetrySnapshot | null): TelemetrySnapshot {
  const now = Date.now();
  if (!prev) {
    return {
      timestamp: now,
      speed: 80,
      temperature: 72,
      oilTemperature: 85,
      vibration: 2.1,
      voltage: 25.0,
      current: 420,
      fuelLevel: 87,
      fuelConsumption: 180,
      brakePressure: 0.55,
      tractionEffort: 220,
      efficiency: 88,
      position: { lat: 43.238, lng: 76.946 },
    };
  }

  const drift = (range: number) => (Math.random() - 0.5) * range;

  const speed = clampValue(prev.speed + drift(8), 0, 200);
  const temperature = clampValue(prev.temperature + drift(2) + (speed > 120 ? 0.3 : -0.1), 40, 120);
  const oilTemperature = clampValue(prev.oilTemperature + drift(1.5), 60, 150);
  const vibration = clampValue(prev.vibration + drift(0.5), 0.5, 10);
  const voltage = clampValue(prev.voltage + drift(0.3), 20, 30);
  const current = clampValue(prev.current + drift(30), 100, 1000);
  const fuelLevel = clampValue(prev.fuelLevel - Math.random() * 0.05, 0, 100);
  const fuelConsumption = clampValue(prev.fuelConsumption + drift(15), 80, 500);
  const brakePressure = clampValue(prev.brakePressure + drift(0.03), 0.1, 1.0);
  const tractionEffort = clampValue(speed * 2.5 + drift(20), 0, 500);
  const efficiency = clampValue(prev.efficiency + drift(2), 40, 100);

  const latStep = 0.002 * (Math.random() * 0.5 + 0.5);
  const lngStep = -0.001 * (Math.random() * 0.5 + 0.5);

  return {
    timestamp: now,
    speed,
    temperature,
    oilTemperature,
    vibration,
    voltage,
    current,
    fuelLevel,
    fuelConsumption,
    brakePressure,
    tractionEffort,
    efficiency,
    position: {
      lat: prev.position.lat + latStep,
      lng: prev.position.lng + lngStep,
    },
  };
}

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
  const [status, setStatus] = useState<ConnectionStatus>(MOCK_MODE ? "connected" : "disconnected");

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

  // Mock mode
  useEffect(() => {
    if (!MOCK_MODE) return;

    const interval = setInterval(() => {
      const next = generateMockSnapshot(lastSnapshotRef.current);
      processSnapshot(next);
    }, MOCK_TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [processSnapshot]);

  // Real WebSocket mode
  useEffect(() => {
    if (MOCK_MODE) return;

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
