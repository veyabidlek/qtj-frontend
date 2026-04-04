import type { HealthGrade } from "@/types/health";

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "";
export const MOCK_MODE = !WS_URL;

export const BUFFER_FLUSH_INTERVAL = 200;
export const MAX_HISTORY_POINTS = 300;
export const MOCK_TICK_INTERVAL = 1000;

export const RECONNECT = {
  initialDelay: 1000,
  maxDelay: 30000,
  multiplier: 2,
} as const;

export const TIME_WINDOWS = [
  { label: "1 мин", seconds: 60 },
  { label: "5 мин", seconds: 300 },
  { label: "15 мин", seconds: 900 },
] as const;

export const HEALTH_WEIGHTS = {
  engine: 0.3,
  electrical: 0.25,
  brakes: 0.25,
  fuel: 0.2,
} as const;

export const HEALTH_THRESHOLDS = {
  A: 80,
  B: 60,
  C: 40,
  D: 20,
} as const;

export const HEALTH_COLORS = {
  good: "#22c55e",
  warning: "#eab308",
  danger: "#ef4444",
} as const;

export const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  tertiary: "#f59e0b",
  grid: "#e5e5ea",
} as const;

export const THRESHOLDS = {
  speed: { min: 0, max: 200, warning: 160, critical: 180 },
  temperature: { min: 0, max: 120, warning: 95, critical: 105 },
  oilTemperature: { min: 0, max: 150, warning: 110, critical: 130 },
  vibration: { min: 0, max: 10, warning: 5, critical: 7 },
  voltage: { min: 20, max: 30, warning: 22, critical: 21 },
  current: { min: 0, max: 1000, warning: 800, critical: 900 },
  fuelLevel: { min: 0, max: 100, warning: 25, critical: 10 },
  fuelConsumption: { min: 0, max: 500, warning: 350, critical: 420 },
  brakePressure: { min: 0, max: 1.0, warning: 0.3, critical: 0.15 },
  tractionEffort: { min: 0, max: 500, warning: 400, critical: 450 },
  efficiency: { min: 0, max: 100, warning: 60, critical: 40 },
} as const;

export interface MetricDefinition {
  key: string;
  label: string;
  unit: string;
  icon: string;
  decimals: number;
}

export const METRIC_DEFINITIONS: MetricDefinition[] = [
  { key: "temperature", label: "Температура", unit: "°C", icon: "Thermometer", decimals: 1 },
  { key: "vibration", label: "Вибрация", unit: "мм/с", icon: "Activity", decimals: 1 },
  { key: "voltage", label: "Напряжение", unit: "кВ", icon: "Zap", decimals: 1 },
  { key: "current", label: "Ток", unit: "А", icon: "Zap", decimals: 0 },
  { key: "fuelLevel", label: "Топливо", unit: "%", icon: "Fuel", decimals: 0 },
  { key: "brakePressure", label: "Тормоза", unit: "МПа", icon: "Gauge", decimals: 2 },
  { key: "tractionEffort", label: "Тяга", unit: "кН", icon: "Activity", decimals: 0 },
  { key: "efficiency", label: "КПД", unit: "%", icon: "Gauge", decimals: 0 },
] as const;

export function getHealthGrade(score: number): HealthGrade {
  if (score >= HEALTH_THRESHOLDS.A) return "A";
  if (score >= HEALTH_THRESHOLDS.B) return "B";
  if (score >= HEALTH_THRESHOLDS.C) return "C";
  if (score >= HEALTH_THRESHOLDS.D) return "D";
  return "E";
}

export function getHealthColor(score: number): string {
  if (score >= 80) return HEALTH_COLORS.good;
  if (score >= 50) return HEALTH_COLORS.warning;
  return HEALTH_COLORS.danger;
}
