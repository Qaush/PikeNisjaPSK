import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "../config";
import type { Order, OrderStore } from "./types";

/**
 * Ruajtje në skedar JSON (data/db.json), vetëm për zhvillim lokal.
 * Në Vercel dhe hosting serverless skedarët nuk mbeten; aty përdoret Redis.
 */

type Db = { orders: Order[] };

const dbPath = () => path.join(process.cwd(), config.dataDir, "db.json");

let writeQueue: Promise<void> = Promise.resolve();

async function readDb(): Promise<Db> {
  try {
    return JSON.parse(await readFile(dbPath(), "utf8")) as Db;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return { orders: [] };
    throw err;
  }
}

async function writeDb(db: Db): Promise<void> {
  await mkdir(path.dirname(dbPath()), { recursive: true });
  await writeFile(dbPath(), JSON.stringify(db, null, 2), "utf8");
}

/** Ekzekuton një ndryshim në mënyrë serike (pa gara shkrimi). */
async function mutate<T>(fn: (db: Db) => T): Promise<T> {
  let result!: T;
  writeQueue = writeQueue.then(async () => {
    const db = await readDb();
    purgeExpired(db);
    result = fn(db);
    await writeDb(db);
  });
  await writeQueue;
  return result;
}

function purgeExpired(db: Db) {
  const cutoff = Date.now() - config.pendingOrderHours * 60 * 60 * 1000;
  db.orders = db.orders.filter((o) => new Date(o.createdAt).getTime() >= cutoff);
}

export const fileStore: OrderStore = {
  name: "file",
  createOrder: (order) =>
    mutate((db) => {
      db.orders.push(order);
      return order;
    }),
  async getOrder(id) {
    return (await readDb()).orders.find((o) => o.id === id);
  },
  updateOrder: (id, patch) =>
    mutate((db) => {
      const o = db.orders.find((x) => x.id === id);
      if (!o) return undefined;
      Object.assign(o, patch);
      return o;
    }),
  deleteOrder: (id) =>
    mutate((db) => {
      db.orders = db.orders.filter((o) => o.id !== id);
    }),
};
