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
        <div className={cn("relative h-60 w-full overflow-hidden bg-gradient-to-br from-[#0c3e21] via-[#041a0e] to-[#010a05] border-b border-[#262626] shrink-0 flex flex-col justify-between p-4", className)}>
          {/* Subtle grid mockup representing spreadsheet cells */}
          <div className="grid grid-cols-4 gap-1.5 opacity-20 select-none pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-6 rounded border border-emerald-500/30 bg-emerald-500/10 flex items-center px-1">
                <div className="h-1.5 w-1/2 bg-emerald-500/20 rounded-xs" />
              </div>
            ))}
          </div>
          <div className="z-10 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 rounded bg-black/60 border border-emerald-950 px-2.5 py-1 text-[10px] font-mono text-emerald-300 backdrop-blur-sm shadow-md">
              <img src={faviconUrl} alt="" className="size-3.5 rounded-xs" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
              <span>{domain}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[10px] font-semibold text-emerald-400 backdrop-blur-sm">
              <Table className="size-3.5" />
              <span>Spreadsheet</span>
            </div>
          </div>
        </div>
      );

    case "figma":
      return (
        <div className={cn("relative h-60 w-full overflow-hidden bg-gradient-to-br from-[#3b0764] via-[#120421] to-[#07010d] border-b border-[#262626] shrink-0 flex flex-col justify-between p-4", className)}>
          {/* Vector canvas shapes mock */}
          <div className="absolute inset-0 opacity-15 flex items-center justify-center select-none pointer-events-none">
            <div className="absolute w-28 h-28 rounded-full border border-purple-500/40 -translate-x-12 -translate-y-4" />
            <div className="absolute w-40 h-24 border border-purple-500/30 rotate-12 translate-x-8" />
            <div className="absolute w-14 h-14 border border-purple-500/40 translate-x-12 -translate-y-8 rounded-xs" />
            <div className="absolute h-0.5 w-full bg-purple-500/10 top-1/2 left-0" />
            <div className="absolute w-0.5 h-full bg-purple-500/10 left-1/2 top-0" />
          </div>
          <div className="z-10 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 rounded bg-black/60 border border-purple-950 px-2.5 py-1 text-[10px] font-mono text-purple-300 backdrop-blur-sm shadow-md">
              <img src={faviconUrl} alt="" className="size-3.5 rounded-xs" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
              <span>{domain}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-[10px] font-semibold text-purple-400 backdrop-blur-sm">
              <Palette className="size-3.5" />
              <span>Design Canvas</span>
            </div>
          </div>
        </div>
      );

    case "document":
      return (
        <div className={cn("relative h-60 w-full overflow-hidden bg-gradient-to-br from-[#172554] via-[#091024] to-[#02050f] border-b border-[#262626] shrink-0 flex flex-col justify-between p-4", className)}>
          {/* Document page and text lines mock */}
          <div className="flex flex-col gap-2.5 opacity-20 max-w-[80%] mt-2 select-none pointer-events-none">
            <div className="h-3 w-1/3 rounded bg-blue-400" />
            <div className="h-2 w-full rounded bg-blue-400/60" />
            <div className="h-2 w-5/6 rounded bg-blue-400/60" />
            <div className="h-2 w-4/5 rounded bg-blue-400/60" />
          </div>
          <div className="z-10 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 rounded bg-black/60 border border-blue-950 px-2.5 py-1 text-[10px] font-mono text-blue-300 backdrop-blur-sm shadow-md">
              <img src={faviconUrl} alt="" className="size-3.5 rounded-xs" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
              <span>{domain}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-[10px] font-semibold text-blue-400 backdrop-blur-sm">
              <FileText className="size-3.5" />
              <span>Document</span>
            </div>
          </div>
        </div>
      );

    case "code":
      return (
        <div className={cn("relative h-60 w-full overflow-hidden bg-gradient-to-br from-[#1e1e1e] via-[#0d0d0d] to-[#040404] border-b border-[#262626] shrink-0 flex flex-col justify-between p-4", className)}>
          {/* Code syntax highlighted elements mock */}
          <div className="font-mono text-[9px] text-zinc-500 space-y-1.5 opacity-30 mt-1 select-none pointer-events-none">
            <div className="flex gap-1.5">
              <span className="text-purple-400">import</span>
              <span className="text-blue-400">{"{ link }"}</span>
              <span className="text-purple-400">from</span>
              <span className="text-green-400">"@/vault"</span>
            </div>
            <div className="flex gap-1.5 pl-3">
              <span className="text-purple-400">const</span>
              <span className="text-yellow-400">render</span>
              <span className="text-zinc-400">=</span>
              <span className="text-yellow-400">()</span>
              <span className="text-zinc-400">=&gt;</span>
              <span className="text-blue-400">active</span>
            </div>
            <div className="pl-3 text-zinc-600">// build system verified</div>
          </div>
          <div className="z-10 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 rounded bg-black/60 border border-zinc-800 px-2.5 py-1 text-[10px] font-mono text-zinc-300 backdrop-blur-sm shadow-md">
              <img src={faviconUrl} alt="" className="size-3.5 rounded-xs" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
              <span>{domain}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-zinc-500/10 border border-zinc-500/30 px-3 py-1 text-[10px] font-semibold text-zinc-400 backdrop-blur-sm">
              <Code className="size-3.5" />
              <span>Code Repository</span>
            </div>
          </div>
        </div>
      );

    case "docs":
      return (
        <div className={cn("relative h-60 w-full overflow-hidden bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] border-b border-[#262626] shrink-0 flex flex-col justify-between p-4", className)}>
          {/* Docs layout structure mock */}
          <div className="space-y-2 opacity-25 mt-2 select-none pointer-events-none">
            <div className="h-3 w-1/4 rounded bg-slate-400" />
            <div className="h-0.5 bg-slate-700/50 w-full" />
            <div className="h-2 w-2/3 rounded bg-slate-400/60" />
            <div className="h-2 w-1/2 rounded bg-slate-400/60" />
          </div>
          <div className="z-10 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 rounded bg-black/60 border border-slate-900 px-2.5 py-1 text-[10px] font-mono text-slate-300 backdrop-blur-sm shadow-md">
              <img src={faviconUrl} alt="" className="size-3.5 rounded-xs" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
              <span>{domain}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-slate-500/10 border border-slate-500/30 px-3 py-1 text-[10px] font-semibold text-slate-400 backdrop-blur-sm">
              <BookOpen className="size-3.5" />
              <span>Documentation</span>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={cn("relative h-60 w-full overflow-hidden bg-gradient-to-br from-[#18181b] via-[#09090b] to-black border-b border-[#262626] shrink-0 flex flex-col justify-between p-4", className)}>
          {/* Abstract background glow with floating central favicon */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/10 via-transparent to-transparent opacity-60 select-none pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none pointer-events-none">
            <Globe className="size-16 stroke-1 text-zinc-500" />
          </div>
          <div className="z-10 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 rounded bg-black/60 border border-zinc-900 px-2.5 py-1 text-[10px] font-mono text-zinc-400 backdrop-blur-sm shadow-md">
              <img src={faviconUrl} alt="" className="size-3.5 rounded-xs" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
              <span>{domain}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-zinc-800 border border-zinc-700/50 px-3 py-1 text-[10px] font-semibold text-zinc-400 backdrop-blur-sm">
              <Globe className="size-3.5" />
              <span>Web Resource</span>
            </div>
          </div>
        </div>
      );
  }
}
