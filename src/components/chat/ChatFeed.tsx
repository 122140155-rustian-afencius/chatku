"use client";

import { Virtuoso } from "react-virtuoso";
import { Card, CardContent } from "@/components/ui/card";
import { Message } from "@/lib/types";
import { useChatScroll } from "@/hooks/useChatScroll";
import { MessageItem } from "./MessageItem";

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
  const { virtuosoRef } = useChatScroll(messages);

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
      <CardContent className="flex-1 overflow-hidden p-2 sm:p-4 min-h-0">
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
            itemContent={(index, message) => (
              <MessageItem
                key={message.id}
                message={message}
                isGrouped={message.isGrouped}
                currentUserId={currentUserId}
              />
            )}
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
