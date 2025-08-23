import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import ProfilePhoto from "@/components/User/ProfilePhoto";
import { withCloudinaryAuto } from "@/lib/media";
import BrandLogo from "@/components/BrandLogo";

const contacts = [
  {
    label: "News Tips",
    email: "tips@waternewsgy.com",
    description:
      "Story ideas, leaks, firsthand accounts, documents. We respect source safety and can discuss confidentiality.",
  },
  {
    label: "Corrections",
    email: "corrections@waternewsgy.com",
    description:
      "Spotted an error? Tell us what we got wrong and include a link or quote and the correct information.",
  },
  {
    label: "General Inquiries",
    email: "hello@waternewsgy.com",
    description: "Partnerships, press, events, and everything else.",
  },
  {
    label: "Advertising",
    email: "ads@waternewsgy.com",
    description:
      "Sponsorships, display, branded content requests. We clearly label ads and sponsored posts.",
  },
];

const people = [
  {
    name: "Tatiana Chow",
    role: "Editor-in-Chief — Current Events & Lifestyle",
    bio: `Guyana-born editor focused on clear, inclusive storytelling across current events and lifestyle. Leads WaterNews’ editorial direction and standards.`,
    email: "editor@waternewsgy.com",
    headshot: withCloudinaryAuto(
      "https://res.cloudinary.com/dpdhi4joq/image/upload/v1755882163/file_00000000eaf461f88c63fecb72905946_qmoqor.png"
    ),
  },
  {
    name: "Contributor (Open Role)",
    role: "News Reporter",
    bio: "Pitch breaking news and enterprise stories across Guyana and the Caribbean.",
    email: "careers@waternewsgy.com",
    headshot: null,
  },
  {
    name: "Contributor (Open Role)",
    role: "Opinion Editor",
    bio: "Commission and edit letters and opinion essays from diverse voices.",
    email: "careers@waternewsgy.com",
    headshot: null,
  },
];

export default function MastheadPage() {
  return (
    <>
      <Head>
        <title>Masthead & Contacts — WaterNews</title>
        <meta
          name="description"
          content="WaterNews masthead and contact information for tips, corrections, partnerships, and advertising."
        />
      </Head>

      <Script
        id="newsroom-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            name: "WaterNews",
            url: "https://waternews.onrender.com",
            logo: withCloudinaryAuto(
              "https://res.cloudinary.com/dpdhi4joq/image/upload/v1755961127/WN_Logo_Full_JPG_s1tkic_0238af.png"
            ),
            slogan: "Dive Into Current Stories",
            foundingLocation: "Georgetown, Guyana",
            contactPoint: [
              { "@type": "ContactPoint", contactType: "News Tips", email: "tips@waternewsgy.com" },
              { "@type": "ContactPoint", contactType: "Corrections", email: "corrections@waternewsgy.com" },
              { "@type": "ContactPoint", contactType: "General", email: "hello@waternewsgy.com" },
            ],
            employee: [
              {
                "@type": "Person",
                name: "Tatiana Chow",
                jobTitle: "Editor-in-Chief",
                email: "editor@waternewsgy.com",
              },
            ],
          }),
        }}
      />

      <header className="bg-gradient-to-b from-[#0f6cad] via-[#0b5d95] to-[#0a4f7f] px-4 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 flex items-center gap-3">
            <BrandLogo variant="mini" onDark size={40} className="rounded-full bg-white/95 p-1" />
            <h1 className="m-0 text-3xl font-extrabold leading-tight md:text-5xl">
              Masthead &amp; Contacts
            </h1>
          </div>
          <p className="max-w-3xl text-sm md:text-base opacity-95">
            Reach the right desk fast. For sensitive tips, contact us and request a secure channel.
          </p>
        </div>
      </header>

      <main className="mx-auto my-10 max-w-5xl px-4">
        {/* Contacts */}
        <section className="mb-10 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Contact</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {contacts.map((c) => (
              <div key={c.label} className="rounded-xl border border-slate-200 p-4">
                <p className="m-0 text-sm font-semibold">{c.label}</p>
                <p className="m-0 text-[13px] text-slate-600">{c.description}</p>
                <a
                  className="mt-2 inline-block rounded-lg border border-[#cfe6f7] bg-[#eff7fd] px-3 py-1.5 text-sm font-semibold text-[#1583c2]"
                  href={`mailto:${c.email}`}
                >
                  {c.email}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Masthead */}
        <section className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <BrandLogo variant="mini" size={28} />
            <h2 className="m-0 text-xl font-bold">Editorial Team</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {people.map((p) => (
              <article key={p.name} className="rounded-2xl bg-white p-5 shadow">
                <div className="grid min-h-[120px] place-items-center rounded-md border border-slate-200 bg-gradient-to-br from-[#e8f4fd] to-[#f7fbff]">
                  <ProfilePhoto
                    name={p.name}
                    url={p.headshot}
                    isVerified={false}
                    isOrganization={false}
                    size={160}
                  />
                </div>
                <h3 className="mt-3 text-base font-semibold">{p.name}</h3>
                <p className="m-0 text-[13px] text-slate-600">{p.role}</p>
                <p className="mt-2 text-[14px] text-slate-700">{p.bio}</p>
                {p.email && (
                  <a
                    className="mt-2 inline-block rounded-lg border border-[#cfe6f7] bg-[#eff7fd] px-3 py-1.5 text-sm font-semibold text-[#1583c2]"
                    href={`mailto:${p.email}`}
                  >
                    {p.email}
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Policies &amp; Standards</h2>
          <p className="mt-2 text-[15px] text-slate-700">
            Read our <Link className="text-[#1583c2]" href="/about#editorial-standards">Editorial Standards &amp; Fact-Check Policy</Link> and how to request corrections.
          </p>
          <div className="mt-3">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-[#cfe6f7] bg-[#eff7fd] px-3 py-2 text-sm font-semibold text-[#1583c2]"
            >
              Back to About WaterNews
            </Link>
            <Link
              href="/contact"
              className="ml-2 inline-flex items-center gap-2 rounded-lg border border-[#cfe6f7] bg-[#eff7fd] px-3 py-2 text-sm font-semibold text-[#1583c2]"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-4 pb-16 text-center text-slate-500">
        <BrandLogo variant="mini" size={36} className="mx-auto rounded-full" />
        <div className="mt-2">&copy; {new Date().getFullYear()} WaterNews — All rights reserved.</div>
      </footer>
    </>
  );
}

