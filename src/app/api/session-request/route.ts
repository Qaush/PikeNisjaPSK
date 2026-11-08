import { config } from "@/lib/config";
import { getEmailProvider } from "@/lib/email";
import { openReport } from "@/lib/orders";
import { buildSessionRequestEmail } from "@/lib/report";
import { getOrderByReportToken, updateOrder } from "@/lib/store";

/**
 * POST /api/session-request
 * Body: { token }
 * Njofton psikologun se klienti kërkon një seancë. Dërgohet vetëm një herë për raport.
 * Klienti nuk e sheh kurrë adresën e psikologut.
 */
export async function POST(request: Request) {
  let body: Partial<{ token: string }>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Kërkesë e pavlefshme." }, { status: 400 });
  }
  if (typeof body.token !== "string" || !body.token) {
    return Response.json({ error: "Mungon token-i i raportit." }, { status: 400 });
  }

  const order = await getOrderByReportToken(body.token);
  const view = order ? openReport(order) : null;
  if (!order || !view) return Response.json({ error: "Raporti nuk u gjet." }, { status: 404 });

  if (order.sessionRequestedAt) return Response.json({ ok: true, already: true });

  const mail = buildSessionRequestEmail({
    test: view.test,
    result: view.result,
    clientEmail: view.email,
    reportUrl: `${config.baseUrl}/report/${body.token}`,
  });

  await getEmailProvider().send({
    to: config.psychologistEmail,
    replyTo: view.email,
    ...mail,
  });
  await updateOrder(order.id, { sessionRequestedAt: new Date().toISOString() });

  return Response.json({ ok: true });
}
