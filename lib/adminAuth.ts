/**
 * /admin sign-in. Server only.
 *
 * One shared password: ADMIN_PASSWORD (Netlify → Site configuration →
 * Environment variables). A correct password sets an httpOnly, SameSite=Strict
 * cookie holding an expiry time signed with HMAC-SHA256. Nothing is stored
 * server-side, so changing ADMIN_PASSWORD (or ADMIN_SESSION_SECRET, if set)
 * signs everyone out.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "gas_admin";
const SESSION_HOURS = 12;

const password = () => process.env.ADMIN_PASSWORD ?? "";
export const adminConfigured = () => password().length >= 8;

function secret() {
  return createHmac("sha256", "greenfield-admin-session")
    .update(process.env.ADMIN_SESSION_SECRET || password())
    .digest();
}

const b64url = (b: Buffer) => b.toString("base64url");

function sign(payload: string) {
  return b64url(createHmac("sha256", secret()).update(payload).digest());
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  // Compare equal-length digests so the timing doesn't leak the length either.
  const ha = createHmac("sha256", "cmp").update(ab).digest();
  const hb = createHmac("sha256", "cmp").update(bb).digest();
  return timingSafeEqual(ha, hb) && ab.length === bb.length;
}

export function checkPassword(attempt: string) {
  return adminConfigured() && safeEqual(attempt, password());
}

export function newSessionToken() {
  const exp = Date.now() + SESSION_HOURS * 3600_000;
  const payload = b64url(Buffer.from(JSON.stringify({ exp })));
  return { token: `${payload}.${sign(payload)}`, maxAge: SESSION_HOURS * 3600 };
}

export function verifySessionToken(token: string | undefined) {
  if (!token || !adminConfigured()) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

/** For server components (pages). */
export async function isAdmin() {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge,
});

/**
 * For API route handlers: signed-in session AND a same-origin request.
 * Returns a Response to send back when the check fails, or null when OK.
 */
export async function guardAdminRequest(req: Request): Promise<Response | null> {
  if (req.method !== "GET" && req.method !== "HEAD") {
    const origin = req.headers.get("origin");
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      return Response.json({ ok: false, error: "Cross-site request blocked." }, { status: 403 });
    }
  }
  if (!(await isAdmin())) {
    return Response.json({ ok: false, error: "Signed out. Sign in again at /admin." }, { status: 401 });
  }
  return null;
}
