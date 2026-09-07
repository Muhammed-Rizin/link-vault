"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/utils";

interface ThemeToggleProps {
  variant?: "icon" | "full" | "dropdown";
  className?: string;
}

export function ThemeToggle({ variant = "icon", className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>, targetTheme?: string) => {
    const nextTheme = targetTheme || (resolvedTheme === "dark" ? "light" : "dark");

    // Check for View Transition support
    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(nextTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const doc = document as unknown as {
      startViewTransition?: (callback: () => void) => { ready: Promise<void> };
    };

    if (!doc.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const transition = doc.startViewTransition(() => {
      setTheme(nextTheme);
    });


    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      const isDark = nextTheme === "dark";

      document.documentElement.animate(
        {
          clipPath: isDark ? clipPath : clipPath.reverse(),
        },
        {
          duration: 450,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: isDark
            ? "::view-transition-new(root)"
            : "::view-transition-old(root)",
        }
      );
    });
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={variant === "full" ? "default" : "icon-sm"}
        className={cn("rounded-xl opacity-0", className)}
        aria-label="Toggle theme"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "full") {
    return (
      <div className={cn("relative w-full", className)}>
        <button
          type="button"
          onClick={(e) => handleToggle(e)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl font-semibold text-xs transition-all duration-200 border border-border/60 bg-card/40 hover:bg-accent hover:text-foreground text-muted-foreground"
        >
          <div className="flex items-center gap-3">
            <div className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={resolvedTheme}
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: 90, scale: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {isDark ? <Moon className="size-4 text-sky-400" /> : <Sun className="size-4 text-amber-500" />}
                </motion.div>
              </AnimatePresence>
            </div>
            <span>{isDark ? "Dark Mode" : "Light Mode"}</span>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
            {theme === "system" ? "System" : isDark ? "Dark" : "Light"}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => handleToggle(e)}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuOpen(!menuOpen);
        }}
        title={`Current: ${theme} theme. Click to toggle, Right-click for options.`}
        aria-label="Toggle theme"
        className={cn(
          "relative overflow-hidden rounded-xl border border-border/60 bg-card/40 hover:bg-accent text-foreground transition-all duration-200 shadow-sm",
          className
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={resolvedTheme}
            initial={{ y: -15, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 15, opacity: 0, rotate: 45 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center justify-center"
          >
            {isDark ? (
              <Moon className="size-4 text-sky-400 fill-sky-400/20" />
            ) : (
              <Sun className="size-4 text-amber-500 fill-amber-500/20" />
            )}
          </motion.div>
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[130px] rounded-xl border border-border/80 bg-popover p-1.5 shadow-xl backdrop-blur-xl"
            >
              <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Theme
              </div>
              <button
                type="button"
                onClick={(e) => {
                  handleToggle(e, "light");
                  setMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                  theme === "light"
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <Sun className="size-3.5 text-amber-500" />
                  <span>Light</span>
                </div>
                {theme === "light" && <Check className="size-3.5" />}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  handleToggle(e, "dark");
                  setMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                  theme === "dark"
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <Moon className="size-3.5 text-sky-400" />
                  <span>Dark</span>
                </div>
                {theme === "dark" && <Check className="size-3.5" />}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  handleToggle(e, "system");
                  setMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                  theme === "system"
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <Laptop className="size-3.5 text-emerald-500" />
                  <span>System</span>
                </div>
                {theme === "system" && <Check className="size-3.5" />}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
