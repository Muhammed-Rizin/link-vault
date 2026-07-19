/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ExternalLink, Globe, Sparkles, X } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { VaultLink } from "@/shared/services/supabase";
import { fetchLinkPreview, getCachedPreviewSync } from "@/features/vault/services/previewCache";

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
  const [targetPreview, setTargetPreview] = React.useState<LinkPreview | null>(() =>
    link ? getCachedPreviewSync(link.url) : null,
  );
  const [sourcePreview, setSourcePreview] = React.useState<LinkPreview | null>(() =>
    link?.source_url ? getCachedPreviewSync(link.source_url) : null,
  );
  const [loadingTarget, setLoadingTarget] = React.useState(false);
  const [loadingSource, setLoadingSource] = React.useState(false);

  const targetDomain = link ? getDomain(link.url) : "";
  const hasSourceUrl = Boolean(link?.source_url);
  const sourceDomain = hasSourceUrl && link?.source_url ? getDomain(link.source_url) : "";

  // Reset states and fetch enrichment previews via global cache when link changes
  React.useEffect(() => {
    if (!link) {
      setTargetPreview(null);
      setSourcePreview(null);
      setLoadingTarget(false);
      setLoadingSource(false);
      return;
    }

    // Initialize with cached preview if available
    const cachedTarget = getCachedPreviewSync(link.url);
    setTargetPreview(cachedTarget);
    setLoadingTarget(!cachedTarget);

    if (hasSourceUrl && link.source_url) {
      const cachedSource = getCachedPreviewSync(link.source_url);
      setSourcePreview(cachedSource);
      setLoadingSource(!cachedSource);
    } else {
      setSourcePreview(null);
      setLoadingSource(false);
    }

    let isSubscribed = true;

    // Fetch Target Link Preview
    fetchLinkPreview(link.url)
      .then((data) => {
        if (!isSubscribed) return;
        setTargetPreview({
          title: data.title,
          description: data.description ?? data.summary,
          image: data.image,
        });
      })
      .catch(() => {})
      .finally(() => {
        if (isSubscribed) setLoadingTarget(false);
      });

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

  const targetImage =
    targetPreview?.image ||
    (link?.youtube_id ? `https://img.youtube.com/vi/${link.youtube_id}/hqdefault.jpg` : null);

  const handleModalClose = () => {
    setTargetPreview(null);
    setSourcePreview(null);
    setLoadingTarget(false);
    setLoadingSource(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {link && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 px-4 backdrop-blur-sm overflow-y-auto py-6"
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
            className="w-full max-w-2xl h-auto max-h-[90vh] flex flex-col my-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <Card className="border-[#262626] bg-[#141414] shadow-2xl overflow-hidden rounded-xl h-auto flex flex-col">
              {/* Header - Renders Immediately */}
              <CardHeader className="pb-3 px-6 pt-5 border-b border-[#262626] shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${targetDomain}&sz=128`}
                      alt=""
                      className="mt-0.5 size-9 rounded border border-[#262626] bg-[#0a0a0a] p-1 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-balance text-base font-bold tracking-tight text-white">
                          {link.title}
                        </CardTitle>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                        <span className="flex items-center gap-1 font-mono text-zinc-300">
                          <Globe className="size-3 text-zinc-500" />
                          {targetDomain}
                        </span>
                        <span>•</span>
                        <Badge
                          variant="outline"
                          className="font-medium text-[10px] uppercase tracking-wider border-[#262626] bg-[#0a0a0a] text-zinc-300 px-2 py-0.5"
                        >
                          {link.category}
                        </Badge>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-zinc-500">
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
                    className="rounded text-zinc-400 hover:bg-[#262626]"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Scrollable Body */}
              <CardContent className="space-y-4 px-6 py-5 overflow-y-auto flex-1">
                {/* UNIFIED TARGET LINK CARD */}
                <div className="overflow-hidden rounded-lg border border-[#262626] bg-[#0a0a0a]">
                  {/* Top Cover Banner: SKELETON ONLY FOR IMAGE/VIDEO WHILE FETCHING */}
                  {loadingTarget && !link.youtube_id && !targetImage ? (
                    <Skeleton className="h-60 w-full rounded-t-lg bg-[#1c1c1c] animate-pulse" />
                  ) : link.youtube_id ? (
                    <div className="relative aspect-video w-full overflow-hidden bg-black border-b border-[#262626]">
                      <iframe
                        src={`https://www.youtube.com/embed/${link.youtube_id}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                  ) : targetImage ? (
                    <div className="relative max-h-96 w-full overflow-hidden bg-black border-b border-[#262626]">
                      <img
                        src={targetImage}
                        alt=""
                        className="h-full w-full object-cover opacity-90"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded bg-black/80 border border-[#262626] px-2 py-0.5 text-[10px] font-mono text-white backdrop-blur-sm">
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${targetDomain}&sz=32`}
                          alt=""
                          className="size-3"
                        />
                        <span>{targetDomain}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-20 w-full overflow-hidden bg-[#0d0d0d] p-3 flex items-center justify-between border-b border-[#262626]">
                      <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-md border border-[#262626] bg-[#1a1a1a] grid place-items-center">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${targetDomain}&sz=64`}
                            alt=""
                            className="size-4.5"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-white truncate max-w-xs">
                            {link.title}
                          </h4>
                          <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                            {targetDomain}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="font-semibold text-[10px] uppercase border-[#262626] bg-[#141414] text-zinc-300 px-2 py-0.5"
                      >
                        Target Link
                      </Badge>
                    </div>
                  )}

                  {/* Web Page Details & AI Summary - RENDERS IMMEDIATELY */}
                  <div className="p-4 space-y-3">
                    <div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline transition-all"
                      >
                        <span>{targetPreview?.title || link.title}</span>
                        <ExternalLink className="size-3.5 text-zinc-400 hover:text-white" />
                      </a>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-400 font-normal">
                        {targetPreview?.description ||
                          link.summary ||
                          `Web page resource on ${targetDomain}.`}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 truncate pt-1">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-zinc-300"
                        >
                          {link.url}
                        </a>
                      </p>
                    </div>

                    {/* Directly Attached AI Key Summary - RENDERS IMMEDIATELY */}
                    <div className="pt-3 border-t border-[#262626] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                        <span>Summary</span>
                      </div>
                      <p className="text-xs leading-relaxed text-zinc-300 font-normal">
                        {link.summary || "No summary captured yet for this saved link."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* UNIFIED REFERRER SOURCE CARD - TEXT RENDERS IMMEDIATELY */}
                {hasSourceUrl && link.source_url && (
                  <div className="rounded-lg border border-[#262626] bg-[#0a0a0a] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${sourceDomain}&sz=32`}
                          alt=""
                          className="size-4 shrink-0 rounded-xs"
                        />
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                          Referrer Source ({sourceDomain})
                        </span>
                      </div>
                    </div>

                    <div>
                      <a
                        href={link.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline transition-all"
                      >
                        <span>{sourcePreview?.title || `Referrer Link on ${sourceDomain}`}</span>
                        <ExternalLink className="size-3 text-zinc-400 hover:text-white" />
                      </a>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-400 font-normal">
                        {sourcePreview?.description ||
                          (loadingSource
                            ? "Fetching source webpage metadata..."
                            : `Source URL captured when saving target bookmark.`)}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 truncate pt-1">
                        <a
                          href={link.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-zinc-300"
                        >
                          {link.source_url}
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-end border-t border-[#262626] pt-3 mt-2">
                  <Button
                    variant="ghost"
                    onClick={handleModalClose}
                    className="font-semibold text-xs rounded-md text-zinc-400 hover:bg-[#262626]"
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
