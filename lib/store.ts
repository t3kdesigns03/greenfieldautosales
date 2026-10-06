/**
 * Inventory storage — Netlify Blobs store "inventory". Server only.
 *
 * On Netlify (functions, and builds when the Blobs context is present) this
 * talks to Netlify Blobs. Anywhere else (`npm run dev`, `next start` on your
 * machine) it falls back to files under .data/inventory/ so the admin works
 * locally without credentials. .data/ is git-ignored and never deployed.
 *
 * To point a local machine at the real store instead, set
 * NETLIFY_BLOBS_SITE_ID and NETLIFY_BLOBS_TOKEN (a personal access token).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { getStore } from "@netlify/blobs";

export const STORE_NAME = "inventory";

export interface InventoryStore {
  readonly kind: "netlify-blobs" | "local-files";
  getJSON<T>(key: string): Promise<T | null>;
  setJSON(key: string, value: unknown): Promise<void>;
  getBytes(key: string): Promise<ArrayBuffer | null>;
  setBytes(key: string, data: ArrayBuffer): Promise<void>;
  delete(key: string): Promise<void>;
  /** Keys starting with `prefix` */
  list(prefix: string): Promise<string[]>;
}

type BlobStore = ReturnType<typeof getStore>;

function netlifyStore(): InventoryStore | null {
  const siteID = process.env.NETLIFY_BLOBS_SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN;
  const make = (consistency: "strong" | "eventual"): BlobStore =>
    siteID && token ? getStore({ name: STORE_NAME, siteID, token, consistency }) : getStore({ name: STORE_NAME, consistency });

  let strong: BlobStore;
  let eventual: BlobStore;
  try {
    strong = make("strong");
    eventual = make("eventual");
  } catch {
    return null; // no Blobs context here
  }

  // Strong consistency (read-your-writes) needs the uncached edge URL, which
  // some contexts (e.g. builds) don't provide. Fall back to eventual there.
  const withStrong = async <T>(fn: (s: BlobStore) => Promise<T>): Promise<T> => {
    try {
      return await fn(strong);
    } catch (err) {
      if (err instanceof Error && /consisten/i.test(`${err.name} ${err.message}`)) return fn(eventual);
      throw err;
    }
  };

  return {
    kind: "netlify-blobs",
    getJSON: (key) => withStrong((s) => s.get(key, { type: "json" })) as Promise<never>,
    setJSON: async (key, value) => {
      await strong.setJSON(key, value);
    },
    getBytes: (key) => withStrong((s) => s.get(key, { type: "arrayBuffer" })) as Promise<ArrayBuffer | null>,
    setBytes: async (key, data) => {
      await strong.set(key, data);
    },
    delete: (key) => strong.delete(key),
    list: (prefix) => withStrong(async (s) => (await s.list({ prefix })).blobs.map((b) => b.key)),
  };
}

function localStore(): InventoryStore {
  const root = path.join(process.cwd(), ".data", STORE_NAME);
  const file = (key: string) => path.join(root, encodeURIComponent(key));
  const read = async (key: string) => {
    try {
      return await fs.readFile(file(key));
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw err;
    }
  };
  const write = async (key: string, data: Uint8Array | string) => {
    await fs.mkdir(root, { recursive: true });
    const tmp = `${file(key)}.${process.pid}.tmp`;
    await fs.writeFile(tmp, data);
    await fs.rename(tmp, file(key));
  };
  return {
    kind: "local-files",
    async getJSON<T>(key: string) {
      const b = await read(key);
      return b ? (JSON.parse(b.toString("utf8")) as T) : null;
    },
    setJSON: (key, value) => write(key, JSON.stringify(value)),
    async getBytes(key) {
      const b = await read(key);
      return b ? b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) : null;
    },
    setBytes: (key, data) => write(key, new Uint8Array(data)),
    delete: (key) => fs.rm(file(key), { force: true }),
    async list(prefix) {
      try {
        return (await fs.readdir(root))
          .filter((f) => !f.endsWith(".tmp"))
          .map((f) => decodeURIComponent(f))
          .filter((k) => k.startsWith(prefix));
      } catch {
        return [];
      }
    },
  };
}

let local: InventoryStore | null = null;

/**
 * A store handle. Netlify's is created per call on purpose: the Blobs context
 * (and its token) is supplied per invocation, so it must not be cached.
 */
export function inventoryStore(): InventoryStore {
  const onNetlify = process.env.NETLIFY === "true" || Boolean(process.env.NETLIFY_BLOBS_CONTEXT) || Boolean(process.env.NETLIFY_BLOBS_TOKEN);
  const blobs = netlifyStore();
  if (blobs) return blobs;
  if (onNetlify) {
    // On Netlify without a Blobs context: don't silently write to a disk that
    // disappears. Reads in this state are handled by the caller (content-only).
    throw new Error("Netlify Blobs is not available in this context.");
  }
  return (local ??= localStore());
}
