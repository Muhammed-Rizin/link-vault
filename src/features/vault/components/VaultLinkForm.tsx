"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/utils/utils";
import { CategoryPicker } from "./CategoryPicker";
import { useVault } from "../context/VaultContext";

export function VaultLinkForm() {
  const {
    formOpen,
    setFormOpen,
    resetForm,
    formMode,
    formState,
    setFormState,
    handleAutoEnrich,
    isEnriching,
    categoryMode,
    setCategoryMode,
    newCategoryName,
    setNewCategoryName,
    formError,
    isSubmitting,
    handleSubmit,
    categories,
  } = useVault();

  const existingCategories = React.useMemo(
    () => categories.filter((category) => category !== "All"),
    [categories]
  );

  const handleClose = React.useCallback(() => {
    setFormOpen(false);
    resetForm();
  }, [setFormOpen, resetForm]);

  return (
    <AnimatePresence>
      {formOpen && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-[#262626] bg-[#141414] shadow-2xl overflow-hidden rounded-xl">
              <CardHeader className="relative pb-3 px-6 pt-5 border-b border-[#262626]">
                {isEnriching && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-[#262626] overflow-hidden">
                    <motion.div 
                      className="h-full bg-white"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md border border-[#262626] bg-[#0a0a0a] text-white">
                      <Sparkles className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base font-bold text-white">
                        {formMode === "create" ? "Add link to vault" : "Edit link"}
                        {isEnriching && <Loader2 className="size-3.5 animate-spin text-white" />}
                      </CardTitle>
                      <CardDescription className="text-xs font-normal text-zinc-400 mt-0.5">
                        Save target URL, source URL, dynamic category, and summary.
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={handleClose}
                    className="rounded text-zinc-400 hover:bg-[#262626]"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="px-6 py-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-400">
                      Target URL
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={formState.url}
                        onChange={(e) => setFormState((prev) => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com/article"
                        required
                        className={cn("flex-1 h-9 bg-[#0a0a0a] border-[#262626] rounded-md text-xs", isEnriching && "opacity-50 pointer-events-none")}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAutoEnrich}
                        disabled={isEnriching}
                        className="h-9 px-3 font-semibold text-xs border-[#262626] bg-[#0a0a0a] text-white hover:bg-[#262626] rounded-md"
                      >
                        {isEnriching ? "Enriching..." : "Auto enrich"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-400">
                      Title
                    </label>
                    {isEnriching ? (
                      <Skeleton className="h-9 w-full rounded-md" />
                    ) : (
                      <Input
                        value={formState.title}
                        onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Readable title"
                        required
                        className="h-9 bg-[#0a0a0a] border-[#262626] rounded-md text-xs"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-400">
                      Source URL (optional)
                    </label>
                    <Input
                      value={formState.sourceUrl}
                      onChange={(e) =>
                        setFormState((prev) => ({ ...prev, sourceUrl: e.target.value }))
                      }
                      placeholder="https://instagram.com/..., twitter.com/..."
                      className="h-9 bg-[#0a0a0a] border-[#262626] rounded-md text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <CategoryPicker
                      existingCategories={existingCategories}
                      categoryMode={categoryMode}
                      selectedCategory={formState.category}
                      newCategoryName={newCategoryName}
                      onCategoryModeChange={setCategoryMode}
                      onSelectedCategoryChange={(category) =>
                        setFormState((prev) => ({ ...prev, category }))
                      }
                      onNewCategoryNameChange={setNewCategoryName}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-400">
                      Summary (optional)
                    </label>
                    {isEnriching ? (
                      <div className="space-y-1.5 p-2.5 rounded-md border border-[#262626] bg-[#0a0a0a]">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-11/12" />
                        <Skeleton className="h-3 w-4/5" />
                      </div>
                    ) : (
                      <textarea
                        value={formState.summary}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, summary: e.target.value }))
                        }
                        rows={3}
                        className="w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus-visible:border-zinc-500 focus-visible:outline-none"
                        placeholder="Auto-enrich populates this automatically."
                      />
                    )}
                  </div>

                  {formError && (
                    <p className="text-xs text-red-400 font-semibold bg-red-500/10 p-2.5 rounded-md border border-red-500/20 text-center">
                      {formError}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#262626]">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleClose}
                      className="font-medium text-xs rounded-md text-zinc-400 hover:bg-[#262626]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || isEnriching}
                      className="h-9 px-4 font-semibold text-xs bg-white text-black hover:bg-zinc-200 rounded-md transition-colors"
                    >
                      {isSubmitting ? "Saving..." : formMode === "create" ? "Save to vault" : "Update link"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
