import { Redis } from "@upstash/redis";
import { config } from "../config";
import type { Order, OrderStore } from "./types";

/**
 * Ruajtje në Upstash Redis (prodhim, Vercel).
 *
 * Çelësat:
 *   order:<id>      → porosia (JSON)
 *   report:<token>  → id e porosisë (për hapjen e raportit)
 * Të dy çelësat kanë TTL = REPORT_RETENTION_DAYS, kështu që fshirja automatike
 * e të dhënave e bën vetë Redis-i.
 *
 * Variablat: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 * (ose KV_REST_API_URL + KV_REST_API_TOKEN, siç i vendos integrimi i Vercel-it).
 */

export function redisCredentials(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

let client: Redis | null = null;
function redis(): Redis {
  if (!client) {
    const creds = redisCredentials();
    if (!creds) throw new Error("Mungojnë UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.");
    client = new Redis(creds);
  }
  return client;
}

const ttlSeconds = () => config.retentionDays * 24 * 60 * 60;
const orderKey = (id: string) => `order:${id}`;
const reportKey = (token: string) => `report:${token}`;

/** Ruan porosinë duke e rifreskuar TTL-në; indekson token-in e raportit nëse ka. */
async function save(order: Order): Promise<void> {
  const r = redis();
  const ex = ttlSeconds();
  const ops: Promise<unknown>[] = [r.set(orderKey(order.id), order, { ex })];
  if (order.reportToken) ops.push(r.set(reportKey(order.reportToken), order.id, { ex }));
  await Promise.all(ops);
}

export const redisStore: OrderStore = {
  name: "redis",
  async createOrder(order) {
    await save(order);
    return order;
  },
  async getOrder(id) {
    return (await redis().get<Order>(orderKey(id))) ?? undefined;
  },
  async getOrderByReportToken(token) {
    const id = await redis().get<string>(reportKey(token));
    if (!id) return undefined;
    const order = await this.getOrder(id);
    return order?.status === "paid" && order.reportToken === token ? order : undefined;
  },
  async updateOrder(id, patch) {
    const current = await this.getOrder(id);
    if (!current) return undefined;
    const updated = { ...current, ...patch };
    await save(updated);
    return updated;
  },
};
