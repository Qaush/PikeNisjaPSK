import type { CheckoutInput, CheckoutSession, PaymentProvider } from "./types";

/**
 * Ofrues pagese i simuluar, për zhvillim dhe demonstrim.
 * E çon klientin te një faqe e brendshme (/pay/mock/[orderId]) ku "paguan" me një klikim.
 * NUK përdoret në prodhim.
 */
export const mockPaymentProvider: PaymentProvider = {
  name: "mock",
  async createCheckout(input: CheckoutInput): Promise<CheckoutSession> {
    const url = new URL(`/pay/mock/${input.orderId}`, input.successUrl);
    return { redirectUrl: url.toString(), providerRef: `mock_${input.orderId}` };
  },
};
