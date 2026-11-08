import nodemailer from "nodemailer";
import { config } from "../config";
import type { EmailMessage, EmailProvider } from "./types";

/**
 * Dërgim real përmes SMTP (Gmail me "App password", Outlook, Zoho, serveri i hostingut, etj.).
 * Konfigurohet me SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE në .env.local.
 */
function transporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST, SMTP_USER dhe SMTP_PASS duhen vendosur në .env.local për EMAIL_PROVIDER=smtp.");
  }
  const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);
  const secure = (process.env.SMTP_SECURE ?? (port === 465 ? "true" : "false")) === "true";
  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
}

export const smtpEmailProvider: EmailProvider = {
  name: "smtp",
  async send(message: EmailMessage) {
    const info = await transporter().sendMail({
      from: config.fromEmail,
      to: message.to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    console.log(`[email:smtp] → ${message.to} | ${message.subject} | ${info.messageId}`);
    return { id: info.messageId };
  },
};
