"use client";

import * as React from "react";
import { Logo } from "@/shared/components/ui/logo";
import { Button } from "@/shared/components/ui/button";

interface LandingHeaderProps {
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

export function LandingHeader({ isLoggedIn, onOpenLogin, onOpenSignup }: LandingHeaderProps) {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 sm:px-10">
        <Logo iconClassName="size-9" />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {/* Nav links removed as requested */}
        </div>
        <div className="flex items-center gap-4">
          {!isLoggedIn && (
            <Button
              variant="ghost"
              className="hidden sm:inline-flex text-white/70 hover:text-white font-bold text-sm tracking-tight"
              onClick={onOpenLogin}
            >
              Login
            </Button>
          )}
          <Button
            className="rounded-full px-8 h-11 font-black shadow-lg shadow-primary/20 tracking-tighter"
            onClick={() => (isLoggedIn ? (window.location.href = "/links") : onOpenSignup())}
          >
            {isLoggedIn ? "Dashboard" : "Get Started"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
