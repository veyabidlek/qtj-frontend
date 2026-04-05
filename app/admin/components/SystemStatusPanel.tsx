"use client";

import { useHealthz } from "@/hooks/useApi";

const STATUS_LABELS: Record<string, string> = {
  status: "Статус",
  db: "База данных",
  simulator: "Симулятор",
  scenario: "Сценарий",
  clients: "Клиенты",
};

const GOOD_VALUES = new Set(["ok", "connected", "running"]);

export default function SystemStatusPanel() {
  const { data } = useHealthz(10000);

  const entries: { key: string; value: string }[] = data
    ? [
        { key: "status", value: data.status },
        { key: "db", value: data.db },
        { key: "simulator", value: data.simulator },
        { key: "scenario", value: data.scenario },
        { key: "clients", value: String(data.clients) },
      ]
    : [];

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 shadow-sm">
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
        Статус системы
      </h2>

      {entries.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">Загрузка...</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {entries.map(({ key, value }) => {
            const isGood = GOOD_VALUES.has(value);
            const isNumeric = key === "clients";

            return (
              <div key={key} className="rounded-xl bg-gray-50 dark:bg-gray-800 px-3 py-2.5 border border-gray-200 dark:border-gray-700">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {STATUS_LABELS[key]}
                </p>
                <p className={`font-mono text-sm font-medium mt-0.5 ${
                  isNumeric ? "text-gray-900 dark:text-white" : isGood ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                }`}>
                  {value}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
