"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PresenceMember } from "@/lib/types";
import { getInitials, getAvatarColor } from "@/lib/utils/avatar";

interface MobileActiveUsersProps {
  users: PresenceMember[];
  currentUserId: string;
}

export const MobileActiveUsers = ({
  users,
  currentUserId,
}: MobileActiveUsersProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-20 right-4 h-14 w-14 rounded-full lg:hidden z-40 shadow-lg hover:shadow-xl transition-all"
        >
          <Users className="h-6 w-6" />
          {users.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-6 w-6 p-0 flex items-center justify-center text-[10px] font-bold shadow-md">
              {users.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader className="pr-10">
          <SheetTitle className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
              <span>Active Users</span>
            </div>
            <Badge
              variant="secondary"
              className="text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm"
            >
              {users.length} online
            </Badge>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          <div className="space-y-2">
            {users.map((user) => {
              const isCurrentUser = user.clientId === currentUserId;
              return (
                <div
                  key={user.clientId}
                  className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer group hover:shadow-sm"
                >
                  <Avatar className="w-12 h-12 ring-2 ring-background shadow-md transition-transform duration-200 group-hover:scale-105">
                    <AvatarFallback
                      className={`${getAvatarColor(
                        user.clientId
                      )} text-white font-semibold text-base`}
                    >
                      {getInitials(user.data.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium truncate group-hover:text-foreground transition-colors">
                      {user.data.userName}
                    </p>
                    {isCurrentUser && (
                      <p className="text-muted-foreground text-xs">
                        That&apos;s you
                      </p>
                    )}
                  </div>
                  <div className="relative shrink-0">
                    <div className="w-2.5 h-2.5 bg-green-500 dark:bg-green-400 rounded-full shadow-sm" />
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 dark:bg-green-400 rounded-full animate-ping opacity-75" />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
