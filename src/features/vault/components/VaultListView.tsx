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
  const [imageFailed, setImageFailed] = React.useState(false);

  const coverImage = link.youtube_id
    ? `https://img.youtube.com/vi/${link.youtube_id}/hqdefault.jpg`
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-center justify-between gap-3.5 rounded-lg border border-[#262626] bg-[#141414] px-3.5 py-2.5 transition-colors hover:border-zinc-500/50",
        isMenuOpen && "border-zinc-500 bg-[#1c1c1c]"
      )}
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-300 transition-colors p-1 shrink-0"
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
        <div className="shrink-0 overflow-hidden rounded-md border border-[#262626] bg-[#0a0a0a] flex items-center justify-center size-10">
          {coverImage && !imageFailed ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={coverImage}
              alt=""
              className="size-full object-cover opacity-90 transition-transform duration-200 group-hover:scale-105"
              onError={() => setImageFailed(true)}
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
              alt=""
              className="size-5 object-contain"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-xs font-semibold text-white group-hover:text-zinc-200 transition-colors">
              {link.title}
            </h4>
            <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-medium uppercase tracking-wider bg-[#0a0a0a] border-[#262626] shrink-0 text-zinc-400">
              {link.category}
            </Badge>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-zinc-400 font-normal">
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
          className="rounded border-[#262626] bg-[#0a0a0a] hover:bg-white hover:text-black hover:border-white transition-colors"
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
            className="rounded hover:bg-[#262626] text-zinc-400 hover:text-white"
          >
            <MoreHorizontal className="size-4" />
          </Button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                className="absolute right-0 top-7 z-30 w-32 rounded-md border border-[#262626] bg-[#141414] p-1 shadow-xl"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium hover:bg-[#262626] transition-colors text-zinc-200"
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
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
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
