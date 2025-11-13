"use client";

import { useMemo, useState } from "react";
import { Users as UsersIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { PresenceMember } from "@/lib/types";
import { getInitials, getAvatarColor } from "@/lib/utils/avatar";

interface MobileActiveUsersProps {
  users: PresenceMember[];
  currentUserId: string;
  typingUsers?: Set<string>;
}

export const MobileActiveUsers = ({
  users,
  currentUserId,
  typingUsers = new Set<string>(),
}: MobileActiveUsersProps) => {
  const [open, setOpen] = useState(false);
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-[calc(72px+env(safe-area-inset-bottom))] right-[calc(16px+env(safe-area-inset-right))] z-40 h-14 w-14 rounded-full bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground shadow-2xl transition-all hover:scale-[1.03] hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.8)] sm:bottom-20 sm:right-4 lg:hidden"
        >
          <UsersIcon className="h-6 w-6" />
          {users.length > 0 && (
            <Badge className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-background/80 bg-background/95 p-0 text-[10px] font-bold text-foreground shadow-lg">
              {users.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-sm px-0 pb-[max(env(safe-area-inset-bottom),0px)]"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="px-6 pb-4 pt-6">
            <SheetTitle className="flex items-center justify-between gap-3 text-lg font-semibold">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                Active teammates
              </span>
              <Badge
                variant="secondary"
                className="rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold uppercase tracking-widest text-primary"
              >
                {users.length} online
              </Badge>
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Filter, scan, and reach out to collaborators without leaving the
              conversation.
            </SheetDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search teammates…"
                className="h-11 rounded-xl border-2 bg-background/70 pl-10 text-sm shadow-inner placeholder:text-muted-foreground/70 focus-visible:border-primary/40"
              />
            </div>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-220px)] px-6 pb-6">
            {filteredUsers.length === 0 ? (
              <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/50 px-4 py-16 text-center">
                <UsersIcon className="mb-3 h-6 w-6 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  No teammates found
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try a different keyword or clear the filter to see everyone
                  online.
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
                      className="group flex items-center gap-4 rounded-xl border border-transparent bg-background/50 p-3.5 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg"
                    >
                      <Avatar className="h-12 w-12 ring-2 ring-background shadow-lg transition-transform duration-200 group-hover:scale-105">
                        <AvatarFallback
                          className={`${getAvatarColor(
                            user.clientId
                          )} text-base font-semibold text-white`}
                        >
                          {getInitials(user.data.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
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
        </div>
      </SheetContent>
    </Sheet>
  );
};
