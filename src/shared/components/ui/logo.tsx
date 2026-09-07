"use client";

import { cn } from "@/shared/utils/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
}

export function Logo({ className, iconClassName, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 font-bold tracking-tight", className)}>
      <div 
        className={cn(
          "relative flex size-9 items-center justify-center shrink-0 overflow-hidden rounded-xl border border-border/80 bg-primary/10 text-primary shadow-sm",
          iconClassName
        )}
      >
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full p-1.5">
          <path 
            d="M22 22H33.5C40.4036 22 46 27.5964 46 34.5C46 41.4036 40.4036 47 33.5 47H22" 
            stroke="currentColor" 
            strokeWidth="5" 
            strokeLinecap="round"
            className="opacity-90"
          />
          <circle cx="20" cy="22" r="4" fill="currentColor" className="opacity-90" />
          <circle cx="20" cy="47" r="4" fill="currentColor" className="opacity-50" />
        </svg>
      </div>
      {showText && (
        <span className="font-(family-name:--font-geist) text-lg tracking-tighter text-foreground">LinkVault</span>
      )}
    </div>
  );
}
