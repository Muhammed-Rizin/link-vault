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
    <nav className="fixed top-0 z-50 w-full border-b border-[#262626] bg-[#0a0a0a]">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 sm:px-10">
        <Logo iconClassName="size-8" />
        <div className="flex items-center gap-3">
          {!isLoggedIn && (
            <Button
              variant="ghost"
              className="hidden sm:inline-flex text-zinc-400 hover:text-white font-medium text-xs rounded-md"
              onClick={onOpenLogin}
            >
              Sign in
            </Button>
          )}
          <Button
            className="rounded-md px-4 h-9 font-semibold text-xs bg-white text-black hover:bg-zinc-200 transition-colors"
            onClick={() => (isLoggedIn ? (window.location.href = "/links") : onOpenSignup())}
          >
            {isLoggedIn ? "Vault dashboard" : "Get started free"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
