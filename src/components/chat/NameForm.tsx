"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { nameSchema } from "@/lib/validations/name";
import { storage } from "@/lib/storage";

interface NameFormProps {
  onSubmit: (name: string) => void;
}

export const NameForm = ({ onSubmit }: NameFormProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = nameSchema.safeParse(name);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    storage.setUserName(result.data);
    onSubmit(result.data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md mx-4 shadow-xl border-2">
        <CardHeader className="space-y-3 sm:space-y-4 text-center pb-6 sm:pb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            Welcome to ChatKu
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your name to start chatting with other users in realtime
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6 sm:pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                type="text"
                placeholder="Your name (2-20 characters)"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className={`text-sm sm:text-base h-12 sm:h-14 rounded-xl border-2 transition-all ${
                  error
                    ? "border-destructive focus-visible:border-destructive"
                    : "focus-visible:border-foreground/30"
                }`}
                maxLength={20}
                autoFocus
              />
              {error && (
                <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-3 mt-3 shadow-sm">
                  <p className="text-xs sm:text-sm text-destructive font-medium">
                    {error}
                  </p>
                </div>
              )}
            </div>
            <Button
              type="submit"
              className="w-full text-sm sm:text-base h-12 sm:h-14 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Start Chat
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
