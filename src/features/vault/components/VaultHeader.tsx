"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command, Menu, Plus, Search, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useVault } from "../context/VaultContext";

export function VaultHeader() {
  const {
    mobileCategoriesOpen,
    setMobileCategoriesOpen,
    searchQuery: query,
    setSearchQuery: setQuery,
    openCreateForm: openCreate,
    categories,
    activeCategory,
    setActiveCategory,
  } = useVault();

  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      const element = target as HTMLElement | null;
      if (!element) return false;
      const tagName = element.tagName;
      return (
        element.isContentEditable ||
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        tagName === "SELECT"
      );
    };

    const handler = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
        event.preventDefault();
        openCreate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openCreate]);

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <Button
          size="icon-sm"
          variant="outline"
          className="md:hidden"
          aria-label={mobileCategoriesOpen ? "Close categories" : "Open categories"}
          onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
        >
          {mobileCategoriesOpen ? <X /> : <Menu />}
        </Button>
        <div className="relative w-full max-w-2xl">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 pl-9 pr-16"
            placeholder="Search links, source URLs, or summaries..."
          />
          <div className="pointer-events-none absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-border/80 bg-background/70 px-1.5 py-0.5 text-xs text-muted-foreground">
            <Command className="size-3" />
            <span>K</span>
          </div>
        </div>
        <Button size="sm" variant="secondary" onClick={openCreate}>
          <Plus />
          Add Link
        </Button>
      </div>

      <AnimatePresence>
        {mobileCategoriesOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 flex flex-wrap gap-2 md:hidden"
          >
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={category === activeCategory ? "secondary" : "ghost"}
                className="rounded-full"
                onClick={() => {
                  setActiveCategory(category);
                }}
              >
                {category}
              </Button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
