import "server-only";
import { timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "./config";
import { randomToken } from "./crypto";

/**
 * Kërkesat për ndryshim nga rishikuesi (psikologu) gjatë fazës së testimit.
 *
 * Aktive vetëm kur është vendosur FEEDBACK_KEY. Rishikuesi hyn një herë me linkun
 * /api/feedback/hyr?k=<çelësi>, që i vendos një cookie; vizitorët e tjerë nuk e shohin kutinë.
 * Ruhen në skedar (data/kerkesat.json), pra punon vetëm aty ku disku shkruhet (jo në Vercel).
 */

export type FeedbackStatus = "e-re" | "ne-pune" | "kryer" | "pyetje";

export type FeedbackItem = {
  id: string;
  createdAt: string;
  /** Faqja ku ishte rishikuesi kur e shkroi kërkesën. */
  page: string;
  text: string;
  status: FeedbackStatus;
  /** Përgjigjja e zhvilluesit: çka u ndryshua, ose pyetja kur kërkesa s'është e qartë. */
  reply?: string;
  updatedAt?: string;
};

export const FEEDBACK_COOKIE = "pn_fb";
export const FEEDBACK_MAX_TEXT = 2000;
const MAX_OPEN = 50;

const filePath = () => path.join(process.cwd(), config.dataDir, "kerkesat.json");

export function feedbackEnabled(): boolean {
  return Boolean(process.env.FEEDBACK_KEY);
}

export function isValidFeedbackKey(candidate: string | undefined | null): boolean {
  const key = process.env.FEEDBACK_KEY;
  if (!key || !candidate) return false;
  const a = Buffer.from(key);
  const b = Buffer.from(candidate);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** A e ka kërkesa cookie-n e rishikuesit. */
export function isReviewer(request: Request): boolean {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === FEEDBACK_COOKIE) return isValidFeedbackKey(decodeURIComponent(rest.join("=")));
  }
  return false;
}

export async function listFeedback(): Promise<FeedbackItem[]> {
  try {
    return JSON.parse(await readFile(filePath(), "utf8")) as FeedbackItem[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

let writeQueue: Promise<void> = Promise.resolve();

export async function addFeedback(input: {
  text: string;
  page: string;
}): Promise<FeedbackItem | { error: string }> {
  let result!: FeedbackItem | { error: string };
  writeQueue = writeQueue.then(async () => {
    const items = await listFeedback();
    if (items.filter((i) => i.status !== "kryer").length >= MAX_OPEN) {
      result = { error: "Ka shumë kërkesa të hapura. Prisni sa të kryhen disa." };
      return;
    }
    const item: FeedbackItem = {
      id: randomToken(6),
      createdAt: new Date().toISOString(),
      page: input.page.slice(0, 200),
      text: input.text,
      status: "e-re",
    };
    items.push(item);
    await mkdir(path.dirname(filePath()), { recursive: true });
    await writeFile(filePath(), JSON.stringify(items, null, 2), "utf8");
    result = item;
  });
  await writeQueue;
  return result;
}
