"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  children: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  maxWidth = "md",
  children,
  showCloseButton = true,
  className,
  headerClassName,
  bodyClassName,
}: ModalProps) {
  // Close on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/65 px-4 py-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative w-full rounded-2xl border border-border/80 bg-card text-card-foreground shadow-2xl shadow-black/40 outline-none my-auto overflow-hidden",
              maxWidthMap[maxWidth],
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || showCloseButton || icon) && (
              <div
                className={cn(
                  "flex items-start justify-between gap-4 border-b border-border/60 px-6 py-5 bg-card/50",
                  headerClassName
                )}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
                  {(title || description) && (
                    <div className="min-w-0">
                      {title && (
                        <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                          {title}
                        </h3>
                      )}
                      {description && (
                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                          {description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {showCloseButton && (
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            )}

            <div className={cn("p-6", bodyClassName)}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
