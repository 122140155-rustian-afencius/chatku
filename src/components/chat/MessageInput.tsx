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

  return (
    <div className="space-y-2">
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
