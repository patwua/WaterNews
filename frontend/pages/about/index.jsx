import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import SectionCard from "@/components/UX/SectionCard";
import { withCloudinaryAuto } from "@/lib/media";
import { colors } from "@/lib/brand-tokens";
import { aboutPageJsonLd } from "@/lib/seo";

const leaders = [
  {
    name: "Tatiana Chow",
    title: "Publisher & CEO / Editor in Chief",
    photo: withCloudinaryAuto(
      "https://res.cloudinary.com/dpdhi4joq/image/upload/v1755882163/file_00000000eaf461f88c63fecb72905946_qmoqor.png"
    ),
    bio: "Guides WaterNews with a focus on rigorous, community-rooted journalism.",
  },
  {
    name: "Dwuane Adams",
    title: "CTO / Co-founder",
    photo: withCloudinaryAuto(
      "https://res.cloudinary.com/dpdhi4joq/image/upload/v1755961624/file_0000000084bc61fb9c2f1f0e1c239ffa_shstq4.png"
    ),
    bio: "Jamaican-born technologist building fast, safe systems for storytelling.",
  },
  {
    name: "Sherman Rodriguez",
    title: "CFO",
    photo: withCloudinaryAuto(
      "https://res.cloudinary.com/dpdhi4joq/image/upload/v1755882130/file_0000000001e861f8a8db16bf20e9d1c8_yju42z.png"
    ),
    bio: "Keeps budgets honest and partnerships viable for our mission.",
  },
];

const publishTypes = [
  {
    t: "News",
    d: "Reporting on national and regional events, policy, economy, and public interest issues that matter now.",
  },
  {
    t: "Opinions & Letters",
    d: "Well-argued perspectives that challenge, explain, and invite constructive debate from our community.",
  },
  {
    t: "Lifestyle",
    d: "Culture, food, fashion, and everyday life — the rhythms that shape who we are.",
  },
];

const values = [
  {
    t: "Truth First",
    d: "We verify sources, correct mistakes, and prioritize accuracy over virality.",
  },
  {
    t: "Community Voice",
    d: "We make space for letters and perspectives across the Caribbean and diaspora.",
  },
  {
    t: "Cultural Pride",
    d: "We highlight stories that honor our heritage, creativity, and diversity.",
  },
];

const contacts = [
  { label: "Send a Tip", token: "tip" },
  { label: "Request a Correction", token: "correction" },
  { label: "Suggest a Story", token: "suggest-story" },
  { label: "Apply to Contribute", token: "apply" },
  { label: "Partnerships & Advertising", token: "partnerships" },
  { label: "Press & Speaking", token: "press" },
  { label: "Careers", token: "careers" },
];

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

  return (
    <>
      <Head>
        <title>About Us — WaterNews</title>
        <meta
          name="description"
          content="WaterNews gives Guyanese, Caribbean, and diaspora voices a modern platform for verified news, opinion, and lifestyle stories."
        />
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
        <h1 className="text-4xl font-extrabold">About WaterNews</h1>
        <p className="mt-2 font-serif text-base opacity-95 md:text-lg">
          Dive Into Current Stories — giving Guyanese, Caribbean, and diaspora voices a modern platform.
        </p>
      </header>
      <main style={brandVars} className="mx-auto -mt-12 mb-16 max-w-5xl px-4">
        <SectionCard className="mb-8">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: "var(--brand-tag-bg)", color: "var(--brand-tag-text)" }}
          >
            Our Mission
          </span>
          <h2 className="mt-2 text-2xl font-bold">Empower Our Communities with Truth &amp; Story</h2>
          <p className="mt-1 text-[15px] text-slate-600">
            We deliver authentic, fact-checked news and engaging features that connect the Caribbean and its diaspora — from Georgetown to New York, Toronto and beyond.
          </p>
          <ul className="mt-3 space-y-1 text-[15px] text-slate-700">
            <li>✅ Reliable reporting across current events, politics, economy</li>
            <li>✅ Opinion &amp; Letters inviting debate and diverse perspectives</li>
            <li>✅ Lifestyle features celebrating culture, food, and everyday life</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/contact?subject=apply"
              className="rounded-xl bg-[var(--brand)] px-4 py-2 font-semibold text-white"
            >
              Apply to Contribute
            </Link>
            <Link
              href="/contact?subject=suggest-story"
              className="rounded-xl border border-[var(--brand-light)] bg-[var(--brand-lighter)] px-4 py-2 font-semibold text-[var(--brand)]"
            >
              Suggest a Story
            </Link>
          </div>
        </SectionCard>

        <div className="mb-8 grid gap-8 lg:grid-cols-2">
          <SectionCard>
            <h2 className="text-2xl font-bold">Who We Are</h2>
            <p className="mt-2 text-[15px] text-slate-700">
              Stories travel like waves — they echo from the coastlines of Guyana across the Caribbean and through diaspora communities worldwide. WaterNews captures those waves with clarity and context, keeping our readers informed and connected.
            </p>
            <p className="mt-2 text-[15px] text-slate-700">
              Built by journalists and technologists from the region and its diaspora, we're independent, community-rooted, and driven by a commitment to verified reporting and cultural pride.
            </p>
          </SectionCard>
          <SectionCard>
            <h2 className="text-2xl font-bold">Diaspora &amp; International</h2>
            <div className="mt-2 flow-root text-[15px] text-slate-700">
              <Image
                src="/brand/diaspora-card.png"
                alt="Collage of Guyanese diaspora"
                width={1536}
                height={1024}
                className="float-left mr-4 mb-2 w-40 h-auto rounded-lg"
              />
              <p>
                Guyana’s story extends beyond its borders. We examine remittances, migration, climate, culture, and policy as
                they flow between Georgetown and the diaspora. When global headlines hit home, we explain the why—not just the
                what. From Brooklyn and Toronto to London, see how the world touches Guyanese life.
              </p>
            </div>
          </SectionCard>
        </div>

        <SectionCard className="mb-8">
          <h2 className="text-2xl font-bold">What We Publish</h2>
          <p className="mt-2 text-[15px] text-slate-700">
            News articles, opinion letters, and lifestyle features designed for engagement and credibility.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {publishTypes.map((v) => (
              <div key={v.t} className="rounded-xl border border-[var(--brand-light)] bg-white p-5">
                <strong className="block">{v.t}</strong>
                <p className="mt-1 text-[15px] text-slate-700">{v.d}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="mb-8">
          <h2 className="text-2xl font-bold">Our Values</h2>
          <p className="mt-2 text-[15px] text-slate-700">
            Truth first. Community voice. Cultural pride. Modern storytelling.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.t} className="rounded-2xl bg-white p-6 shadow">
                <strong className="block">{v.t}</strong>
                <p className="mt-1 text-[15px] text-slate-700">{v.d}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="mb-8">
          <h2 className="text-2xl font-bold">Leadership</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {leaders.map((p) => (
              <article key={p.name} className="text-center">
                <Image
                  src={p.photo}
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
            <Link href="/about/leadership" className="inline-block rounded-xl bg-black px-4 py-2 font-semibold text-white">
              Full leadership
            </Link>
          </div>
        </SectionCard>

        <SectionCard className="mb-8">
          <h2 className="text-2xl font-bold">Masthead &amp; News Team</h2>
          <p className="mt-2 text-[15px] text-slate-700">
            Find editors, reporters, and contributors. Search and paging available.
          </p>
          <div className="mt-4">
            <Link href="/about/masthead" className="rounded-xl bg-black px-4 py-2 font-semibold text-white">
              Meet the News Team
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
            <h2 className="text-2xl font-bold">How to reach us</h2>
            <p className="mt-2 text-[15px] text-slate-700">
              Whether you're pitching a feature, flagging a typo, or exploring a partnership, we're just a click away. Choose a link below to reach the right team.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {contacts.map((c) => (
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
