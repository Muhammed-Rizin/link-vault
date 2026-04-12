export function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

export function cleanContent(value: string | null): string | null {
  if (!value) return null;
  return decodeHtmlEntities(value).replace(/\s+/g, " ").trim() || null;
}

export function resolveAbsoluteUrl(value: string | null, baseUrl: URL): string | null {
  if (!value) return null;
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

export function extractTagContent(html: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = html.match(regex);
  return match?.[1] || null;
}

export function extractMetaContent(html: string, attribute: "name" | "property", value: string): string | null {
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

export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 9000): Promise<Response> {
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

export function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function extractPlainText(html: string): string {
  // 1. Remove non-content blocks first to prevent them matching as "main"
  const cleanHtml = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "");

  // 2. Try to find the most significant content container
  const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let targetHtml = bodyMatch ? bodyMatch[1] : cleanHtml;
  
  // Refined selectors: Prioritize unique content containers
  const contentMatch = 
    targetHtml.match(/<article[^>]*>([\s\S]*)<\/article>/i) || 
    targetHtml.match(/<main[^>]*>([\s\S]*)<\/main>/i) ||
    targetHtml.match(/<div[^>]*id=["'][^"']*(?:article|content|post|story)[^"']*["'][^>]*>([\s\S]*)<\/div>/i) ||
    targetHtml.match(/<div[^>]*class=["'][^"']*(?:article|content|post-body|story-body)[^"']*["'][^>]*>([\s\S]*)<\/div>/i);
  
  if (contentMatch) targetHtml = contentMatch[1];

  // 3. Strip remaining tags and collapse whitespace
  const text = targetHtml.replace(/<[^>]+>/g, " ");
  return text.replace(/\s+/g, " ").trim().substring(0, 15000);
}
