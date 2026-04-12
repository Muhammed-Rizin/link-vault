import * as React from "react";

export type FormMode = "create" | "edit";

export type LinkFormState = {
  title: string;
  url: string;
  sourceUrl: string;
  category: string;
  summary: string;
  youtubeId?: string | null;
};

const INITIAL_FORM_STATE: LinkFormState = {
  title: "",
  url: "",
  sourceUrl: "",
  category: "",
  summary: "",
  youtubeId: null,
};

const normalizeCategory = (value: string) => value.replace(/\s+/g, " ").trim();

export function useVaultForm(existingCategories: string[]) {
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<FormMode>("create");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formState, setFormState] = React.useState<LinkFormState>(INITIAL_FORM_STATE);
  const [categoryMode, setCategoryMode] = React.useState<"existing" | "new">("existing");
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isEnriching, setIsEnriching] = React.useState(false);

  const resetForm = React.useCallback((categoryHint?: string, initialUrl?: string) => {
    const fallbackCategory = categoryHint ?? "";
    setFormState({
      ...INITIAL_FORM_STATE,
      category: fallbackCategory,
      url: initialUrl ?? "",
    });
    
    if (existingCategories.length === 0 || !fallbackCategory) {
      setCategoryMode("new");
      setNewCategoryName(fallbackCategory);
    } else {
      setCategoryMode("existing");
      setNewCategoryName("");
    }
    
    setFormMode("create");
    setEditingId(null);
    setFormError(null);
  }, [existingCategories]);

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
      
      const payload = await response.json();
      if (!response.ok) throw new Error("enrich_failed");

      const title = payload.title?.trim() || null;
      // Prioritize description for the detailed text area, fallback to summary
      const summaryContent = payload.description?.trim() || payload.summary?.trim() || null;
      const primaryCategory = normalizeCategory(
        payload.suggestedCategories?.[0] || payload.category || "Web",
      );
      const youtubeId = payload.youtubeId || null;

      if (!title && !summaryContent) {
        setFormError("No metadata was found for this URL.");
        return;
      }

      setFormState((prev) => ({
        ...prev,
        title: title ?? prev.title,
        summary: summaryContent ?? prev.summary,
        category: primaryCategory,
        youtubeId: youtubeId ?? prev.youtubeId,
      }));

      if (primaryCategory) {
        const lowerPrimary = primaryCategory.toLowerCase();
        const existingMatch = existingCategories.find((cat) => cat.toLowerCase() === lowerPrimary);

        if (existingMatch) {
          setFormState((prev) => ({ ...prev, category: existingMatch }));
          setCategoryMode("existing");
          setNewCategoryName("");
        } else {
          setCategoryMode("new");
          setNewCategoryName(primaryCategory);
        }
      }
    } catch {
      setFormError("Could not enrich this URL right now. You can still add it manually.");
    } finally {
      setIsEnriching(false);
    }
  };

  return {
    formOpen,
    setFormOpen,
    formMode,
    setFormMode,
    editingId,
    setEditingId,
    formState,
    setFormState,
    categoryMode,
    setCategoryMode,
    newCategoryName,
    setNewCategoryName,
    formError,
    setFormError,
    isEnriching,
    resetForm,
    handleAutoEnrich,
  };
}
