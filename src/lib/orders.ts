import "server-only";
import { config } from "./config";
import { decryptJson, encryptJson, randomToken } from "./crypto";
import { getEmailProvider } from "./email";
import { getPaymentProvider } from "./payments";
import { buildReportEmail } from "./report";
import { createOrder, deleteOrder, getOrder, updateOrder, type Order } from "./store";
import { getTest, scoreTest, validateAnswers, type TestDefinition, type TestResult } from "./tests";

/**
 * Logjika e biznesit për porositë: krijimi i pagesës dhe përmbyllja pas pagesës.
 * Përdoret si nga ofruesi "mock" ashtu edhe (më vonë) nga webhook-u real,
 * që rrjedha "pagesa u krye → raporti u dërgua" të jetë një e vetme.
 *
 * PRIVATËSIA (kërkesa VCQ2XERZ e psikologes, vendim i pronarit 10.11.2026):
 * pas dërgimit të raportit serveri nuk ruan asgjë. Porosia mbahet (e enkriptuar) vetëm
 * derisa të kryhet pagesa, pastaj fshihet. Raporti hapet nga linku: token-i i tij është
 * vetë përmbajtja (testi, përgjigjet, emaili, data), e enkriptuar me DATA_ENCRYPTION_KEY.
 * Pasojë: nëse çelësi ndërrohet, linqet e vjetra nuk hapen më.
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

/** Përmbajtja e token-it të raportit (e enkriptuar brenda linkut). Emra të shkurtër = link më i shkurtër. */
type ReportPayload = {
  v: 1;
  /** slug i testit */
  t: string;
  /** përgjigjet, sipas radhës së pyetjeve të testit */
  a: number[];
  /** emaili i klientit (për kërkesën e seancës) */
  e: string;
  /** data e pagesës, ISO */
  d: string;
};

function buildReportToken(test: TestDefinition, answers: Record<string, number>, email: string): string {
  const payload: ReportPayload = {
    v: 1,
    t: test.slug,
    a: test.questions.map((q) => answers[q.id]),
    e: email,
    d: new Date().toISOString(),
  };
  return encryptJson(payload);
}

/**
 * Përmbyll pagesën: ndërton linkun e raportit, dërgon emailin dhe FSHIN porosinë.
 * Thirrja e dytë për të njëjtën porosi (p.sh. webhook i përsëritur) kthen "nuk u gjet",
 * pra nuk dërgon email të dytë.
 */
export async function completePayment(orderId: string): Promise<
  { reportToken: string } | { error: string }
> {
  const order = await getOrder(orderId);
  if (!order) return { error: "Porosia nuk u gjet ose është përmbyllur tashmë." };

  const test = getTest(order.testSlug);
  if (!test) return { error: "Testi i porosisë nuk ekziston më." };

  const email = decryptJson<string>(order.emailEnc);
  const answers = decryptJson<Record<string, number>>(order.answersEnc);
  const reportToken = buildReportToken(test, answers, email);

  // Fshihet para dërgimit të emailit: edhe nëse emaili dështon, asgjë s'mbetet te serveri.
  await deleteOrder(order.id);

  const result = scoreTest(test, answers);
  const reportUrl = `${config.baseUrl}/report/${reportToken}`;
  const msg = buildReportEmail({ test, result, reportUrl });

  try {
    await getEmailProvider().send({ to: email, ...msg });
  } catch (err) {
    // Pagesa u krye; klienti ridrejtohet te raporti edhe nëse emaili dështon.
    console.error("[orders] dërgimi i emailit dështoi", err);
  }

  return { reportToken };
}

export type ReportView = {
  test: TestDefinition;
  result: TestResult;
  answers: Record<string, number>;
  email: string;
  /** Data e pagesës. */
  date: Date;
};

/** Hap një raport nga token-i i linkut. Kthen null kur linku është i pavlefshëm ose ka skaduar. */
export function openReport(token: string): ReportView | null {
  let payload: ReportPayload;
  try {
    payload = decryptJson<ReportPayload>(token);
  } catch {
    return null;
  }
  if (!payload || payload.v !== 1 || !Array.isArray(payload.a) || typeof payload.e !== "string") {
    return null;
  }
  const test = getTest(payload.t);
  if (!test || payload.a.length !== test.questions.length) return null;

  const date = new Date(payload.d);
  const ageMs = Date.now() - date.getTime();
  if (!Number.isFinite(ageMs) || ageMs > config.retentionDays * 24 * 60 * 60 * 1000) return null;

  const answers: Record<string, number> = {};
  test.questions.forEach((q, i) => {
    answers[q.id] = payload.a[i];
  });
  if (validateAnswers(test, answers)) return null;

  return { test, result: scoreTest(test, answers), answers, email: payload.e, date };
}
