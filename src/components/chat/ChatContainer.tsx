"use client";

import { useState, useEffect, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { Users, MessageCircle, Activity, Sparkles } from "lucide-react";
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
import { formatTimestamp } from "@/lib/utils/time";

type Stat = {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
};

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
  const lastMessageTimestamp =
    messages.length > 0 ? messages[messages.length - 1].timestamp : null;
  const typingCount = typingUsers.size;
  const connectionLabel = connectionState === "connected" ? "Live" : "Syncing";
  const accentId = userId ? `${userId.slice(0, 5)}…` : "—";

  const stats = useMemo<Stat[]>(
    () => [
      {
        label: "Active participants",
        value: activeUsers.length,
        detail:
          activeUsers.length === 1
            ? "You are the only one online"
            : `${activeUsers.length} teammates online`,
        icon: Users,
      },
      {
        label: "Messages shared",
        value: totalMessages,
        detail:
          lastMessageTimestamp !== null
            ? `Last update ${formatTimestamp(lastMessageTimestamp)}`
            : "Introduce yourself to kick things off",
        icon: MessageCircle,
      },
      {
        label: "Typing activity",
        value: typingCount,
        detail:
          typingCount > 0
            ? `${typingCount} teammate${typingCount > 1 ? "s" : ""} typing now`
            : "Room is calm at the moment",
        icon: Sparkles,
      },
      {
        label: "Connection status",
        value: connectionLabel,
        detail:
          connectionState === "connected"
            ? "Realtime sync secured"
            : "Re-establishing the channel",
        icon: Activity,
      },
    ],
    [
      activeUsers.length,
      connectionLabel,
      connectionState,
      lastMessageTimestamp,
      totalMessages,
      typingCount,
    ]
  );

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

  const StatCard = ({ icon: Icon, label, value, detail }: Stat) => (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/95 via-card/70 to-background/60 shadow-lg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_65%)] opacity-80 dark:opacity-60" />
      <div className="relative flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </span>
        </div>
        <p className="text-2xl font-semibold text-foreground sm:text-3xl">
          {value}
        </p>
        <p className="text-xs text-muted-foreground sm:text-sm">{detail}</p>
      </div>
    </div>
  );

  return (
    <>
      <ConnectionStatus state={connectionState} />
      <MobileActiveUsers
        users={activeUsers}
        currentUserId={userId}
        typingUsers={typingUsers}
      />
      <div className="relative min-h-screen bg-background">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_65%)] dark:bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.22),_transparent_65%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[length:32px_32px] opacity-50 dark:opacity-30" />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col gap-4 px-4 pb-6 pt-6 sm:gap-6 sm:pb-10 sm:pt-8 lg:pb-12">
          <header className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-card/95 via-card/70 to-background/50 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.2),_transparent_60%)] opacity-80 dark:opacity-60" />
            <div className="relative flex flex-col gap-6 px-6 py-8 sm:px-8 sm:py-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(59,130,246,0.45)]" />
                  Live Collaboration Space
                </span>
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                    ChatKu Workplace
                  </h1>
                  <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                    Coordinate with your team in realtime, keep conversations
                    organized, and capture decisions without losing momentum.
                    Stay connected across devices with a calm and focused
                    interface.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:text-sm">
                  <div className="flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-3 py-1.5 backdrop-blur">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                    Synced as{" "}
                    <span className="font-semibold text-foreground">
                      {currentUserName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-3 py-1.5 backdrop-blur">
                    <span className="font-semibold text-foreground">ID</span>
                    <span className="font-mono text-[11px] tracking-widest text-muted-foreground sm:text-xs">
                      {accentId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-3 py-1.5 backdrop-blur">
                    <span className="font-semibold text-foreground">
                      Security
                    </span>
                    <span>End-to-end via Ably</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-4">
                <ThemeToggle />
                <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-right backdrop-blur">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Room health
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {connectionState === "connected"
                      ? "Stable connection"
                      : "Reconnecting…"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    You&apos;re in control of notifications
                  </p>
                </div>
              </div>
            </div>
          </header>

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </section>

          <div className="flex flex-1 flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,2.2fr)_minmax(280px,1fr)] lg:items-stretch lg:gap-6">
            <section className="flex min-h-0 flex-col gap-4">
              <div className="flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-border/60 bg-card/85 backdrop-blur-xl shadow-2xl">
                <div className="flex flex-col gap-3 border-b border-border/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground sm:text-xl">
                      Conversation Stream
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Keep everyone aligned with contextual updates and quick
                      responses.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground sm:text-sm">
                    <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 backdrop-blur">
                      <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
                      {activeUsers.length} online
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 backdrop-blur">
                      <span className="font-semibold text-foreground">
                        {totalMessages}
                      </span>
                      messages exchanged
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-h-0 px-2 pb-4 pt-3 sm:px-4">
                  <ChatFeed
                    messages={messages}
                    currentUserId={userId}
                    isLoading={isLoading}
                    typingUsers={typingUsers}
                  />
                </div>
                <div className="border-t border-border/70 bg-background/60 px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4 sm:px-6">
                  <MessageInput
                    onSend={handleSendMessage}
                    onTyping={emitTyping}
                  />
                </div>
              </div>
            </section>
            <aside className="flex min-h-0 flex-col gap-4">
              <div className="rounded-[2rem] border border-border/60 bg-card/80 px-6 py-6 shadow-xl backdrop-blur-xl">
                <h3 className="text-base font-semibold text-foreground sm:text-lg">
                  Quick meeting notes
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Capture action items directly in the chat. Mention teammates
                  by name to notify them instantly. Use short, structured
                  messages to keep the timeline easy to scan later.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>
                      Start updates with a clear owner, e.g.{" "}
                      <span className="font-semibold text-foreground">
                        @Ayu
                      </span>{" "}
                      followed by the task.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>
                      Add time markers like{" "}
                      <span className="font-semibold text-foreground">
                        [Today 16:30]
                      </span>{" "}
                      for clarity.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>
                      React with 👍 or ✅ to confirm decisions and keep everyone
                      aligned.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="hidden min-h-0 flex-1 lg:block">
                <ActiveUsers
                  users={activeUsers}
                  currentUserId={userId}
                  typingUsers={typingUsers}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};
