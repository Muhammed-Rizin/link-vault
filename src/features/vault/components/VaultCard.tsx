/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  ExternalLink,
  Globe,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/utils";
import type { VaultLink } from "@/shared/services/supabase";
import { VaultLinkCover } from "./VaultLinkCover";

type VaultCardProps = {
  link: VaultLink;
  isMenuOpen: boolean;
  onOpenDetails: () => void;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "example.com";
  }
}

export function VaultCard({
  link,
  isMenuOpen,
  onOpenDetails,
  onToggleMenu,
  onEdit,
  onDelete,
}: VaultCardProps) {
  const [copied, setCopied] = React.useState(false);
  const domain = getDomain(link.url);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Card
      className="border text-card-foreground group relative flex h-full cursor-pointer flex-col justify-end overflow-hidden border-[#262626] bg-[#141414] transition-colors hover:border-zinc-500/50 rounded-lg shadow-sm"
      onClick={onOpenDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDetails();
        }
      }}
    >
      <VaultLinkCover link={link} layout="grid" />

      {/* Main Card Content */}
      <CardContent className="flex flex-1 flex-col justify-end p-4 gap-2.5">
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-semibold text-white leading-snug group-hover:text-zinc-200 transition-colors flex-1 min-w-0">
              {link.title}
            </h3>

            <div className="relative shrink-0" data-link-menu>
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleMenu();
                }}
                aria-label="Link options"
                className={cn(
                  "rounded transition-all hover:bg-[#262626]",
                  isMenuOpen ? "opacity-100 bg-[#262626]" : "opacity-50 group-hover:opacity-100",
                )}
              >
                <MoreHorizontal className="size-4" />
              </Button>
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    className="absolute top-7 right-0 z-30 w-32 rounded-md border border-[#262626] bg-[#141414] p-1 shadow-xl"
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit();
                      }}
                      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium hover:bg-[#262626] transition-colors text-zinc-200"
                    >
                      <Pencil className="size-3.5 opacity-70" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
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

          {/* Category Pill */}
          <div>
            <Badge
              variant="outline"
              className="h-4.5 px-1.5 text-[9px] font-medium uppercase tracking-wider bg-[#0a0a0a] border-[#262626] text-zinc-300"
            >
              {link.category}
            </Badge>
          </div>

          {/* Expanded Summary Snippet */}
          <p className="line-clamp-3 text-xs leading-relaxed font-normal text-zinc-400">
            {link.summary || "No summary captured yet. Click to view details or enrich metadata."}
          </p>
        </div>

        {/* Footer Actions Anchored at Bottom */}
        <div className="mt-auto pt-3 border-t border-[#262626] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
            <Globe className="size-3 text-zinc-500" />
            <span className="truncate max-w-35">{domain}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={handleCopy}
              title="Copy URL"
              className="rounded text-zinc-400 hover:text-white hover:bg-[#262626]"
            >
              {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
            </Button>

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
                aria-label="Open target link"
                title="Open target link"
                onClick={(event) => event.stopPropagation()}
              >
                <ExternalLink className="size-3" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
