"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { TelemetrySnapshot, ConnectionStatus } from "@/types/telemetry";
import {
  WS_URL,
  BUFFER_FLUSH_INTERVAL,
  MAX_HISTORY_POINTS,
  RECONNECT,
} from "@/config/constants";
import { logger } from "@/lib/logger";

export interface UseWebSocketReturn {
  snapshot: TelemetrySnapshot | null;
  history: TelemetrySnapshot[];
  status: ConnectionStatus;
  isConnected: boolean;
}

export function useWebSocket(): UseWebSocketReturn {
  const [snapshot, setSnapshot] = useState<TelemetrySnapshot | null>(null);
  const [history, setHistory] = useState<TelemetrySnapshot[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  const bufferRef = useRef<TelemetrySnapshot[]>([]);
  const historyRef = useRef<TelemetrySnapshot[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectDelayRef = useRef<number>(RECONNECT.initialDelay);

  const processSnapshot = useCallback((data: TelemetrySnapshot) => {
    bufferRef.current.push(data);
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

      // Build absolute WS URL from relative path (for Next.js rewrites proxy)
      let wsUrl = WS_URL;
      if (wsUrl.startsWith("/")) {
        const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
        wsUrl = `${proto}//${window.location.host}${wsUrl}`;
      }
      const ws = new WebSocket(wsUrl);
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
    status,
    isConnected: status === "connected",
  };
}
