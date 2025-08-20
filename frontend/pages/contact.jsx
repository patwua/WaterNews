import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { SUBJECTS } from "@/lib/cms-routing";
import Toast from "@/components/Toast";

export default function ContactPage() {
  const [state, setState] = useState({ name: "", email: "", subject: "general", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

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

      {/* HERO */}
      <header className="relative grid min-h-[48vh] place-items-center overflow-hidden bg-gradient-to-b from-[#0f6cad] via-[#0b5d95] to-[#0a4f7f] px-4 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <Image
            src="/placeholders/contact-hero.svg"
            alt=""
            width={520}
            height={220}
            priority
          />
          <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">Contact WaterNews</h1>
          <p className="mt-2 max-w-2xl text-sm opacity-95 md:text-base">
            We read every message. For sensitive tips, email and request a secure channel.
          </p>
        </div>
      </header>

      <main className="mx-auto -mt-10 mb-16 max-w-5xl px-4">
        {/* Quick routes */}
        <section className="mb-8 grid gap-4 md:grid-cols-3">
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
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow transition hover:shadow-md"
            >
              <p className="m-0 text-sm font-semibold">{c.label}</p>
              <p className="m-0 text-[13px] text-slate-600">{c.desc}</p>
              <span className="mt-2 inline-block rounded-lg border border-[#cfe6f7] bg-[#eff7fd] px-3 py-1.5 text-xs font-semibold text-[#1583c2]">
                {c.email}
              </span>
            </a>
          ))}
        </section>

        {/* Contact form */}
        <section className="grid gap-6 rounded-2xl bg-white p-6 shadow md:grid-cols-[1.1fr,0.9fr]">
          <form onSubmit={onSubmit}>
            <h2 className="text-xl font-bold">Send us a message</h2>
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
                <span className="text-sm font-medium">Subject</span>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#1583c2] focus:ring-2 focus:ring-[#cfe6f7]"
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
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#1583c2] focus:ring-2 focus:ring-[#cfe6f7]"
                  value={state.message}
                  onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="mt-1 inline-flex items-center justify-center rounded-xl bg-[#1583c2] px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send message"}
              </button>
            </div>
          </form>

          <aside className="grid place-items-center rounded-xl border border-slate-200 bg-gradient-to-br from-[#e8f4fd] to-[#f7fbff] p-4 text-slate-600">
            <div className="text-center">
              <Image src="/placeholders/community-1.svg" alt="" width={320} height={180} />
              <p className="mt-3 text-sm">
                Prefer social? Follow {" "}
                <a className="font-semibold text-[#1583c2]" href="#">
                  @WaterNewsGY
                </a>{" "}
                for headlines & highlights.
              </p>
            </div>
          </aside>
        </section>
      </main>

      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  );
}

