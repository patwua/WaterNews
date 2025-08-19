import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

export default function CorrectionsPage() {
  const [state, setState] = useState({ name: "", email: "", url: "", correction: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const r = await fetch("/api/corrections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const json = await r.json();
      setDone(json);
    } catch {
      setDone({ ok: true, ref: "OFFLINE" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Request a Correction — WaterNews</title>
        <meta name="description" content="Report an error and we’ll review promptly." />
      </Head>

      <header className="bg-gradient-to-b from-[#0f6cad] via-[#0b5d95] to-[#0a4f7f] px-4 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 flex items-center gap-3">
            <Image
              src="/logo-waternews.svg"
              alt="WaterNews"
              width={220}
              height={60}
              priority
            />
            <h1 className="m-0 text-3xl font-extrabold leading-tight md:text-5xl">
              Request a Correction
            </h1>
          </div>
          <p className="max-w-3xl text-sm opacity-95 md:text-base">
            We correct the record. Share the link and what needs fixing.
          </p>
        </div>
      </header>

      <main className="mx-auto my-10 max-w-5xl px-4">
        <section className="grid gap-6 rounded-2xl bg-white p-6 shadow md:grid-cols-[1.1fr,0.9fr]">
          <form onSubmit={onSubmit}>
            <h2 className="text-xl font-bold">Submit a correction</h2>
            <div className="mt-3 grid gap-3">
              <label className="block">
                <span className="text-sm font-medium">Your name</span>
                <input
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#1583c2] focus:ring-2 focus:ring-[#cfe6f7]"
                  value={state.name}
                  onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Email</span>
                <input
                  required
                  type="email"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#1583c2] focus:ring-2 focus:ring-[#cfe6f7]"
                  value={state.email}
                  onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Story URL</span>
                <input
                  required
                  type="url"
                  placeholder="https://waternews…"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#1583c2] focus:ring-2 focus:ring-[#cfe6f7]"
                  value={state.url}
                  onChange={(e) => setState((s) => ({ ...s, url: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">What should change?</span>
                <textarea
                  required
                  rows={6}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#1583c2] focus:ring-2 focus:ring-[#cfe6f7]"
                  value={state.correction}
                  onChange={(e) => setState((s) => ({ ...s, correction: e.target.value }))}
                />
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-xl bg-[#1583c2] px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send request"}
                </button>
                {done && (
                  <p className="text-sm text-green-700">
                    Got it — reference <strong>{done.ref}</strong>. We’ll review shortly.
                  </p>
                )}
              </div>
            </div>
          </form>

          <aside className="grid place-items-center rounded-xl border border-slate-200 bg-gradient-to-br from-[#e8f4fd] to-[#f7fbff] p-4 text-slate-600">
            <div className="text-center">
              <Image src="/placeholders/newsroom.svg" alt="" width={320} height={180} />
              <p className="mt-3 text-sm">
                Prefer email? Write {" "}
                <a
                  className="font-semibold text-[#1583c2]"
                  href="mailto:corrections@waternewsgy.com"
                >
                  corrections@waternewsgy.com
                </a>
              </p>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}

