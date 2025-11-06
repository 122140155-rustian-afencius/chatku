"use client";

import { useEffect, useState } from "react";
import * as Ably from "ably";
import { Message } from "@/lib/types";
import { MESSAGE_HISTORY_LIMIT } from "@/lib/ably/constants";

export const useMessages = (channel: Ably.RealtimeChannel | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!channel) return;

    const loadHistory = async () => {
      try {
        const history = await channel.history({ limit: MESSAGE_HISTORY_LIMIT });
        const historicalMessages: Message[] = history.items
          .map((msg) => ({
            id: msg.id || "",
            text: msg.data?.text || "",
            userId: msg.clientId || "",
            userName: msg.data?.userName || "Unknown",
            timestamp: msg.timestamp || Date.now(),
          }))
          .reverse();

        setMessages(historicalMessages);
      } catch (error) {
        console.error("Failed to load message history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();

    const handleMessage = (message: Ably.Message) => {
      const newMessage: Message = {
        id: message.id || Date.now().toString(),
        text: message.data?.text || "",
        userId: message.clientId || "",
        userName: message.data?.userName || "Unknown",
        timestamp: message.timestamp || Date.now(),
      };

      setMessages((prev) => [...prev, newMessage]);
    };

    channel.subscribe("message", handleMessage);

    return () => {
      channel.unsubscribe("message", handleMessage);
    };
  }, [channel]);

  const sendMessage = async (text: string, userName: string) => {
    if (!channel) return;

    try {
      await channel.publish("message", {
        text,
        userName,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };

  return { messages, isLoading, sendMessage };
};
