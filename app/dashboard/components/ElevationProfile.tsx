"use client";

import { memo } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";
import { ELEVATION_PROFILE } from "@/config/constants";

interface ElevationProfileProps {
  progressPercent: number;
  totalDistance: number;
}

function ElevationProfileInner({ progressPercent, totalDistance }: ElevationProfileProps) {
  const currentKm = (progressPercent / 100) * totalDistance;

  return (
    <div className="glass-card p-4" role="img" aria-label="Профиль высот">
      <p className="text-[10px] text-white/70 uppercase tracking-widest mb-2">Профиль высот</p>
      <ResponsiveContainer width="100%" height={100}>
        <AreaChart data={ELEVATION_PROFILE} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis dataKey="km" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 8 }} axisLine={false} tickLine={false} />
          <YAxis hide domain={["dataMin - 50", "dataMax + 50"]} />
          <Area type="monotone" dataKey="elevation" stroke="#3b82f6" fill="url(#elevGrad)" strokeWidth={1.5} isAnimationActive={false} />
          <ReferenceLine x={Math.round(currentKm)} stroke="#22c55e" strokeWidth={2} strokeDasharray="4 2" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-[8px] text-white/30 mt-0.5 font-mono">
        <span>0 км</span>
        <span>{totalDistance} км</span>
      </div>
    </div>
  );
}

const ElevationProfile = memo(ElevationProfileInner);
export default ElevationProfile;
