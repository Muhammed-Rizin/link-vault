import { NextResponse } from "next/server"
import { enrichUrl, type EnrichResponse } from "@/lib/services/enrichment.service";

export async function POST(request: Request) {
  let body: { url?: string };
  try {
    body = (await request.json()) as { url?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rawUrl = body.url?.trim();
  if (!rawUrl) {
    return NextResponse.json({ error: "URL is required." }, { status: 400 });
  }

  try {
    const payload = await enrichUrl(rawUrl);
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      {
        title: null,
        description: null,
        summary: null,
        image: null,
      } satisfies EnrichResponse,
      { status: 200 },
    );
  }
}
