/**
 * Ndërfaqja e një ofruesi pagese. Aplikacioni flet vetëm me këtë ndërfaqe,
 * kështu që kalimi nga "mock" te Paddle/Stripe/bankë lokale prek vetëm një skedar.
 */

export type CheckoutInput = {
  orderId: string;
  amountCents: number;
  currency: string;
  /** Emri i produktit, i shfaqur te ofruesi. */
  description: string;
  /** Emaili i klientit, për ta paraplotësuar te ofruesi. */
  customerEmail: string;
  /** Ku kthehet klienti pas pagesës së suksesshme / anulimit. */
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutSession = {
  /** URL ku duhet ridrejtuar klienti për të paguar. */
  redirectUrl: string;
  /** Referenca e ofruesit për këtë pagesë. */
  providerRef: string;
};

export interface PaymentProvider {
  readonly name: string;
  createCheckout(input: CheckoutInput): Promise<CheckoutSession>;
}
