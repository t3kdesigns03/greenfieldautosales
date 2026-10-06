import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Icon, { type IconName } from "@/components/Icon";
import { financing } from "@/content/copy";
import { site, telHref } from "@/content/site";

export const metadata: Metadata = {
  title: "Financing & Paying for a Car",
  description:
    "How paying works at Greenfield Auto Sales: cash, or a loan from your own bank or credit union. No rates, no credit applications, no promises we can't keep.",
  alternates: { canonical: "/financing" },
  openGraph: { url: "/financing" },
};

const icons: IconName[] = ["cash", "bank"];

export default function FinancingPage() {
  return (
    <>
      <PageHeader eyebrow="Financing" title={financing.title}>
        <p>{financing.intro}</p>
      </PageHeader>

      <div className="container-x max-w-4xl py-10 md:py-14">
        <ul className="grid gap-4 sm:grid-cols-2">
          {financing.options.map((o, i) => (
            <li key={o.title} className="card p-5 sm:p-6">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-leaf">
                <Icon name={icons[i] ?? "check"} className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-[24px] font-semibold">{o.title}</h2>
              <p className="mt-2 text-[17px] text-muted">{o.body}</p>
            </li>
          ))}
        </ul>

        <section className="mt-10 rounded-card border border-white/10 bg-panel p-5 sm:p-6" aria-labelledby="not-title">
          <h2 id="not-title" className="text-[24px] font-semibold">
            {financing.notTitle}
          </h2>
          <ul className="mt-3 space-y-2.5 text-[17px]">
            {financing.nots.map((n) => (
              <li key={n} className="flex gap-3">
                <Icon name="close" className="mt-1 h-5 w-5 shrink-0 text-fg/50" />
                {n}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-8 text-[18px]">{financing.closer}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a href={telHref} className="btn-go">
            <Icon name="phone" className="h-5 w-5" />
            Call {site.phone.display}
          </a>
          <Link href="/inventory" className="btn-ghost">
            See inventory
          </Link>
        </div>
      </div>
    </>
  );
}
