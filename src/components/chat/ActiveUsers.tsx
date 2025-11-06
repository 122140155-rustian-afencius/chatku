"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PresenceMember } from "@/lib/types";
import { getInitials, getAvatarColor } from "@/lib/utils/avatar";

interface ActiveUsersProps {
  users: PresenceMember[];
  currentUserId: string;
}

export const ActiveUsers = ({ users, currentUserId }: ActiveUsersProps) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden border-none shadow-none bg-transparent">
      <CardHeader className="py-4 sm:py-5 shrink-0 border-b bg-card/50 backdrop-blur-sm">
        <CardTitle className="flex items-center justify-between text-base sm:text-lg gap-3">
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
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 flex-1 overflow-hidden min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {users.map((user) => {
              const isCurrentUser = user.clientId === currentUserId;
              return (
                <div
                  key={user.clientId}
                  className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer group hover:shadow-sm"
                >
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-background shadow-md transition-transform duration-200 group-hover:scale-105">
                    <AvatarFallback
                      className={`${getAvatarColor(
                        user.clientId
                      )} text-white font-semibold text-sm sm:text-base`}
                    >
                      {getInitials(user.data.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium truncate group-hover:text-foreground transition-colors">
                      {user.data.userName}
                    </p>
                    {isCurrentUser && (
                      <p className="text-muted-foreground text-xs">
                        That&apos;s you
                      </p>
                    )}
                  </div>
                  <div className="relative shrink-0">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 dark:bg-green-400 rounded-full shadow-sm" />
                    <div className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 dark:bg-green-400 rounded-full animate-ping opacity-75" />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
