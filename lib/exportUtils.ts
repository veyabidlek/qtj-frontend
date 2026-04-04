import type { TelemetrySnapshot } from "@/types/telemetry";

const CSV_HEADERS = [
  "timestamp", "speed", "temperature", "oilTemperature", "vibration",
  "voltage", "current", "fuelLevel", "fuelConsumption", "brakePressure",
  "tractionEffort", "efficiency", "lat", "lng",
] as const;

export function exportCSV(history: TelemetrySnapshot[], filename = "telemetry-export"): void {
  const header = CSV_HEADERS.join(",");
  const rows = history.map((s) =>
    [
      new Date(s.timestamp).toISOString(),
      s.speed.toFixed(1),
      s.temperature.toFixed(1),
      s.oilTemperature.toFixed(1),
      s.vibration.toFixed(2),
      s.voltage.toFixed(1),
      s.current.toFixed(0),
      s.fuelLevel.toFixed(1),
      s.fuelConsumption.toFixed(0),
      s.brakePressure.toFixed(3),
      s.tractionEffort.toFixed(0),
      s.efficiency.toFixed(1),
      s.position.lat.toFixed(5),
      s.position.lng.toFixed(5),
    ].join(",")
  );

  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 19)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function printReport(): void {
  window.print();
}
