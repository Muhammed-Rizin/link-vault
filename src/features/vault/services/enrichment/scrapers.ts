import { EnrichResponse } from "./types";
import { fetchWithTimeout } from "./utils";

export async function handleYouTube(url: string, youtubeId: string | null): Promise<EnrichResponse | null> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
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
    // Fallback
  }
  
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
  
  return null;
}

export async function handleTwitter(url: string): Promise<EnrichResponse | null> {
  try {
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;
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
  return null;
}

export async function handleTikTok(url: string): Promise<EnrichResponse | null> {
  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
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
  return null;
}

export async function handleInstagram(url: string, hostname: string, pathname: string): Promise<EnrichResponse | null> {
  try {
    const mlUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;
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
    // Fallback
  }

  if (hostname.includes("instagram.com") || hostname.includes("instagr.am")) {
    const paths = pathname.split("/").filter(Boolean);
    const isPost = paths[0] === "p" || paths[0] === "reel" || paths[0] === "reels" || paths[0] === "tv";
    const isProfile = !isPost && paths.length > 0 && !["explore", "reels", "stories", "direct"].includes(paths[0]);

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
    }
  }

  return {
    title: hostname.includes("instagram.com") ? "Instagram" : "Facebook",
    description: `View on ${hostname.includes("instagram.com") ? "Instagram" : "Facebook"}`,
    summary: `${hostname.includes("instagram.com") ? "Instagram" : "Facebook"} Link`,
    image: null,
    category: "Social",
    suggestedCategories: ["Social"],
  };
}

export async function handleReddit(url: string, origin: string, pathname: string): Promise<EnrichResponse | null> {
  try {
    const jsonUrl = `${origin}${pathname.replace(/\/$/, "")}.json`;
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
    // Fallback
  }
  return null;
}

export async function handleLinkedIn(pathname: string): Promise<EnrichResponse | null> {
  const paths = pathname.split("/").filter(Boolean);
  if (paths[0] === "in" && paths[1]) {
    return {
      title: `${paths[1].split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")} | LinkedIn`,
      description: `View professional profile on LinkedIn.`,
      summary: `LinkedIn Profile`,
      image: null,
      category: "Professional",
      suggestedCategories: ["Professional"],
    };
  } else if (paths[0] === "company" && paths[1]) {
    return {
      title: `${paths[1].split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")} | LinkedIn`,
      description: `View company profile on LinkedIn.`,
      summary: `LinkedIn Company Page`,
      image: null,
      category: "Professional",
      suggestedCategories: ["Professional"],
    };
  }
  return null;
}
