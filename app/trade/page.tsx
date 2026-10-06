import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import TradeForm from "@/components/TradeForm";
import Icon from "@/components/Icon";
import { site, telHref } from "@/content/site";

export const metadata: Metadata = {
  title: "Trade In Your Vehicle",
  description:
    "Tell Greenfield Auto Sales about your trade: year, make, model, miles and condition. We'll get back to you with a straight answer. No obligation.",
  alternates: { canonical: "/trade" },
  openGraph: { url: "/trade" },
};

const steps = [
  { title: "Tell us about it", body: "Year, make, model, miles, and how it runs. Takes a minute." },
  { title: "We get back to you", body: "We'll ask a few questions and talk through what it might be worth." },
  { title: "Bring it by", body: "If it makes sense for both of us, bring it to the lot so we can look it over." },
];

export default function TradePage() {
  return (
    <>
      <PageHeader eyebrow="Trade-ins wanted" title="What are you driving now?">
        <p>
          Tell us about your vehicle and we&apos;ll get back to you. No obligation, and no pressure if it doesn&apos;t work out.
        </p>
      </PageHeader>

      <div className="container-x grid gap-8 py-8 md:grid-cols-[1fr_340px] md:py-12 lg:gap-12">
        <TradeForm source="trade-page" />

        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="text-[22px] font-semibold">How it works</h2>
            <ol className="mt-4 space-y-4">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-display text-[16px] font-bold text-paper">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-sans text-[17px] font-bold">{s.title}</h3>
                    <p className="text-[15px] text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-card bg-panel-2 p-5 text-paper">
            <p className="text-[16px] text-paper/80">Rather talk it through?</p>
            <a href={telHref} className="mt-1 flex min-h-tap items-center gap-2 font-display text-[24px] font-semibold text-paper">
              <Icon name="phone" className="h-5 w-5 text-gold" />
              {site.phone.display}
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
