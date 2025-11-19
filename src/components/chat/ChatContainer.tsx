"use client";

import { useState, useEffect } from "react";
import { Users, MessageCircle } from "lucide-react";
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

  const totalMessages = messages.length;


  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  if (!currentUserName) {
    return <NameForm onSubmit={handleNameSubmit} />;
  }



  return (
    <>
      <MobileActiveUsers
        users={activeUsers}
        currentUserId={userId}
        typingUsers={typingUsers}
      />
      <div className="relative h-screen w-full bg-background flex flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_65%)] dark:bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.22),_transparent_65%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[length:32px_32px] opacity-50 dark:opacity-30" />
        </div>
        
        {/* Header - Compact */}
        <header className="shrink-0 border-b border-border/60 bg-card/50 backdrop-blur-md z-20">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none sm:text-xl">
                  ChatKu
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${connectionState === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${connectionState === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {connectionState === 'connected' ? 'Live' : 'Connecting'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 border border-border/50">
                <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                <span className="text-xs font-medium text-muted-foreground">
                  {currentUserName}
                </span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content - Flex Grow */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Chat Area */}
          <main className="flex-1 flex flex-col min-w-0 bg-background/30 relative">
            <div className="flex-1 min-h-0 relative">
              <div className="absolute inset-0 px-2 sm:px-4 py-4">
                <ChatFeed
                  messages={messages}
                  currentUserId={userId}
                  isLoading={isLoading}
                  typingUsers={typingUsers}
                />
              </div>
            </div>
            
            {/* Input Area - Fixed at bottom of chat area */}
            <div className="shrink-0 p-3 sm:p-4 bg-background/80 backdrop-blur-sm border-t border-border/50">
              <div className="max-w-4xl mx-auto w-full">
                <MessageInput
                  onSend={handleSendMessage}
                  onTyping={emitTyping}
                />
              </div>
            </div>
          </main>

          {/* Sidebar - Hidden on mobile, visible on desktop */}
          <aside className="hidden lg:flex w-72 flex-col border-l border-border/60 bg-card/30 backdrop-blur-sm">
            <div className="p-4 border-b border-border/40">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Online Members
                <span className="ml-auto flex h-5 items-center justify-center rounded-full bg-primary/10 px-2 text-[10px] font-bold text-primary">
                  {activeUsers.length}
                </span>
              </h3>
            </div>
            <div className="flex-1 overflow-hidden p-2">
              <ActiveUsers
                users={activeUsers}
                currentUserId={userId}
                typingUsers={typingUsers}
              />
            </div>
            <div className="p-3 border-t border-border/40 bg-card/20">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Messages</span>
                <span className="font-mono font-medium text-foreground">{totalMessages}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};
