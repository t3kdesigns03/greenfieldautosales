"use client";

import { useId, useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";
import Icon from "@/components/Icon";
import { site, telHref } from "@/content/site";
import { conditions, emptyLead, validateLead, type TradeErrors, type TradeLead } from "@/lib/trade";

type State = "idle" | "sending" | "done" | "failed";

/**
 * The trade-in lead form. POSTs JSON to /api/trade.
 * `source` is recorded with the lead so Luke can tell where it came from.
 */
export default function TradeForm({ source = "trade-page", tone = "card" }: { source?: string; tone?: "card" | "plain" }) {
  const uid = useId();
  const [lead, setLead] = useState<TradeLead>(emptyLead);
  const [errors, setErrors] = useState<TradeErrors>({});
  const [state, setState] = useState<State>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const id = (k: string) => `${uid}-${k}`;
  const set = (k: keyof TradeLead) => (e: { target: { value: string } }) => {
    setLead((l) => ({ ...l, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { errors: errs } = validateLead(lead);
    setErrors(errs);
    const firstBad = (Object.keys(emptyLead) as (keyof TradeLead)[]).find((k) => errs[k]);
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(firstBad))}`)?.focus();
      return;
    }
    setState("sending");
    try {
      const honeypot = (formRef.current?.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...lead, source, company: honeypot }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: TradeErrors };
      if (res.ok && data.ok) {
        setState("done");
        requestAnimationFrame(() => successRef.current?.focus());
      } else {
        if (data.errors) setErrors(data.errors);
        setState("failed");
      }
    } catch {
      setState("failed");
    }
  }

  const wrap = tone === "card" ? "card p-5 sm:p-7" : "";

  if (state === "done") {
    const first = lead.name.split(/\s+/)[0];
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className={`${wrap} animate-rise-in text-center outline-none`}
      >
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-go text-white">
          <Icon name="check" className="h-7 w-7" strokeWidth={2.4} />
        </span>
        <h2 className="mt-4 text-[28px] font-semibold">Got it{first ? `, ${first}` : ""}.</h2>
        <p className="mx-auto mt-2 max-w-sm text-[18px] text-fg/85">
          Luke will call you at <strong className="whitespace-nowrap">{lead.phone}</strong> about your{" "}
          {lead.year} {lead.make} {lead.model}.
        </p>
        <p className="mt-4 text-[15px] text-muted">
          Don&apos;t want to wait?{" "}
          <a href={telHref} className="font-semibold text-leaf underline underline-offset-4">
            Call {site.phone.display}
          </a>
        </p>
      </div>
    );
  }

  const field = (
    k: keyof TradeLead,
    label: string,
    props: InputHTMLAttributes<HTMLInputElement> = {},
    hint?: string,
  ) => (
    <div>
      <label htmlFor={id(k)} className="field-label">
        {label}
        {props.required && <span className="text-leaf"> *</span>}
      </label>
      <input
        id={id(k)}
        name={k}
        value={lead[k]}
        onChange={set(k)}
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={errors[k] ? id(`${k}-err`) : hint ? id(`${k}-hint`) : undefined}
        className={`field-input ${errors[k] ? "border-rust focus:border-rust focus:ring-rust/20" : ""}`}
        {...props}
      />
      {errors[k] ? (
        <p id={id(`${k}-err`)} className="mt-1 text-[14px] font-semibold text-rust-fg">
          {errors[k]}
        </p>
      ) : hint ? (
        <p id={id(`${k}-hint`)} className="mt-1 text-[14px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className={wrap} aria-describedby={id("req")}>
      <fieldset>
        <legend className="font-display text-[22px] font-semibold">Your vehicle</legend>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="col-span-1">{field("year", "Year", { inputMode: "numeric", placeholder: "2014", required: true, autoComplete: "off", maxLength: 4 })}</div>
          <div className="col-span-1 sm:col-span-1">{field("miles", "Miles", { inputMode: "numeric", placeholder: "150,000", autoComplete: "off" })}</div>
          <div className="col-span-2 sm:col-span-1">{field("make", "Make", { placeholder: "Ford", required: true, autoComplete: "off" })}</div>
          <div className="col-span-2 sm:col-span-1">{field("model", "Model", { placeholder: "F-150", required: true, autoComplete: "off" })}</div>
        </div>
        <div className="mt-4">
          <label htmlFor={id("condition")} className="field-label">
            Condition
          </label>
          <select
            id={id("condition")}
            name="condition"
            value={lead.condition}
            onChange={set("condition")}
            className="field-input appearance-none bg-[length:20px] bg-[right_14px_center] bg-no-repeat pr-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23EEF2EC' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="">Pick one (optional)</option>
            {conditions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="font-display text-[22px] font-semibold">How to reach you</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {field("name", "Your name", { required: true, autoComplete: "name" })}
          {field("phone", "Phone", { type: "tel", inputMode: "tel", required: true, autoComplete: "tel", placeholder: "(641) 555-0123" })}
        </div>
        <div className="mt-4">
          <label htmlFor={id("note")} className="field-label">
            Anything Luke should know?
          </label>
          <textarea
            id={id("note")}
            name="note"
            value={lead.note}
            onChange={set("note")}
            rows={3}
            maxLength={1000}
            placeholder="Rust, repairs, what you're looking to buy, best time to call…"
            className="field-input min-h-[96px] resize-y"
          />
        </div>
      </fieldset>

      {/* Honeypot — hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {state === "failed" && (
        <p role="alert" className="mt-5 rounded-xl border border-rust/50 bg-rust/15 p-3 text-[15px] text-rust-fg">
          That didn&apos;t go through. Check the fields above, or just call Luke at{" "}
          <a href={telHref} className="font-bold underline">
            {site.phone.display}
          </a>
          .
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p id={id("req")} className="text-[14px] text-muted">
          <span className="text-leaf">*</span> required. We only use your number to call you about this.
        </p>
        <button type="submit" className="btn-go w-full sm:w-auto" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send to Luke"}
          {state !== "sending" && <Icon name="arrow" className="h-5 w-5" />}
        </button>
      </div>
    </form>
  );
}
