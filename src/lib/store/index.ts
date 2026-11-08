import "server-only";
import { fileStore } from "./file";
import { redisCredentials, redisStore } from "./redis";
import type { OrderStore } from "./types";

export type { Order, OrderStatus, OrderStore } from "./types";

/**
 * Zgjedh ruajtjen: Redis kur ka kredenciale Upstash (ose STORE=redis),
 * përndryshe skedar JSON lokal. STORE=file e detyron skedarin edhe me kredenciale.
 */
function pick(): OrderStore {
  const forced = process.env.STORE;
  if (forced === "file") return fileStore;
  if (forced === "redis" || redisCredentials()) return redisStore;
  if (process.env.VERCEL) {
    throw new Error(
      "Në Vercel duhet një bazë të dhënash: shtoni Upstash Redis (Storage → Create) që të vendosen UPSTASH_REDIS_REST_URL/TOKEN.",
    );
  }
  return fileStore;
}

const store = pick();

export const createOrder: OrderStore["createOrder"] = (o) => store.createOrder(o);
export const getOrder: OrderStore["getOrder"] = (id) => store.getOrder(id);
export const getOrderByReportToken: OrderStore["getOrderByReportToken"] = (t) =>
  store.getOrderByReportToken(t);
export const updateOrder: OrderStore["updateOrder"] = (id, p) => store.updateOrder(id, p);
