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
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_65%)] dark:bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.22),_transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[length:32px_32px] opacity-60 dark:opacity-30" />
      </div>
      <Card className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-border/70 bg-card/95 shadow-2xl backdrop-blur-xl">
        <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
          <div className="relative border-b border-border/60 bg-gradient-to-br from-primary/20 via-primary/15 to-background/70 px-8 py-10 text-foreground md:border-b-0 md:border-r lg:px-10 lg:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.28),_transparent_65%)] opacity-90 dark:opacity-60" />
            <div className="relative flex h-full flex-col justify-between gap-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  Realtime Workspace
                </div>
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                    Welcome to ChatKu
                  </h1>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    Join the conversation instantly, share updates with your team,
                    and keep decisions documented in one elegant interface.
                  </p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Use your real name so teammates can recognize you quickly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Switch themes anytime to match your working environment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Stay respectful and concise—your notes fuel team alignment.</span>
                </li>
              </ul>
            </div>
          </div>
          <CardContent className="px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-lg sm:h-20 sm:w-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 sm:h-10 sm:w-10"
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
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
                  Let&apos;s personalize your space
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                  Enter a name between 2 and 20 characters to help everyone identify
                  you in the room.
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-3 text-left">
                <Input
                  type="text"
                  placeholder="Your name (2-20 characters)"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  className={`h-12 rounded-xl border-2 bg-background/80 text-base transition-all sm:h-14 ${
                    error
                      ? "border-destructive focus-visible:border-destructive"
                      : "focus-visible:border-primary/40"
                  }`}
                  maxLength={20}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  We’ll store this locally so you can jump back in without re-entering it.
                </p>
                {error && (
                  <div className="rounded-xl border-2 border-destructive/30 bg-destructive/10 p-3 shadow-sm">
                    <p className="text-xs font-medium text-destructive sm:text-sm">
                      {error}
                    </p>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-gradient-to-r from-primary via-primary/90 to-primary/70 text-sm font-semibold shadow-lg transition-transform duration-200 hover:scale-[1.01] hover:shadow-[0_20px_60px_-20px_rgba(59,130,246,0.9)] sm:h-14 sm:text-base"
              >
                Enter the workspace
              </Button>
            </form>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              By continuing, you agree to keep discussions professional and respectful.
            </p>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};
