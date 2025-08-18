import Head from "next/head";
import { useState } from "react";

export default function ApplyPage() {
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
    payload.samples = (payload.samples || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/apply", {
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
        <title>Apply — WaterNews</title>
        <meta name="description" content="Apply to write for WaterNews." />
      </Head>

      <header className="bg-gradient-to-b from-[#0f6cad] via-[#0b5d95] to-[#0a4f7f] px-4 py-14 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="m-0 text-3xl font-extrabold md:text-5xl">Become an Author</h1>
          <p className="mt-2 max-w-2xl text-sm opacity-95 md:text-base">
            Pitch your voice. We’re looking for clear, credible reporting and compelling lifestyle features.
          </p>
        </div>
      </header>

      <main className="mx-auto my-10 max-w-3xl px-4">
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold">Full Name</label>
              <input name="name" required className="mt-1 w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold">Email</label>
              <input type="email" name="email" required className="mt-1 w-full rounded-lg border p-2" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold">Role</label>
              <select name="role" className="mt-1 w-full rounded-lg border p-2">
                <option>News Reporter</option>
                <option>Opinion/Letters</option>
                <option>Lifestyle</option>
                <option>Photo/Video</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold">Beats (comma-separated)</label>
              <input name="beats" placeholder="politics, economy, culture" className="mt-1 w-full rounded-lg border p-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold">Links to recent samples (one per line)</label>
            <textarea name="samples" rows={4} className="mt-1 w-full rounded-lg border p-2" placeholder="https://example.com/story-1&#10;https://example.com/story-2" />
          </div>

          <div>
            <label className="block text-sm font-semibold">Short Bio</label>
            <textarea name="bio" rows={3} className="mt-1 w-full rounded-lg border p-2" placeholder="Tell us about your experience and interests." />
          </div>

          <div>
            <label className="block text-sm font-semibold">Portfolio URL (optional)</label>
            <input name="portfolio" placeholder="https://your-site.com" className="mt-1 w-full rounded-lg border p-2" />
          </div>

          <div className="flex items-center gap-2">
            <button disabled={submitting} className="rounded-xl bg-[#1583c2] px-5 py-2 font-semibold text-white disabled:opacity-60">
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
            {done && <span className="text-sm text-green-700">Received — reference <strong>{done.ref}</strong></span>}
            {error && <span className="text-sm text-red-600">Error: {error}</span>}
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Prefer email? Send your pitch to <a className="text-[#1583c2]" href="mailto:careers@waternewsgy.com">careers@waternewsgy.com</a>.
        </p>
      </main>
    </>
  );
}

