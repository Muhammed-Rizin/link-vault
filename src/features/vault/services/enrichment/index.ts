import { EnrichResponse } from "./types";
import { 
  fetchWithTimeout, 
  extractYouTubeId, 
  cleanContent, 
  extractMetaContent, 
  extractTagContent, 
  resolveAbsoluteUrl 
} from "./utils";
import { 
  handleYouTube, 
  handleTwitter, 
  handleTikTok, 
  handleInstagram, 
  handleReddit, 
  handleLinkedIn 
} from "./scrapers";
import { summarizeWithAI, applyTechnicalSafetyNet } from "./ai.service";

export async function enrichUrl(
  rawUrl: string,
  existingCategories?: string[],
): Promise<EnrichResponse> {
  const parsedUrl = new URL(rawUrl);
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Unsupported protocol");
  }

  const hostname = parsedUrl.hostname;
  const pathname = parsedUrl.pathname;
  const youtubeId = extractYouTubeId(rawUrl);

  // 1. Site-Specific Scrapers
  if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
    const res = await handleYouTube(rawUrl, youtubeId);
    if (res) return res;
  }

  if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
    const res = await handleTwitter(rawUrl);
    if (res) return res;
  }

  if (hostname.includes("tiktok.com")) {
    const res = await handleTikTok(rawUrl);
    if (res) return res;
  }

  if (
    hostname.includes("instagram.com") ||
    hostname.includes("instagr.am") ||
    hostname.includes("facebook.com") ||
    hostname.includes("fb.watch")
  ) {
    const res = await handleInstagram(rawUrl, hostname, pathname);
    if (res) return res;
  }

  if (hostname.includes("reddit.com")) {
    const res = await handleReddit(rawUrl, parsedUrl.origin, pathname);
    if (res) return res;
  }

  if (hostname.includes("linkedin.com")) {
    const res = await handleLinkedIn(pathname);
    if (res) return res;
  }

  // 2. Global Scraper Fallback
  let html = "";
  let title: string | null = null;
  let description: string | null = null;
  let image: string | null = null;

  try {
    const response = await fetchWithTimeout(rawUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });

    if (response.ok) {
      html = (await response.text()).slice(0, 400_000);
      title =
        cleanContent(extractMetaContent(html, "property", "og:title")) ||
        cleanContent(extractMetaContent(html, "name", "twitter:title")) ||
        cleanContent(extractTagContent(html, "title"));

      description =
        cleanContent(extractMetaContent(html, "property", "og:description")) ||
        cleanContent(extractMetaContent(html, "name", "description")) ||
        cleanContent(extractMetaContent(html, "name", "twitter:description"));

      image = resolveAbsoluteUrl(
        cleanContent(extractMetaContent(html, "property", "og:image")) ||
          cleanContent(extractMetaContent(html, "name", "twitter:image")),
        parsedUrl,
      );
    }
  } catch (e) {
    console.error("General Scrape Error:", e);
  }

  // 3. Final Fallback if everything failed completely
  if (!title && !description && !html) {
    const fallbackTitle = hostname.replace(/^www\./, "");
    return {
      title: fallbackTitle,
      description: `Link to ${fallbackTitle}`,
      summary: `Link to ${fallbackTitle}`,
      image: null,
      category: "Web",
      suggestedCategories: ["Web"],
    };
  }

  // 4. AI Enrichment
  let finalTitle = title || "";
  let finalDescription = description || "";
  let finalSummary = description || ""; // Fallback summary to description if scraping found something
  let finalCategory = "Web";
  let finalSuggestions: string[] = ["Web"];

  const aiResult = await summarizeWithAI(html, title, description, existingCategories);
  if (aiResult) {
    finalTitle = aiResult.title || finalTitle;
    finalSummary = aiResult.summary || finalSummary;
    finalDescription = aiResult.description || finalDescription;
    finalCategory = aiResult.category || finalCategory;
    finalSuggestions = aiResult.suggestedCategories || [finalCategory];
  }

  // 5. Technical Safety Net
  const { category, suggestions } = applyTechnicalSafetyNet(finalTitle, finalCategory, finalSuggestions);

  // 6. Cleanup and normalization
  const resolvedTitle = finalTitle || hostname.replace(/^www\./, "") || "Link Vault Item";
  const resolvedSummary = finalSummary || "No summary available.";
  const resolvedDescription = finalDescription || "No description available.";

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    summary: resolvedSummary,
    image,
    category,
    suggestedCategories: Array.from(new Set(suggestions)),
    youtubeId,
  };
}
