import "server-only";
import { config } from "./config";
import { decryptJson, encryptJson, randomToken } from "./crypto";
import { getEmailProvider } from "./email";
import { getPaymentProvider } from "./payments";
import { buildReportEmail } from "./report";
import { createOrder, getOrder, updateOrder, type Order } from "./store";
import { getTest, scoreTest, validateAnswers, type TestDefinition, type TestResult } from "./tests";

/**
 * Logjika e biznesit për porositë: krijimi i pagesës dhe përmbyllja pas pagesës.
 * Përdoret si nga ofruesi "mock" ashtu edhe (më vonë) nga webhook-u real,
 * që rrjedha "pagesa u krye → raporti u dërgua" të jetë një e vetme.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email) && email.length <= 254;
}

export async function startCheckout(input: {
  testSlug: string;
  email: string;
  answers: Record<string, number>;
}): Promise<{ redirectUrl: string } | { error: string }> {
  const test = getTest(input.testSlug);
  if (!test) return { error: "Testi nuk u gjet." };
  if (!isValidEmail(input.email)) return { error: "Emaili nuk është i vlefshëm." };
  const invalid = validateAnswers(test, input.answers);
  if (invalid) return { error: invalid };

  const order: Order = {
    id: randomToken(12),
    testSlug: test.slug,
    status: "pending",
    amountCents: config.priceCents,
    currency: config.currency,
    provider: config.paymentProvider,
    emailEnc: encryptJson(input.email.trim().toLowerCase()),
    answersEnc: encryptJson(input.answers),
    createdAt: new Date().toISOString(),
  };
  await createOrder(order);

  const provider = getPaymentProvider();
  const session = await provider.createCheckout({
    orderId: order.id,
    amountCents: order.amountCents,
    currency: order.currency,
    description: `${config.brandName} – ${test.title}`,
    customerEmail: input.email,
    successUrl: `${config.baseUrl}/pay/success?order=${order.id}`,
    cancelUrl: `${config.baseUrl}/test/${test.slug}`,
  });
  await updateOrder(order.id, { providerRef: session.providerRef });

  return { redirectUrl: session.redirectUrl };
}

/**
 * Shënon porosinë si të paguar, gjeneron token-in e raportit dhe dërgon emailin.
 * Idempotente: nëse thirret dy herë (p.sh. webhook i përsëritur), nuk dërgon email të dytë.
 */
export async function completePayment(orderId: string): Promise<
  { reportToken: string } | { error: string }
> {
  const order = await getOrder(orderId);
  if (!order) return { error: "Porosia nuk u gjet." };
  if (order.status === "paid" && order.reportToken) {
    return { reportToken: order.reportToken };
  }

  const test = getTest(order.testSlug);
  if (!test) return { error: "Testi i porosisë nuk ekziston më." };

  const reportToken = randomToken(24);
  await updateOrder(order.id, {
    status: "paid",
    paidAt: new Date().toISOString(),
    reportToken,
  });

  const email = decryptJson<string>(order.emailEnc);
  const answers = decryptJson<Record<string, number>>(order.answersEnc);
  const result = scoreTest(test, answers);
  const reportUrl = `${config.baseUrl}/report/${reportToken}`;
  const msg = buildReportEmail({ test, result, reportUrl });

  try {
    await getEmailProvider().send({ to: email, ...msg });
    await updateOrder(order.id, { reportSentAt: new Date().toISOString() });
  } catch (err) {
    // Pagesa u krye; raporti mbetet i hapshëm nga linku edhe nëse emaili dështon.
    console.error("[orders] dërgimi i emailit dështoi", err);
  }

  return { reportToken };
}

export type ReportView = {
  order: Order;
  test: TestDefinition;
  result: TestResult;
  answers: Record<string, number>;
  email: string;
};

/** Hap një raport nga porosia e paguar, duke dekriptuar të dhënat. */
export function openReport(order: Order): ReportView | null {
  const test = getTest(order.testSlug);
  if (!test || order.status !== "paid") return null;
  const answers = decryptJson<Record<string, number>>(order.answersEnc);
  const email = decryptJson<string>(order.emailEnc);
  return { order, test, result: scoreTest(test, answers), answers, email };
}
