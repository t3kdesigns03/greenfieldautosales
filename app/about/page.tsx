import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import Icon, { type IconName } from "@/components/Icon";
import BrandLockup from "@/components/brand/BrandLockup";
import { about } from "@/content/copy";
import { site, telHref } from "@/content/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Greenfield Auto Sales is a family-owned used car and truck lot in Greenfield, Iowa, selling since July 2008. Here's how buying works: come look, bring a mechanic, pay cash or use your own bank.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

const howIcons: IconName[] = ["eye", "wrench", "bank", "key"];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow={`Since ${site.since.month} ${site.since.year}`} title={about.title} />

      <section className="container-x grid gap-8 py-10 md:grid-cols-[1.4fr_1fr] md:gap-12 md:py-14">
        <div className="space-y-4 text-[18px] leading-relaxed text-fg/85">
          {about.intro.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <Reveal className="relative self-start overflow-hidden rounded-card bg-panel-2 p-6 text-paper">
          <div className="grain absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <BrandLockup className="-ml-1 max-w-full" badgeClass="h-14 w-auto sm:h-16" wordmarkClass="h-[44px] w-auto sm:h-[50px]" padClass="py-4" />
            <p className="mt-4 font-display text-[26px] font-semibold leading-tight text-paper">{site.name}</p>
            <p className="text-[15px] text-muted">Used cars, trucks and SUVs. Family-owned.</p>
            <dl className="mt-5 space-y-2 border-t border-white/10 pt-4 text-[15px]">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Selling since</dt>
                <dd className="font-semibold">
                  {site.since.month} {site.since.year}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Where</dt>
                <dd className="text-right font-semibold">
                  {site.address.street}, {site.address.city}
                </dd>
              </div>
            </dl>
            <a href={telHref} className="btn-gold mt-5 w-full">
              <Icon name="phone" className="h-5 w-5" />
              {site.phone.display}
            </a>
          </div>
        </Reveal>
      </section>

      <section className="bg-panel py-12 md:py-16" aria-labelledby="how-title">
        <div className="container-x">
          <p className="eyebrow">No surprises</p>
          <h2 id="how-title" className="mt-1 text-[30px] font-semibold sm:text-[38px]">
            {about.howTitle}
          </h2>
          <ol className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.how.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 80} className="card relative p-5">
                <span className="absolute right-4 top-3 font-display text-[44px] font-bold leading-none text-white/[0.06]">
                  {i + 1}
                </span>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-paper">
                  <Icon name={howIcons[i] ?? "check"} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-[21px] font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-[16px] text-muted">{step.body}</p>
              </Reveal>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/inventory" className="btn-go">
              See what&apos;s on the lot
              <Icon name="arrow" className="h-5 w-5" />
            </Link>
            <Link href="/financing" className="btn-ghost">
              About paying
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
