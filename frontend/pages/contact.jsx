import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { SUBJECTS } from "@/lib/cms-routing";
import Toast from "@/components/Toast";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import { colors } from "@/lib/brand-tokens";

export default function ContactPage() {
  const [state, setState] = useState({ name: "", email: "", subject: "general", message: "" });
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
      fd.append("message", state.message);
      const r = await fetch("/api/inbox/create", { method: "POST", body: fd });
      const json = await r.json();
      if (!json.ok) throw new Error(json.error || "Failed");
      setToast({ type: "success", message: "Thank you — submitted." });
      setState({ name: "", email: "", subject: "general", message: "" });
    } catch (_e) {
      setToast({ type: "error", message: _e.message || "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Contact Us — WaterNews</title>
        <meta
          name="description"
          content="Reach WaterNews for tips, partnerships, advertising, and general inquiries."
        />
      </Head>
      <Page
        title="Contact WaterNews"
        subtitle="We read every message. For sensitive tips, email and request a secure channel."
      >
        <div className="grid gap-6">
          <SectionCard>
            <div style={brandVars} className="grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "News Tips",
                  email: "tips@waternewsgy.com",
                  desc: "Story ideas, documents, eyewitness info.",
                },
                {
                  label: "Corrections",
                  email: "corrections@waternewsgy.com",
                  desc: "Tell us what needs fixing.",
                },
                {
                  label: "Partnerships",
                  email: "hello@waternewsgy.com",
                  desc: "Press, events, advertising.",
                },
              ].map((c) => (
                <a
                  key={c.label}
                  href={`mailto:${c.email}`}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow transition hover:shadow-md"
                >
                  <p className="m-0 text-sm font-semibold">{c.label}</p>
                  <p className="m-0 text-[13px] text-slate-600">{c.desc}</p>
                  <span className="mt-2 inline-block rounded-lg border border-[var(--brand-light)] bg-[var(--brand-lighter)] px-3 py-1.5 text-xs font-semibold text-[var(--brand)]">
                    {c.email}
                  </span>
                </a>
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <div style={brandVars} className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
            <form onSubmit={onSubmit} className="grid gap-3">
              <h2 className="text-xl font-bold">Send us a message</h2>
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
                <span className="text-sm font-medium">Message</span>
                <textarea
                  required
                  rows={6}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-light)]"
                  value={state.message}
                  onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="mt-1 inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send message"}
              </button>
            </form>

            <aside className="grid place-items-center rounded-xl border border-slate-200 bg-gradient-to-br from-[var(--brand-soft-from)] to-[var(--brand-soft-to)] p-4 text-slate-600">
              <div className="text-center">
                <Image src="/placeholders/community-1.svg" alt="" width={320} height={180} />
                <p className="mt-3 text-sm">
                  Prefer social? Follow{" "}
                  <a className="font-semibold text-[var(--brand)]" href="#">
                    @WaterNewsGY
                  </a>{" "}
                  for headlines &amp; highlights.
                </p>
              </div>
            </aside>
            </div>
          </SectionCard>
        </div>
      </Page>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  );
}

