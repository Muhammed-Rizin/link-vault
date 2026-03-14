"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CalendarDays, X } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import type { VaultLink } from "@/shared/services/supabase"

type LinkDetailsModalProps = {
  link: VaultLink | null
  onClose: () => void
}

type EnrichPayload = {
  title: string | null
  description: string | null
  summary: string | null
  image: string | null
}

type LinkPreview = {
  title: string | null
  description: string | null
  image: string | null
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return "example.com"
  }
}

function formatDateTime(value: string | null) {
  if (!value) return "Unknown date"
  return new Date(value).toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function EmbedPreviewCard({
  label,
  url,
  preview,
  isLoading,
}: {
  label: string
  url: string
  preview: LinkPreview | null
  isLoading: boolean
}) {
  const domain = getDomain(url)
  const title = preview?.title?.trim() || domain
  const description = preview?.description?.trim() || "Open this link in a new tab."
  const image = preview?.image?.trim() || null
  const [imageLoading, setImageLoading] = React.useState(Boolean(image))
  const [imageFailed, setImageFailed] = React.useState(false)

  React.useEffect(() => {
    setImageLoading(Boolean(image))
    setImageFailed(false)
  }, [image])

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block cursor-pointer rounded-lg border border-border/80 bg-background/40 p-3 transition-colors hover:border-border hover:bg-background/60"
    >
      <p className="mb-2 text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
      <div className="flex items-start gap-3">
        {isLoading ? (
          <Skeleton className="size-12 shrink-0 rounded-md" />
        ) : image && !imageFailed ? (
          <div className="relative size-12 shrink-0">
            {imageLoading && <Skeleton className="absolute inset-0 rounded-md" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=""
              className="size-12 rounded-md border border-border/80 object-cover"
              loading="lazy"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageFailed(true)
                setImageLoading(false)
              }}
            />
          </div>
        ) : (
          <div className="grid size-12 shrink-0 place-items-center rounded-md border border-border/80 bg-muted/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="" className="size-5" />
          </div>
        )}
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">{title}</p>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{isLoading ? "Loading preview..." : description}</p>
          <p className="mt-1 truncate text-[11px] text-muted-foreground">{domain}</p>
        </div>
      </div>
    </a>
  )
}

export function VaultDetailsModal({ link, onClose }: LinkDetailsModalProps) {
  const [previewByUrl, setPreviewByUrl] = React.useState<Record<string, LinkPreview>>({})
  const [loadingByUrl, setLoadingByUrl] = React.useState<Record<string, boolean>>({})
  const [isModalSkeleton, setIsModalSkeleton] = React.useState(false)

  React.useEffect(() => {
    if (!link) return
    setIsModalSkeleton(true)
    const timer = window.setTimeout(() => setIsModalSkeleton(false), 240)
    return () => window.clearTimeout(timer)
  }, [link])

  React.useEffect(() => {
    if (!link) return
    const urls = [link.url, link.source_url].filter((u): u is string => Boolean(u))
    const uniqueUrls = [...new Set(urls)]
    let isCancelled = false

    setLoadingByUrl((prev) => {
      const next = { ...prev }
      uniqueUrls.forEach((url) => {
        next[url] = true
      })
      return next
    })

    void Promise.all(
      uniqueUrls.map(async (url) => {
        try {
          const response = await fetch("/api/enrich", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          })
          const payload = (await response.json()) as EnrichPayload
          return [
            url,
            {
              title: payload.title,
              description: payload.description ?? payload.summary,
              image: payload.image,
            } satisfies LinkPreview,
          ] as const
        } catch {
          return [url, { title: null, description: null, image: null } satisfies LinkPreview] as const
        }
      })
    ).then((entries) => {
      if (isCancelled) return
      setPreviewByUrl((prev) => ({ ...prev, ...Object.fromEntries(entries) }))
      setLoadingByUrl((prev) => {
        const next = { ...prev }
        urls.forEach((url) => {
          next[url] = false
        })
        return next
      })
    })

    return () => {
      isCancelled = true
    }
  }, [link])

  return (
    <AnimatePresence>
      {link && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full max-w-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Card className="border-border/80 bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${getDomain(link.url)}&sz=128`}
                      alt=""
                      className="mt-1 size-9 rounded-md border border-border/80 bg-background p-1"
                    />
                    <div className="min-w-0">
                      <CardTitle className="text-balance text-lg sm:text-xl">
                        {link.title}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-1">
                        {/* <Globe className="size-3.5" /> */}
                        {getDomain(link.url)}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={onClose}
                    aria-label="Close details"
                  >
                    <X />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {isModalSkeleton ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-44" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-10/12" />
                    <div className="space-y-3">
                      <Skeleton className="h-24 w-full rounded-lg" />
                      <Skeleton className="h-24 w-full rounded-lg" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="font-bold">{link.category}</Badge>
                      <div className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        {formatDateTime(link.created_at)}
                      </div>
                    </div>

                    <p className="text-sm leading-6 text-foreground/90">
                      {link.summary || "No summary available yet."}
                    </p>

                    {link.youtube_id && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/80 bg-muted/30 shadow-sm">
                        <iframe
                          src={`https://www.youtube.com/embed/${link.youtube_id}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full"
                        />
                      </div>
                    )}

                    <div className="space-y-3">
                      <EmbedPreviewCard
                        label="URL"
                        url={link.url}
                        preview={previewByUrl[link.url] ?? null}
                        isLoading={Boolean(loadingByUrl[link.url])}
                      />
                      {link.source_url && link.source_url !== link.url && (
                        <EmbedPreviewCard
                          label="Source"
                          url={link.source_url}
                          preview={previewByUrl[link.source_url] ?? null}
                          isLoading={Boolean(loadingByUrl[link.source_url])}
                        />
                      )}
                    </div>
                  </>
                )}

                <div className="flex items-center justify-end border-t border-border/80 pt-3">
                  <Button variant="ghost" onClick={onClose}>
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
