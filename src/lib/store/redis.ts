import { Redis } from "@upstash/redis";
import { config } from "../config";
import type { Order, OrderStore } from "./types";

/**
 * Ruajtje në Upstash Redis (prodhim, Vercel).
 *
 * Çelësi: order:<id> → porosia në pritje të pagesës (JSON), me TTL = PENDING_ORDER_HOURS.
 * Pas pagesës porosia fshihet; porositë e papaguara i fshin vetë Redis-i.
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

const ttlSeconds = () => config.pendingOrderHours * 60 * 60;
const orderKey = (id: string) => `order:${id}`;

/** Ruan porosinë duke e rifreskuar TTL-në. */
async function save(order: Order): Promise<void> {
  await redis().set(orderKey(order.id), order, { ex: ttlSeconds() });
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
  async updateOrder(id, patch) {
    const current = await this.getOrder(id);
    if (!current) return undefined;
    const updated = { ...current, ...patch };
    await save(updated);
    return updated;
  },
  async deleteOrder(id) {
    await redis().del(orderKey(id));
  },
};
