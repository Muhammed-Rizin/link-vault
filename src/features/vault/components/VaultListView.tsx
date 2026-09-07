"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, GripVertical, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/utils";
import type { VaultLink } from "@/shared/services/supabase";
import { VaultLinkCover } from "./VaultLinkCover";

interface SortableVaultRowProps {
  link: VaultLink;
  isMenuOpen: boolean;
  onOpenDetails: () => void;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "example.com";
  }
}

export function SortableVaultRow({
  link,
  isMenuOpen,
  onOpenDetails,
  onToggleMenu,
  onEdit,
  onDelete,
}: SortableVaultRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
    data: { type: "link", link },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const domain = getDomain(link.url);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-center justify-between gap-3.5 rounded-xl border border-border/80 bg-card px-3.5 py-2.5 transition-all hover:border-primary/40 shadow-sm hover:shadow-md",
        isMenuOpen && "border-primary/60 bg-accent/40"
      )}
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground transition-colors p-1 shrink-0"
        aria-label="Drag handle"
      >
        <GripVertical className="size-4" />
      </button>

      {/* Main info & Preview */}
      <div
        className="flex flex-1 min-w-0 items-center gap-3.5 cursor-pointer"
        onClick={onOpenDetails}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenDetails();
          }
        }}
      >
        {/* Constrained Thumbnail Preview Container */}
        <VaultLinkCover link={link} layout="list" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
              {link.title}
            </h4>
            <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-semibold uppercase tracking-wider bg-muted/60 border-border/80 shrink-0 text-muted-foreground rounded-md">
              {link.category}
            </Badge>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground font-normal">
            {link.summary || domain}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          asChild
          size="icon-xs"
          variant="outline"
          className="rounded-lg border-border/80 bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open link"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="size-3" />
          </a>
        </Button>

        <div className="relative">
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu();
            }}
            className="rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </Button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                className="absolute right-0 top-7 z-30 w-32 rounded-xl border border-border/80 bg-popover p-1 shadow-xl backdrop-blur-xl"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium hover:bg-accent transition-colors text-foreground"
                >
                  <Pencil className="size-3.5 opacity-70" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="size-3.5 opacity-70" />
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
