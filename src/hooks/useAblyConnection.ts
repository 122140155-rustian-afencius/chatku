"use client";

import { useEffect, useState } from "react";
import * as Ably from "ably";
import { getAblyClient } from "@/lib/ably/client";
import { CHANNEL_NAME } from "@/lib/ably/constants";

export const useAblyConnection = (clientId: string) => {
  const [connectionState, setConnectionState] = useState<
    "connected" | "connecting" | "disconnected" | "failed"
  >("connecting");
  const [channel] = useState<Ably.RealtimeChannel | null>(() => {
    if (typeof window === "undefined" || !clientId) return null;
    const client = getAblyClient(clientId);
    return client.channels.get(CHANNEL_NAME);
  });

  useEffect(() => {
    if (!clientId || !channel) return;

    const client = getAblyClient(clientId);

    const updateConnectionState = () => {
      const state = client.connection.state;
      if (state === "connected") setConnectionState("connected");
      else if (state === "connecting" || state === "initialized")
        setConnectionState("connecting");
      else if (state === "disconnected" || state === "suspended")
        setConnectionState("disconnected");
      else setConnectionState("failed");
    };

    client.connection.on(updateConnectionState);
    updateConnectionState();

    return () => {
      client.connection.off(updateConnectionState);
    };
  }, [clientId, channel]);

  return { channel, connectionState };
};
