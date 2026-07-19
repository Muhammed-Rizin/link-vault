"use client";

import * as React from "react";
import { AuthForm } from "./AuthForm";
import { Modal } from "@/shared/components/ui/modal";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "login" | "signup";
}

export function AuthModal({ isOpen, onOpenChange, defaultMode = "login" }: AuthModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      showCloseButton={false}
      bodyClassName="p-0 border-none bg-transparent overflow-hidden"
      className="p-0 border-none bg-transparent shadow-none"
    >
      <AuthForm mode={defaultMode} onCancel={() => onOpenChange(false)} />
    </Modal>
  );
}
