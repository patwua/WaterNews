import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import ProfilePhoto from "@/components/User/ProfilePhoto";
import { withCloudinaryAuto } from "@/lib/media";
import { colors } from "@/lib/brand-tokens";
import {
  absoluteCanonical,
  jsonLdScript,
  pageBreadcrumbsJsonLd,
} from "@/lib/seo";
import type { CSSProperties } from "react";

type BrandVars = CSSProperties & Record<string, string>;

const team = [
  {
    name: "Tatiana Chow",
    role: "Editor-in-Chief — Current Events & Lifestyle",
    bio: "Guyana-born editor focused on clear, inclusive storytelling across current events and lifestyle.",
    slug: "tatiana-chow",
    headshot: withCloudinaryAuto(
      "https://res.cloudinary.com/dpdhi4joq/image/upload/v1755882163/file_00000000eaf461f88c63fecb72905946_qmoqor.png"
    ),
  },
  {
    name: "Contributor (Open Role)",
    role: "News Reporter",
    bio: "Pitch breaking news and enterprise stories across Guyana and the Caribbean.",
    slug: "",
    headshot: null,
  },
  {
    name: "Contributor (Open Role)",
    role: "Opinion Editor",
    bio: "Commission and edit letters and opinion essays from diverse voices.",
    slug: "",
    headshot: null,
  },
];

export default function MastheadPage() {
  const [query, setQuery] = useState<string>("");
  const [show, setShow] = useState<number>(6);
  const brandVars: BrandVars = {
    "--brand": colors.primary,
    "--brand-light": colors.primaryLight,
    "--brand-lighter": colors.primaryLighter,
    "--brand-soft-from": colors.primarySoftFrom,
    "--brand-soft-to": colors.primarySoftTo,
    "--brand-blue": colors.brandBlue,
    "--brand-blue-dark": colors.brandBlueDark,
    "--brand-blue-darker": colors.brandBlueDarker,
  };
  const filtered = team.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  const origin =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL || "https://www.waternewsgy.com"
      : window.location.origin;
  const breadcrumbs = pageBreadcrumbsJsonLd(origin, { name: "About", url: "/about" }, { name: "Masthead & News Team", url: "/about/masthead" });
  return (
    <>
      <Head>
        <title>Masthead & News Team — WaterNews</title>
        <meta name="description" content="WaterNews masthead and newsroom staff." />
        <link rel="canonical" href={absoluteCanonical("/about/masthead")} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbs) }}
        />
      </Head>

      <header
        style={brandVars}
        className="bg-gradient-to-b from-[var(--brand-blue)] via-[var(--brand-blue-dark)] to-[var(--brand-blue-darker)] px-4 py-14 text-white"
      >
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-5 text-3xl font-extrabold leading-tight md:text-5xl">Masthead &amp; News Team</h1>
          <p className="max-w-3xl text-sm opacity-95 md:text-base">
            Meet the journalists and staff behind WaterNews.
          </p>
        </div>
      </header>

      <main style={brandVars} className="mx-auto my-10 max-w-5xl px-4">
        {/* News Team */}
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold">News Team</h2>

          <input
            placeholder="Search by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2"
          />

          <div className="grid gap-4 md:grid-cols-3">
            {filtered.slice(0, show).map((p) => (
              <article key={p.name} className="rounded-2xl bg-white p-5 shadow">
                <div
                  className={`grid min-h-[120px] place-items-center rounded-md border border-slate-200 ${
                    p.headshot ? "" : "bg-gradient-to-br from-[var(--brand-soft-from)] to-[var(--brand-soft-to)]"
                  }`}
                >
                  <ProfilePhoto
                    name={p.name}
                    url={p.headshot}
                    isVerified={false}
                    isOrganization={false}
                    size={160}
                  />
                </div>
                <h3 className="mt-3 text-base font-semibold">
                  {p.slug ? <Link href={`/author/${p.slug}`}>{p.name}</Link> : p.name}
                </h3>
                <p className="m-0 text-[13px] text-slate-600">{p.role}</p>
                <p className="mt-2 text-[14px] text-slate-700">{p.bio}</p>
              </article>
            ))}
          </div>

          {show < filtered.length && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShow(show + 6)}
                className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
              >
                Load more
              </button>
            </div>
          )}
          {filtered.length === 0 && <p className="mt-4 text-sm text-slate-600">No results.</p>}
        </section>

        {/* Business & Media */}
        <section className="mb-10 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Business &amp; Media</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/contact?subject=partnerships"
              className="rounded-lg border border-[var(--brand-light)] bg-[var(--brand-lighter)] px-3 py-2 text-sm font-semibold text-[var(--brand)]"
            >
              Partnerships &amp; Ads
            </Link>
            <Link
              href="/contact?subject=press"
              className="rounded-lg border border-[var(--brand-light)] bg-[var(--brand-lighter)] px-3 py-2 text-sm font-semibold text-[var(--brand)]"
            >
              Press &amp; Speaking
            </Link>
            <Link
              href="/contact?subject=careers"
              className="rounded-lg border border-[var(--brand-light)] bg-[var(--brand-lighter)] px-3 py-2 text-sm font-semibold text-[var(--brand)]"
            >
              Careers
            </Link>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Policies &amp; Standards</h2>
          <p className="mt-2 text-[15px] text-slate-700">
            Read our <Link className="text-[var(--brand)]" href="/about#editorial-standards">Editorial Standards &amp; Fact-Check Policy</Link> and how to request corrections.
          </p>
          <div className="mt-3">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--brand-light)] bg-[var(--brand-lighter)] px-3 py-2 text-sm font-semibold text-[var(--brand)]"
            >
              Back to About WaterNews
            </Link>
            <Link
              href="/contact?subject=general"
              className="ml-2 inline-flex items-center gap-2 rounded-lg border border-[var(--brand-light)] bg-[var(--brand-lighter)] px-3 py-2 text-sm font-semibold text-[var(--brand)]"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-4 py-16 text-center text-slate-500">
        <div>&copy; {new Date().getFullYear()} WaterNews — All rights reserved.</div>
      </footer>
    </>
  );
}

