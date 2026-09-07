"use client";

import * as React from "react";
import { Logo } from "@/shared/components/ui/logo";
import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";

interface LandingHeaderProps {
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

export function LandingHeader({ isLoggedIn, onOpenLogin, onOpenSignup }: LandingHeaderProps) {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 sm:px-10">
        <Logo iconClassName="size-8" />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {!isLoggedIn && (
            <Button
              variant="ghost"
              className="hidden sm:inline-flex text-muted-foreground hover:text-foreground font-medium text-xs rounded-xl"
              onClick={onOpenLogin}
            >
              Sign in
            </Button>
          )}
          <Button
            className="rounded-xl px-4 h-9 font-semibold text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            onClick={() => (isLoggedIn ? (window.location.href = "/links") : onOpenSignup())}
          >
            {isLoggedIn ? "Vault dashboard" : "Get started free"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
