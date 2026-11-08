export type OrderStatus = "pending" | "paid" | "cancelled";

export type Order = {
  id: string;
  testSlug: string;
  status: OrderStatus;
  amountCents: number;
  currency: string;
  provider: string;
  /** Emaili i klientit, i enkriptuar. */
  emailEnc: string;
  /** Përgjigjet e testit, të enkriptuara. */
  answersEnc: string;
  /** Token sekret për të hapur raportin; caktohet vetëm pas pagesës. */
  reportToken?: string;
  /** ID e transaksionit te ofruesi i pagesës, nëse ka. */
  providerRef?: string;
  createdAt: string;
  paidAt?: string;
  reportSentAt?: string;
  /** Kur klienti kërkoi seancë me psikologun (vetëm një herë për raport). */
  sessionRequestedAt?: string;
};

/**
 * Ndërfaqja e ruajtjes. Zbatimet: skedar JSON (zhvillim lokal) dhe Upstash Redis (prodhim).
 * Çdo zbatim duhet t'i fshijë porositë pas REPORT_RETENTION_DAYS ditësh.
 */
export interface OrderStore {
  readonly name: string;
  createOrder(order: Order): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  /** Kthen vetëm porosi të paguara. */
  getOrderByReportToken(token: string): Promise<Order | undefined>;
  updateOrder(id: string, patch: Partial<Order>): Promise<Order | undefined>;
}
