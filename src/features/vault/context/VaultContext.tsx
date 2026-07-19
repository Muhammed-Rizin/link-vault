"use client";

import * as React from "react";
import { createSupabaseBrowserClient, type VaultLink } from "@/shared/services/supabase";
import { useVaultNavigation } from "../hooks/useVaultNavigation";
import { useVaultForm, LinkFormState, FormMode } from "../hooks/useVaultForm";
import { useVaultActions } from "../hooks/useVaultActions";

export type ViewMode = "grid" | "list";

interface VaultContextType {
  // Navigation State
  collapsedSidebar: boolean;
  setCollapsedSidebar: (collapsed: boolean) => void;
  mobileCategoriesOpen: boolean;
  setMobileCategoriesOpen: (open: boolean) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: string[];
  
  // View Mode State
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Link State
  links: VaultLink[];
  filteredLinks: VaultLink[];
  
  // Form State
  formOpen: boolean;
  setFormOpen: (open: boolean) => void;
  formMode: FormMode;
  formState: LinkFormState;
  setFormState: React.Dispatch<React.SetStateAction<LinkFormState>>;
  formError: string | null;
  categoryMode: "existing" | "new";
  setCategoryMode: (mode: "existing" | "new") => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  
  // Status State
  isInitialLoading: boolean;
  isSubmitting: boolean;
  isEnriching: boolean;
  isReordering: boolean;
  isSigningOut: boolean;
  
  // Selection State
  selectedLink: VaultLink | null;
  setSelectedLink: (link: VaultLink | null) => void;
  deletingLink: VaultLink | null;
  setDeletingLink: (link: VaultLink | null) => void;
  menuOpenId: string | null;
  setMenuOpenId: (id: string | null) => void;

  // Actions
  openCreateForm: (initialUrl?: string) => void;
  openEditForm: (link: VaultLink) => void;
  handleLogout: () => Promise<void>;
  handleAutoEnrich: () => Promise<void>;
  handleConfirmDelete: () => Promise<void>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: (categoryHint?: string, initialUrl?: string) => void;
  handleReorder: (activeId: string, overId: string) => Promise<void>;
}

const VaultContext = React.createContext<VaultContextType | undefined>(undefined);

const sortLinksByPosition = (items: VaultLink[]) => 
  [...items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0) || 
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

export function VaultProvider({ children, initialLinks }: { children: React.ReactNode; initialLinks: VaultLink[] }) {
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);
  const [links, setLinks] = React.useState<VaultLink[]>(() => sortLinksByPosition(initialLinks));
  const [selectedLink, setSelectedLink] = React.useState<VaultLink | null>(null);
  const [deletingLink, setDeletingLink] = React.useState<VaultLink | null>(null);
  const [menuOpenId, setMenuOpenId] = React.useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");

  // Modular Hooks
  const nav = useVaultNavigation(links);
  const form = useVaultForm(nav.existingCategories);
  const actions = useVaultActions({
    supabase,
    links,
    setLinks,
    formState: form.formState,
    formMode: form.formMode,
    editingId: form.editingId,
    categoryMode: form.categoryMode,
    newCategoryName: form.newCategoryName,
    setFormOpen: form.setFormOpen,
    resetForm: form.resetForm,
    selectedLink,
    setSelectedLink,
    deletingLink,
    setDeletingLink,
  });

  // Derived State
  const filteredLinks = React.useMemo(() => {
    const term = nav.searchQuery.toLowerCase().trim();
    return links.filter((link) => {
      if (nav.activeCategory !== "All" && link.category !== nav.activeCategory) return false;
      if (!term) return true;
      return (
        link.title.toLowerCase().includes(term) ||
        (link.summary ?? "").toLowerCase().includes(term) ||
        link.url.toLowerCase().includes(term)
      );
    });
  }, [nav.activeCategory, nav.searchQuery, links]);

  // Effects
  React.useEffect(() => setLinks(sortLinksByPosition(initialLinks)), [initialLinks]);
  React.useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 420);
    return () => clearTimeout(timer);
  }, []);

  // Event Handlers
  const openCreateForm = (initialUrl?: string) => {
    const hint = nav.activeCategory !== "All" ? nav.activeCategory : undefined;
    form.resetForm(hint, initialUrl);
    form.setFormOpen(true);
    if (initialUrl?.trim()) setTimeout(() => form.handleAutoEnrich(), 100);
  };

  const openEditForm = (link: VaultLink) => {
    form.setFormMode("edit");
    form.setEditingId(link.id);
    form.setFormState({
      title: link.title,
      url: link.url,
      sourceUrl: link.source_url === link.url ? "" : link.source_url || "",
      category: link.category,
      summary: link.summary ?? "",
      youtubeId: link.youtube_id,
    });
    
    const isExisting = nav.existingCategories.includes(link.category);
    form.setCategoryMode(isExisting ? "existing" : "new");
    form.setNewCategoryName(isExisting ? "" : link.category);
    form.setFormError(null);
    form.setFormOpen(true);
  };

  const value = {
    ...nav,
    ...form,
    ...actions,
    viewMode,
    setViewMode,
    links,
    filteredLinks,
    isInitialLoading,
    selectedLink,
    setSelectedLink,
    deletingLink,
    setDeletingLink,
    menuOpenId,
    setMenuOpenId,
    openCreateForm,
    openEditForm,
  };

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const context = React.useContext(VaultContext);
  if (context === undefined) throw new Error("useVault must be used within a VaultProvider");
  return context;
}
