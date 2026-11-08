/**
 * POST /api/payments/webhook
 * Vendi ku ofruesi real i pagesës (Paddle, Stripe, bankë) njofton se pagesa u krye.
 *
 * TODO kur hapet llogaria e ofruesit:
 *  1. Verifiko nënshkrimin e webhook-ut me sekretin e ofruesit (kurrë mos e beso pa verifikim).
 *  2. Lexo orderId-në nga metadata e transaksionit.
 *  3. Thirr completePayment(orderId) nga "@/lib/orders".
 */
export async function POST() {
  return Response.json({ error: "Webhook-u ende nuk është konfiguruar." }, { status: 501 });
}
