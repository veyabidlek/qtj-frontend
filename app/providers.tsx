"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { useWebSocket, type UseWebSocketReturn } from "@/hooks/useWebSocket";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const WebSocketContext = createContext<UseWebSocketReturn | null>(null);

export function useWebSocketContext(): UseWebSocketReturn {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocketContext must be used within Providers");
  return ctx;
}

function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const ws = useWebSocket();
  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => queryClient);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
      <QueryClientProvider client={client}>
        <TooltipProvider>
          <WebSocketProvider>{children}</WebSocketProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
