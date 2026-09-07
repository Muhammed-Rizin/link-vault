/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ExternalLink, Globe, X } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { VaultLink } from "@/shared/services/supabase";
import { fetchLinkPreview, getCachedPreviewSync } from "@/features/vault/services/previewCache";
import { VaultLinkCover } from "./VaultLinkCover";

type LinkDetailsModalProps = {
  link: VaultLink | null;
  onClose: () => void;
};

type LinkPreview = {
  title: string | null;
  description: string | null;
  image: string | null;
};

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "example.com";
  }
}

function formatDateTime(value: string | null) {
  if (!value) return "Unknown date";
  return new Date(value).toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function VaultDetailsModal({ link, onClose }: LinkDetailsModalProps) {
  const [sourcePreview, setSourcePreview] = React.useState<LinkPreview | null>(() =>
    link?.source_url ? getCachedPreviewSync(link.source_url) : null,
  );
  const [loadingSource, setLoadingSource] = React.useState(false);

  const targetDomain = link ? getDomain(link.url) : "";
  const hasSourceUrl = Boolean(link?.source_url);
  const sourceDomain = hasSourceUrl && link?.source_url ? getDomain(link.source_url) : "";

  // Reset states and fetch source enrichment preview when link changes
  React.useEffect(() => {
    if (!link) {
      setSourcePreview(null);
      setLoadingSource(false);
      return;
    }

    if (hasSourceUrl && link.source_url) {
      const cachedSource = getCachedPreviewSync(link.source_url);
      setSourcePreview(cachedSource);
      setLoadingSource(!cachedSource);
    } else {
      setSourcePreview(null);
      setLoadingSource(false);
    }

    let isSubscribed = true;

    // Fetch Source Link Preview if present
    if (hasSourceUrl && link.source_url) {
      fetchLinkPreview(link.source_url)
        .then((data) => {
          if (!isSubscribed) return;
          setSourcePreview({
            title: data.title,
            description: data.description ?? data.summary,
            image: data.image,
          });
        })
        .catch(() => {})
        .finally(() => {
          if (isSubscribed) setLoadingSource(false);
        });
    }

    return () => {
      isSubscribed = false;
    };
  }, [link, hasSourceUrl]);

  const handleModalClose = () => {
    setSourcePreview(null);
    setLoadingSource(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {link && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleModalClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <Card className="border-border/80 bg-card text-card-foreground shadow-2xl overflow-hidden rounded-2xl flex flex-col max-h-full">
              {/* Header - Renders Immediately */}
              <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-5 border-b border-border/80 shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${targetDomain}&sz=128`}
                      alt=""
                      className="mt-0.5 size-9 rounded-lg border border-border/80 bg-muted p-1 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-balance text-base font-bold tracking-tight text-foreground break-words">
                          {link.title}
                        </CardTitle>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono text-muted-foreground font-semibold">
                          <Globe className="size-3 text-muted-foreground" />
                          {targetDomain}
                        </span>
                        <span>•</span>
                        <Badge
                          variant="outline"
                          className="font-semibold text-[10px] uppercase tracking-wider border-border/80 bg-muted text-muted-foreground px-2 py-0.5 rounded-md"
                        >
                          {link.category}
                        </Badge>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <CalendarDays className="size-3" />
                          {formatDateTime(link.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={handleModalClose}
                    aria-label="Close details"
                    className="rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Scrollable Body */}
              <CardContent className="space-y-4 px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1">
                {/* UNIFIED TARGET LINK CARD */}
                <div className="overflow-hidden rounded-xl border border-border/80 bg-background/80 shadow-sm">
                  <VaultLinkCover link={link} layout="detail" />

                  {/* Web Page Details & AI Summary - RENDERS IMMEDIATELY */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-start gap-1.5">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-foreground hover:underline hover:text-primary transition-all break-words"
                        >
                          {link.title}
                        </a>
                        <ExternalLink className="size-3.5 text-muted-foreground hover:text-foreground shrink-0 mt-0.5" />
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground font-normal">
                        {link.summary || `Web page resource on ${targetDomain}.`}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground truncate pt-1">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-foreground"
                        >
                          {link.url}
                        </a>
                      </p>
                    </div>

                    {/* Directly Attached AI Key Summary - RENDERS IMMEDIATELY */}
                    <div className="pt-3 border-t border-border/60 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        <span>Summary</span>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground font-normal">
                        {link.summary || "No summary captured yet for this saved link."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* UNIFIED REFERRER SOURCE CARD - TEXT RENDERS IMMEDIATELY */}
                {hasSourceUrl && link.source_url && (
                  <div className="rounded-xl border border-border/80 bg-background/80 p-4 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${sourceDomain}&sz=32`}
                          alt=""
                          className="size-4 shrink-0 rounded-xs"
                        />
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate max-w-[150px] sm:max-w-none">
                          Referrer Source ({sourceDomain})
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-start gap-1.5">
                        <a
                          href={link.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-foreground hover:underline hover:text-primary transition-all break-words"
                        >
                          {sourcePreview?.title || `Referrer Link on ${sourceDomain}`}
                        </a>
                        <ExternalLink className="size-3 text-muted-foreground hover:text-foreground shrink-0 mt-0.5" />
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground font-normal">
                        {sourcePreview?.description ||
                          (loadingSource
                            ? "Fetching source webpage metadata..."
                            : `Source URL captured when saving target bookmark.`)}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground truncate pt-1">
                        <a
                          href={link.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-foreground"
                        >
                          {link.source_url}
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-end border-t border-border/80 pt-3 mt-2">
                  <Button
                    variant="ghost"
                    onClick={handleModalClose}
                    className="font-semibold text-xs rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
