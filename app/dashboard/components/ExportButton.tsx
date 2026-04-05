"use client";

import { memo, useState } from "react";
import { ArrowDownTrayIcon, PrinterIcon } from "@heroicons/react/24/outline";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function ExportButtonInner() {
  const [open, setOpen] = useState(false);

  function downloadCSV() {
    const url = `${API_URL}/api/history/export?minutes=60`;
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    link.click();
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white/80 hover:text-white transition-colors border border-white/10"
        aria-label="Экспорт данных"
      >
        <ArrowDownTrayIcon className="h-3.5 w-3.5" />
        Экспорт
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 glass-card py-1 min-w-[160px]">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ArrowDownTrayIcon className="h-3.5 w-3.5" />
              Экспорт CSV
            </button>
            <button
              onClick={() => { window.print(); setOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <PrinterIcon className="h-3.5 w-3.5" />
              Печать отчёта
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const ExportButton = memo(ExportButtonInner);
export default ExportButton;
