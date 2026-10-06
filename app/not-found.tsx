import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { site, telHref } from "@/content/site";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="container-x flex flex-col items-start py-16 md:py-24">
      <p className="eyebrow">Wrong turn</p>
      <h1 className="mt-2 text-[36px] font-semibold sm:text-[48px]">That page isn&apos;t here.</h1>
      <p className="mt-3 max-w-lg text-[18px] text-muted">
        If you were looking at a vehicle, it may have sold. Take a look at what&apos;s on the lot now, or give us a call.
      </p>
      <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link href="/inventory" className="btn-go">
          See inventory
          <Icon name="arrow" className="h-5 w-5" />
        </Link>
        <a href={telHref} className="btn-ghost">
          <Icon name="phone" className="h-5 w-5" />
          {site.phone.display}
        </a>
      </div>
    </div>
  );
}
