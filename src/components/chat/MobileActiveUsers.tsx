"use client";

import { useMemo, useState } from "react";
import { Users as UsersIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
          className="fixed bottom-[calc(80px+env(safe-area-inset-bottom))] right-[calc(16px+env(safe-area-inset-right))] z-40 h-12 w-12 rounded-full bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground shadow-xl transition-all hover:scale-[1.05] hover:shadow-2xl sm:bottom-24 sm:right-6 lg:hidden"
        >
          <UsersIcon className="h-5 w-5" />
          {users.length > 0 && (
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-background bg-primary text-[9px] font-bold text-primary-foreground shadow-sm">
              {users.length}
            </div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-xs px-0 pb-[max(env(safe-area-inset-bottom),0px)]"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="px-4 pb-4 pt-6 border-b border-border/40">
            <SheetTitle className="flex items-center justify-between gap-3 text-base font-semibold">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                Active teammates
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {users.length} online
              </span>
            </SheetTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search teammates..."
                className="h-9 rounded-lg border bg-background/50 pl-9 text-sm shadow-sm focus-visible:ring-1"
              />
            </div>
          </SheetHeader>
          <ScrollArea className="flex-1 px-2 py-2">
            {filteredUsers.length === 0 ? (
              <div className="mt-8 flex flex-col items-center justify-center px-4 py-8 text-center">
                <UsersIcon className="mb-2 h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  No teammates found
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
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent/50 transition-colors"
                    >
                      <div className="relative shrink-0">
                        <Avatar className="h-9 w-9 ring-1 ring-border/50">
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
                          <p className="truncate text-sm font-medium text-foreground">
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
      </SheetContent>
    </Sheet>
  );
};
