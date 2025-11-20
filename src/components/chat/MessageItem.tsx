import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils/time";
import { getInitials, getAvatarColor } from "@/lib/utils/avatar";

interface MessageItemProps {
  message: Message;
  isGrouped: boolean;
  currentUserId: string;
}

export const MessageItem = ({
  message,
  isGrouped,
  currentUserId,
}: MessageItemProps) => {
  const isOwnMessage = message.userId === currentUserId;

  return (
    <div
      className={`mb-3 sm:mb-4 flex gap-2 sm:gap-3 ${
        isGrouped ? "mt-1" : "mt-3 sm:mt-4"
      } ${isOwnMessage ? "flex-row-reverse" : ""}`}
    >
      {!isGrouped && (
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
      {isGrouped && <div className="w-9 sm:w-11 shrink-0" />}

      <div className="flex-1 min-w-0">
        {!isGrouped && (
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
};
