"use client";

import * as React from "react";
import { AuthForm } from "./AuthForm";
import { AnimatePresence, motion } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "login" | "signup";
}

export function AuthModal({ isOpen, onOpenChange, defaultMode = "login" }: AuthModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full max-w-md"
            onClick={(event) => event.stopPropagation()}
          >
            <AuthForm mode={defaultMode} onCancel={() => onOpenChange(false)} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
