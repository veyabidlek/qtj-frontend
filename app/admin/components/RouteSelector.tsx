"use client";

import { useState } from "react";
import { useRoutes, useStartRoute } from "@/hooks/useApi";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";

export default function RouteSelector() {
  const { data: routes } = useRoutes();
  const mutation = useStartRoute();

  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleStart() {
    if (!selected) return;
    mutation.mutate(selected, {
      onSuccess: () => {
        setFeedback({ type: "success", text: "Маршрут запущен" });
        setTimeout(() => setFeedback(null), 3000);
      },
      onError: () => {
        setFeedback({ type: "error", text: "Ошибка при запуске маршрута" });
        setTimeout(() => setFeedback(null), 3000);
      },
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 shadow-sm">
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
        Маршрут
      </h2>

      <div className="space-y-2">
        {(routes ?? []).map((r) => (
          <button
            key={r.id}
            onClick={() => setSelected(r.id)}
            className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
              selected === r.id
                ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40"
                : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750"
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-gray-400 shrink-0" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">{r.name}</p>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 ml-6">
              {r.stations.length} станций
            </p>
          </button>
        ))}
      </div>

      <button
        onClick={handleStart}
        disabled={!selected || mutation.isPending}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        {mutation.isPending ? (
          <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
        ) : (
          <PlayIcon className="h-4 w-4" />
        )}
        Запустить маршрут
      </button>

      {feedback && (
        <p className={`mt-2 text-xs text-center ${feedback.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
          {feedback.text}
        </p>
      )}
    </div>
  );
}
