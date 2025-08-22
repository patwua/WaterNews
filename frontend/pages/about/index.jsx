import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us — WaterNews</title>
        <meta
          name="description"
          content="WaterNews gives Guyanese, Caribbean, and diaspora voices a modern platform for verified news, opinion, and lifestyle stories."
        />
      </Head>

      {/* HERO */}
      <header
        className="relative grid min-h-[58vh] place-items-center overflow-hidden px-4 text-center text-white"
        style={{ backgroundImage: "linear-gradient(to bottom, #0f6cad, #0b5d95, #0a4f7f)" }}
      >
        <div className="mb-4 flex items-center justify-center gap-4">
          <Image
            src="/logo-mini.svg"
            alt="WaterNews mini logo"
            width={64}
            height={64}
            className="rounded-full bg-white/95 p-1.5 shadow-xl"
            priority
          />
          <Image
            src="/logo-waternews.svg"
            alt="WaterNews full logo"
            width={420}
            height={96}
            className="h-auto w-[60vw] max-w-[340px]"
            priority
          />
        </div>
        <h1 className="m-0 text-3xl font-extrabold leading-tight md:text-5xl">
          About WaterNews
        </h1>
        <p className="mt-2 font-serif text-base opacity-95 md:text-lg">
          Dive Into Current Stories — giving Guyanese, Caribbean, and diaspora
          voices a modern platform.
        </p>

        {/* subtle wave mask */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-50"
          style={{
            WebkitMask:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='200' viewBox='0 0 1600 200'><path d='M0 80 C 200 160, 400 0, 600 80 S 1000 160, 1200 80 S 1400 0, 1600 80 V200 H0 Z' fill=\"black\"/></svg>\") center/cover no-repeat",
            mask:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='200' viewBox='0 0 1600 200'><path d='M0 80 C 200 160, 400 0, 600 80 S 1000 160, 1200 80 S 1400 0, 1600 80 V200 H0 Z' fill=\"black\"/></svg>\") center/cover no-repeat",
            background:
              "radial-gradient(45% 80% at 30% 20%, rgba(255,255,255,.15), transparent 60%), linear-gradient(0deg, rgba(255,255,255,.15), rgba(255,255,255,0) 60%)",
          }}
        />
      </header>

      {/* BODY */}
      <main className="mx-auto -mt-14 mb-16 max-w-5xl px-4">
        {/* Mission */}
        <section className="mb-12 grid gap-6 rounded-2xl bg-white p-6 shadow-lg md:grid-cols-[1.1fr,0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e6f2fb] px-3 py-1 text-xs font-semibold text-[#0f6cad]">
              Our Mission
            </span>
            <h2 className="mt-2 text-2xl font-bold">
              Empower Our Communities with Truth &amp; Story
            </h2>
            <p className="mt-1 text-[15px] text-slate-600">
              We deliver authentic, fact-checked news and engaging features that
              connect the Caribbean and its diaspora — from Georgetown to New
              York, Toronto and beyond.
            </p>
            <ul className="mt-3 space-y-1 text-[15px] text-slate-700">
              <li>✅ Reliable reporting across current events, politics, economy</li>
              <li>✅ Opinion &amp; Letters inviting debate and diverse perspectives</li>
              <li>✅ Lifestyle features celebrating culture, food, and everyday life</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <a className="rounded-xl bg-[#1583c2] px-4 py-2 font-semibold text-white" href="#join">
                Join Our Team
              </a>
              <a className="rounded-xl border border-[#cfe6f7] bg-[#eff7fd] px-4 py-2 font-semibold text-[#1583c2]" href="#suggest">
                Suggest a Story
              </a>
              <a className="rounded-xl border border-[#cfe6f7] bg-[#eff7fd] px-4 py-2 font-semibold text-[#1583c2]" href="#follow">
                Follow for Updates
              </a>
            </div>
          </div>
          <div className="grid min-h-[220px] place-items-center rounded-xl border border-slate-200 bg-gradient-to-br from-[#e8f4fd] to-[#f7fbff] p-4">
            <Image src="/placeholders/newsroom.svg" alt="" width={420} height={220} />
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-10">
          <div className="mb-2 flex items-center gap-3">
            <Image src="/logo-mini.svg" alt="" width={28} height={28} />
            <div>
              <h3 className="m-0 text-xl font-bold">Our Story</h3>
              <p className="m-0 text-sm text-slate-600">
                Founded to counter misinformation and center regional voices with
                a platform designed for modern readers.
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-[15px] text-slate-700">
              Stories travel like waves — they echo from the coastlines of Guyana
              across the Caribbean and through diaspora communities worldwide.
              WaterNews captures those waves with clarity and context, keeping our
              readers informed and connected.
            </p>
          </div>
        </section>

        {/* What We Publish */}
        <section className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <Image src="/logo-mini.svg" alt="" width={28} height={28} />
            <div>
              <h3 className="m-0 text-xl font-bold">What We Publish</h3>
              <p className="m-0 text-sm text-slate-600">
                News articles, opinion letters, and lifestyle features designed
                for engagement and credibility.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
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
            ].map((v) => (
              <div
                key={v.t}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <strong className="block">{v.t}</strong>
                <p className="mt-1 text-[15px] text-slate-700">{v.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <Image src="/logo-mini.svg" alt="" width={28} height={28} />
            <div>
              <h3 className="m-0 text-xl font-bold">Our Values</h3>
              <p className="m-0 text-sm text-slate-600">
                Truth first. Community voice. Cultural pride. Modern
                storytelling.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
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
            ].map((v) => (
              <div key={v.t} className="rounded-2xl bg-white p-6 shadow">
                <strong className="block">{v.t}</strong>
                <p className="mt-1 text-[15px] text-slate-700">{v.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership */}
        <section id="team" className="mb-10 rounded-2xl bg-white p-6 shadow">
          <div className="mb-3 flex items-center gap-3">
            <Image src="/logo-mini.svg" alt="" width={28} height={28} />
            <h3 className="m-0 text-xl font-bold">Leadership</h3>
          </div>

          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <h4 className="m-0 text-lg font-semibold">Tatiana Chow</h4>
              <p className="mt-1 text-sm text-slate-600">
                Editor-in-Chief • Current Events &amp; Lifestyle
              </p>
              <p className="mt-2 text-[15px] text-slate-700">
                Guyana-born and rooted in regional culture, Tatiana leads
                WaterNews with a commitment to sharp reporting and inclusive
                storytelling. Her focus spans current events and lifestyle,
                bridging local narratives with global relevance.
              </p>
            </div>
            <div className="grid min-h-[220px] place-items-center rounded-xl border border-slate-200 bg-gradient-to-br from-[#e8f4fd] to-[#f7fbff] p-4">
              <Image
                src="/team/tatiana-chow.png"
                alt="Tatiana Chow headshot"
                width={220}
                height={220}
                className="rounded-md object-cover"
              />
            </div>
          </div>
        </section>

        {/* Editorial Standards & Fact-Check Policy */}
        <section className="mb-10 rounded-2xl bg-white p-6 shadow">
          <div className="mb-3 flex items-center gap-3">
            <Image src="/logo-mini.svg" alt="" width={28} height={28} />
            <h3 className="m-0 text-xl font-bold">Editorial Standards &amp; Fact-Check Policy</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-[15px] text-slate-700">
                WaterNews follows a clear set of editorial practices to keep our reporting
                accurate, fair, and independent.
              </p>
              <ul className="list-disc space-y-2 pl-5 text-[15px] text-slate-700">
                <li><strong>Sourcing:</strong> Prefer on-the-record sources, public documents, and data. Anonymous sources are used sparingly with editor approval.</li>
                <li><strong>Verification:</strong> Names, titles, dates, locations, and figures are verified prior to publication. Hyperlinks and citations are included where practical.</li>
                <li><strong>Right of Reply:</strong> Subjects of critical coverage are given reasonable time to respond.</li>
                <li><strong>Conflicts:</strong> Reporters disclose potential conflicts; assignments can be reassigned if necessary.</li>
                <li><strong>Images:</strong> Photos and graphics should not materially alter reality; edits are limited to basic color/size/crop.</li>
                <li><strong>AI Use:</strong> We may use AI for drafting or summarization; editors review all output for accuracy and tone before publishing.</li>
              </ul>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <h4 className="m-0 text-lg font-semibold">Fact-Check Workflow</h4>
              <ol className="list-decimal space-y-2 pl-5 text-[15px] text-slate-700">
                <li>Reporter drafts story with citations and supporting materials.</li>
                <li>Section editor (or EIC) verifies key facts, quotes, names, dates.</li>
                <li>If sensitive or contested, we seek an additional independent source.</li>
                <li>Story is approved for publication with an audit note in the CMS.</li>
              </ol>
              <h4 className="mt-4 text-lg font-semibold">Corrections</h4>
              <p className="text-[15px] text-slate-700">
                If we publish an error, we will correct it promptly and add a note indicating
                what changed. Email <a className="text-[#1583c2]" href="mailto:corrections@waternewsgy.com">corrections@waternewsgy.com</a>.
              </p>
              <div className="mt-3">
                <Link href="/about/masthead" className="inline-flex items-center gap-2 rounded-lg border border-[#cfe6f7] bg-[#eff7fd] px-3 py-2 text-sm font-semibold text-[#1583c2]">
                  View Masthead &amp; Contacts
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section id="join" className="mb-6 rounded-2xl bg-white p-6 shadow">
          <h3 className="text-xl font-bold">Join Our Team</h3>
          <p className="mt-1 text-[15px] text-slate-700">
            Writers, photographers, and editors — pitch your voice and help shape
            regional storytelling.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a className="rounded-xl bg-[#1583c2] px-4 py-2 font-semibold text-white" href="/apply">
              Become an Author
            </a>
            <a className="rounded-xl border border-[#cfe6f7] bg-[#eff7fd] px-4 py-2 font-semibold text-[#1583c2]" href="#suggest">
              Suggest a Story
            </a>
          </div>
        </section>

        <section id="suggest" className="mb-6 rounded-2xl bg-white p-6 shadow">
          <h3 className="text-xl font-bold">Suggest a Story</h3>
          <p className="mt-1 text-[15px] text-slate-700">
            See something our readers should know? Send us a tip or a fully
            formed pitch.
          </p>
          <div className="mt-3">
            <a className="rounded-xl border border-[#cfe6f7] bg-[#eff7fd] px-4 py-2 font-semibold text-[#1583c2]" href="mailto:tips@waternewsgy.com">
              tips@waternewsgy.com
            </a>
          </div>
        </section>

        <section id="follow" className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-xl font-bold">Follow Us for Updates</h3>
          <p className="mt-1 text-[15px] text-slate-700">
            Get the latest headlines and features as they publish.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a className="rounded-xl border border-[#cfe6f7] bg-[#eff7fd] px-4 py-2 font-semibold text-[#1583c2]" href="#">
              @WaterNewsGY
            </a>
            <a className="rounded-xl border border-[#cfe6f7] bg-[#eff7fd] px-4 py-2 font-semibold text-[#1583c2]" href="#">
              Facebook
            </a>
            <a className="rounded-xl border border-[#cfe6f7] bg-[#eff7fd] px-4 py-2 font-semibold text-[#1583c2]" href="#">
              Instagram
            </a>
            <a className="rounded-xl border border-[#cfe6f7] bg-[#eff7fd] px-4 py-2 font-semibold text-[#1583c2]" href="#">
              X (Twitter)
            </a>
          </div>
        </section>
      </main>

      <footer className="px-4 pb-16 text-center text-slate-500">
        <Image
          src="/logo-mini.svg"
          alt="WaterNews mini logo"
          width={36}
          height={36}
          className="mx-auto rounded-full"
        />
        <div className="mt-2">&copy; {new Date().getFullYear()} WaterNews — All rights reserved.</div>
      </footer>
    </>
  );
}

