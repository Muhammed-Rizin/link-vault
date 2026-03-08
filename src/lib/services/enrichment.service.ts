export type EnrichResponse = {
  title: string | null;
  description: string | null;
  summary: string | null;
  image: string | null;
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
): Promise<{ title: string; summary: string } | null> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await import("next/server").then(() =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze the following webpage extracted text. Extract or generate a clean, accurate Title (Heading) and a short Summary (1-2 sentences) of the content.
Return ONLY a valid JSON object strictly matching this format: {"title": "The Title", "summary": "The summary here."}
If you can't determine it, use "${defaultTitle || "Unknown"}" as title.

Webpage Text:
${text}`,
                },
              ],
            },
          ],
        }),
      }),
    );

    if (!response.ok) return null;
    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (resultText) {
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
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

export async function enrichUrl(rawUrl: string): Promise<EnrichResponse> {
  const parsedUrl = new URL(rawUrl);
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Unsupported protocol");
  }

  // Handle YouTube
  if (parsedUrl.hostname.includes("youtube.com") || parsedUrl.hostname.includes("youtu.be")) {
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
        };
      }
    } catch {
      // Fallback to standard fetch if oembed fails
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
        };
      } else if (isPost && paths[1]) {
        return {
          title: "Instagram Post",
          description: `View this post on Instagram.`,
          summary: `Instagram post ID: ${paths[1]}`,
          image: null,
        };
      } else {
        return {
          title: "Instagram",
          description: "View on Instagram",
          summary: "Instagram Link",
          image: null,
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
    };
  }

  let finalTitle = title;
  let finalDescription = description;

  if (process.env.GEMINI_API_KEY && html) {
    const aiResult = await summarizeWithAI(extractPlainText(html), title);
    if (aiResult) {
      finalTitle = aiResult.title || finalTitle;
      finalDescription = aiResult.summary || finalDescription;
    }
  }

  return {
    title: finalTitle,
    description: finalDescription,
    summary: finalDescription,
    image,
  };
}
