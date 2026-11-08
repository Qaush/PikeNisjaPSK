import "server-only";
import { config } from "../config";
import { mockEmailProvider } from "./mock";
import type { EmailProvider } from "./types";

export type { EmailMessage, EmailProvider } from "./types";

export function getEmailProvider(): EmailProvider {
  switch (config.emailProvider) {
    case "mock":
      return mockEmailProvider;
    // case "resend": return resendProvider;  // TODO: kur hapet llogaria Resend
    default:
      throw new Error(`Ofrues emaili i panjohur: ${config.emailProvider}`);
  }
}
