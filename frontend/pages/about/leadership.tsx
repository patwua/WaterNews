import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import SectionCard from "@/components/UX/SectionCard";
import { withCloudinaryAuto } from "@/lib/media";
import { colors } from "@/lib/brand-tokens";
import {
  buildBreadcrumbsJsonLd,
  jsonLdScript,
  seoMetaTags,
  absoluteCanonical,
} from "@/lib/seo";
type BrandVars = Record<string, string>;

const leaders = [
  {
    name: "Tatiana Chow",
    title: "Publisher & CEO / Editor in Chief",
    photo: withCloudinaryAuto("https://res.cloudinary.com/dpdhi4joq/image/upload/v1755882163/file_00000000eaf461f88c63fecb72905946_qmoqor.png"),
    bio: "Leads editorial direction and organizational strategy with clarity and care.",
  },
  {
    name: "Dwuane Adams",
    title: "CTO / Co-founder",
    photo: withCloudinaryAuto("https://res.cloudinary.com/dpdhi4joq/image/upload/v1755961624/file_0000000084bc61fb9c2f1f0e1c239ffa_shstq4.png"),
    bio: "Builder and serial entrepreneur focused on scalable newsroom technology.",
  },
  {
    name: "Sherman Rodriguez",
    title: "CFO",
    photo: withCloudinaryAuto("https://res.cloudinary.com/dpdhi4joq/image/upload/v1755882130/file_0000000001e861f8a8db16bf20e9d1c8_yju42z.png"),
    bio: "Finance lead ensuring growth with integrity across borders.",
  },
  {
    name: "(Vacancy)",
    title: "COO",
    photo: null,
    bio: "We're hiring—see › Careers",
    href: "/careers",
  },
];

export default function LeadershipPage() {
  const brandVars: BrandVars = {
    "--brand": colors.primary,
    "--brand-light": colors.primaryLight,
    "--brand-lighter": colors.primaryLighter,
    "--brand-soft-from": colors.primarySoftFrom,
    "--brand-soft-to": colors.primarySoftTo,
  };
  const origin =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL || "https://www.waternewsgy.com"
      : window.location.origin;
  const breadcrumbs = buildBreadcrumbsJsonLd(origin, [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Leadership Team", url: "/about/leadership" },
  ]);

  return (
    <>
      <Head>
        {seoMetaTags({
          title: "Leadership Team — WaterNews",
          description: "Meet the executives guiding WaterNews.",
        })}
        <link rel="canonical" href={absoluteCanonical("/about/leadership")} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbs) }}
        />
      </Head>
      <header
        className="relative grid min-h-[40vh] place-items-center overflow-hidden px-4 pt-16 text-center text-white"
        style={{ backgroundImage: `linear-gradient(to bottom, ${colors.brandBlue}, ${colors.brandBlueDark}, ${colors.brandBlueDarker})` }}
      >
        <h1 className="text-4xl font-extrabold">Leadership Team</h1>
      </header>
      <main style={brandVars} className="mx-auto -mt-12 mb-16 max-w-5xl px-4">
        <SectionCard>
          <p className="text-[15px] text-slate-700">
            Our executives steer WaterNews with accountability, innovation, and a commitment to regional voices.
          </p>
        </SectionCard>
        <SectionCard className="mt-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {leaders.map((p) => (
              <article key={p.name} className="text-center">
                {p.photo ? (
                  <Image
                    src={p.photo}
                    alt={p.name}
                    width={96}
                    height={96}
                    className="mx-auto rounded-full object-cover"
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                ) : (
                  <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--brand-soft-from)] text-sm text-slate-600">
                    No Photo
                  </div>
                )}
                <h3 className="mt-3 text-base font-semibold">{p.name}</h3>
                <p className="m-0 text-sm text-slate-600">{p.title}</p>
                <p className="mt-2 text-[15px] text-slate-700">
                  {p.href ? <Link href={p.href} className="text-[var(--brand)] underline">{p.bio}</Link> : p.bio}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact?subject=partnerships" className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white">Partnerships</Link>
            <Link href="/contact?subject=press" className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white">Press</Link>
            <Link href="/contact?subject=careers" className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white">Careers</Link>
          </div>
        </SectionCard>
      </main>
      <footer className="px-4 py-16 text-center text-slate-500">
        <div>&copy; {new Date().getFullYear()} WaterNews — All rights reserved.</div>
      </footer>
    </>
  );
}
