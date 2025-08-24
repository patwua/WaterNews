import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { SUBJECTS } from "@/lib/cms-routing";
import Toast from "@/components/Toast";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import { colors } from "@/lib/brand-tokens";

export default function CorrectionsPage() {
  const [state, setState] = useState({ name: "", email: "", url: "", correction: "", subject: "correction" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const brandVars = {
    "--brand": colors.primary,
    "--brand-light": colors.primaryLight,
    "--brand-lighter": colors.primaryLighter,
    "--brand-soft-from": colors.primarySoftFrom,
    "--brand-soft-to": colors.primarySoftTo,
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("subject", state.subject);
      fd.append("name", state.name);
      fd.append("email", state.email);
      fd.append("message", `${state.correction}${state.url ? `\nURL: ${state.url}` : ""}`);
      const r = await fetch("/api/inbox/create", { method: "POST", body: fd });
      const json = await r.json();
      if (!json.ok) throw new Error(json.error || "Failed");
      setToast({ type: "success", message: "Thank you — submitted." });
      setState({ name: "", email: "", url: "", correction: "", subject: "correction" });
    } catch (e) {
      setToast({ type: "error", message: e.message || "Something went wrong." });
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
      <Page
        title="Request a Correction"
        subtitle="We correct the record. Share the link and what needs fixing."
      >
        <SectionCard>
          <div style={brandVars} className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
          <form onSubmit={onSubmit} className="grid gap-3">
            <h2 className="text-xl font-bold">Submit a correction</h2>
            <label className="block">
              <span className="text-sm font-medium">Your name</span>
              <input
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-light)]"
                value={state.name}
                onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                required
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-light)]"
                value={state.email}
                onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Subject</span>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-light)]"
                value={state.subject}
                onChange={(e) => setState((s) => ({ ...s, subject: e.target.value }))}
                name="subject"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium">Story URL</span>
              <input
                required
                type="url"
                placeholder="https://waternews…"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-light)]"
                value={state.url}
                onChange={(e) => setState((s) => ({ ...s, url: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">What should change?</span>
              <textarea
                required
                rows={6}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-light)]"
                value={state.correction}
                onChange={(e) => setState((s) => ({ ...s, correction: e.target.value }))}
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send request"}
              </button>
            </div>
          </form>

          <aside className="grid place-items-center rounded-xl border border-slate-200 bg-gradient-to-br from-[var(--brand-soft-from)] to-[var(--brand-soft-to)] p-4 text-slate-600">
            <div className="text-center">
              <Image src="/placeholders/newsroom.svg" alt="" width={320} height={180} />
              <p className="mt-3 text-sm">
                Prefer email? Write{" "}
                <a className="font-semibold text-[var(--brand)]" href="mailto:corrections@waternewsgy.com">
                  corrections@waternewsgy.com
                </a>
              </p>
            </div>
          </aside>
          </div>
        </SectionCard>
      </Page>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  );
}

