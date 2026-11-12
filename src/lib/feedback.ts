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
 *
 * Kërkesës mund t'i bashkëngjiten PDF (p.sh. manuali i një testi që duhet shtuar). Ruhen te
 * data/kerkesat-skedaret/<id>/ dhe nuk shërbehen kurrë prapa nga faqja: i lexon vetëm zhvilluesi.
 */

export type FeedbackStatus = "e-re" | "ne-pune" | "kryer" | "pyetje";

export type FeedbackItem = {
  id: string;
  createdAt: string;
  /** Faqja ku ishte rishikuesi kur e shkroi kërkesën. */
  page: string;
  text: string;
  status: FeedbackStatus;
  /** Emrat e PDF-ve të bashkëngjitura (siç u ruajtën në disk). */
  files?: string[];
  /** Përgjigjja e zhvilluesit: çka u ndryshua, ose pyetja kur kërkesa s'është e qartë. */
  reply?: string;
  updatedAt?: string;
};

export const FEEDBACK_COOKIE = "pn_fb";
export const FEEDBACK_MAX_TEXT = 2000;
export const FEEDBACK_MAX_FILES = 5;
export const FEEDBACK_MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_OPEN = 50;

export type FeedbackUpload = { name: string; data: Buffer };

/** Kthen mesazh gabimi kur skedarët nuk pranohen, përndryshe null. */
export function validateUploads(files: FeedbackUpload[]): string | null {
  if (files.length > FEEDBACK_MAX_FILES) {
    return `Më së shumti ${FEEDBACK_MAX_FILES} skedarë për kërkesë.`;
  }
  for (const f of files) {
    if (f.data.length > FEEDBACK_MAX_FILE_BYTES) {
      return `Skedari "${f.name}" është më i madh se 25 MB.`;
    }
    // Pranohet vetëm PDF i vërtetë: kontrollohet fillimi i skedarit, jo vetëm emri.
    if (f.data.subarray(0, 5).toString("latin1") !== "%PDF-") {
      return `Skedari "${f.name}" nuk është PDF.`;
    }
  }
  return null;
}

/** Emër i sigurt për disk: pa shtigje, pa shenja të veçanta, gjithmonë me .pdf. */
function safeFileName(name: string, index: number): string {
  const base = name
    .replace(/\.pdf$/i, "")
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9 _-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${index + 1}-${base || "skedar"}.pdf`;
}

const filePath = () => path.join(process.cwd(), config.dataDir, "kerkesat.json");
const uploadsDir = (id: string) => path.join(process.cwd(), config.dataDir, "kerkesat-skedaret", id);

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
  files?: FeedbackUpload[];
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
    if (input.files?.length) {
      const dir = uploadsDir(item.id);
      await mkdir(dir, { recursive: true });
      item.files = [];
      for (const [i, f] of input.files.entries()) {
        const name = safeFileName(f.name, i);
        await writeFile(path.join(dir, name), f.data);
        item.files.push(name);
      }
    }
    items.push(item);
    await mkdir(path.dirname(filePath()), { recursive: true });
    await writeFile(filePath(), JSON.stringify(items, null, 2), "utf8");
    result = item;
  });
  await writeQueue;
  return result;
}
