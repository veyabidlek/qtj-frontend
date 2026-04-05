"use client";

import { useQuery } from "@tanstack/react-query";
import client from "@/lib/api";
import type { components } from "@/types/api";

// ── Re-export schema types for convenience ──
export type HealthIndex = components["schemas"]["HealthIndex"];
export type HealthBreakdown = components["schemas"]["HealthBreakdown"];
export type HealthFactor = components["schemas"]["HealthFactor"];
export type HealthCheckResponse = components["schemas"]["HealthCheckResponse"];
export type AlertListResponse = components["schemas"]["AlertListResponse"];
export type HistoryResponse = components["schemas"]["HistoryResponse"];
export type RecommendationListResponse = components["schemas"]["RecommendationListResponse"];
export type ThresholdResponse = components["schemas"]["ThresholdResponse"];
export type ThresholdListResponse = components["schemas"]["ThresholdListResponse"];
export type ScenarioInfo = components["schemas"]["ScenarioInfo"];
export type ScenarioListResponse = components["schemas"]["ScenarioListResponse"];
export type RouteSchema = components["schemas"]["RouteSchema"];
export type RouteStatusResponse = components["schemas"]["RouteStatusResponse"];
export type StationSchema = components["schemas"]["StationSchema"];

// ── Health ──

export function useHealth(refetchInterval = 5000) {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const { data, error } = await client.GET("/api/health");
      if (error) throw error;
      return data;
    },
    refetchInterval,
  });
}

// ── Alerts ──

export function useAlerts(severity?: string | null, limit = 50) {
  return useQuery({
    queryKey: ["alerts", severity, limit],
    queryFn: async () => {
      const { data, error } = await client.GET("/api/alerts", {
        params: { query: { severity, limit } },
      });
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000,
  });
}

// ── Telemetry history ──

export function useHistory(minutes = 15) {
  return useQuery({
    queryKey: ["history", minutes],
    queryFn: async () => {
      const { data, error } = await client.GET("/api/history", {
        params: { query: { minutes } },
      });
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });
}

// ── Recommendations ──

export function useRecommendations(refetchInterval = 10000) {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const { data, error } = await client.GET("/api/recommendations");
      if (error) throw error;
      return data;
    },
    refetchInterval,
  });
}

// ── Thresholds config ──

export function useThresholds() {
  return useQuery({
    queryKey: ["thresholds"],
    queryFn: async () => {
      const { data, error } = await client.GET("/api/config/thresholds");
      if (error) throw error;
      return data;
    },
  });
}

// ── Scenarios ──

export function useScenarios() {
  return useQuery({
    queryKey: ["scenarios"],
    queryFn: async () => {
      const { data, error } = await client.GET("/api/scenarios");
      if (error) throw error;
      return data;
    },
  });
}

// ── Routes ──

export function useRoutes() {
  return useQuery({
    queryKey: ["routes"],
    queryFn: async () => {
      const { data, error } = await client.GET("/api/routes");
      if (error) throw error;
      return data;
    },
  });
}

// ── Route status ──

export function useRouteStatus(refetchInterval = 3000) {
  return useQuery({
    queryKey: ["routeStatus"],
    queryFn: async () => {
      const { data, error } = await client.GET("/api/route/status");
      if (error) throw error;
      return data;
    },
    refetchInterval,
  });
}

// ── System health check ──

export function useHealthz() {
  return useQuery({
    queryKey: ["healthz"],
    queryFn: async () => {
      const { data, error } = await client.GET("/api/healthz");
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });
}
