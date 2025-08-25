import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import SectionCard from "@/components/UX/SectionCard";
import { withCloudinaryAuto } from "@/lib/media";
import { colors } from "@/lib/brand-tokens";
import { aboutPageJsonLd } from "@/lib/seo";
import aboutCopy from "@/lib/copy/about";

export default function AboutPage() {
  const brandVars = {
    "--brand": colors.primary,
    "--brand-light": colors.primaryLight,
    "--brand-lighter": colors.primaryLighter,
    "--brand-soft-from": colors.primarySoftFrom,
    "--brand-soft-to": colors.primarySoftTo,
    "--brand-tag-bg": colors.primaryTagBg,
    "--brand-tag-text": colors.primaryTagText,
  };
  const { hero, mission, whoWeAre, diaspora, publish, values: valuesCopy, leadershipHighlights, masthead, reachUs } =
    aboutCopy;

  return (
    <>
      <Head>
        <title>{hero.title} — WaterNews</title>
        <meta name="description" content={hero.subtitle} />
      </Head>
      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd()) }}
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
          <h2 className="mt-2 text-2xl font-bold">{mission.title}</h2>
          <p className="mt-1 text-[15px] text-slate-600">{mission.blurb}</p>
          <ul className="mt-3 space-y-1 text-[15px] text-slate-700">
            {mission.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {mission.ctas.map((c, i) => (
              <Link
                key={c.href}
                href={c.href}
                className={
                  i === 0
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
            {whoWeAre.body.map((p, i) => (
              <p key={i} className="mt-2 text-[15px] text-slate-700">
                {p}
              </p>
            ))}
          </SectionCard>
          <SectionCard>
            <h2 className="text-2xl font-bold">{diaspora.title}</h2>
            <p className="mt-2 text-[15px] text-slate-700">{diaspora.body}</p>
          </SectionCard>
        </div>

        <SectionCard className="mb-8">
          <h2 className="text-2xl font-bold">{publish.title}</h2>
          <p className="mt-2 text-[15px] text-slate-700">{publish.blurb}</p>
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
          <h2 className="text-2xl font-bold">{valuesCopy.title}</h2>
          <p className="mt-2 text-[15px] text-slate-700">{valuesCopy.blurb}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {valuesCopy.list.map((v) => (
              <div key={v.t} className="rounded-2xl bg-white p-6 shadow">
                <strong className="block">{v.t}</strong>
                <p className="mt-1 text-[15px] text-slate-700">{v.d}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="mb-8">
          <h2 className="text-2xl font-bold">{leadershipHighlights.title}</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {leadershipHighlights.people.map((p) => (
              <article key={p.name} className="text-center">
                <Image
                  src={withCloudinaryAuto(p.photo)}
                  alt=""
                  width={96}
                  height={96}
                  className="mx-auto rounded-full object-cover"
                />
                <h3 className="mt-3 text-base font-semibold">{p.name}</h3>
                <p className="m-0 text-sm text-slate-600">{p.title}</p>
                <p className="mt-2 text-[15px] text-slate-700">{p.bio}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href={leadershipHighlights.cta.href} className="inline-block rounded-xl bg-black px-4 py-2 font-semibold text-white">
              {leadershipHighlights.cta.label}
            </Link>
          </div>
        </SectionCard>

        <SectionCard className="mb-8">
          <h2 className="text-2xl font-bold">{masthead.title}</h2>
          <p className="mt-2 text-[15px] text-slate-700">{masthead.blurb}</p>
          <div className="mt-4">
            <Link href={masthead.cta.href} className="rounded-xl bg-black px-4 py-2 font-semibold text-white">
              {masthead.cta.label}
            </Link>
          </div>
        </SectionCard>

        <div className="grid gap-8 lg:grid-cols-2">
          <SectionCard id="standards">
            <h2 className="text-2xl font-bold">Editorial Standards &amp; Fact-Check Policy</h2>
            <p className="mt-2 text-[15px] text-slate-700">
              WaterNews follows a clear set of editorial practices to keep our reporting accurate, fair, and independent. We vet sources, provide context, and publish corrections when we fall short.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-[15px] text-slate-700">
              <li>
                <strong>Sourcing:</strong> Prefer on-the-record sources, public documents, and data. Anonymous sources are used sparingly with editor approval.
              </li>
              <li>
                <strong>Verification:</strong> Names, titles, dates, locations, and figures are verified prior to publication. Hyperlinks and citations are included where practical.
              </li>
              <li>
                <strong>Right of Reply:</strong> Subjects of critical coverage are given reasonable time to respond.
              </li>
              <li>
                <strong>Conflicts:</strong> Reporters disclose potential conflicts; assignments can be reassigned if necessary.
              </li>
              <li>
                <strong>Images:</strong> Photos and graphics should not materially alter reality; edits are limited to basic color/size/crop.
              </li>
              <li>
                <strong>AI Use:</strong> We may use AI for drafting or summarization; editors review all output for accuracy and tone before publishing.
              </li>
            </ul>
            <h3 className="mt-4 text-lg font-semibold">Fact-Check Workflow</h3>
            <ol className="list-decimal space-y-2 pl-5 text-[15px] text-slate-700">
              <li>Reporter drafts story with citations and supporting materials.</li>
              <li>Section editor (or EIC) verifies key facts, quotes, names, dates.</li>
              <li>If sensitive or contested, we seek an additional independent source.</li>
              <li>Story is approved for publication with an audit note in the CMS.</li>
            </ol>
            <h3 className="mt-4 text-lg font-semibold">Corrections</h3>
            <p className="text-[15px] text-slate-700">
              If we publish an error, we will correct it promptly and add a note indicating what changed. Use the link below to request a correction.
            </p>
            <div className="mt-3">
              <Link
                href="/contact?subject=correction"
                className="rounded-xl border border-[var(--brand-light)] bg-[var(--brand-lighter)] px-3 py-2 text-sm font-semibold text-[var(--brand)]"
              >
                Request a Correction
              </Link>
            </div>
          </SectionCard>
          <SectionCard>
            <h2 className="text-2xl font-bold">{reachUs.title}</h2>
            <p className="mt-2 text-[15px] text-slate-700">{reachUs.blurb}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {reachUs.contacts.map((c) => (
                <Link
                  key={c.token}
                  href={`/contact?subject=${c.token}`}
                  className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </main>
      <footer className="px-4 py-16 text-center text-slate-500">
        <div>&copy; {new Date().getFullYear()} WaterNews — All rights reserved.</div>
      </footer>
    </>
  );
}
