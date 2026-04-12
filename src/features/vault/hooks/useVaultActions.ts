import * as React from "react";
import { useRouter } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";
import { VaultLink } from "@/shared/services/supabase";
import { vaultDbService } from "../services/vault.db.service";
import { LinkFormState, FormMode } from "./useVaultForm";

const normalizeCategory = (value: string) => value.replace(/\s+/g, " ").trim();

interface VaultActionsDeps {
  supabase: SupabaseClient;
  links: VaultLink[];
  setLinks: React.Dispatch<React.SetStateAction<VaultLink[]>>;
  formState: LinkFormState;
  formMode: FormMode;
  editingId: string | null;
  categoryMode: "existing" | "new";
  newCategoryName: string;
  setFormOpen: (open: boolean) => void;
  resetForm: (categoryHint?: string) => void;
  selectedLink: VaultLink | null;
  setSelectedLink: (link: VaultLink | null) => void;
  deletingLink: VaultLink | null;
  setDeletingLink: (link: VaultLink | null) => void;
}

export function useVaultActions({
  supabase,
  links,
  setLinks,
  formState,
  formMode,
  editingId,
  categoryMode,
  newCategoryName,
  setFormOpen,
  resetForm,
  selectedLink,
  setSelectedLink,
  deletingLink,
  setDeletingLink,
}: VaultActionsDeps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isReordering, setIsReordering] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const category = categoryMode === "new" 
      ? normalizeCategory(newCategoryName) 
      : normalizeCategory(formState.category);

    if (!formState.title.trim() || !formState.url.trim() || !category) {
      throw new Error("Title, URL, and Category are required.");
    }

    setIsSubmitting(true);
    try {
      if (formMode === "create") {
        const minPos = links.length > 0 ? Math.min(...links.map((l) => l.position ?? 0)) : 0;
        const newLink = await vaultDbService.createLink(supabase, {
          title: formState.title.trim(),
          url: formState.url.trim(),
          source_url: formState.sourceUrl.trim() || formState.url.trim(),
          category,
          status: "Backlog",
          summary: formState.summary.trim() || null,
          youtube_id: formState.youtubeId || null,
          position: minPos - 1024,
        });

        setLinks((prev) => [newLink, ...prev]);
      } else if (editingId) {
        const updatedLink = await vaultDbService.updateLink(supabase, editingId, {
          title: formState.title.trim(),
          url: formState.url.trim(),
          source_url: formState.sourceUrl.trim() || formState.url.trim(),
          category,
          summary: formState.summary.trim() || null,
          youtube_id: formState.youtubeId || null,
        });

        setLinks((prev) => prev.map((item) => (item.id === editingId ? updatedLink : item)));
        if (selectedLink?.id === editingId) setSelectedLink(updatedLink);
      }
      
      setFormOpen(false);
      resetForm(category);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingLink) return;
    const linkId = deletingLink.id;
    setDeletingLink(null);
    
    const previousLinks = [...links];
    setLinks((prev) => prev.filter((item) => item.id !== linkId));
    if (selectedLink?.id === linkId) setSelectedLink(null);

    try {
      await vaultDbService.deleteLink(supabase, linkId);
    } catch (err) {
      setLinks(previousLinks);
      throw err;
    }
  };

  const handleReorder = async (activeId: string, overId: string) => {
    const oldIndex = links.findIndex((l) => l.id === activeId);
    const newIndex = links.findIndex((l) => l.id === overId);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    const newLinks = [...links];
    const [movedItem] = newLinks.splice(oldIndex, 1);
    newLinks.splice(newIndex, 0, movedItem);

    const prevItem = newLinks[newIndex - 1];
    const nextItem = newLinks[newIndex + 1];

    let newPos: number;
    const prevPos = prevItem?.position ?? null;
    const nextPos = nextItem?.position ?? null;

    if (prevPos === null) {
      newPos = (nextPos ?? 0) - 1024;
    } else if (nextPos === null) {
      newPos = prevPos + 1024;
    } else if (prevPos === nextPos) {
      newLinks.forEach((link, idx) => {
        link.position = idx * 1024;
      });
      newPos = movedItem.position;
    } else {
      newPos = (prevPos + nextPos) / 2;
    }

    movedItem.position = newPos;
    setLinks([...newLinks]);
    setIsReordering(true);

    try {
      await vaultDbService.updatePosition(supabase, activeId, newPos);
    } catch (err) {
      setLinks([...links]); // Rollback simplified
      throw err;
    } finally {
      setIsReordering(false);
    }
  };

  const handleLogout = async () => {
    setIsSigningOut(true);
    await new Promise((resolve) => setTimeout(resolve, 180));
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return {
    handleSubmit,
    handleConfirmDelete,
    handleReorder,
    handleLogout,
    isSubmitting,
    isReordering,
    isSigningOut,
  };
}
