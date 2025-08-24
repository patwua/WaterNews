import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import SectionCard from "@/components/UX/SectionCard";
import BrandLogo from "@/components/BrandLogo";
import { withCloudinaryAuto } from "@/lib/media";
import { colors } from "@/lib/brand-tokens";
import { aboutPageJsonLd } from "@/lib/seo";

const leaders = [
  {
    name: "Tatiana Chow",
    title: "Publisher & CEO / Editor in Chief",
    photo: withCloudinaryAuto("https://res.cloudinary.com/dpdhi4joq/image/upload/v1755882163/file_00000000eaf461f88c63fecb72905946_qmoqor.png"),
    bio: "Guides WaterNews with a focus on rigorous, community-rooted journalism.",
  },
  {
    name: "Dwuane Adams",
    title: "CTO / Co-founder",
    photo: withCloudinaryAuto("https://res.cloudinary.com/dpdhi4joq/image/upload/v1755961624/file_0000000084bc61fb9c2f1f0e1c239ffa_shstq4.png"),
    bio: "Jamaican-born technologist building fast, safe systems for storytelling.",
  },
  {
    name: "Sherman Rodriguez",
    title: "CFO",
    photo: withCloudinaryAuto("https://res.cloudinary.com/dpdhi4joq/image/upload/v1755882130/file_0000000001e861f8a8db16bf20e9d1c8_yju42z.png"),
    bio: "Keeps budgets honest and partnerships viable for our mission.",
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
  };
  return (
    <>
      <Head>
        <title>About Us — WaterNews</title>
        <meta name="description" content="Who we are and how to reach WaterNews." />
      </Head>
      <Script id="about-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd()) }} />
      <header
        className="relative grid min-h-[50vh] place-items-center overflow-hidden px-4 text-center text-white"
        style={{ backgroundImage: `linear-gradient(to bottom, ${colors.brandBlue}, ${colors.brandBlueDark}, ${colors.brandBlueDarker})` }}
      >
        <BrandLogo variant="mark" width={56} height={56} />
        <h1 className="mt-4 text-4xl font-extrabold">About WaterNews</h1>
      </header>
      <main style={brandVars} className="mx-auto -mt-12 mb-16 max-w-5xl px-4">
        <SectionCard className="mb-8">
          <h2 className="text-2xl font-bold">Who we are</h2>
          <p className="mt-2 text-[15px] text-slate-700">
            WaterNews connects Guyana, the Caribbean, and its diaspora with verified stories and modern perspectives.
          </p>
        </SectionCard>

        <SectionCard className="mb-8">
          <h2 className="text-2xl font-bold">Leadership</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {leaders.map((p) => (
              <article key={p.name} className="text-center">
                <Image src={p.photo} alt="" width={96} height={96} className="mx-auto rounded-full object-cover" />
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

        <SectionCard id="standards" className="mb-8">
          <h2 className="text-2xl font-bold">Editorial Standards &amp; Fact-Check Policy</h2>
          <p className="mt-2 text-[15px] text-slate-700">
            We verify names, dates, locations and figures before publishing and correct errors with transparent notes. A future
            Standards &amp; Ethics Editor will independently review our practices.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-[15px] text-slate-700">
            <li>Sourcing favors on-the-record voices and public documents.</li>
            <li>Verification precedes publication; sensitive stories seek an extra source.</li>
            <li>Conflicts of interest are disclosed and may reassign coverage.</li>
            <li>Photos and graphics never distort the reality of an event.</li>
          </ul>
        </SectionCard>

        <SectionCard className="mb-8">
          <h2 className="text-2xl font-bold">Diaspora &amp; International</h2>
          <p className="mt-2 text-[15px] text-slate-700">
            From Brooklyn and Toronto to London, we highlight how regional and global stories ripple across Guyanese lives.
          </p>
        </SectionCard>

        <SectionCard>
          <h2 className="text-2xl font-bold">How to reach us</h2>
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
      </main>
      <footer className="px-4 pb-16 text-center text-slate-500">
        <BrandLogo variant="mark" width={36} height={36} className="mx-auto rounded-full" />
        <div className="mt-2">&copy; {new Date().getFullYear()} WaterNews — All rights reserved.</div>
      </footer>
    </>
  );
}
