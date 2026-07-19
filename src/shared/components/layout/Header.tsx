"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command, LayoutGrid, List, Menu, Plus, Search, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/utils";
import { useVault } from "@/features/vault/context/VaultContext";

export function Header() {
  const {
    mobileCategoriesOpen,
    setMobileCategoriesOpen,
    searchQuery: query,
    setSearchQuery: setQuery,
    openCreateForm: openCreate,
    categories,
    activeCategory,
    setActiveCategory,
    viewMode,
    setViewMode,
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
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/80 px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <Button
          size="icon-sm"
          variant="outline"
          className="md:hidden"
          aria-label={mobileCategoriesOpen ? "Close categories" : "Open categories"}
          onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
        >
          {mobileCategoriesOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>

        <div className="relative flex-1 max-w-2xl">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 pl-10 pr-16 bg-card/60 border-border/80 focus-visible:ring-primary/40 rounded-xl"
            placeholder="Search links, source URLs, or summaries..."
          />
          <div className="pointer-events-none absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center gap-1 rounded-lg border border-border/80 bg-background/80 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
            <Command className="size-3" />
            <span>K</span>
          </div>
        </div>

        {/* View Switcher Toggle */}
        <div className="hidden sm:flex items-center rounded-xl border border-border/80 bg-card/60 p-1">
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            title="Grid View"
            className={cn(
              "rounded-lg transition-all",
              viewMode === "grid"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <LayoutGrid className="size-3.5" />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => setViewMode("list")}
            aria-label="List view"
            title="List View"
            className={cn(
              "rounded-lg transition-all",
              viewMode === "list"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <List className="size-3.5" />
          </Button>
        </div>

        <Button
          size="sm"
          onClick={() => openCreate()}
          className="shrink-0 font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 rounded-lg px-4"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Add Link</span>
        </Button>
      </div>

      <AnimatePresence>
        {mobileCategoriesOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 md:hidden">
              <div className="no-scrollbar flex overflow-x-auto scroll-smooth py-1 focus-visible:outline-none">
                <div className="flex gap-2 px-1">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      size="sm"
                      variant={category === activeCategory ? "default" : "ghost"}
                      className={cn(
                        "h-8 shrink-0 rounded-full px-4 text-xs font-semibold whitespace-nowrap transition-all",
                        category === activeCategory
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground",
                      )}
                      onClick={() => {
                        setActiveCategory(category);
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
