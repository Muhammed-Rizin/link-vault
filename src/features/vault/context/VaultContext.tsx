"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient, type VaultLink } from "@/shared/services/supabase";

type FormMode = "create" | "edit";

type LinkFormState = {
  title: string;
  url: string;
  sourceUrl: string;
  category: string;
  summary: string;
};

interface VaultContextType {
  // State
  links: VaultLink[];
  filteredLinks: VaultLink[];
  categories: string[];
  activeCategory: string;
  searchQuery: string;
  collapsedSidebar: boolean;
  mobileCategoriesOpen: boolean;
  isInitialLoading: boolean;
  isSubmitting: boolean;
  isEnriching: boolean;
  isSigningOut: boolean;
  selectedLink: VaultLink | null;
  deletingLink: VaultLink | null;
  menuOpenId: string | null;
  formOpen: boolean;
  formMode: FormMode;
  formState: LinkFormState;
  formError: string | null;
  categoryMode: "existing" | "new";
  newCategoryName: string;

  // Setters/Actions
  setCollapsedSidebar: (collapsed: boolean) => void;
  setMobileCategoriesOpen: (open: boolean) => void;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedLink: (link: VaultLink | null) => void;
  setDeletingLink: (link: VaultLink | null) => void;
  setMenuOpenId: (id: string | null) => void;
  setFormOpen: (open: boolean) => void;
  setCategoryMode: (mode: "existing" | "new") => void;
  setNewCategoryName: (name: string) => void;
  setFormState: React.Dispatch<React.SetStateAction<LinkFormState>>;

  // High-level Actions
  openCreateForm: () => void;
  openEditForm: (link: VaultLink) => void;
  handleLogout: () => Promise<void>;
  handleAutoEnrich: () => Promise<void>;
  handleConfirmDelete: () => Promise<void>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: (categoryHint?: string) => void;
}

const VaultContext = React.createContext<VaultContextType | undefined>(undefined);

function normalizeCategory(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function sortLinksLatest(items: VaultLink[]) {
  return [...items].sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bTime - aTime;
  });
}

function toFormState(link?: VaultLink, fallbackCategory = "AI Coding"): LinkFormState {
  if (!link) {
    return {
      title: "",
      url: "",
      sourceUrl: "",
      category: fallbackCategory,
      summary: "",
    };
  }
  return {
    title: link.title,
    url: link.url,
    sourceUrl: link.source_url,
    category: link.category,
    summary: link.summary ?? "",
  };
}

export function VaultProvider({
  children,
  initialLinks,
}: {
  children: React.ReactNode;
  initialLinks: VaultLink[];
}) {
  const [collapsedSidebar, setCollapsedSidebar] = React.useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [links, setLinks] = React.useState<VaultLink[]>(() => sortLinksLatest(initialLinks));
  const [selectedLink, setSelectedLink] = React.useState<VaultLink | null>(null);
  const [menuOpenId, setMenuOpenId] = React.useState<string | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<FormMode>("create");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formState, setFormState] = React.useState<LinkFormState>(toFormState(undefined));
  const [categoryMode, setCategoryMode] = React.useState<"existing" | "new">("existing");
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isEnriching, setIsEnriching] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [deletingLink, setDeletingLink] = React.useState<VaultLink | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);

  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();

  React.useEffect(() => setLinks(sortLinksLatest(initialLinks)), [initialLinks]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setIsInitialLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  const categories = React.useMemo(() => {
    const unique = [
      ...new Set(links.map((link) => normalizeCategory(link.category)).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));
    return ["All", ...unique];
  }, [links]);

  const existingCategories = React.useMemo(
    () => categories.filter((category) => category !== "All"),
    [categories],
  );

  React.useEffect(() => {
    if (!categories.includes(activeCategory)) setActiveCategory("All");
  }, [activeCategory, categories]);

  React.useEffect(() => {
    if (!menuOpenId) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-link-menu]")) {
        setMenuOpenId(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [menuOpenId]);

  React.useEffect(() => {
    setMenuOpenId(null);
  }, [activeCategory, searchQuery]);

  const filteredLinks = React.useMemo(() => {
    const term = searchQuery.toLowerCase().trim();
    const filtered = links.filter((link) => {
      if (activeCategory !== "All" && link.category !== activeCategory) return false;
      if (!term) return true;
      return (
        link.title.toLowerCase().includes(term) ||
        (link.summary ?? "").toLowerCase().includes(term) ||
        link.url.toLowerCase().includes(term) ||
        link.source_url.toLowerCase().includes(term)
      );
    });
    return sortLinksLatest(filtered);
  }, [activeCategory, links, searchQuery]);

  const resetForm = (categoryHint?: string) => {
    const fallback = categoryHint ?? categories[1] ?? "AI Coding";
    setFormState(toFormState(undefined, fallback));
    if (existingCategories.length === 0) {
      setCategoryMode("new");
      setNewCategoryName(fallback);
    } else {
      setCategoryMode("existing");
      setNewCategoryName("");
    }
    setFormMode("create");
    setEditingId(null);
    setFormError(null);
  };

  const openCreateForm = () => {
    const hinted = activeCategory !== "All" ? activeCategory : undefined;
    resetForm(hinted);
    if (hinted && !existingCategories.includes(hinted)) {
      setCategoryMode("new");
      setNewCategoryName(hinted);
    }
    setFormOpen(true);
  };

  const openEditForm = (link: VaultLink) => {
    setFormMode("edit");
    setEditingId(link.id);
    setFormState(toFormState(link));
    if (existingCategories.includes(link.category)) {
      setCategoryMode("existing");
      setNewCategoryName("");
    } else {
      setCategoryMode("new");
      setNewCategoryName(link.category);
    }
    setFormError(null);
    setFormOpen(true);
  };

  const handleAutoEnrich = async () => {
    if (!formState.url.trim()) {
      setFormError("Paste a URL first to run auto-enrichment.");
      return;
    }

    setIsEnriching(true);
    setFormError(null);
    try {
      const response = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: formState.url.trim(),
          existingCategories,
        }),
      });
      const payload = (await response.json()) as {
        title?: string | null;
        summary?: string | null;
        description?: string | null;
        category?: string | null;
      };
      if (!response.ok) throw new Error("enrich_failed");
      const title = payload.title?.trim() || null;
      const summary = payload.summary?.trim() || payload.description?.trim() || null;
      const suggestedCategory = normalizeCategory(payload.category || "");

      if (!title && !summary) {
        setFormError("No metadata was found for this URL.");
        return;
      }

      setFormState((prev) => ({
        ...prev,
        title: title ?? prev.title,
        summary: summary ?? prev.summary,
        category: suggestedCategory || prev.category,
      }));

      // Map suggested category to mode
      if (suggestedCategory) {
        if (existingCategories.includes(suggestedCategory)) {
          setCategoryMode("existing");
          setNewCategoryName("");
        } else {
          setCategoryMode("new");
          setNewCategoryName(suggestedCategory);
        }
      }
    } catch {
      setFormError("Could not enrich this URL right now. You can still add it manually.");
    } finally {
      setIsEnriching(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingLink) return;
    const link = deletingLink;
    setDeletingLink(null);
    const previous = links;
    setLinks((prev) => prev.filter((item) => item.id !== link.id));
    if (selectedLink?.id === link.id) setSelectedLink(null);
    const { error } = await supabase.from("vault_links").delete().eq("id", link.id);
    if (error) {
      setLinks(previous);
      setFormError(error.message);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const category =
      categoryMode === "new"
        ? normalizeCategory(newCategoryName)
        : normalizeCategory(formState.category);
    if (
      !formState.title.trim() ||
      !formState.url.trim() ||
      !formState.sourceUrl.trim() ||
      !category
    ) {
      setFormError("Title, URL, Source URL, and Category are required.");
      return;
    }
    try {
      new URL(formState.url);
      new URL(formState.sourceUrl);
    } catch {
      setFormError("URL and Source URL must be valid links.");
      return;
    }

    setIsSubmitting(true);
    if (formMode === "create") {
      const { data, error } = await supabase
        .from("vault_links")
        .insert({
          title: formState.title.trim(),
          url: formState.url.trim(),
          source_url: formState.sourceUrl.trim(),
          category,
          status: "Backlog",
          summary: formState.summary.trim() || null,
        })
        .select("id, title, url, source_url, category, status, summary, created_at")
        .single();
      setIsSubmitting(false);
      if (error) {
        if (error.code === "23505") {
          return setFormError("This link has already been added to your vault.");
        }
        return setFormError(error.message);
      }
      setLinks((prev) => sortLinksLatest([data as VaultLink, ...prev]));
      setFormOpen(false);
      resetForm(category);
      return;
    }

    if (!editingId) {
      setIsSubmitting(false);
      return setFormError("No link selected for edit.");
    }
    const { data, error } = await supabase
      .from("vault_links")
      .update({
        title: formState.title.trim(),
        url: formState.url.trim(),
        source_url: formState.sourceUrl.trim(),
        category,
        summary: formState.summary.trim() || null,
      })
      .eq("id", editingId)
      .select("id, title, url, source_url, category, status, summary, created_at")
      .single();
    setIsSubmitting(false);
    if (error) {
      if (error.code === "23505") {
        return setFormError("This link has already been added to your vault.");
      }
      return setFormError(error.message);
    }
    setLinks((prev) =>
      sortLinksLatest(prev.map((item) => (item.id === editingId ? (data as VaultLink) : item))),
    );
    if (selectedLink?.id === editingId) setSelectedLink(data as VaultLink);
    setFormOpen(false);
    setMenuOpenId(null);
    resetForm(category);
  };

  const handleLogout = async () => {
    setIsSigningOut(true);
    await new Promise((resolve) => setTimeout(resolve, 180));
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const value = {
    links,
    filteredLinks,
    categories,
    activeCategory,
    searchQuery,
    collapsedSidebar,
    mobileCategoriesOpen,
    isInitialLoading,
    isSubmitting,
    isEnriching,
    isSigningOut,
    selectedLink,
    deletingLink,
    menuOpenId,
    formOpen,
    formMode,
    formState,
    formError,
    categoryMode,
    newCategoryName,
    setCollapsedSidebar,
    setMobileCategoriesOpen,
    setActiveCategory,
    setSearchQuery,
    setSelectedLink,
    setDeletingLink,
    setMenuOpenId,
    setFormOpen,
    setCategoryMode,
    setNewCategoryName,
    setFormState,
    openCreateForm,
    openEditForm,
    handleLogout,
    handleAutoEnrich,
    handleConfirmDelete,
    handleSubmit,
    resetForm,
  };

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const context = React.useContext(VaultContext);
  if (context === undefined) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
}
