"use client";

import * as React from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  type DropAnimation,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Badge } from "@/shared/components/ui/badge";
import { useVault } from "../context/VaultContext";
import { VaultCard } from "./VaultCard";
import { SortableVaultRow } from "./VaultListView";
import { VaultCardSkeleton } from "./VaultCardSkeleton";
import { Loader2, Sparkles } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

export function VaultGrid() {
  const {
    filteredLinks: links,
    isInitialLoading,
    setSelectedLink,
    openEditForm,
    openCreateForm,
    setDeletingLink,
    menuOpenId,
    setMenuOpenId,
    handleReorder,
    isReordering,
    viewMode,
    activeCategory,
  } = useVault();

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const activeLink = React.useMemo(() => links.find((l) => l.id === activeId), [links, activeId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 12,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      handleReorder(active.id as string, over.id as string);
    }

    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  if (isInitialLoading) {
    return (
      <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
        <div className="mb-5 gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {activeCategory === "All" ? "Link Vault" : activeCategory}
            </h2>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground font-normal">
            <Skeleton className="h-5 w-80 bg-muted/80 rounded-md" />
          </div>
        </div>
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <VaultCardSkeleton key={`skeleton-${index}`} />
          ))}
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {activeCategory === "All" ? "Link Vault" : activeCategory}
            </h2>
            <Badge
              variant="outline"
              className="font-semibold text-xs border-border/80 bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-md"
            >
              {links.length} {links.length === 1 ? "link" : "links"}
            </Badge>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground font-normal">
            {viewMode === "list" ? (
              <span>Drag list rows to reorder priority. Changes persist automatically.</span>
            ) : (
              <span>Saved web research and AI summaries.</span>
            )}
            {isReordering && (
              <span className="flex items-center gap-1.5 text-primary font-semibold animate-pulse">
                <Loader2 className="size-3 animate-spin text-primary" />
                Saving order...
              </span>
            )}
          </div>
        </div>
      </div>

      {!links.length ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card shadow-sm">
          <div className="grid size-12 place-items-center rounded-xl border border-border/80 bg-primary/10 text-primary mb-4">
            <Sparkles className="size-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No links found</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No links match your current filter or search criteria. Add your first research link to
            populate your vault.
          </p>
          <button
            onClick={() => openCreateForm()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
          >
            Add First Link
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View: Static, Non-Draggable Grid Cards */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <VaultCard
              key={link.id}
              link={link}
              isMenuOpen={menuOpenId === link.id}
              onOpenDetails={() => setSelectedLink(link)}
              onToggleMenu={() => setMenuOpenId(menuOpenId === link.id ? null : link.id)}
              onEdit={() => openEditForm(link)}
              onDelete={() => setDeletingLink(link)}
            />
          ))}
        </div>
      ) : (
        /* List View: Draggable Sortable List Rows */
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2.5">
              {links.map((link) => (
                <SortableVaultRow
                  key={link.id}
                  link={link}
                  isMenuOpen={menuOpenId === link.id}
                  onOpenDetails={() => setSelectedLink(link)}
                  onToggleMenu={() => setMenuOpenId(menuOpenId === link.id ? null : link.id)}
                  onEdit={() => openEditForm(link)}
                  onDelete={() => setDeletingLink(link)}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay adjustScale dropAnimation={dropAnimation}>
            {activeId && activeLink ? (
              <div className="h-full w-full rotate-1 scale-102 cursor-grabbing opacity-90 shadow-2xl">
                <SortableVaultRow
                  link={activeLink}
                  isMenuOpen={false}
                  onOpenDetails={() => {}}
                  onToggleMenu={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </main>
  );
}
