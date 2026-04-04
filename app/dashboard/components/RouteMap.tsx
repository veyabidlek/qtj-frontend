"use client";

import { memo, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import type { TelemetryPosition } from "@/types/telemetry";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ROUTE_WAYPOINTS: [number, number][] = [
  [43.238, 76.946], [43.35, 76.8], [43.6, 76.3], [44.0, 75.5],
  [44.5, 74.5], [45.0, 73.5], [45.5, 72.5], [46.0, 71.8],
  [46.5, 71.4], [47.0, 71.0], [47.5, 70.5], [48.0, 69.5],
  [48.5, 68.5], [49.0, 68.0], [50.0, 67.5], [51.1, 71.4],
];

function MapUpdater({ position }: { position: TelemetryPosition }) {
  const map = useMap();
  const isFirstRef = useRef(true);

  useEffect(() => {
    if (isFirstRef.current) {
      map.setView([position.lat, position.lng], 8);
      isFirstRef.current = false;
    }
  }, [map, position]);

  return null;
}

interface RouteMapProps {
  position: TelemetryPosition;
  positionHistory?: TelemetryPosition[];
}

function RouteMapInner({ position, positionHistory = [] }: RouteMapProps) {
  const trailPoints: [number, number][] = positionHistory.map((p) => [p.lat, p.lng]);

  return (
    <div className="glass-card overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-2">
        <div>
          <h3 className="text-[10px] font-medium text-hud-muted uppercase tracking-widest">Position</h3>
          <p className="font-mono text-xs text-hud-text mt-0.5">
            {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
          </p>
        </div>
      </div>
      <div className="flex-1 min-h-[150px]">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <MapUpdater position={position} />
          <Polyline
            positions={ROUTE_WAYPOINTS}
            pathOptions={{ color: "rgba(255,255,255,0.3)", weight: 3, dashArray: "8 4" }}
          />
          {trailPoints.length > 1 && (
            <Polyline
              positions={trailPoints}
              pathOptions={{ color: "#60a5fa", weight: 3 }}
            />
          )}
          <Marker position={[position.lat, position.lng]} icon={defaultIcon} />
        </MapContainer>
      </div>
    </div>
  );
}

const RouteMap = memo(RouteMapInner);
export default RouteMap;
