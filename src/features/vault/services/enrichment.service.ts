export type EnrichResponse = {
  title: string | null;
  description: string | null;
  summary: string | null;
  image: string | null;
  category: string | null;
  suggestedCategories?: string[]; // Optional after removal
  youtubeId?: string | null;
};

function extractPlainText(html: string): string {
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<[^>]+>/g, " ");
  return text.replace(/\s+/g, " ").trim().substring(0, 15000);
}

async function summarizeWithAI(
  text: string,
  defaultTitle: string | null,
  description?: string | null,
  existingCategories?: string[],
): Promise<{ title: string; summary: string; category: string } | null> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const contextText = `
Webpage Metadata:
Title: ${defaultTitle || "N/A"}
Description: ${description || "N/A"}

Visible Body Content:
${text}
`.trim();
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyze the provided webpage data. Extract or generate:
1. A clean, accurate Title (Heading).
2. A short, engaging Summary (1-2 sentences).
3. A ranked list of Suggested Categories (e.g., "AI Tools", "Design", "DevTools", "News", "Resource", etc.).

${existingCategories?.length ? `The available categories are: ${existingCategories.join(", ")}. 

CRITICAL INSTRUCTION: You MUST prioritize the available categories. Suggest multiple if relevant. ONLY suggest a NEW category name if there is a 0% match with the existing list. Accuracy and consolidation are the highest priority.` : `Suggest short, professional category names.`}

Return ONLY a valid JSON object strictly matching this format: {"title": "The Title", "summary": "The summary here.", "suggestedCategories": ["Category 1", "Category 2"]}
IMPORTANT: Never return null or empty strings for any field. If unsure about categories, use "Software" or "Web".

Data to analyze:
${contextText}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (resultText) {
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          title: parsed.title,
          summary: parsed.summary,
          category: parsed.suggestedCategories?.[0] || "AI Coding",
        };
      }
    }
  } catch (e) {
    console.error("AI Enrichment Error:", e);
  }
  return null;
}

function cleanContent(value: string | null) {
  if (!value) return null;
  return decodeHtmlEntities(value).replace(/\s+/g, " ").trim() || null;
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function resolveAbsoluteUrl(value: string | null, baseUrl: URL) {
  if (!value) return null;
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

function extractTagContent(html: string, tagName: string) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = html.match(regex);
  return match?.[1] || null;
}

function extractMetaContent(html: string, attribute: "name" | "property", value: string) {
  const regex = new RegExp(
    `<meta[^>]*${attribute}=["']${value}["'][^>]*content=["']([^"']*)["'][^>]*>`,
    "i",
  );
  const reverseRegex = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*${attribute}=["']${value}["'][^>]*>`,
    "i",
  );
  return html.match(regex)?.[1] || html.match(reverseRegex)?.[1] || null;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 9000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function enrichUrl(
  rawUrl: string,
  existingCategories?: string[],
): Promise<EnrichResponse> {
  const parsedUrl = new URL(rawUrl);
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Unsupported protocol");
  }

  // Handle YouTube
  if (parsedUrl.hostname.includes("youtube.com") || parsedUrl.hostname.includes("youtu.be")) {
    const youtubeId = extractYouTubeId(rawUrl);
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(rawUrl)}&format=json`;
      const oembedResponse = await fetchWithTimeout(oembedUrl);
      if (oembedResponse.ok) {
        const data = await oembedResponse.json();
        return {
          title: data.title || null,
          description: data.author_name ? `YouTube Video by ${data.author_name}` : "YouTube Video",
          summary: data.title || null,
          image: data.thumbnail_url || null,
          category: "Video",
          suggestedCategories: ["Video"],
          youtubeId,
        };
      }
    } catch {
      // Fallback to standard fetch if oembed fails
    }
    // Final fallback for YouTube if oembed fails but we have the ID
    if (youtubeId) {
      return {
        title: "YouTube Video",
        description: "View this video on YouTube",
        summary: "YouTube Video",
        image: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
        category: "Video",
        suggestedCategories: ["Video"],
        youtubeId,
      };
    }
  }

  // Handle Twitter/X
  if (parsedUrl.hostname.includes("twitter.com") || parsedUrl.hostname.includes("x.com")) {
    try {
      const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(rawUrl)}`;
      const oembedResponse = await fetchWithTimeout(oembedUrl);
      if (oembedResponse.ok) {
        const data = await oembedResponse.json();
        return {
          title: "X (formerly Twitter) Post",
          description: data.author_name ? `Post by ${data.author_name}` : "X Post",
          summary: data.author_name ? `Post by ${data.author_name}` : "X Post",
          image: null,
          category: "Social",
          suggestedCategories: ["Social"],
        };
      }
    } catch {
      // Fallback
    }
  }

  // Handle TikTok
  if (parsedUrl.hostname.includes("tiktok.com")) {
    try {
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(rawUrl)}`;
      const oembedResponse = await fetchWithTimeout(oembedUrl);
      if (oembedResponse.ok) {
        const data = await oembedResponse.json();
        return {
          title: data.title || null,
          description: data.author_name ? `TikTok Video by ${data.author_name}` : "TikTok Video",
          summary: data.title || null,
          image: data.thumbnail_url || null,
          category: "Video",
          suggestedCategories: ["Video"],
        };
      }
    } catch {
      // Fallback
    }
  }

  // Handle Instagram and Facebook (Aggressive Login Walls)
  if (
    parsedUrl.hostname.includes("instagram.com") ||
    parsedUrl.hostname.includes("instagr.am") ||
    parsedUrl.hostname.includes("facebook.com") ||
    parsedUrl.hostname.includes("fb.watch")
  ) {
    try {
      // Use Microlink API to securely bypass login walls and extract rich OpenGraph data
      const mlUrl = `https://api.microlink.io/?url=${encodeURIComponent(rawUrl)}`;
      const mlResponse = await fetchWithTimeout(mlUrl);
      if (mlResponse.ok) {
        const { data } = await mlResponse.json();
        if (data && (data.title || data.description)) {
          return {
            title: data.title || "Social Media Post",
            description: data.description || "View this content directly on the app",
            summary: data.description || "Social Media Link",
            image: data.image?.url || null,
            category: "Social",
            suggestedCategories: ["Social"],
          };
        }
      }
    } catch {
      // Fallback below if Microlink is rate-limited or fails
    }

    if (parsedUrl.hostname.includes("instagram.com") || parsedUrl.hostname.includes("instagr.am")) {
      const paths = parsedUrl.pathname.split("/").filter(Boolean);
      const isPost =
        paths[0] === "p" || paths[0] === "reel" || paths[0] === "reels" || paths[0] === "tv";
      const isProfile =
        !isPost &&
        paths.length > 0 &&
        !["explore", "reels", "stories", "direct"].includes(paths[0]);

      if (isProfile) {
        return {
          title: `${paths[0]} on Instagram`,
          description: `View @${paths[0]}'s profile, posts, and reels on Instagram.`,
          summary: `Instagram profile for @${paths[0]}`,
          image: null,
          category: "Social",
          suggestedCategories: ["Social"],
        };
      } else if (isPost && paths[1]) {
        return {
          title: "Instagram Post",
          description: `View this post on Instagram.`,
          summary: `Instagram post ID: ${paths[1]}`,
          image: null,
          category: "Social",
          suggestedCategories: ["Social"],
        };
      } else {
        return {
          title: "Instagram",
          description: "View on Instagram",
          summary: "Instagram Link",
          image: null,
          category: "Social",
          suggestedCategories: ["Social"],
        };
      }
    }
  }

  // Handle Reddit
  if (parsedUrl.hostname.includes("reddit.com")) {
    try {
      const jsonUrl = `${parsedUrl.origin}${parsedUrl.pathname.replace(/\/$/, "")}.json`;
      const jsonResponse = await fetchWithTimeout(jsonUrl);
      if (jsonResponse.ok) {
        const data = await jsonResponse.json();
        const post = Array.isArray(data)
          ? data[0]?.data?.children?.[0]?.data
          : data?.data?.children?.[0]?.data;
        if (post) {
          return {
            title: post.title || "Reddit Post",
            description: post.selftext
              ? `${post.selftext.substring(0, 150)}...`
              : `Posted in r/${post.subreddit} by u/${post.author}`,
            summary: post.selftext
              ? `${post.selftext.substring(0, 150)}...`
              : `Reddit post in r/${post.subreddit}`,
            image: post.thumbnail && post.thumbnail.startsWith("http") ? post.thumbnail : null,
            category: "Community",
            suggestedCategories: ["Community"],
          };
        }
      }
    } catch {
      // Fallback below if JSON fails
    }
  }

  // Handle LinkedIn
  if (parsedUrl.hostname.includes("linkedin.com")) {
    const paths = parsedUrl.pathname.split("/").filter(Boolean);
    if (paths[0] === "in" && paths[1]) {
      return {
        title: `${paths[1]
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ")} | LinkedIn`,
        description: `View professional profile on LinkedIn.`,
        summary: `LinkedIn Profile`,
        image: null,
        category: "Professional",
        suggestedCategories: ["Professional"],
      };
    } else if (paths[0] === "company" && paths[1]) {
      return {
        title: `${paths[1]
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ")} | LinkedIn`,
        description: `View company profile on LinkedIn.`,
        summary: `LinkedIn Company Page`,
        image: null,
        category: "Professional",
        suggestedCategories: ["Professional"],
      };
    }
    // For posts and jobs, let it fall back or we can provide a default so it doesn't fail entirely
    // We'll let it try to scrape below via global fallback, but if that returns "Login", we should handle that gracefully.
  }

  // General fallback for all other sources (including Facebook, Medium, etc.)
  const response = await fetchWithTimeout(parsedUrl.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error("Failed request");
  }

  const html = (await response.text()).slice(0, 400_000);
  const title =
    cleanContent(extractMetaContent(html, "property", "og:title")) ||
    cleanContent(extractMetaContent(html, "name", "twitter:title")) ||
    cleanContent(extractTagContent(html, "title"));

  const description =
    cleanContent(extractMetaContent(html, "property", "og:description")) ||
    cleanContent(extractMetaContent(html, "name", "description")) ||
    cleanContent(extractMetaContent(html, "name", "twitter:description"));

  const image = resolveAbsoluteUrl(
    cleanContent(extractMetaContent(html, "property", "og:image")) ||
      cleanContent(extractMetaContent(html, "name", "twitter:image")),
    parsedUrl,
  );

  // One final fallback check: If we scraped a site (like LinkedIn or Instagram) and all it gave us was "Sign Up" or "Login", use URL as title
  if (!title && !description) {
    return {
      title: parsedUrl.hostname,
      description: `Link to ${parsedUrl.hostname}`,
      summary: `Link to ${parsedUrl.hostname}`,
      image: null,
      category: "Web",
      suggestedCategories: ["Web"],
    };
  }

  let finalTitle = title;
  let finalDescription = description;
  let finalSummary = description;
  let finalCategory = "";

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey && html) {
    const aiResult = await summarizeWithAI(
      extractPlainText(html),
      title,
      description,
      existingCategories,
    );
    if (aiResult) {
      finalTitle = aiResult.title || finalTitle;
      finalSummary = aiResult.summary || finalSummary;
      finalCategory = aiResult.category || finalCategory;
      // Also update description if summary is better
      if (aiResult.summary) finalDescription = aiResult.summary;
    }
  }

  return {
    title: finalTitle,
    description: finalDescription,
    summary: finalSummary,
    image,
    category: finalCategory,
  };
}
