"use client";

import { useState } from "react";
import { useReloadHealthConfig } from "@/hooks/useApi";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function ConfigReloadButton() {
  const mutation = useReloadHealthConfig();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleReload() {
    mutation.mutate(undefined, {
      onSuccess: () => {
        setFeedback({ type: "success", text: "Конфигурация перезагружена" });
        setTimeout(() => setFeedback(null), 3000);
      },
      onError: () => {
        setFeedback({ type: "error", text: "Ошибка при перезагрузке" });
        setTimeout(() => setFeedback(null), 3000);
      },
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 shadow-sm">
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
        Конфигурация
      </h2>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-4">
        Перезагрузка health_config.yaml без перезапуска сервера
      </p>

      <button
        onClick={handleReload}
        disabled={mutation.isPending}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        {mutation.isPending ? (
          <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
        ) : (
          <ArrowPathIcon className="h-4 w-4" />
        )}
        Перезагрузить
      </button>

      {feedback && (
        <p className={`mt-2 text-xs text-center ${feedback.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
          {feedback.text}
        </p>
      )}
    </div>
  );
}
