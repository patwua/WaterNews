import Head from "next/head";
import Image from "next/image";
import { withCloudinaryAuto } from "@/lib/media";
import { useState } from "react";
import { SUBJECTS } from "@/lib/cms-routing";
import Toast from "@/components/Toast";

export default function ApplyPage() {
  const [state, setState] = useState({ name: "", email: "", role: "", links: "", note: "", subject: "apply" });
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
      fd.append(
        "message",
        `${state.note}${state.role ? `\nRole: ${state.role}` : ""}${state.links ? `\nLinks: ${state.links}` : ""}`
      );
      const r = await fetch("/api/inbox/create", { method: "POST", body: fd });
      const json = await r.json();
      if (!json.ok) throw new Error(json.error || "Failed");
      setToast({ type: "success", message: "Thank you — submitted." });
      setState({ name: "", email: "", role: "", links: "", note: "", subject: "apply" });
    } catch (e) {
      setToast({ type: "error", message: e.message || "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Apply — WaterNews</title>
        <meta
          name="description"
          content="Pitch your voice — apply to contribute to WaterNews."
        />
      </Head>

      <header className="bg-gradient-to-b from-[#0f6cad] via-[#0b5d95] to-[#0a4f7f] px-4 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 flex items-center gap-3">
            <Image
              src={withCloudinaryAuto(
                "https://res.cloudinary.com/dpdhi4joq/image/upload/v1755961127/WN_Logo_Full_JPG_s1tkic_0238af.png"
              )}
              alt="WaterNews"
              width={220}
              height={60}
              priority
            />
            <h1 className="m-0 text-3xl font-extrabold leading-tight md:text-5xl">
              Apply to Contribute
            </h1>
          </div>
          <p className="max-w-3xl text-sm opacity-95 md:text-base">
            Writers, photographers, and editors — we’d love to see your work.
          </p>
        </div>
      </header>

      <main className="mx-auto my-10 max-w-5xl px-4">
        <section className="grid gap-6 rounded-2xl bg-white p-6 shadow md:grid-cols-[1.1fr,0.9fr]">
          <form onSubmit={onSubmit}>
            <h2 className="text-xl font-bold">Tell us about you</h2>
            <div className="mt-3 grid gap-3">
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
                <span className="text-sm font-medium">Name</span>
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
                <span className="text-sm font-medium">Role (Reporter, Opinion, Photo…)</span>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#1583c2] focus:ring-2 focus:ring-[#cfe6f7]"
                  value={state.role}
                  onChange={(e) => setState((s) => ({ ...s, role: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Portfolio / Links</span>
                <textarea
                  rows={3}
                  placeholder="URLs, clips, social"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#1583c2] focus:ring-2 focus:ring-[#cfe6f7]"
                  value={state.links}
                  onChange={(e) => setState((s) => ({ ...s, links: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Note</span>
                <textarea
                  rows={6}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#1583c2] focus:ring-2 focus:ring-[#cfe6f7]"
                  value={state.note}
                  onChange={(e) => setState((s) => ({ ...s, note: e.target.value }))}
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="mt-1 inline-flex items-center justify-center rounded-xl bg-[#1583c2] px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit application"}
              </button>
            </div>
          </form>

          <aside className="grid place-items-center rounded-xl border border-slate-200 bg-gradient-to-br from-[#e8f4fd] to-[#f7fbff] p-4 text-slate-600">
            <div className="text-center">
              <Image src="/placeholders/community-2.svg" alt="" width={320} height={180} />
              <p className="mt-3 text-sm">
                We welcome voices across Guyana, the Caribbean, and the diaspora.
              </p>
            </div>
          </aside>
        </section>
      </main>

      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  );
}

