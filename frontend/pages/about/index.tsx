import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import SectionCard from "@/components/UX/SectionCard";
import { colors } from "@/lib/brand-tokens";
import {
  aboutPageJsonLd,
  absoluteCanonical,
  jsonLdScript,
  pageBreadcrumbsJsonLd,
} from "@/lib/seo";
import aboutCopy from "@/lib/copy/about";
import type { CSSProperties } from "react";

type BrandVars = CSSProperties & Record<string, string>;

export default function AboutPage() {
  const brandVars: BrandVars = {
    "--brand": colors.primary,
    "--brand-light": colors.primaryLight,
    "--brand-lighter": colors.primaryLighter,
    "--brand-soft-from": colors.primarySoftFrom,
    "--brand-soft-to": colors.primarySoftTo,
    "--brand-tag-bg": colors.primaryTagBg,
    "--brand-tag-text": colors.primaryTagText,
  };

  const origin =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL || "https://www.waternewsgy.com"
      : window.location.origin;
  const breadcrumbs = pageBreadcrumbsJsonLd(origin, { name: "About", url: "/about" });

  const {
    hero,
    mission,
    whoWeAre,
    diaspora,
    publish,
    values,
    leadershipHighlights,
    masthead,
    standards,
    reachUs,
  } = aboutCopy;

  return (
    <>
      <Head>
        <title>About Us — WaterNews</title>
        <meta
          name="description"
          content="WaterNews gives Guyanese, Caribbean, and diaspora voices a modern platform for verified news, opinion, and lifestyle stories."
        />
        <link rel="canonical" href={absoluteCanonical("/about")} />
      </Head>
      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript([aboutPageJsonLd(), breadcrumbs]) }}
      />
      <header
        className="relative grid min-h-[58vh] place-items-center overflow-hidden px-4 pt-16 text-center text-white"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${colors.brandBlue}, ${colors.brandBlueDark}, ${colors.brandBlueDarker})`,
        }}
      >
        <h1 className="text-4xl font-extrabold">{hero.title}</h1>
        <p className="mt-2 font-serif text-base opacity-95 md:text-lg">{hero.subtitle}</p>
      </header>
      <main style={brandVars} className="mx-auto -mt-12 mb-16 max-w-5xl px-4">
        <SectionCard className="mb-8">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: "var(--brand-tag-bg)", color: "var(--brand-tag-text)" }}
          >
            {mission.tag}
          </span>
          <h2 className="mt-2 text-2xl font-bold">{mission.headline}</h2>
          <p className="mt-1 text-[15px] text-slate-600">{mission.body}</p>
          <ul className="mt-3 space-y-1 text-[15px] text-slate-700">
            {mission.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {mission.ctas.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className={
                  c.type === "primary"
                    ? "rounded-xl bg-[var(--brand)] px-4 py-2 font-semibold text-white"
                    : "rounded-xl border border-[var(--brand-light)] bg-[var(--brand-lighter)] px-4 py-2 font-semibold text-[var(--brand)]"
                }
              >
                {c.label}
              </Link>
            ))}
          </div>
        </SectionCard>

        <div className="mb-8 grid gap-8 lg:grid-cols-2">
          <SectionCard>
            <h2 className="text-2xl font-bold">{whoWeAre.title}</h2>
            {whoWeAre.paragraphs.map((p, i) => (
              <p key={i} className="mt-2 text-[15px] text-slate-700">
                {p}
              </p>
            ))}
          </SectionCard>
          <SectionCard>
            <h2 className="text-2xl font-bold">{diaspora.title}</h2>
            <div className="mt-2 flow-root text-[15px] text-slate-700">
              <Image
                src={diaspora.image.src}
                alt={diaspora.image.alt}
                width={diaspora.image.width}
                height={diaspora.image.height}
                className="float-left mr-4 mb-2 w-40 h-auto rounded-lg"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <p>{diaspora.body}</p>
            </div>
          </SectionCard>
        </div>

        <SectionCard className="mb-8">
          <h2 className="text-2xl font-bold">{publish.title}</h2>
          <p className="mt-2 text-[15px] text-slate-700">{publish.subtitle}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {publish.types.map((v) => (
              <div key={v.t} className="rounded-xl border border-[var(--brand-light)] bg-white p-5">
                <strong className="block">{v.t}</strong>
                <p className="mt-1 text-[15px] text-slate-700">{v.d}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="mb-8">
          <h2 className="text-2xl font-bold">{values.title}</h2>
          <p className="mt-2 text-[15px] text-slate-700">{values.subtitle}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {values.items.map((v) => (
              <div key={v.t} className="rounded-2xl bg-white p-6 shadow">
                <strong className="block">{v.t}</strong>
                <p className="mt-1 text-[15px] text-slate-700">{v.d}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="mb-8">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: "var(--brand-tag-bg)", color: "var(--brand-tag-text)" }}
          >
            {leadershipHighlights.tag}
          </span>
          <h2 className="mt-2 text-2xl font-bold">{leadershipHighlights.title}</h2>
          <p className="mt-1 text-[15px] text-slate-700">{leadershipHighlights.subtitle}</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {leadershipHighlights.people.map((p) => (
              <article key={p.name} className="text-center">
                <Image
                  src={p.photo}
                  alt=""
                  width={96}
                  height={96}
                  className="mx-auto rounded-full object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <h3 className="mt-3 text-base font-semibold">{p.name}</h3>
                <p className="m-0 text-sm text-slate-600">{p.title}</p>
                <p className="mt-2 text-[15px] text-slate-700">{p.bio}</p>
                <Link href="/about/leadership" className="mt-2 inline-block text-sm font-semibold text-black">
                  → {leadershipHighlights.cta}
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/about/leadership" className="inline-block rounded-xl bg-black px-4 py-2 font-semibold text-white">
              → {leadershipHighlights.cta}
            </Link>
          </div>
        </SectionCard>

        <SectionCard className="mb-8">
          <div>
            <Image
              src={masthead.image.src}
              alt={masthead.image.alt}
              width={masthead.image.width}
              height={masthead.image.height}
              className="float-right ml-4 mb-2 h-auto w-24 object-contain"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <h2 className="text-2xl font-bold">{masthead.title}</h2>
            {masthead.paragraphs.map((p, i) => (
              <p key={i} className="mt-2 text-[15px] text-slate-700">
                {p}
              </p>
            ))}
            <h3 className="mt-4 text-lg font-semibold">{masthead.findTitle}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-slate-700">
              {masthead.findItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-3 text-[15px] text-slate-700">
              {masthead.reachPrompt.before}
              <Link href="/contact" className="underline text-[var(--brand)]">
                {masthead.reachPrompt.linkLabel}
              </Link>
              {masthead.reachPrompt.after}
            </p>
            <div className="mt-4">
              <Link
                href="/about/masthead"
                className="rounded-xl bg-black px-4 py-2 font-semibold text-white"
              >
                → {masthead.cta}
              </Link>
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-8 lg:grid-cols-2">
          <div id="standards">
            <SectionCard>
            <h2 className="text-2xl font-bold">{standards.title}</h2>
            <p className="mt-2 text-[15px] text-slate-700">{standards.intro}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-[15px] text-slate-700">
              {standards.bullets.map((b) => (
                <li key={b.label}>
                  <strong>{b.label}:</strong> {b.text}
                </li>
              ))}
            </ul>
            <h3 className="mt-4 text-lg font-semibold">{standards.factCheck.title}</h3>
            <ol className="list-decimal space-y-2 pl-5 text-[15px] text-slate-700">
              {standards.factCheck.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            <h3 className="mt-4 text-lg font-semibold">{standards.corrections.title}</h3>
            <p className="text-[15px] text-slate-700">{standards.corrections.text}</p>
            <div className="mt-3">
              <Link
                href="/contact?subject=correction"
                className="rounded-xl border border-[var(--brand-light)] bg-[var(--brand-lighter)] px-3 py-2 text-sm font-semibold text-[var(--brand)]"
              >
                {standards.corrections.linkText}
              </Link>
            </div>
            </SectionCard>
          </div>
          <SectionCard>
            <h2 className="text-2xl font-bold">{reachUs.title}</h2>
            <p className="mt-2 text-[15px] text-slate-700">{reachUs.desc}</p>
            <ul className="mt-4 space-y-4">
              {reachUs.contacts.map((c) => (
                <li key={c.token} className="list-none">
                  <Link
                    href={`/contact?subject=${c.token}`}
                    className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
                  >
                    {c.label}
                  </Link>
                  <p className="mt-1 text-sm text-slate-600">{c.desc}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">{reachUs.note}</p>
          </SectionCard>
        </div>
      </main>
      <footer className="px-4 py-16 text-center text-slate-500">
        <div>&copy; {new Date().getFullYear()} WaterNews — All rights reserved.</div>
      </footer>
    </>
  );
}
