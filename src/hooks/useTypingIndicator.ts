"use client";

import { useEffect, useState, useCallback } from "react";
import * as Ably from "ably";
import { TYPING_EVENT, TYPING_COOLDOWN } from "@/lib/ably/constants";

export const useTypingIndicator = (
  channel: Ably.RealtimeChannel | null,
  currentUserId: string
) => {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [lastTypingTime, setLastTypingTime] = useState(0);

  useEffect(() => {
    if (!channel) return;

    const handleTyping = (message: Ably.Message) => {
      const { userId, isTyping } = message.data;

      if (userId === currentUserId) return;

      setTypingUsers((prev) => {
        const updated = new Set(prev);
        if (isTyping) {
          updated.add(userId);
          setTimeout(() => {
            setTypingUsers((current) => {
              const newest = new Set(current);
              newest.delete(userId);
              return newest;
            });
          }, 3000);
        } else {
          updated.delete(userId);
        }
        return updated;
      });
    };

    channel.subscribe(TYPING_EVENT, handleTyping);

    return () => {
      channel.unsubscribe(TYPING_EVENT, handleTyping);
    };
  }, [channel, currentUserId]);

  const emitTyping = useCallback(() => {
    if (!channel) return;

    const now = Date.now();
    if (now - lastTypingTime < TYPING_COOLDOWN) return;

    setLastTypingTime(now);
    channel.publish(TYPING_EVENT, {
      userId: currentUserId,
      isTyping: true,
    });
  }, [channel, currentUserId, lastTypingTime]);

  return { typingUsers, emitTyping };
};
