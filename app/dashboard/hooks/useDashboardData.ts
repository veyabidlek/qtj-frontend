"use client";

import { useMemo } from "react";
import { useWebSocketContext } from "@/app/providers";
import type { HealthIndex, HealthBreakdown, HealthFactor } from "@/types/health";
import { THRESHOLDS, HEALTH_WEIGHTS, getHealthGrade } from "@/config/constants";

function scoreParam(value: number, min: number, max: number, warning: number, critical: number, invert: boolean): number {
  if (invert) {
    if (value <= critical) return 10;
    if (value <= warning) return 40 + ((value - critical) / (warning - critical)) * 30;
    return 70 + ((value - warning) / (max - warning)) * 30;
  }
  if (value >= critical) return 10;
  if (value >= warning) return 40 + ((critical - value) / (critical - warning)) * 30;
  return 70 + ((warning - value) / (warning - min)) * 30;
}

function computeHealth(snapshot: {
  temperature: number;
  oilTemperature: number;
  vibration: number;
  voltage: number;
  current: number;
  fuelLevel: number;
  brakePressure: number;
  efficiency: number;
}): HealthIndex {
  const engineTemp = scoreParam(snapshot.temperature, 0, 120, 95, 105, false);
  const oilTemp = scoreParam(snapshot.oilTemperature, 0, 150, 110, 130, false);
  const vib = scoreParam(snapshot.vibration, 0, 10, 5, 7, false);
  const engineScore = (engineTemp + oilTemp + vib) / 3;

  const volt = scoreParam(snapshot.voltage, 20, 30, 22, 21, true);
  const curr = scoreParam(snapshot.current, 0, 1000, 800, 900, false);
  const eff = scoreParam(100 - snapshot.efficiency, 0, 100, 40, 60, false);
  const electricalScore = (volt + curr + eff) / 3;

  const brake = scoreParam(1 - snapshot.brakePressure, 0, 1, 0.7, 0.85, false);
  const brakesScore = brake;

  const fuel = scoreParam(100 - snapshot.fuelLevel, 0, 100, 75, 90, false);
  const fuelScore = fuel;

  const breakdown: HealthBreakdown = {
    engine: Math.round(engineScore),
    electrical: Math.round(electricalScore),
    brakes: Math.round(brakesScore),
    fuel: Math.round(fuelScore),
  };

  const score = Math.round(
    breakdown.engine * HEALTH_WEIGHTS.engine +
    breakdown.electrical * HEALTH_WEIGHTS.electrical +
    breakdown.brakes * HEALTH_WEIGHTS.brakes +
    breakdown.fuel * HEALTH_WEIGHTS.fuel
  );

  const factors: HealthFactor[] = [
    { parameter: "Двигатель", impact: breakdown.engine, status: breakdown.engine >= 80 ? "Норма" : breakdown.engine >= 50 ? "Внимание" : "Критично" },
    { parameter: "Электрика", impact: breakdown.electrical, status: breakdown.electrical >= 80 ? "Норма" : breakdown.electrical >= 50 ? "Внимание" : "Критично" },
    { parameter: "Тормоза", impact: breakdown.brakes, status: breakdown.brakes >= 80 ? "Норма" : breakdown.brakes >= 50 ? "Внимание" : "Критично" },
    { parameter: "Топливо", impact: breakdown.fuel, status: breakdown.fuel >= 80 ? "Норма" : breakdown.fuel >= 50 ? "Внимание" : "Критично" },
  ].sort((a, b) => a.impact - b.impact);

  return {
    score,
    grade: getHealthGrade(score),
    breakdown,
    topFactors: factors,
  };
}

export function useDashboardData() {
  const { snapshot, history, alerts, status, isConnected } = useWebSocketContext();

  const health = useMemo(() => {
    if (!snapshot) return null;
    return computeHealth(snapshot);
  }, [snapshot]);

  return {
    snapshot,
    history,
    alerts,
    status,
    isConnected,
    health,
  };
}
