"use client";

import { useRef, useEffect } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils/time";
import { getInitials, getAvatarColor } from "@/lib/utils/avatar";

interface ChatFeedProps {
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
  typingUsers: Set<string>;
}

export const ChatFeed = ({
  messages,
  currentUserId,
  isLoading,
  typingUsers,
}: ChatFeedProps) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: messages.length - 1,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [messages.length]);

  const groupedMessages = messages.reduce((acc, message, index) => {
    const prevMessage = messages[index - 1];
    const isGrouped =
      prevMessage &&
      prevMessage.userId === message.userId &&
      message.timestamp - prevMessage.timestamp < 60000;

    acc.push({ ...message, isGrouped });
    return acc;
  }, [] as Array<Message & { isGrouped: boolean }>);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading messages...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden border-none shadow-none bg-transparent">
      <CardContent className="flex-1 overflow-hidden p-3 sm:p-6 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
              <span className="text-4xl">💬</span>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm sm:text-base font-medium text-foreground">
                No messages yet
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Start the conversation by sending the first message
              </p>
            </div>
          </div>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            data={groupedMessages}
            style={{ height: "100%" }}
            itemContent={(index, message) => {
              const isOwnMessage = message.userId === currentUserId;

              return (
                <div
                  className={`mb-3 sm:mb-4 flex gap-2 sm:gap-3 ${
                    message.isGrouped ? "mt-1" : "mt-3 sm:mt-4"
                  } ${isOwnMessage ? "flex-row-reverse" : ""}`}
                >
                  {!message.isGrouped && (
                    <Avatar className="shrink-0 w-9 h-9 sm:w-11 sm:h-11 ring-2 ring-background shadow-md">
                      <AvatarFallback
                        className={`${getAvatarColor(
                          message.userId
                        )} text-white font-semibold text-xs sm:text-sm`}
                      >
                        {getInitials(message.userName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {message.isGrouped && (
                    <div className="w-9 sm:w-11 shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    {!message.isGrouped && (
                      <div
                        className={`flex items-baseline gap-2 mb-2 flex-wrap ${
                          isOwnMessage ? "flex-row-reverse" : ""
                        }`}
                      >
                        <p className="text-xs sm:text-sm font-semibold">
                          {message.userName}
                          {isOwnMessage && (
                            <span className="text-xs text-muted-foreground font-normal ml-1.5">
                              (You)
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl p-3 sm:p-3.5 transition-all duration-200 ${
                        isOwnMessage
                          ? "bg-card border-2 border-foreground/20 text-foreground max-w-[85%] ml-auto shadow-sm hover:shadow-md hover:border-foreground/30"
                          : "bg-muted/80 max-w-[85%] shadow-sm hover:shadow-md hover:bg-muted"
                      }`}
                    >
                      <p className="text-xs sm:text-sm wrap-break-word whitespace-pre-wrap leading-relaxed">
                        {message.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }}
            followOutput="smooth"
          />
        )}

        {typingUsers.size > 0 && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-full w-fit">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">
              Someone is typing...
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
