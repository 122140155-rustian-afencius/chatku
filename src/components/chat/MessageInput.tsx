"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { messageSchema } from "@/lib/validations/name";
import { ANTI_SPAM_COOLDOWN } from "@/lib/ably/constants";

interface MessageInputProps {
  onSend: (text: string) => Promise<void>;
  onTyping: () => void;
}

export const MessageInput = ({ onSend, onTyping }: MessageInputProps) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [canSend, setCanSend] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!canSend) {
      const timer = setTimeout(() => {
        setCanSend(true);
      }, ANTI_SPAM_COOLDOWN);
      return () => clearTimeout(timer);
    }
  }, [canSend]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSend) {
      setError("Please wait before sending another message");
      return;
    }

    const result = messageSchema.safeParse(text);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsSending(true);
    setCanSend(false);

    try {
      await onSend(result.data);
      setText("");
      setError("");
    } catch {
      setError("Failed to send message");
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setError("");
    onTyping();
  };

  const charCount = text.length;
  const isOverLimit = charCount > 300;
  const quickReplies = [
    "Good morning team — here’s a quick update.",
    "Let’s circle back in 10 minutes with action items.",
    "Thanks! I’ll take ownership and report back.",
    "Can you drop the latest file here for review?",
  ];

  const handleQuickReply = (reply: string) => {
    setText(reply);
    setError("");
    onTyping();
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-background/60 px-3 py-2.5 shadow-sm backdrop-blur">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Quick replies
        </span>
        <div className="flex flex-wrap gap-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => handleQuickReply(reply)}
              className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground hover:shadow-md"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 animate-in slide-in-from-bottom-2">
          <p className="text-xs sm:text-sm text-destructive font-medium">
            {error}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type a message... (Press Enter to send)"
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            className={`text-sm sm:text-base h-11 sm:h-12 rounded-xl shadow-sm border-2 transition-all ${
              isOverLimit
                ? "border-destructive focus-visible:ring-destructive"
                : "focus-visible:border-foreground/30"
            }`}
            maxLength={320}
          />
          <div className="flex justify-between mt-2 px-2">
            <p
              className={`text-[10px] sm:text-xs font-semibold transition-colors ${
                isOverLimit
                  ? "text-destructive"
                  : charCount > 250
                  ? "text-orange-500"
                  : "text-muted-foreground"
              }`}
            >
              {charCount}/300
            </p>
            {!canSend && (
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse" />
                <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold">
                  Please wait...
                </p>
              </div>
            )}
          </div>
        </div>
        <Button
          type="submit"
          disabled={isSending || !text.trim() || isOverLimit || !canSend}
          size="icon"
          className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <Send className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </form>
    </div>
  );
};
