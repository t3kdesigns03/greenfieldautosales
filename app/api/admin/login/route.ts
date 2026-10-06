import { NextResponse } from "next/server";
import { SESSION_COOKIE, adminConfigured, checkPassword, newSessionToken, sessionCookieOptions } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

/** POST { password } → sets the admin session cookie. */
export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin is turned off. Set ADMIN_PASSWORD (8+ characters) in the site's environment variables." },
      { status: 503 },
    );
  }
  let attempt = "";
  try {
    const body = (await req.json()) as { password?: unknown };
    attempt = typeof body.password === "string" ? body.password : "";
  } catch {
    // fall through with an empty attempt
  }
  if (!checkPassword(attempt)) {
    // Slow down guessing a little.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false, error: "That password didn't work." }, { status: 401 });
  }
  const { token, maxAge } = newSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(maxAge));
  return res;
}
