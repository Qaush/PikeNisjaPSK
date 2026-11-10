import {
  addFeedback,
  FEEDBACK_MAX_TEXT,
  feedbackEnabled,
  isReviewer,
  listFeedback,
} from "@/lib/feedback";

/**
 * GET  /api/feedback – lista e kërkesave (vetëm për rishikuesin; të tjerëve u kthen enabled:false)
 * POST /api/feedback – kërkesë e re: { text, page }
 */
export async function GET(request: Request) {
  if (!feedbackEnabled() || !isReviewer(request)) {
    return Response.json({ enabled: false });
  }
  const items = await listFeedback();
  return Response.json(
    { enabled: true, items: items.slice().reverse() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (!feedbackEnabled() || !isReviewer(request)) {
    return Response.json({ error: "Nuk lejohet." }, { status: 403 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Kërkesë e pavlefshme." }, { status: 400 });
  }
  const b = body as Partial<{ text: string; page: string }>;
  const text = typeof b.text === "string" ? b.text.trim() : "";
  if (text.length < 3) {
    return Response.json({ error: "Shkruani çka duhet ndryshuar." }, { status: 400 });
  }
  if (text.length > FEEDBACK_MAX_TEXT) {
    return Response.json(
      { error: `Teksti është shumë i gjatë (më së shumti ${FEEDBACK_MAX_TEXT} shkronja).` },
      { status: 400 },
    );
  }
  const res = await addFeedback({ text, page: typeof b.page === "string" ? b.page : "" });
  if ("error" in res) return Response.json(res, { status: 429 });
  return Response.json({ ok: true, item: res });
}
