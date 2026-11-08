import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/**
 * Enkriptim simetrik AES-256-GCM për të dhënat e ndjeshme (email, përgjigje).
 *
 * Çelësi vjen nga DATA_ENCRYPTION_KEY (çdo string; hash-ohet në 32 bajt).
 * Në zhvillim, nëse mungon, përdoret një çelës fiks me paralajmërim, që të mos bllokohet puna.
 * NË PRODHIM DATA_ENCRYPTION_KEY ËSHTË I DETYRUESHËM.
 */
function getKey(): Buffer {
  const secret = process.env.DATA_ENCRYPTION_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("DATA_ENCRYPTION_KEY mungon. Vendoseni në mjedisin e prodhimit.");
    }
    return createHash("sha256").update("dev-only-insecure-key").digest();
  }
  return createHash("sha256").update(secret).digest();
}

/** Enkripton çdo vlerë JSON. Kthen string në formatin iv.tag.ciphertext (base64url). */
export function encryptJson(value: unknown): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const plaintext = Buffer.from(JSON.stringify(value), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map((b) => b.toString("base64url")).join(".");
}

export function decryptJson<T>(payload: string): T {
  const [ivB64, tagB64, dataB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !dataB64) throw new Error("Payload i enkriptuar i pavlefshëm.");
  const decipher = createDecipheriv("aes-256-gcm", getKey(), Buffer.from(ivB64, "base64url"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64url")),
    decipher.final(),
  ]);
  return JSON.parse(plaintext.toString("utf8")) as T;
}

/** Token i rastësishëm, i sigurt, për URL (p.sh. linku i raportit). */
export function randomToken(bytes = 24): string {
  return randomBytes(bytes).toString("base64url");
}
