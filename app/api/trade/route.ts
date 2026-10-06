import { NextResponse } from "next/server";
import { validateLead } from "@/lib/trade";

/**
 * POST /api/trade — trade-in leads.
 *
 * v1 has no backend vendor: the lead is logged (Netlify → Logs → Functions,
 * search "[trade-lead]") and the form shows success.
 *
 * Optional: set TRADE_WEBHOOK_URL in the host's env vars to also forward each
 * lead as JSON (e.g. to a Zapier/Make webhook that texts or emails Luke).
 * See README "Getting trade leads to Luke".
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  // Honeypot: real people never fill the hidden "company" field.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const { lead, errors } = validateLead(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const record = {
    type: "trade-in",
    receivedAt: new Date().toISOString(),
    source: typeof body.source === "string" ? body.source.slice(0, 120) : "trade",
    ...lead,
  };

  console.log("[trade-lead]", JSON.stringify(record));

  const hook = process.env.TRADE_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(record),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      // The lead is already in the logs; don't fail the customer's submit.
      console.error("[trade-lead] webhook failed", err);
    }
  }

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Use POST." }, { status: 405 });
}
