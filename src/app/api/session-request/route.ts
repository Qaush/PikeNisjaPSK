import { config } from "@/lib/config";
import { getEmailProvider } from "@/lib/email";
import { openReport } from "@/lib/orders";
import { buildSessionRequestEmail } from "@/lib/report";
import { createHash } from "node:crypto";

/**
 * POST /api/session-request
 * Body: { token }
 * Njofton psikologun se klienti kërkon një seancë. Klienti nuk e sheh kurrë adresën e psikologut.
 *
 * Serveri nuk ruan asgjë për raportin, pra as faktin që seanca u kërkua. Përsëritjet i ndal
 * shfletuesi (localStorage) dhe kjo listë në kujtesë, që mban vetëm hash-in e token-it dhe
 * zbrazet në çdo rinisje.
 */
const requested = new Set<string>();

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

  const view = openReport(body.token);
  if (!view) return Response.json({ error: "Raporti nuk u gjet." }, { status: 404 });

  const fingerprint = createHash("sha256").update(body.token).digest("hex");
  if (requested.has(fingerprint)) return Response.json({ ok: true, already: true });

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
  requested.add(fingerprint);

  return Response.json({ ok: true });
}
