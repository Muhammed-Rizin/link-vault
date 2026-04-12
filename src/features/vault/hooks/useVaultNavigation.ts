import * as React from "react";
import { VaultLink } from "@/shared/services/supabase";
import { sortCategories } from "../services/category.service";

const normalizeCategory = (value: string) => value.replace(/\s+/g, " ").trim();

export function useVaultNavigation(links: VaultLink[]) {
  const [collapsedSidebar, setCollapsedSidebar] = React.useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  const categories = React.useMemo(() => {
    const unique = [
      ...new Set(links.map((link) => normalizeCategory(link.category)).filter(Boolean)),
    ];
    return sortCategories(["All", ...unique]);
  }, [links]);

  const existingCategories = React.useMemo(() => {
    const raw = links.map((link) => normalizeCategory(link.category)).filter(Boolean);
    const unique = [...new Set(raw)];
    return sortCategories(unique);
  }, [links]);

  // Ensure active category is valid when links change
  React.useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activeCategory, categories]);

  return {
    collapsedSidebar,
    setCollapsedSidebar,
    mobileCategoriesOpen,
    setMobileCategoriesOpen,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    categories,
    existingCategories,
  };
}
