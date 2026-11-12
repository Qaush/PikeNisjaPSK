import {
  addFeedback,
  FEEDBACK_MAX_FILE_BYTES,
  FEEDBACK_MAX_TEXT,
  feedbackEnabled,
  isReviewer,
  listFeedback,
  validateUploads,
  type FeedbackUpload,
} from "@/lib/feedback";

/**
 * GET  /api/feedback – lista e kërkesave (vetëm për rishikuesin; të tjerëve u kthen enabled:false)
 * POST /api/feedback – kërkesë e re: JSON { text, page }, ose multipart/form-data me
 *                      text, page dhe files (PDF, deri 5 copë, 25 MB secili)
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

  let text = "";
  let page = "";
  const files: FeedbackUpload[] = [];
  try {
    if ((request.headers.get("content-type") ?? "").includes("multipart/form-data")) {
      const form = await request.formData();
      text = String(form.get("text") ?? "").trim();
      page = String(form.get("page") ?? "");
      for (const entry of form.getAll("files")) {
        if (typeof entry === "string" || entry.size === 0) continue;
        if (entry.size > FEEDBACK_MAX_FILE_BYTES) {
          return Response.json(
            { error: `Skedari "${entry.name}" është më i madh se 25 MB.` },
            { status: 400 },
          );
        }
        files.push({ name: entry.name, data: Buffer.from(await entry.arrayBuffer()) });
      }
    } else {
      const b = (await request.json()) as Partial<{ text: string; page: string }>;
      text = typeof b.text === "string" ? b.text.trim() : "";
      page = typeof b.page === "string" ? b.page : "";
    }
  } catch {
    return Response.json({ error: "Kërkesë e pavlefshme." }, { status: 400 });
  }

  const invalid = validateUploads(files);
  if (invalid) return Response.json({ error: invalid }, { status: 400 });

  // Me skedarë të bashkëngjitur teksti mund të mungojë.
  if (text.length < 3 && files.length === 0) {
    return Response.json({ error: "Shkruani çka duhet ndryshuar." }, { status: 400 });
  }
  if (text.length > FEEDBACK_MAX_TEXT) {
    return Response.json(
      { error: `Teksti është shumë i gjatë (më së shumti ${FEEDBACK_MAX_TEXT} shkronja).` },
      { status: 400 },
    );
  }
  const res = await addFeedback({
    text: text || "(vetëm skedarë të bashkëngjitur)",
    page,
    files,
  });
  if ("error" in res) return Response.json(res, { status: 429 });
  return Response.json({ ok: true, item: res });
}
