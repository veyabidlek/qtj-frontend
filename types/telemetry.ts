export interface TelemetryPosition {
  lat: number;
  lng: number;
}

export interface TelemetrySnapshot {
  timestamp: number;
  speed: number;
  temperature: number;
  oilTemperature: number;
  vibration: number;
  voltage: number;
  current: number;
  fuelLevel: number;
  fuelConsumption: number;
  brakePressure: number;
  tractionEffort: number;
  efficiency: number;
  position: TelemetryPosition;
  trainState: "stopped" | "moving" | "approaching_station";
}

export type ConnectionStatus = "connected" | "reconnecting" | "disconnected";

export type AlertSeverity = "critical" | "warning" | "info";

export interface TelemetryAlert {
  id: string;
  timestamp: number;
  severity: AlertSeverity;
  message: string;
  parameter: string;
  value: number;
  threshold: number;
  errorCode?: string;
}
