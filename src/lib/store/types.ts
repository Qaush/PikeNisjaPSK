export type OrderStatus = "pending" | "cancelled";

/**
 * Porosi në pritje të pagesës. Pas pagesës fshihet (shih lib/orders.ts): raporti jeton
 * vetëm te linku i enkriptuar, serveri nuk mban asgjë.
 */
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
  /** Sa sekonda zgjati plotësimi i testit (matur te shfletuesi), nëse dihet. */
  durationSec?: number;
  /** ID e transaksionit te ofruesi i pagesës, nëse ka. */
  providerRef?: string;
  createdAt: string;
};

/**
 * Ndërfaqja e ruajtjes. Zbatimet: skedar JSON (zhvillim lokal) dhe Upstash Redis (prodhim).
 * Çdo zbatim duhet t'i fshijë vetë porositë e papaguara pas PENDING_ORDER_HOURS orësh.
 */
export interface OrderStore {
  readonly name: string;
  createOrder(order: Order): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  updateOrder(id: string, patch: Partial<Order>): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<void>;
}
