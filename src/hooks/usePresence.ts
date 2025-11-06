"use client";

import { useEffect, useState } from "react";
import * as Ably from "ably";
import { PresenceMember } from "@/lib/types";

export const usePresence = (
  channel: Ably.RealtimeChannel | null,
  userName: string
) => {
  const [activeUsers, setActiveUsers] = useState<PresenceMember[]>([]);

  useEffect(() => {
    if (!channel || !userName) return;

    const enterPresence = async () => {
      try {
        await channel.presence.enter({ userName });

        const members = await channel.presence.get();
        setActiveUsers(
          members.map((m) => ({
            clientId: m.clientId,
            data: m.data as { userName: string },
          }))
        );
      } catch (error) {
        console.error("Failed to enter presence:", error);
      }
    };

    enterPresence();

    const handlePresenceUpdate = () => {
      channel.presence.get().then((members) => {
        setActiveUsers(
          members.map((m) => ({
            clientId: m.clientId,
            data: m.data as { userName: string },
          }))
        );
      });
    };

    channel.presence.subscribe(
      ["enter", "leave", "update"],
      handlePresenceUpdate
    );

    return () => {
      channel.presence.unsubscribe(handlePresenceUpdate);
      channel.presence.leave();
    };
  }, [channel, userName]);

  return { activeUsers };
};
