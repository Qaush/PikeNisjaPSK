import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "./config";

/**
 * Ruajtje e thjeshtë në skedar JSON, e mjaftueshme për MVP dhe testim lokal.
 * Ndërfaqja (getOrder/saveOrder/...) është e ndarë nga zbatimi, që më vonë të
 * zëvendësohet me një bazë të dhënash reale (Postgres, SQLite) pa prekur pjesën tjetër.
 *
 * PRIVATËSIA: emaili dhe përgjigjet ruhen vetëm të enkriptuara (shih crypto.ts).
 * Rekordet më të vjetra se REPORT_RETENTION_DAYS fshihen automatikisht.
 */

export type OrderStatus = "pending" | "paid" | "cancelled";

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
  /** Token sekret për të hapur raportin; caktohet vetëm pas pagesës. */
  reportToken?: string;
  /** ID e transaksionit te ofruesi i pagesës, nëse ka. */
  providerRef?: string;
  createdAt: string;
  paidAt?: string;
  reportSentAt?: string;
  /** Kur klienti kërkoi seancë me psikologun (vetëm një herë për raport). */
  sessionRequestedAt?: string;
};

type Db = { orders: Order[] };

const dbPath = () => path.join(process.cwd(), config.dataDir, "db.json");

let writeQueue: Promise<void> = Promise.resolve();

async function readDb(): Promise<Db> {
  try {
    const raw = await readFile(dbPath(), "utf8");
    return JSON.parse(raw) as Db;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return { orders: [] };
    throw err;
  }
}

async function writeDb(db: Db): Promise<void> {
  await mkdir(path.dirname(dbPath()), { recursive: true });
  await writeFile(dbPath(), JSON.stringify(db, null, 2), "utf8");
}

/** Ekzekuton një ndryshim mbi bazën e të dhënave në mënyrë serike (pa gara shkrimi). */
async function mutate<T>(fn: (db: Db) => T | Promise<T>): Promise<T> {
  let result!: T;
  writeQueue = writeQueue.then(async () => {
    const db = await readDb();
    purgeExpired(db);
    result = await fn(db);
    await writeDb(db);
  });
  await writeQueue;
  return result;
}

function purgeExpired(db: Db) {
  const cutoff = Date.now() - config.retentionDays * 24 * 60 * 60 * 1000;
  db.orders = db.orders.filter((o) => new Date(o.createdAt).getTime() >= cutoff);
}

export async function createOrder(order: Order): Promise<Order> {
  return mutate((db) => {
    db.orders.push(order);
    return order;
  });
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const db = await readDb();
  return db.orders.find((o) => o.id === id);
}

export async function getOrderByReportToken(token: string): Promise<Order | undefined> {
  const db = await readDb();
  return db.orders.find((o) => o.reportToken === token && o.status === "paid");
}

export async function updateOrder(
  id: string,
  patch: Partial<Order>,
): Promise<Order | undefined> {
  return mutate((db) => {
    const o = db.orders.find((x) => x.id === id);
    if (!o) return undefined;
    Object.assign(o, patch);
    return o;
  });
}
