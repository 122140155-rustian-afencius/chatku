"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PresenceMember } from "@/lib/types";
import { getInitials, getAvatarColor } from "@/lib/utils/avatar";

interface ActiveUsersProps {
  users: PresenceMember[];
  currentUserId: string;
  typingUsers?: Set<string>;
}

export const ActiveUsers = ({
  users,
  currentUserId,
  typingUsers = new Set<string>(),
}: ActiveUsersProps) => {
  const [query, setQuery] = useState("");

  const sortedUsers = useMemo(
    () =>
      [...users].sort((a, b) =>
        a.data.userName.localeCompare(b.data.userName, "en", {
          sensitivity: "base",
        })
      ),
    [users]
  );

  const filteredUsers = useMemo(
    () =>
      sortedUsers.filter((user) =>
        user.data.userName.toLowerCase().includes(query.toLowerCase())
      ),
    [query, sortedUsers]
  );

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="px-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter members..."
            className="h-8 rounded-lg border bg-background/50 pl-8 text-xs shadow-sm focus-visible:ring-1"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-xs text-muted-foreground">
              No members found
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredUsers.map((user) => {
              const isCurrentUser = user.clientId === currentUserId;
              const isTyping = typingUsers.has(user.clientId);

              return (
                <div
                  key={user.clientId}
                  className="group flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent/50 transition-colors"
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-8 w-8 ring-1 ring-border/50">
                      <AvatarFallback
                        className={`${getAvatarColor(
                          user.clientId
                        )} text-xs font-medium text-white`}
                      >
                        {getInitials(user.data.userName)}
                      </AvatarFallback>
                    </Avatar>
                    {isTyping && (
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-background ring-2 ring-background">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                      </span>
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-foreground/90">
                        {user.data.userName}
                      </p>
                      {isCurrentUser && (
                        <span className="text-[10px] font-medium text-muted-foreground">
                          You
                        </span>
                      )}
                    </div>
                    {isTyping && (
                      <p className="text-[10px] text-amber-500 font-medium truncate">
                        typing...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
