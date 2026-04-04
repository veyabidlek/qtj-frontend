"use client";

import { memo } from "react";
import { WifiIcon, SignalSlashIcon } from "@heroicons/react/24/outline";
import type { ConnectionStatus as ConnectionStatusType } from "@/types/telemetry";

interface ConnectionStatusProps {
  status: ConnectionStatusType;
}

function ConnectionStatusInner({ status }: ConnectionStatusProps) {
  const config = {
    connected: {
      color: "bg-hud-success",
      icon: WifiIcon,
      label: "Подключено",
      pulse: false,
    },
    reconnecting: {
      color: "bg-hud-warning",
      icon: WifiIcon,
      label: "Переподключение...",
      pulse: true,
    },
    disconnected: {
      color: "bg-hud-danger",
      icon: SignalSlashIcon,
      label: "Отключено",
      pulse: false,
    },
  }[status];

  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`h-2.5 w-2.5 rounded-full ${config.color}`} />
        {config.pulse && (
          <div className={`absolute inset-0 h-2.5 w-2.5 rounded-full ${config.color} animate-ping`} />
        )}
      </div>
      <Icon className="h-4 w-4 text-hud-muted" />
      <span className="text-xs text-hud-muted hidden sm:inline">
        {config.label}
      </span>
    </div>
  );
}

const ConnectionStatus = memo(ConnectionStatusInner);
export default ConnectionStatus;
