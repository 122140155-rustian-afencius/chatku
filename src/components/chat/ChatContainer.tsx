"use client";

import { useState, useEffect } from "react";
import { storage } from "@/lib/storage";
import { useAblyConnection } from "@/hooks/useAblyConnection";
import { useMessages } from "@/hooks/useMessages";
import { usePresence } from "@/hooks/usePresence";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { NameForm } from "@/components/chat/NameForm";
import { ChatFeed } from "@/components/chat/ChatFeed";
import { ActiveUsers } from "@/components/chat/ActiveUsers";
import { MobileActiveUsers } from "@/components/chat/MobileActiveUsers";
import { MessageInput } from "@/components/chat/MessageInput";
import { ConnectionStatus } from "@/components/chat/ConnectionStatus";
import { ThemeToggle } from "@/components/ThemeToggle";

export const ChatContainer = () => {
  const [userName] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return storage.getUserName();
  });
  const [userId] = useState(() => {
    if (typeof window === "undefined") return "";
    return storage.getUserId();
  });
  const [currentUserName, setCurrentUserName] = useState(userName);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const { channel, connectionState } = useAblyConnection(userId);
  const { messages, isLoading, sendMessage } = useMessages(channel);
  const { activeUsers } = usePresence(channel, currentUserName || "");
  const { typingUsers, emitTyping } = useTypingIndicator(channel, userId);

  const handleNameSubmit = (name: string) => {
    setCurrentUserName(name);
  };

  const handleSendMessage = async (text: string) => {
    if (!currentUserName) return;
    await sendMessage(text, currentUserName);
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  if (!currentUserName) {
    return <NameForm onSubmit={handleNameSubmit} />;
  }

  return (
    <>
      <ConnectionStatus state={connectionState} />
      <MobileActiveUsers users={activeUsers} currentUserId={userId} />
      <div className="h-screen bg-background p-2 sm:p-4 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          <div className="mb-3 sm:mb-4 flex items-center justify-between px-2 sm:px-3 py-3 sm:py-4 shrink-0 bg-card/50 backdrop-blur-sm rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold leading-none mb-1">
                  ChatKu
                </h1>
                <p className="text-xs text-muted-foreground">
                  Realtime Chat Room
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 flex-1 min-h-0">
            <div className="lg:col-span-2 flex flex-col gap-2 sm:gap-4 h-full min-h-0">
              <div className="flex-1 overflow-hidden min-h-0">
                <ChatFeed
                  messages={messages}
                  currentUserId={userId}
                  isLoading={isLoading}
                  typingUsers={typingUsers}
                />
              </div>
              <div className="shrink-0">
                <MessageInput
                  onSend={handleSendMessage}
                  onTyping={emitTyping}
                />
              </div>
            </div>

            <div className="hidden lg:block h-full min-h-0">
              <ActiveUsers users={activeUsers} currentUserId={userId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
