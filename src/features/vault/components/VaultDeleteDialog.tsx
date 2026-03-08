"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { useVault } from "../context/VaultContext";

export function VaultDeleteDialog() {
  const { deletingLink, setDeletingLink, handleConfirmDelete } = useVault();

  return (
    <AlertDialog open={!!deletingLink} onOpenChange={(open) => !open && setDeletingLink(null)}>
      <AlertDialogContent className="border-border/80 bg-card">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/15 text-destructive">
            <AlertTriangle className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Link Permanently?</AlertDialogTitle>
          <AlertDialogDescription className="text-balance">
            This action cannot be undone. This will permanently remove &quot;{deletingLink?.title}
            &quot; and its associated metadata from your vault.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Link
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
