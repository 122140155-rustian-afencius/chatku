import { useState, useRef, useEffect } from "react";
import { messageSchema } from "@/lib/validations/name";
import { ANTI_SPAM_COOLDOWN } from "@/lib/ably/constants";
import { MAX_MESSAGE_LENGTH } from "@/lib/constants";

interface UseMessageInputProps {
  onSend: (text: string) => Promise<void>;
  onTyping: () => void;
}

export const useMessageInput = ({ onSend, onTyping }: UseMessageInputProps) => {
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

  const handleQuickReply = (reply: string) => {
    setText(reply);
    setError("");
    onTyping();
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const charCount = text.length;
  const isOverLimit = charCount > MAX_MESSAGE_LENGTH;

  return {
    text,
    error,
    isSending,
    canSend,
    inputRef,
    charCount,
    isOverLimit,
    handleSubmit,
    handleKeyDown,
    handleChange,
    handleQuickReply,
  };
};
