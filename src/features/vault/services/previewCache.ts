import type { EnrichResponse } from "@/features/vault/services/enrichment.service";

const memoryCache = new Map<string, EnrichResponse>();
const pendingPromises = new Map<string, Promise<EnrichResponse>>();

export async function fetchLinkPreview(url: string): Promise<EnrichResponse> {
  const normalizedUrl = url.trim();
  if (!normalizedUrl) {
    return {
      title: null,
      description: null,
      summary: null,
      image: null,
      category: null,
      suggestedCategories: [],
    };
  }

  // 1. Return cached result instantly if already fetched
  if (memoryCache.has(normalizedUrl)) {
    return memoryCache.get(normalizedUrl)!;
  }

  // 2. Deduplicate in-flight requests for the same URL
  if (pendingPromises.has(normalizedUrl)) {
    return pendingPromises.get(normalizedUrl)!;
  }

  const promise = (async () => {
    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl }),
      });
      const data = (await res.json()) as EnrichResponse;
      memoryCache.set(normalizedUrl, data);
      return data;
    } catch {
      const fallback: EnrichResponse = {
        title: null,
        description: null,
        summary: null,
        image: null,
        category: null,
        suggestedCategories: [],
      };
      memoryCache.set(normalizedUrl, fallback);
      return fallback;
    } finally {
      pendingPromises.delete(normalizedUrl);
    }
  })();

  pendingPromises.set(normalizedUrl, promise);
  return promise;
}

export function getCachedPreviewSync(url: string): EnrichResponse | null {
  return memoryCache.get(url.trim()) ?? null;
}
