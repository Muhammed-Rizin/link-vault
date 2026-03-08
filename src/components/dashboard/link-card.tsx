"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { VaultLink } from "@/lib/supabase";

type LinkCardProps = {
  link: VaultLink;
  isMenuOpen: boolean;
  onOpenDetails: () => void;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function getDomain(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "example.com";
  }
}

function getDisplaySourceUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./i, "");
    const rest = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    return `${host}${rest}`.replace(/\/$/, "") || host;
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/i, "");
  }
}

export function LinkCard({
  link,
  isMenuOpen,
  onOpenDetails,
  onToggleMenu,
  onEdit,
  onDelete,
}: LinkCardProps) {
  const domain = getDomain(link.url);
  const sourceDomain = getDomain(link.source_url);
  const sourceDisplayUrl = getDisplaySourceUrl(link.source_url);

  return (
    <Card
      className="flex h-full cursor-pointer flex-col border-border/80 bg-card/80 transition-colors hover:border-border"
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
      <CardHeader className="pb-2">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
              alt=""
              className="size-8 rounded-md border border-border/80 bg-background p-1"
            />
            <div className="min-w-0">
              <CardTitle className="truncate text-[15px] leading-5">{link.title}</CardTitle>
              <CardDescription className="mt-1 truncate text-xs">{domain}</CardDescription>
            </div>
          </div>

          <div className="relative shrink-0" data-link-menu>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={(event) => {
                event.stopPropagation();
                onToggleMenu();
              }}
              aria-label="Link options"
            >
              <MoreHorizontal />
            </Button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  className="absolute top-8 right-0 z-30 w-32 rounded-lg border border-border bg-popover p-1 shadow-lg"
                >
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit();
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-accent"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete();
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="overflow-hidden text-sm leading-relaxed text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {link.summary || "No summary yet. Open this link and add notes after review."}
        </p>
        <a
          href={link.source_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="group flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border hover:bg-background/60 hover:text-foreground"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://www.google.com/s2/favicons?domain=${sourceDomain}&sz=32`}
            alt=""
            className="size-4 shrink-0 rounded-sm"
          />
          <span className="truncate text-[11px] font-medium text-foreground/90">
            {sourceDisplayUrl}
          </span>
        </a>
        <div className="mt-auto flex items-end justify-end pt-1">
          <Button asChild size="icon-sm" variant="outline">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open link"
              title="Open link"
              onClick={(event) => event.stopPropagation()}
            >
              <ExternalLink />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
