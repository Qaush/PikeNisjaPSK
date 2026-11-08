import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "../config";
import type { EmailMessage, EmailProvider } from "./types";

/**
 * Ofrues emaili i simuluar: nuk dërgon asgjë, por e ruan mesazhin si skedar HTML
 * në data/outbox/, që ta hapim dhe ta shohim si do të dukej emaili.
 */
export const mockEmailProvider: EmailProvider = {
  name: "mock",
  async send(message: EmailMessage) {
    const dir = path.join(process.cwd(), config.dataDir, "outbox");
    await mkdir(dir, { recursive: true });
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const header = `<!-- To: ${message.to}\n     Reply-To: ${message.replyTo ?? "-"}\n     Subject: ${message.subject} -->\n`;
    await writeFile(path.join(dir, `${id}.html`), header + message.html, "utf8");
    console.log(`[email:mock] → ${message.to} | ${message.subject} | ruajtur te data/outbox/${id}.html`);
    return { id };
  },
};
