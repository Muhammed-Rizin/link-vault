"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/shared/components/ui/badge";
import { useVault } from "../context/VaultContext";
import { VaultCard } from "./VaultCard";
import { VaultCardSkeleton } from "./VaultCardSkeleton";
import { Loader2 } from "lucide-react";
import { type VaultLink } from "@/shared/services/supabase";

interface SortableVaultCardProps {
  link: VaultLink;
  isMenuOpen: boolean;
  onOpenDetails: () => void;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableVaultCard({ link, ...props }: SortableVaultCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: link.id,
    data: {
      type: 'link',
      link,
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="h-full outline-none"
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="h-full"
        onContextMenu={(e) => e.preventDefault()}
      >
        <VaultCard link={link} {...props} />
      </div>
    </div>
  );
}

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
    setDeletingLink,
    menuOpenId,
    setMenuOpenId,
    handleReorder,
    isReordering,
  } = useVault();

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const activeLink = React.useMemo(() => links.find((l) => l.id === activeId), [links, activeId]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 500,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    // DEBUG: This confirms if the drop target is being correctly identified
    console.log(`[DnD] Drop attempt. Active: ${active.id}, Over: ${over?.id}`);

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
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-(family-name:--font-geist) font-bold text-foreground sm:text-2xl">
            Link Vault
          </h2>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Drag to rearrange. Changes persist automatically.</span>
            {isReordering && (
              <span className="flex items-center gap-1.5 text-primary font-medium animate-pulse">
                <Loader2 className="size-3 animate-spin" />
                Saving...
              </span>
            )}
          </div>
        </div>
        <Badge variant="outline">{links.length} links</Badge>
      </div>

      {!links.length ? (
        <div className="mt-10 rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No links match this filter. Add one with the button above.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          {/* 
            CRITICAL: The SortableContext MUST receive the array of IDs that exactly matches the 
            IDs of the children it is managing.
          */}
          <SortableContext 
            items={links.map((l) => l.id)} 
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {links.map((link) => (
                <SortableVaultCard
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
              <div className="h-full w-full rotate-1 scale-105 cursor-grabbing opacity-90 shadow-2xl pointer-events-none">
                <VaultCard
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
