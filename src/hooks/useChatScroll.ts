import { useRef, useEffect } from "react";
import { VirtuosoHandle } from "react-virtuoso";
import { Message } from "@/lib/types";

export const useChatScroll = (messages: Message[]) => {
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

  return { virtuosoRef };
};
