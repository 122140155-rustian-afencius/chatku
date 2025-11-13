"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
    <Card className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-card/95 via-card/75 to-background/60 shadow-xl backdrop-blur">
      <CardHeader className="space-y-4 border-b border-border/60 bg-background/60 px-6 py-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
            <CardTitle className="text-lg font-semibold sm:text-xl">
              Active teammates
            </CardTitle>
          </div>
          <Badge
            variant="secondary"
            className="rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold uppercase tracking-widest text-primary"
          >
            {users.length} online
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground sm:text-sm">
          Track who is available, see who is currently typing, and quickly reach
          out to collaborators.
        </CardDescription>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by name or initial…"
            className="h-11 rounded-xl border-2 bg-background/80 pl-10 text-sm shadow-inner placeholder:text-muted-foreground/70 focus-visible:border-primary/40"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden px-0 pb-0">
        <ScrollArea className="h-full px-4 pb-6 pt-4 sm:px-6">
          {filteredUsers.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/40 px-4 py-12 text-center">
              <Sparkles className="mb-3 h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                No teammates match your search
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try a different name or clear the filter to view everyone online.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const isCurrentUser = user.clientId === currentUserId;
                const isTyping = typingUsers.has(user.clientId);

                return (
                  <div
                    key={user.clientId}
                    className="group flex items-center gap-3 rounded-xl border border-transparent bg-background/40 p-3.5 transition-all duration-200 hover:border-primary/40 hover:bg-background/70 hover:shadow-lg"
                  >
                    <Avatar className="h-11 w-11 ring-2 ring-background shadow-lg transition-transform duration-200 group-hover:scale-105 sm:h-12 sm:w-12">
                      <AvatarFallback
                        className={`${getAvatarColor(
                          user.clientId
                        )} text-sm font-semibold text-white sm:text-base`}
                      >
                        {getInitials(user.data.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                        {user.data.userName}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {isCurrentUser && (
                          <Badge
                            variant="outline"
                            className="border-primary/30 bg-primary/10 text-[11px] font-semibold uppercase tracking-wider text-primary"
                          >
                            You
                          </Badge>
                        )}
                        {isTyping && (
                          <Badge
                            variant="outline"
                            className="border-amber-300/40 bg-amber-100/40 text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300"
                          >
                            typing
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="relative shrink-0">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                      <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-400/60 opacity-60 blur-[2px]" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
