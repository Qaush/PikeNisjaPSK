import "server-only";
import { config } from "../config";
import { mockEmailProvider } from "./mock";
import { smtpEmailProvider } from "./smtp";
import type { EmailProvider } from "./types";

export type { EmailMessage, EmailProvider } from "./types";

export function getEmailProvider(): EmailProvider {
  switch (config.emailProvider) {
    case "mock":
      return mockEmailProvider;
    case "smtp":
      return smtpEmailProvider;
    default:
      throw new Error(`Ofrues emaili i panjohur: ${config.emailProvider}`);
  }
}
