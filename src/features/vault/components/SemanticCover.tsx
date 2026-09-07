"use client";

import * as React from "react";
import { BookOpen, Code, FileText, Globe, Table, Palette } from "lucide-react";
import { cn } from "@/shared/utils/utils";

type SemanticCoverProps = {
  url: string;
  title: string;
  className?: string;
};

type CoverType = "spreadsheet" | "figma" | "document" | "code" | "docs" | "general";

function getCoverType(url: string): CoverType {
  const lowercaseUrl = url.toLowerCase();
  
  if (
    lowercaseUrl.includes("docs.google.com/spreadsheets") ||
    lowercaseUrl.includes("excel") ||
    lowercaseUrl.includes("spreadsheet") ||
    lowercaseUrl.endsWith(".xlsx") ||
    lowercaseUrl.endsWith(".xls") ||
    lowercaseUrl.endsWith(".csv")
  ) {
    return "spreadsheet";
  }
  
  if (
    lowercaseUrl.includes("figma.com") ||
    lowercaseUrl.includes("behance.net") ||
    lowercaseUrl.includes("dribbble.com") ||
    lowercaseUrl.includes("canva.com") ||
    lowercaseUrl.includes("sketch.com")
  ) {
    return "figma";
  }
  
  if (
    lowercaseUrl.includes("docs.google.com/document") ||
    lowercaseUrl.includes("docs.google.com/presentation") ||
    lowercaseUrl.includes("drive.google.com") ||
    lowercaseUrl.includes("document") ||
    lowercaseUrl.endsWith(".pdf") ||
    lowercaseUrl.endsWith(".docx") ||
    lowercaseUrl.endsWith(".pptx") ||
    lowercaseUrl.endsWith(".pages")
  ) {
    return "document";
  }
  
  if (
    lowercaseUrl.includes("github.com") ||
    lowercaseUrl.includes("gitlab.com") ||
    lowercaseUrl.includes("bitbucket.org") ||
    lowercaseUrl.includes("stackoverflow.com") ||
    lowercaseUrl.endsWith(".json") ||
    lowercaseUrl.endsWith(".ts") ||
    lowercaseUrl.endsWith(".tsx") ||
    lowercaseUrl.endsWith(".js") ||
    lowercaseUrl.endsWith(".py") ||
    lowercaseUrl.endsWith(".go")
  ) {
    return "code";
  }
  
  if (
    lowercaseUrl.includes("/docs/") ||
    lowercaseUrl.includes("/documentation/") ||
    lowercaseUrl.includes("/wiki/") ||
    lowercaseUrl.includes("/api/") ||
    lowercaseUrl.includes("/study/") ||
    lowercaseUrl.includes("documentation.html") ||
    lowercaseUrl.includes("report.html") ||
    lowercaseUrl.includes("legacy-development-report") ||
    lowercaseUrl.includes("system-study")
  ) {
    return "docs";
  }
  
  return "general";
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "web-page";
  }
}

export function SemanticCover({ url, title, className }: SemanticCoverProps) {
  const coverType = getCoverType(url);
  const domain = getDomain(url);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  // Render different cover styles based on URL type
  switch (coverType) {
    case "spreadsheet":
      return (
        <div className={cn("relative h-60 w-full overflow-hidden bg-gradient-to-br from-[#0c3e21]/40 via-[#041a0e]/40 to-muted border-b border-border/80 shrink-0 flex flex-col justify-between p-4", className)}>
          {/* Subtle grid mockup representing spreadsheet cells */}
          <div className="grid grid-cols-4 gap-1.5 opacity-25 select-none pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 flex items-center px-1">
                <div className="h-1.5 w-1/2 bg-emerald-500/30 rounded-xs" />
              </div>
            ))}
          </div>
          <div className="z-10 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 rounded-md bg-background/90 border border-border/80 px-2.5 py-1 text-[10px] font-mono text-foreground backdrop-blur-md shadow-sm">
              <img src={faviconUrl} alt="" className="size-3.5 rounded-xs" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
              <span>{domain}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[10px] font-semibold text-emerald-500 backdrop-blur-md">
              <Table className="size-3.5" />
              <span>Spreadsheet</span>
            </div>
          </div>
        </div>
      );

    case "figma":
      return (
        <div className={cn("relative h-60 w-full overflow-hidden bg-gradient-to-br from-[#3b0764]/40 via-[#120421]/40 to-muted border-b border-border/80 shrink-0 flex flex-col justify-between p-4", className)}>
          {/* Vector canvas shapes mock */}
          <div className="absolute inset-0 opacity-20 flex items-center justify-center select-none pointer-events-none">
            <div className="absolute w-28 h-28 rounded-full border border-purple-500/40 -translate-x-12 -translate-y-4" />
            <div className="absolute w-40 h-24 border border-purple-500/30 rotate-12 translate-x-8" />
            <div className="absolute w-14 h-14 border border-purple-500/40 translate-x-12 -translate-y-8 rounded-xs" />
            <div className="absolute h-0.5 w-full bg-purple-500/20 top-1/2 left-0" />
            <div className="absolute w-0.5 h-full bg-purple-500/20 left-1/2 top-0" />
          </div>
          <div className="z-10 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 rounded-md bg-background/90 border border-border/80 px-2.5 py-1 text-[10px] font-mono text-foreground backdrop-blur-md shadow-sm">
              <img src={faviconUrl} alt="" className="size-3.5 rounded-xs" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
              <span>{domain}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-[10px] font-semibold text-purple-500 backdrop-blur-md">
              <Palette className="size-3.5" />
              <span>Design Canvas</span>
            </div>
          </div>
        </div>
      );

    case "document":
      return (
        <div className={cn("relative h-60 w-full overflow-hidden bg-gradient-to-br from-[#172554]/40 via-[#091024]/40 to-muted border-b border-border/80 shrink-0 flex flex-col justify-between p-4", className)}>
          {/* Document page and text lines mock */}
          <div className="flex flex-col gap-2.5 opacity-25 max-w-[80%] mt-2 select-none pointer-events-none">
            <div className="h-3 w-1/3 rounded-md bg-sky-500" />
            <div className="h-2 w-full rounded-md bg-sky-500/60" />
            <div className="h-2 w-5/6 rounded-md bg-sky-500/60" />
            <div className="h-2 w-4/5 rounded-md bg-sky-500/60" />
          </div>
          <div className="z-10 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 rounded-md bg-background/90 border border-border/80 px-2.5 py-1 text-[10px] font-mono text-foreground backdrop-blur-md shadow-sm">
              <img src={faviconUrl} alt="" className="size-3.5 rounded-xs" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
              <span>{domain}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 px-3 py-1 text-[10px] font-semibold text-sky-500 backdrop-blur-md">
              <FileText className="size-3.5" />
              <span>Document</span>
            </div>
          </div>
        </div>
      );

    case "code":
      return (
        <div className={cn("relative h-60 w-full overflow-hidden bg-gradient-to-br from-muted via-background to-muted/80 border-b border-border/80 shrink-0 flex flex-col justify-between p-4", className)}>
          {/* Code syntax highlighted elements mock */}
          <div className="font-mono text-[9px] text-muted-foreground space-y-1.5 opacity-50 mt-1 select-none pointer-events-none">
            <div className="flex gap-1.5">
              <span className="text-purple-500 font-bold">import</span>
              <span className="text-sky-500 font-bold">{"{ link }"}</span>
              <span className="text-purple-500 font-bold">from</span>
              <span className="text-emerald-500 font-bold">"@/vault"</span>
            </div>
            <div className="flex gap-1.5 pl-3">
              <span className="text-purple-500 font-bold">const</span>
              <span className="text-amber-500 font-bold">render</span>
              <span className="text-foreground">=</span>
              <span className="text-amber-500">()</span>
              <span className="text-foreground">=&gt;</span>
              <span className="text-sky-500 font-bold">active</span>
            </div>
            <div className="pl-3 text-muted-foreground/60">// build system verified</div>
          </div>
          <div className="z-10 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 rounded-md bg-background/90 border border-border/80 px-2.5 py-1 text-[10px] font-mono text-foreground backdrop-blur-md shadow-sm">
              <img src={faviconUrl} alt="" className="size-3.5 rounded-xs" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
              <span>{domain}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[10px] font-semibold text-primary backdrop-blur-md">
              <Code className="size-3.5" />
              <span>Code Repository</span>
            </div>
          </div>
        </div>
      );

    case "docs":
      return (
        <div className={cn("relative h-60 w-full overflow-hidden bg-gradient-to-br from-muted via-background to-muted/80 border-b border-border/80 shrink-0 flex flex-col justify-between p-4", className)}>
          {/* Docs layout structure mock */}
          <div className="space-y-2 opacity-30 mt-2 select-none pointer-events-none">
            <div className="h-3 w-1/4 rounded-md bg-foreground/40" />
            <div className="h-0.5 bg-border w-full" />
            <div className="h-2 w-2/3 rounded-md bg-foreground/30" />
            <div className="h-2 w-1/2 rounded-md bg-foreground/30" />
          </div>
          <div className="z-10 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 rounded-md bg-background/90 border border-border/80 px-2.5 py-1 text-[10px] font-mono text-foreground backdrop-blur-md shadow-sm">
              <img src={faviconUrl} alt="" className="size-3.5 rounded-xs" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
              <span>{domain}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[10px] font-semibold text-primary backdrop-blur-md">
              <BookOpen className="size-3.5" />
              <span>Documentation</span>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={cn("relative h-60 w-full overflow-hidden bg-gradient-to-br from-muted via-background to-muted/80 border-b border-border/80 shrink-0 flex flex-col justify-between p-4", className)}>
          {/* Abstract background glow with floating central favicon */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-60 select-none pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center opacity-15 select-none pointer-events-none">
            <Globe className="size-16 stroke-1 text-muted-foreground" />
          </div>
          <div className="z-10 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 rounded-md bg-background/90 border border-border/80 px-2.5 py-1 text-[10px] font-mono text-foreground backdrop-blur-md shadow-sm">
              <img src={faviconUrl} alt="" className="size-3.5 rounded-xs" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
              <span>{domain}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-muted border border-border/80 px-3 py-1 text-[10px] font-semibold text-muted-foreground backdrop-blur-md">
              <Globe className="size-3.5" />
              <span>Web Resource</span>
            </div>
          </div>
        </div>
      );
  }
}
