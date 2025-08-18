import Head from "next/head";
import { useState } from "react";

export default function CorrectionsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setDone(null);

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/corrections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to submit");
      setDone(json);
      e.currentTarget.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Corrections — WaterNews</title>
        <meta name="description" content="Request a correction on WaterNews content." />
      </Head>

      <header className="bg-gradient-to-b from-[#0f6cad] via-[#0b5d95] to-[#0a4f7f] px-4 py-14 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="m-0 text-3xl font-extrabold md:text-5xl">Request a Correction</h1>
          <p className="mt-2 max-w-2xl text-sm opacity-95 md:text-base">
            If we got something wrong, tell us exactly what to fix and where.
          </p>
        </div>
      </header>

      <main className="mx-auto my-10 max-w-3xl px-4">
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow">
          <div>
            <label className="block text-sm font-semibold">Article URL</label>
            <input name="url" type="url" required className="mt-1 w-full rounded-lg border p-2" placeholder="https://www.waternewsgy.com/article/..." />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold">Your Name</label>
              <input name="name" className="mt-1 w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold">Email</label>
              <input type="email" name="email" required className="mt-1 w-full rounded-lg border p-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold">What’s incorrect?</label>
            <textarea name="issue" rows={4} required className="mt-1 w-full rounded-lg border p-2" placeholder="Quote the exact line, figure, or claim." />
          </div>

          <div>
            <label className="block text-sm font-semibold">What’s the correct information?</label>
            <textarea name="correction" rows={3} required className="mt-1 w-full rounded-lg border p-2" placeholder="Provide the correction and supporting link(s), if any." />
          </div>

          <div className="flex items-center gap-2">
            <button disabled={submitting} className="rounded-xl bg-[#1583c2] px-5 py-2 font-semibold text-white disabled:opacity-60">
              {submitting ? "Sending..." : "Send Correction"}
            </button>
            {done && <span className="text-sm text-green-700">Received — reference <strong>{done.ref}</strong></span>}
            {error && <span className="text-sm text-red-600">Error: {error}</span>}
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Or email us directly at{" "}
          <a className="text-[#1583c2]" href="mailto:corrections@waternewsgy.com">
            corrections@waternewsgy.com
          </a>
          .
        </p>
      </main>
    </>
  );
}

