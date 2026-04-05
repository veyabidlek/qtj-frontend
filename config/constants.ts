import type { HealthGrade } from "@/types/health";

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "";

export const BUFFER_FLUSH_INTERVAL = 200;
export const MAX_HISTORY_POINTS = 300;

export const RECONNECT = {
  initialDelay: 1000,
  maxDelay: 30000,
  multiplier: 2,
} as const;

// Simulator runs 1:1 real-time. Default route ~3 min, alternate ~5 min.
export const TIME_WINDOWS = [
  { label: "1 мин", seconds: 60 },
  { label: "3 мин", seconds: 180 },
  { label: "5 мин", seconds: 300 },
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

/* ── Route & geography ── */

export interface RouteStation {
  name: string;
  lat: number;
  lng: number;
  km: number;
}

export const ROUTE_STATIONS: RouteStation[] = [
  { name: "Алматы-1", lat: 43.238, lng: 76.946, km: 0 },
  { name: "Капшагай", lat: 43.88, lng: 77.07, km: 80 },
  { name: "Талдыкорган", lat: 45.02, lng: 78.38, km: 270 },
  { name: "Сарышаган", lat: 46.12, lng: 73.62, km: 480 },
  { name: "Балхаш", lat: 46.85, lng: 74.98, km: 590 },
  { name: "Караганда", lat: 49.80, lng: 73.10, km: 900 },
  { name: "Астана", lat: 51.13, lng: 71.43, km: 1300 },
] as const;

export const TOTAL_ROUTE_KM = 1300;

export interface SpeedZone {
  startKm: number;
  endKm: number;
  limit: number;
}

export const SPEED_LIMIT_ZONES: SpeedZone[] = [
  { startKm: 0, endKm: 15, limit: 60 },
  { startKm: 70, endKm: 90, limit: 80 },
  { startKm: 265, endKm: 275, limit: 60 },
  { startKm: 580, endKm: 600, limit: 80 },
  { startKm: 890, endKm: 910, limit: 60 },
  { startKm: 1285, endKm: 1300, limit: 40 },
] as const;

export const TANK_CAPACITY = 6000; // liters

export const ERROR_CODES: Record<string, { code: string; description: string }> = {
  temperature: { code: "E-101", description: "Перегрев двигателя" },
  oilTemperature: { code: "E-102", description: "Перегрев масла" },
  vibration: { code: "E-201", description: "Критическая вибрация" },
  voltage: { code: "E-301", description: "Отклонение напряжения" },
  current: { code: "E-302", description: "Перегрузка по току" },
  fuelLevel: { code: "E-401", description: "Низкий уровень топлива" },
  fuelConsumption: { code: "E-402", description: "Аномальный расход" },
  brakePressure: { code: "E-501", description: "Низкое давление тормозов" },
  speed: { code: "E-601", description: "Превышение скорости" },
  tractionEffort: { code: "E-701", description: "Перегрузка тяги" },
  efficiency: { code: "E-801", description: "Низкий КПД" },
};

export interface ElevationPoint {
  km: number;
  elevation: number;
  label?: string;
}

export const ELEVATION_PROFILE: ElevationPoint[] = [
  { km: 0, elevation: 700, label: "Алматы" },
  { km: 40, elevation: 780 },
  { km: 80, elevation: 450, label: "Капшагай" },
  { km: 150, elevation: 520 },
  { km: 270, elevation: 600, label: "Талдыкорган" },
  { km: 350, elevation: 480 },
  { km: 480, elevation: 370, label: "Сарышаган" },
  { km: 590, elevation: 350, label: "Балхаш" },
  { km: 700, elevation: 400 },
  { km: 800, elevation: 450 },
  { km: 900, elevation: 550, label: "Караганда" },
  { km: 1000, elevation: 500 },
  { km: 1100, elevation: 470 },
  { km: 1200, elevation: 430 },
  { km: 1300, elevation: 350, label: "Астана" },
];
