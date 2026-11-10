import { config } from "@/lib/config";
import { FEEDBACK_COOKIE, isValidFeedbackKey } from "@/lib/feedback";

/**
 * GET /api/feedback/hyr?k=<çelësi>
 * Linku i rishikuesit: vendos cookie-n që ia shfaq kutinë e kërkesave dhe e kthen te faqja kryesore.
 */
export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("k");
  if (!isValidFeedbackKey(key)) {
    return Response.json({ error: "Linku nuk është i vlefshëm." }, { status: 404 });
  }
  const cookie = [
    `${FEEDBACK_COOKIE}=${encodeURIComponent(key!)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${60 * 60 * 24 * 30}`,
  ].join("; ");
  return new Response(null, {
    status: 303,
    headers: { Location: `${config.baseUrl}/`, "Set-Cookie": cookie },
  });
}
