"use client";

import { useState, useEffect } from "react";
import { useScenarios, useHealthz, useSetScenario } from "@/hooks/useApi";
import { PlayIcon } from "@heroicons/react/24/solid";

export default function ScenarioSwitcher() {
  const { data: scenarioData } = useScenarios();
  const { data: healthz } = useHealthz(10000);
  const mutation = useSetScenario();

  const scenarios = scenarioData?.scenarios ?? [];
  const activeScenario = healthz?.scenario ?? "";

  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (activeScenario && !selected) setSelected(activeScenario);
  }, [activeScenario, selected]);

  function handleApply() {
    if (!selected) return;
    mutation.mutate(selected, {
      onSuccess: () => {
        setFeedback({ type: "success", text: "Сценарий изменён" });
        setTimeout(() => setFeedback(null), 3000);
      },
      onError: () => {
        setFeedback({ type: "error", text: "Ошибка при смене сценария" });
        setTimeout(() => setFeedback(null), 3000);
      },
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Сценарий симулятора
        </h2>
        {activeScenario && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-medium">
            {activeScenario}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
              selected === s.id
                ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40"
                : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750"
            }`}
          >
            <p className="text-sm font-medium text-gray-900 dark:text-white">{s.name}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{s.description}</p>
          </button>
        ))}
      </div>

      <button
        onClick={handleApply}
        disabled={!selected || selected === activeScenario || mutation.isPending}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        {mutation.isPending ? (
          <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
        ) : (
          <PlayIcon className="h-4 w-4" />
        )}
        Применить
      </button>

      {feedback && (
        <p className={`mt-2 text-xs text-center ${feedback.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
          {feedback.text}
        </p>
      )}
    </div>
  );
}
