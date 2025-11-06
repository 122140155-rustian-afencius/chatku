"use client";

import { Wifi, WifiOff, Loader2 } from "lucide-react";

interface ConnectionStatusProps {
  state: "connected" | "connecting" | "disconnected" | "failed";
}

export const ConnectionStatus = ({ state }: ConnectionStatusProps) => {
  if (state === "connected") return null;

  const getStatusConfig = () => {
    switch (state) {
      case "connecting":
        return {
          text: "Connecting...",
          variant: "secondary" as const,
          icon: <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />,
        };
      case "disconnected":
        return {
          text: "Disconnected - Reconnecting",
          variant: "warning" as const,
          icon: <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
        };
      case "failed":
        return {
          text: "Connection failed",
          variant: "destructive" as const,
          icon: <WifiOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
        };
      default:
        return {
          text: "Unknown",
          variant: "secondary" as const,
          icon: <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="fixed top-3 sm:top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div
        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium shadow-lg backdrop-blur-sm flex items-center gap-2 ${
          config.variant === "destructive"
            ? "bg-destructive/90 text-destructive-foreground border-2 border-destructive"
            : config.variant === "warning"
            ? "bg-orange-500/90 text-white border-2 border-orange-600"
            : "bg-secondary/90 text-secondary-foreground border-2 border-border"
        }`}
      >
        {config.icon}
        {config.text}
      </div>
    </div>
  );
};
