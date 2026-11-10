/**
 * Konfigurimi i aplikacionit, i lexuar nga variablat e mjedisit (.env.local).
 * Shih .env.example për listën e plotë.
 */

function int(name: string, fallback: number): number {
  const raw = process.env[name];
  const n = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(n) ? n : fallback;
}

export const config = {
  /** Emri i markës, i shfaqur në faqe dhe email. */
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME ?? "PikëNisja",

  /** URL-ja publike e faqes, për linqet në email. */
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",

  /** Çmimi i një testi në cent (200 = 2,00 €). */
  priceCents: int("PRICE_CENTS", 200),
  currency: process.env.CURRENCY ?? "EUR",

  /** Emaili i psikologut që merr kërkesat për kontakt. */
  psychologistEmail: process.env.PSYCHOLOGIST_EMAIL ?? "psikologu@example.com",

  /** Adresa dërguese e emaileve. */
  fromEmail: process.env.FROM_EMAIL ?? "PikëNisja <raporte@example.com>",

  /** Ofruesi i pagesës: "mock" (për zhvillim) ose "paddle" (prodhim, ende pa u zbatuar). */
  paymentProvider: process.env.PAYMENT_PROVIDER ?? "mock",

  /** Ofruesi i emailit: "mock" (ruan në data/outbox) ose "resend". */
  emailProvider: process.env.EMAIL_PROVIDER ?? "mock",

  /** Sa ditë vlen linku i raportit (të dhënat janë brenda linkut; serveri nuk i ruan). */
  retentionDays: int("REPORT_RETENTION_DAYS", 30),

  /** Pas sa orësh fshihet një porosi që nuk u pagua. */
  pendingOrderHours: int("PENDING_ORDER_HOURS", 24),

  /** Dosja ku ruhen të dhënat (store-i JSON dhe outbox-i i emaileve). */
  dataDir: process.env.DATA_DIR ?? "data",
};

export function formatPrice(cents: number = config.priceCents): string {
  const euros = (cents / 100).toFixed(2).replace(".", ",");
  return `${euros} €`;
}
