import { startCheckout } from "@/lib/orders";

/**
 * POST /api/checkout
 * Body: { testSlug, email, answers: { q1: 0..3, ... }, consent: true, durationSec? }
 * Kthen: { redirectUrl } ose { error }
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Kërkesë e pavlefshme." }, { status: 400 });
  }

  const b = body as Partial<{
    testSlug: string;
    email: string;
    answers: Record<string, number>;
    consent: boolean;
    durationSec: number;
  }>;

  if (b.consent !== true) {
    return Response.json(
      { error: "Duhet të pranoni politikën e privatësisë për të vazhduar." },
      { status: 400 },
    );
  }
  if (typeof b.testSlug !== "string" || typeof b.email !== "string" || !b.answers) {
    return Response.json({ error: "Të dhëna të paplota." }, { status: 400 });
  }

  const res = await startCheckout({
    testSlug: b.testSlug,
    email: b.email,
    answers: b.answers,
    durationSec: b.durationSec,
  });
  if ("error" in res) return Response.json(res, { status: 400 });
  return Response.json(res);
}
