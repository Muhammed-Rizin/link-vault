/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
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
  const sourceDomain = getDomain(link.source_url);
  const sourceDisplayUrl = getDisplaySourceUrl(link.source_url);

  return (
    <Card
      className="group flex h-full cursor-pointer flex-col overflow-hidden border-border/80 bg-card/80 transition-all hover:border-border hover:shadow-lg hover:shadow-black/5"
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
      <CardHeader className="pb-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={`https://www.google.com/s2/favicons?domain=${getDomain(link.url)}&sz=64`}
                alt=""
                className="size-8 rounded-lg border border-border/80 bg-background p-1.5 shadow-sm"
              />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-[15px] leading-tight font-bold tracking-tight group-hover:text-primary transition-colors">
                {link.title}
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-1 text-[12px]">
                <span className="size-1 rounded-full bg-primary/40" />
                {getDomain(link.url)}
              </CardDescription>
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
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-muted/80"
            >
              <MoreHorizontal className="size-4" />
            </Button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  className="absolute top-9 right-0 z-30 w-36 rounded-xl border border-border bg-popover/90 p-1.5 shadow-2xl backdrop-blur-md"
                >
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit();
                    }}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium hover:bg-accent transition-colors"
                  >
                    <Pencil className="size-3.5 opacity-70" />
                    Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete();
                    }}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="size-3.5 opacity-70" />
                    Delete Link
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-3 text-[13.5px] leading-relaxed font-medium text-muted-foreground/80">
          {link.summary || "No summary captured yet. Review and add insights to this link."}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <a
            href={link.source_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="group/source flex min-w-0 items-center gap-2 rounded-full border border-border/40 bg-muted/20 px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground transition-all hover:border-border/80 hover:bg-muted/40 hover:text-foreground"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${sourceDomain}&sz=32`}
              alt=""
              className="size-3.5 shrink-0 rounded-sm opacity-70 transition-opacity group-hover/source:opacity-100"
            />
            <span className="truncate">{sourceDisplayUrl}</span>
          </a>

          <Button
            asChild
            size="icon-xs"
            variant="outline"
            className="shrink-0 rounded-full border-border/40 bg-background/50 transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg hover:shadow-primary/20"
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open link"
              title="Open link"
              onClick={(event) => event.stopPropagation()}
            >
              <ExternalLink className="size-3.5" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
