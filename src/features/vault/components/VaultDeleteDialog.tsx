"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { useVault } from "../context/VaultContext";

export function VaultDeleteDialog() {
  const { deletingLink, setDeletingLink, handleConfirmDelete } = useVault();

  return (
    <Modal
      isOpen={!!deletingLink}
      onClose={() => setDeletingLink(null)}
      title="Delete Link Permanently?"
      description={`This action cannot be undone. This will permanently remove "${deletingLink?.title}" and its metadata from your vault.`}
      icon={
        <div className="grid size-9 place-items-center rounded-xl border border-destructive/20 bg-destructive/10 text-destructive">
          <AlertTriangle className="size-5" />
        </div>
      }
      maxWidth="md"
    >
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" onClick={() => setDeletingLink(null)}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            handleConfirmDelete();
            setDeletingLink(null);
          }}
          className="font-semibold"
        >
          Delete Link
        </Button>
      </div>
    </Modal>
  );
}
