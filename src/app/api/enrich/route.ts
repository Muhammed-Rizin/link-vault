import { NextResponse } from "next/server"

type EnrichResponse = {
  title: string | null
  description: string | null
  summary: string | null
  image: string | null
}

function cleanContent(value: string | null) {
  if (!value) return null
  return decodeHtmlEntities(value).replace(/\s+/g, " ").trim() || null
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
}

function resolveAbsoluteUrl(value: string | null, baseUrl: URL) {
  if (!value) return null
  try {
    return new URL(value, baseUrl).toString()
  } catch {
    return value
  }
}

function extractTagContent(html: string, tagName: string) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i")
  const match = html.match(regex)
  return match?.[1] || null
}

function extractMetaContent(html: string, attribute: "name" | "property", value: string) {
  const regex = new RegExp(
    `<meta[^>]*${attribute}=["']${value}["'][^>]*content=["']([^"']*)["'][^>]*>`,
    "i"
  )
  const reverseRegex = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*${attribute}=["']${value}["'][^>]*>`,
    "i"
  )
  return html.match(regex)?.[1] || html.match(reverseRegex)?.[1] || null
}

export async function POST(request: Request) {
  let body: { url?: string }
  try {
    body = (await request.json()) as { url?: string }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const rawUrl = body.url?.trim()
  if (!rawUrl) {
    return NextResponse.json({ error: "URL is required." }, { status: 400 })
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(rawUrl)
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Unsupported protocol")
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL." }, { status: 400 })
  }

  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), 9000)

  try {
    const response = await fetch(parsedUrl.toString(), {
      signal: abortController.signal,
      headers: {
        "User-Agent": "LinkVaultBot/1.0 (+https://localhost)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    })

    clearTimeout(timeout)
    if (!response.ok) {
      throw new Error("Failed request")
    }

    const html = (await response.text()).slice(0, 400_000)
    const title =
      cleanContent(extractMetaContent(html, "property", "og:title")) ||
      cleanContent(extractMetaContent(html, "name", "twitter:title")) ||
      cleanContent(extractTagContent(html, "title"))

    const description =
      cleanContent(extractMetaContent(html, "property", "og:description")) ||
      cleanContent(extractMetaContent(html, "name", "description")) ||
      cleanContent(extractMetaContent(html, "name", "twitter:description"))

    const image = resolveAbsoluteUrl(
      cleanContent(extractMetaContent(html, "property", "og:image")) ||
        cleanContent(extractMetaContent(html, "name", "twitter:image")),
      parsedUrl
    )

    const payload: EnrichResponse = {
      title,
      description,
      summary: description,
      image,
    }

    return NextResponse.json(payload)
  } catch {
    clearTimeout(timeout)
    return NextResponse.json(
      {
        title: null,
        description: null,
        summary: null,
        image: null,
      } satisfies EnrichResponse,
      { status: 200 }
    )
  }
}
