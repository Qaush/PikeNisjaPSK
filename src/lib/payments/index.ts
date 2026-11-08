import "server-only";
import { config } from "../config";
import { mockPaymentProvider } from "./mock";
import type { PaymentProvider } from "./types";

export type { CheckoutInput, CheckoutSession, PaymentProvider } from "./types";

export function getPaymentProvider(): PaymentProvider {
  switch (config.paymentProvider) {
    case "mock":
      return mockPaymentProvider;
    // case "paddle": return paddleProvider;  // TODO: zbatohet kur hapet llogaria Paddle
    default:
      throw new Error(`Ofrues pagese i panjohur: ${config.paymentProvider}`);
  }
}
