import { config } from "@/lib/config";
import { getEmailProvider } from "@/lib/email";
import { openReport } from "@/lib/orders";
import { buildContactEmail } from "@/lib/report";
import { getOrderByReportToken } from "@/lib/store";

/**
 * POST /api/contact
 * Body: { token, message }
 * Dërgon mesazhin e klientit te psikologu, me emailin e klientit si Reply-To.
 * Klienti nuk e sheh kurrë adresën e psikologut.
 */
export async function POST(request: Request) {
  let body: Partial<{ token: string; message: string }>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Kërkesë e pavlefshme." }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (typeof body.token !== "string" || !body.token) {
    return Response.json({ error: "Mungon token-i i raportit." }, { status: 400 });
  }
  if (message.length < 5) {
    return Response.json({ error: "Shkruani një mesazh të shkurtër (të paktën 5 shkronja)." }, { status: 400 });
  }
  if (message.length > 3000) {
    return Response.json({ error: "Mesazhi është shumë i gjatë (maks. 3000 shkronja)." }, { status: 400 });
  }

  const order = await getOrderByReportToken(body.token);
  const view = order ? openReport(order) : null;
  if (!view) return Response.json({ error: "Raporti nuk u gjet." }, { status: 404 });

  const reportUrl = `${config.baseUrl}/report/${body.token}`;
  const mail = buildContactEmail({
    test: view.test,
    result: view.result,
    clientEmail: view.email,
    message,
    reportUrl,
  });

  await getEmailProvider().send({
    to: config.psychologistEmail,
    replyTo: view.email,
    ...mail,
  });

  return Response.json({ ok: true });
}
