"use client";

import { useMemo } from "react";
import { useRouteStatus } from "@/hooks/useApi";
import { TOTAL_ROUTE_KM, SPEED_LIMIT_ZONES, ROUTE_STATIONS } from "@/config/constants";

export interface RouteProgress {
  progressPercent: number;
  distanceTraveled: number;
  totalDistance: number;
  etaMinutes: number;
  currentStation: string;
  nextStation: { name: string; distanceKm: number };
  currentSpeedLimit: number;
}

export function useRouteProgress(speed: number): RouteProgress {
  const { data: routeStatus } = useRouteStatus(3000);

  return useMemo(() => {
    const progressRaw = routeStatus?.progress ?? 0;
    const progressPercent = Math.round(progressRaw * 100);
    const distanceTraveled = progressRaw * TOTAL_ROUTE_KM;

    const remaining = TOTAL_ROUTE_KM - distanceTraveled;
    const etaMinutes = speed > 5 ? (remaining / speed) * 60 : 0;

    const currentStation = routeStatus?.current_station ?? ROUTE_STATIONS[0].name;
    // null means route completed — fall back to current station
    const nextStationName = routeStatus?.next_station ?? currentStation;
    const nextStationData = ROUTE_STATIONS.find((s) => s.name === nextStationName);
    const nextStationDistanceKm = nextStationData
      ? Math.max(0, nextStationData.km - distanceTraveled)
      : remaining;

    let currentSpeedLimit = 120;
    for (const zone of SPEED_LIMIT_ZONES) {
      if (distanceTraveled >= zone.startKm && distanceTraveled <= zone.endKm) {
        currentSpeedLimit = zone.limit;
        break;
      }
    }

    return {
      progressPercent,
      distanceTraveled,
      totalDistance: TOTAL_ROUTE_KM,
      etaMinutes,
      currentStation,
      nextStation: { name: nextStationName, distanceKm: nextStationDistanceKm },
      currentSpeedLimit,
    };
  }, [routeStatus, speed]);
}
