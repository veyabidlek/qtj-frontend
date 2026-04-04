"use client";

import { useMemo } from "react";
import type { TelemetryPosition } from "@/types/telemetry";
import { ROUTE_STATIONS, TOTAL_ROUTE_KM, SPEED_LIMIT_ZONES } from "@/config/constants";

function haversineKm(a: TelemetryPosition, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export interface RouteProgress {
  progressPercent: number;
  distanceTraveled: number;
  totalDistance: number;
  etaMinutes: number;
  nextStation: { name: string; distanceKm: number };
  currentSpeedLimit: number;
}

export function useRouteProgress(position: TelemetryPosition, speed: number): RouteProgress {
  return useMemo(() => {
    const distFromStart = haversineKm(ROUTE_STATIONS[0], position);
    const distanceTraveled = Math.min(distFromStart, TOTAL_ROUTE_KM);
    const progressPercent = (distanceTraveled / TOTAL_ROUTE_KM) * 100;

    const remaining = TOTAL_ROUTE_KM - distanceTraveled;
    const etaMinutes = speed > 5 ? (remaining / speed) * 60 : 0;

    let nextStation = { name: ROUTE_STATIONS[ROUTE_STATIONS.length - 1].name, distanceKm: remaining };
    for (const station of ROUTE_STATIONS) {
      if (station.km > distanceTraveled) {
        nextStation = { name: station.name, distanceKm: station.km - distanceTraveled };
        break;
      }
    }

    let currentSpeedLimit = 120;
    for (const zone of SPEED_LIMIT_ZONES) {
      if (distanceTraveled >= zone.startKm && distanceTraveled <= zone.endKm) {
        currentSpeedLimit = zone.limit;
        break;
      }
    }

    return { progressPercent, distanceTraveled, totalDistance: TOTAL_ROUTE_KM, etaMinutes, nextStation, currentSpeedLimit };
  }, [position, speed]);
}
