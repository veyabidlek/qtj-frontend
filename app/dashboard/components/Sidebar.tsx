"use client";

import { memo } from "react";
import Image from "next/image";
import {
  Squares2X2Icon,
  BoltIcon,
  ChartBarIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { FuelIcon } from "@/components/icons/TrainIcons";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { ConnectionStatus as ConnectionStatusType } from "@/types/telemetry";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Обзор", icon: Squares2X2Icon },
  { id: "traction", label: "Тяга", icon: BoltIcon },
  { id: "resources", label: "Ресурсы", icon: FuelIcon },
  { id: "monitoring", label: "Мониторинг", icon: ChartBarIcon },
  { id: "context", label: "Контекст", icon: MapIcon },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  connectionStatus: ConnectionStatusType;
  mounted: boolean;
}

function SidebarInner({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col items-center w-[72px] h-screen sticky top-0 py-5 gap-6 z-20 overflow-visible">
      {/* Logo */}
      <Image
        src="/ktz.png"
        alt="КТЖ"
        width={40}
        height={40}
        className="rounded-xl"
        priority
      />

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-2 pt-4" role="tablist" aria-label="Навигация по разделам">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger
                role="tab"
                aria-selected={isActive}
                aria-label={item.label}
                onClick={() => onTabChange(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onTabChange(item.id);
                  }
                }}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none ${
                  isActive
                    ? "glass-card text-white shadow-lg"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="h-5 w-5" />
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </aside>
  );
}

const Sidebar = memo(SidebarInner);
export default Sidebar;
