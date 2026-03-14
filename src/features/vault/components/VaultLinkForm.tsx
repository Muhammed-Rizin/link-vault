"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
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

  return (
    <AnimatePresence>
      {formOpen && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            className="w-full max-w-xl"
          >
            <Card className="border-border/80 bg-card overflow-hidden">
              <CardHeader className="relative">
                {isEnriching && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-muted overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {formMode === "create" ? "Add Link To Vault" : "Edit Link"}
                      {isEnriching && <Loader2 className="size-4 animate-spin text-primary" />}
                    </CardTitle>
                    <CardDescription>
                      Save URL, source URL, dynamic category, and summary.
                    </CardDescription>
                  </div>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => {
                      setFormOpen(false);
                      resetForm();
                    }}
                  >
                    <X />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL</label>
                    <div className="flex gap-2">
                      <Input
                        value={formState.url}
                        onChange={(e) => setFormState((prev) => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com/article"
                        required
                        className={cn("flex-1", isEnriching && "opacity-50 pointer-events-none")}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAutoEnrich}
                        disabled={isEnriching}
                        className="h-10 px-4"
                      >
                        {isEnriching ? "Enriching..." : "Auto Enrich"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    {isEnriching ? (
                      <Skeleton className="h-10 w-full rounded-md" />
                    ) : (
                      <Input
                        value={formState.title}
                        onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Readable title"
                        required
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Source URL (Optional)</label>
                    <Input
                      value={formState.sourceUrl}
                      onChange={(e) =>
                        setFormState((prev) => ({ ...prev, sourceUrl: e.target.value }))
                      }
                      placeholder="https://instagram.com/..."
                    />
                  </div>

                  <div className="space-y-3">
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Summary (Optional)</label>
                    {isEnriching ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-11/12" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    ) : (
                      <textarea
                        value={formState.summary}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, summary: e.target.value }))
                        }
                        rows={4}
                        className="w-full rounded-lg border border-input/80 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                        placeholder="Auto-Enrich can populate this from the URL."
                      />
                    )}
                  </div>

                  {formError && <p className="text-sm text-destructive">{formError}</p>}

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setFormOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || isEnriching}>
                      {isSubmitting ? "Saving..." : formMode === "create" ? "Save" : "Update"}
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
