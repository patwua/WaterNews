import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import SectionCard from "@/components/UX/SectionCard";
import BrandLogo from "@/components/BrandLogo";
import ProfilePhoto from "@/components/User/ProfilePhoto";
import { withCloudinaryAuto } from "@/lib/media";
import { colors } from "@/lib/brand-tokens";

const team = [
  {
    name: "Tatiana Chow",
    role: "Editor-in-Chief — Current Events & Lifestyle",
    bio: "Guyana-born editor focused on clear, inclusive storytelling across current events and lifestyle.",
    slug: "tatiana-chow",
    headshot: withCloudinaryAuto("https://res.cloudinary.com/dpdhi4joq/image/upload/v1755882163/file_00000000eaf461f88c63fecb72905946_qmoqor.png"),
  },
  {
    name: "Contributor (Open Role)",
    role: "News Reporter",
    bio: "Pitch breaking news and enterprise stories across Guyana and the Caribbean.",
    slug: "", // no author page yet
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
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(6);
  const brandVars = {
    "--brand": colors.primary,
    "--brand-light": colors.primaryLight,
    "--brand-lighter": colors.primaryLighter,
    "--brand-soft-from": colors.primarySoftFrom,
    "--brand-soft-to": colors.primarySoftTo,
  };
  const filtered = team.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <Head>
        <title>Masthead & News Team — WaterNews</title>
        <meta name="description" content="WaterNews masthead and newsroom staff." />
      </Head>
      <header
        className="relative grid min-h-[40vh] place-items-center overflow-hidden px-4 text-center text-white"
        style={{ backgroundImage: `linear-gradient(to bottom, ${colors.brandBlue}, ${colors.brandBlueDark}, ${colors.brandBlueDarker})` }}
      >
        <BrandLogo variant="mark" width={56} height={56} />
        <h1 className="mt-4 text-4xl font-extrabold">Masthead &amp; News Team</h1>
      </header>
      <main style={brandVars} className="mx-auto -mt-12 mb-16 max-w-5xl px-4">
        <SectionCard className="mb-8">
          <h2 className="text-xl font-bold">News Team</h2>
          <input
            placeholder="Search by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {filtered.slice(0, show).map((p) => (
              <article key={p.name} className="rounded-xl bg-white p-4 shadow">
                <div className="flex justify-center">
                  <ProfilePhoto name={p.name} url={p.headshot} isVerified={false} isOrganization={false} size={80} />
                </div>
                <h3 className="mt-3 text-base font-semibold">
                  {p.slug ? <Link href={`/author/${p.slug}`}>{p.name}</Link> : p.name}
                </h3>
                <p className="m-0 text-sm text-slate-600">{p.role}</p>
                <p className="mt-2 text-[14px] text-slate-700">{p.bio}</p>
              </article>
            ))}
          </div>
          {show < filtered.length && (
            <div className="mt-4 text-center">
              <button onClick={() => setShow(show + 6)} className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white">
                Load more
              </button>
            </div>
          )}
          {filtered.length === 0 && <p className="mt-4 text-sm text-slate-600">No results.</p>}
        </SectionCard>
        <SectionCard>
          <h2 className="text-xl font-bold">Business &amp; Media</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/contact?subject=partnerships" className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white">Partnerships &amp; Ads</Link>
            <Link href="/contact?subject=press" className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white">Press &amp; Speaking</Link>
            <Link href="/contact?subject=careers" className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white">Careers</Link>
          </div>
        </SectionCard>
      </main>
      <footer className="px-4 pb-16 text-center text-slate-500">
        <BrandLogo variant="mark" width={36} height={36} className="mx-auto rounded-full" />
        <div className="mt-2">&copy; {new Date().getFullYear()} WaterNews — All rights reserved.</div>
      </footer>
    </>
  );
}
