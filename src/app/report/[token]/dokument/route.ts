import { config } from "@/lib/config";
import { openReport } from "@/lib/orders";
import { buildReportDocument } from "@/lib/report";

/**
 * GET /report/[token]/dokument
 * Raporti si dokument i plotë, i njëjti që i shkon klientit në email: për t'u parë, printuar
 * ose ruajtur si PDF nga shfletuesi. Hapet vetëm me token-in e raportit, si faqja e raportit.
 */
export async function GET(_request: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const view = openReport(token);
  if (!view) {
    return new Response("Raporti nuk u gjet ose linku ka skaduar.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  const html = buildReportDocument({
    test: view.test,
    result: view.result,
    answers: view.answers,
    email: view.email,
    date: view.date,
    durationSec: view.durationSec,
    reportUrl: `${config.baseUrl}/report/${token}`,
    standalone: true,
  });
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
