"use client";

import * as React from "react";
import { Play, Youtube } from "lucide-react";
import type { VaultLink } from "@/shared/services/supabase";
import { fetchLinkPreview, getCachedPreviewSync } from "@/features/vault/services/previewCache";
import { SemanticCover } from "./SemanticCover";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/utils/utils";

type VaultLinkCoverProps = {
  link: VaultLink;
  layout: "grid" | "list" | "detail";
  className?: string;
};

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "example.com";
  }
}

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    // Google Sheets
    if (hostname.includes("docs.google.com") && pathname.includes("/spreadsheets/d/")) {
      const match = pathname.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        return `https://docs.google.com/spreadsheets/d/${match[1]}/preview`;
      }
    }

    // Google Docs
    if (hostname.includes("docs.google.com") && pathname.includes("/document/d/")) {
      const match = pathname.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        return `https://docs.google.com/document/d/${match[1]}/preview`;
      }
    }

    // Google Slides
    if (hostname.includes("docs.google.com") && pathname.includes("/presentation/d/")) {
      const match = pathname.match(/\/presentation\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        return `https://docs.google.com/presentation/d/${match[1]}/preview`;
      }
    }

    // Google Drive PDF/Files
    if (hostname.includes("drive.google.com") && pathname.includes("/file/d/")) {
      const match = pathname.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }

    // Figma designs
    if (
      hostname.includes("figma.com") &&
      (pathname.includes("/design/") || pathname.includes("/file/"))
    ) {
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
    }
  } catch {
    // Ignore invalid URLs
  }
  return null;
}

export function VaultLinkCover({ link, layout, className }: VaultLinkCoverProps) {
  const [ogImage, setOgImage] = React.useState<string | null>(
    () => getCachedPreviewSync(link.url)?.image || null,
  );
  const [imageFailed, setImageFailed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const domain = getDomain(link.url);
  const hasYouTube = Boolean(link.youtube_id);
  const embedUrl = getEmbedUrl(link.url);

  const coverUrl = hasYouTube
    ? `https://img.youtube.com/vi/${link.youtube_id}/hqdefault.jpg`
    : ogImage;

  // Auto-enrich fetch with global cache for preview cover
  React.useEffect(() => {
    setImageFailed(false);

    // Check cache
    const cached = getCachedPreviewSync(link.url);
    if (cached) {
      if (cached.image) setOgImage(cached.image);
      setLoading(false);
      return;
    }

    if (hasYouTube) return;

    let isMounted = true;
    setLoading(true);

    fetchLinkPreview(link.url)
      .then((data) => {
        if (isMounted) {
          if (data?.image) {
            setOgImage(data.image);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [link.url, hasYouTube]);

  // Layout 1: Main Dashboard Grid Cards
  if (layout === "grid") {
    if (coverUrl && !imageFailed) {
      return (
        <div
          className={cn(
            "relative max-h-60 w-full overflow-hidden bg-muted/40 border-b border-border/80 shrink-0",
            className,
          )}
        >
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover opacity-95 transition-transform duration-300 group-hover:scale-102"
            onError={() => setImageFailed(true)}
            referrerPolicy="no-referrer"
          />
          {hasYouTube ? (
            <>
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-md">
                <Youtube className="size-3" />
                <span>YouTube</span>
              </div>
              <div className="absolute inset-0 grid place-items-center">
                <div className="grid size-10 place-items-center rounded-full bg-red-600 text-white shadow-lg">
                  <Play className="size-4 fill-white ml-0.5" />
                </div>
              </div>
            </>
          ) : (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-md bg-background/90 border border-border/80 px-2 py-0.5 text-[10px] font-mono text-foreground backdrop-blur-md shadow-sm">
              <img
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                alt=""
                className="size-3 rounded-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span>{domain}</span>
            </div>
          )}
        </div>
      );
    }

    return <SemanticCover url={link.url} title={link.title} className={className} />;
  }

  // Layout 2: List View Row Thumbnail
  if (layout === "list") {
    if (coverUrl && !imageFailed) {
      return (
        <div
          className={cn(
            "shrink-0 overflow-hidden rounded-lg border border-border/80 bg-muted flex items-center justify-center size-10 shadow-xs",
            className,
          )}
        >
          <img
            src={coverUrl}
            alt=""
            className="size-full object-cover opacity-95 transition-transform duration-200 group-hover:scale-105"
            onError={() => setImageFailed(true)}
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }

    return (
      <div
        className={cn(
          "shrink-0 overflow-hidden rounded-lg border border-border/80 bg-muted flex items-center justify-center size-10 shadow-xs",
          className,
        )}
      >
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
          alt=""
          className="size-5 object-contain"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      </div>
    );
  }

  // Layout 3: Details Modal Cover (interactive iframes or banners)
  if (layout === "detail") {
    if (loading && !hasYouTube && !embedUrl && !coverUrl) {
      return (
        <Skeleton
          className={cn("h-60 w-full rounded-t-2xl bg-muted animate-pulse", className)}
        />
      );
    }

    if (hasYouTube) {
      return (
        <div
          className={cn(
            "relative h-70 sm:h-95 md:aspect-video w-full overflow-hidden bg-black border-b border-border/80",
            className,
          )}
        >
          <iframe
            src={`https://www.youtube.com/embed/${link.youtube_id}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      );
    }

    if (embedUrl) {
      return (
        <div
          className={cn(
            "relative h-70 sm:h-95 md:aspect-video w-full overflow-hidden bg-black border-b border-border/80",
            className,
          )}
        >
          <iframe
            src={embedUrl}
            title="Interactive Embed Preview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            className="absolute inset-0 h-full w-full"
          />
        </div>
      );
    }

    if (coverUrl && !imageFailed) {
      return (
        <div
          className={cn(
            "relative h-48 sm:h-64 md:h-80 w-full overflow-hidden bg-muted/40 border-b border-border/80",
            className,
          )}
        >
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover opacity-95"
            onError={() => setImageFailed(true)}
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-md bg-background/90 border border-border/80 px-2 py-0.5 text-[10px] font-mono text-foreground backdrop-blur-md shadow-sm">
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
              alt=""
              className="size-3"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <span>{domain}</span>
          </div>
        </div>
      );
    }

    return <SemanticCover url={link.url} title={link.title} className={cn("h-48", className)} />;
  }

  return null;
}
