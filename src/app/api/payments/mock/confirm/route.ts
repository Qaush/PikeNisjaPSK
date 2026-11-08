import { config } from "@/lib/config";
import { completePayment } from "@/lib/orders";

/**
 * POST /api/payments/mock/confirm
 * Simulon konfirmimin e pagesës nga ofruesi. Aktiv vetëm kur PAYMENT_PROVIDER=mock.
 * Në prodhim, këtë rol e luan webhook-u i ofruesit real (/api/payments/webhook).
 */
export async function POST(request: Request) {
  if (config.paymentProvider !== "mock") {
    return Response.json({ error: "Nuk është aktiv." }, { status: 404 });
  }
  const form = await request.formData();
  const orderId = String(form.get("orderId") ?? "");
  if (!orderId) return Response.json({ error: "Mungon orderId." }, { status: 400 });

  const res = await completePayment(orderId);
  if ("error" in res) return Response.json(res, { status: 400 });

  return Response.redirect(`${config.baseUrl}/report/${res.reportToken}`, 303);
}
