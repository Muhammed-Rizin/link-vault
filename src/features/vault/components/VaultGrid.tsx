"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { Badge } from "@/shared/components/ui/badge";
import { useVault } from "../context/VaultContext";
import { VaultCard } from "./VaultCard";
import { VaultCardSkeleton } from "./VaultCardSkeleton";
import { sortCategories } from "@/features/vault/services/category.service";

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

export function VaultGrid() {
  const {
    filteredLinks: links,
    isInitialLoading,
    setSelectedLink,
    openEditForm,
    setDeletingLink,
    menuOpenId,
    setMenuOpenId,
    activeCategory,
    searchQuery,
    setSearchQuery,
  } = useVault();

  // Sort by CATEGORY_LEVELS, then newest first
  const sortedLinks = React.useMemo(() => {
    return [...links].sort((a, b) => {
      // Primary sort: Category Hierarchy
      const order = sortCategories([a.category, b.category]);
      if (a.category !== b.category) {
        return order[0] === a.category ? -1 : 1;
      }
      
      // Secondary sort: Newest first
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [links]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-(family-name:--font-geist) font-bold text-foreground sm:text-2xl">
            Link Vault
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            High-signal links sorted by newest first with source provenance.
          </p>
        </div>
        <Badge variant="outline">{links.length} links</Badge>
      </div>

      {isInitialLoading ? (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <VaultCardSkeleton key={`skeleton-${index}`} />
          ))}
        </section>
      ) : (
        <motion.section
          key={`${activeCategory}:${searchQuery}:${links.length}`}
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {sortedLinks.map((link) => (
            <motion.article key={link.id} variants={itemVariants}>
              <VaultCard
                link={link}
                isMenuOpen={menuOpenId === link.id}
                onOpenDetails={() => setSelectedLink(link)}
                onToggleMenu={() => setMenuOpenId(menuOpenId === link.id ? null : link.id)}
                onEdit={() => openEditForm(link)}
                onDelete={() => setDeletingLink(link)}
              />
            </motion.article>
          ))}
        </motion.section>
      )}

      {!isInitialLoading && !links.length && (
        <div className="mt-10 rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No links match this filter. Add one with the button above.
          </p>
        </div>
      )}
    </main>
  );
}
