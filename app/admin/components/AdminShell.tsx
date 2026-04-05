"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, Cog6ToothIcon, SunIcon, MoonIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import ScenarioSwitcher from "./ScenarioSwitcher";
import RouteSelector from "./RouteSelector";
import SystemStatusPanel from "./SystemStatusPanel";
import ConfigReloadButton from "./ConfigReloadButton";

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? "";

export default function AdminShell() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => setMounted(true), []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-xs">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-8 shadow-sm flex flex-col items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800">
              <LockClosedIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Панель управления</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Введите PIN-код</p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
              className={`w-full text-center font-mono text-2xl tracking-[0.5em] px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-colors ${
                error
                  ? "border-red-400 bg-red-50 dark:bg-red-950/30"
                  : "border-gray-200 dark:border-gray-700 focus:border-blue-400"
              }`}
              placeholder="····"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white transition-colors"
            >
              Войти
            </button>
            {error && (
              <p className="text-xs text-red-500">Неверный PIN-код</p>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="min-h-screen p-4 sm:p-6 max-w-lg mx-auto flex flex-col gap-4">
        {/* Header */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 flex items-center gap-3 shadow-sm">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </Link>
          <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">Панель управления</h1>
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {resolvedTheme === "dark" ? (
                <SunIcon className="h-4 w-4 text-gray-400" />
              ) : (
                <MoonIcon className="h-4 w-4 text-gray-600" />
              )}
            </button>
          )}
        </div>

        <ScenarioSwitcher />
        <RouteSelector />
        <SystemStatusPanel />
        <ConfigReloadButton />
      </div>
    </div>
  );
}
