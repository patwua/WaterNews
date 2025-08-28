import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SectionCard from "@/components/UX/SectionCard";
import Page from "@/components/UX/Page";
import Toast from "@/components/Toast";
import { SUBJECTS } from "@/lib/cms-routing";
import contactCopy from "@/lib/copy/contact";
import {
  buildBreadcrumbsJsonLd,
  jsonLdScript,
  seoMetaTags,
  absoluteCanonical,
} from "@/lib/seo";

type ToastState = { type: "success" | "error"; message: string } | null;
interface Fields {
  name: string;
  email: string;
  [key: string]: string | FileList | undefined;
}

export default function ContactPage() {
  const router = useRouter();
  const [subject, setSubject] = useState<string>("general");
  const [fields, setFields] = useState<Fields>({ name: "", email: "" });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    const q = router.query.subject;
    if (typeof q === "string" && contactCopy[q.toLowerCase()]) {
      setSubject(q.toLowerCase());
    }
  }, [router.query.subject]);

  const { shared } = contactCopy;
  const current = contactCopy[subject] || contactCopy.general;

  function updateField(name: string, value: string | FileList | undefined) {
    setFields((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("subject", subject);
      Object.entries(fields).forEach(([k, v]) => {
        if (v instanceof FileList) {
          Array.from(v).forEach((file) => fd.append(k, file));
        } else if (typeof v === "string") {
          fd.append(k, v);
        }
      });
      const r = await fetch("/api/inbox/create", { method: "POST", body: fd });
      const json = await r.json();
      if (!json.ok) throw new Error(json.error || "Failed");
      setToast({ type: "success", message: current.success.detail || shared.toasts.success });
      setFields({ name: "", email: "" });
    } catch {
      setToast({ type: "error", message: shared.toasts.error });
    } finally {
      setSubmitting(false);
    }
  }

  const origin =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL || "https://www.waternewsgy.com"
      : window.location.origin;
  const breadcrumbs = buildBreadcrumbsJsonLd(origin, [
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact" },
  ]);

  return (
    <>
      <Head>
        {seoMetaTags({
          title: `${current.hero.title} — WaterNews`,
          description: current.hero.subtitle,
        })}
        <link rel="canonical" href={absoluteCanonical("/contact")} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbs) }}
        />
      </Head>
      <div style={{ minHeight: "70vh" }}>
        <Page title={current.hero.title} subtitle={current.hero.subtitle}>
          <SectionCard id="contact-form">
          {subject === "tip" && current.meta && current.fieldsets.some((f) => f.type === "file") && (
            <div className="mb-3 space-y-1 text-sm text-slate-600">
              {current.meta.anonymousReassure && <p>{current.meta.anonymousReassure}</p>}
              {current.meta.uploadNote && <p>{current.meta.uploadNote}</p>}
            </div>
          )}
          {current.guidance.length > 0 && (
            <ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {current.guidance.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          )}
          <form onSubmit={onSubmit} className="grid gap-3">
            <label className="block">
              <span className="text-sm font-medium">{shared.labels.subject}</span>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {SUBJECTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium">{shared.labels.name}</span>
              <input
                required
                value={fields.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">{shared.labels.email}</span>
              <input
                required
                type="email"
                value={fields.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            {current.fieldsets.map((f) => (
              <label key={f.name} className="block">
                <span className="text-sm font-medium">{f.label}</span>
                {f.type === "textarea" ? (
                  <textarea
                    rows={4}
                    required={f.required}
                    onChange={(e) => updateField(f.name, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                ) : f.type === "file" ? (
                  <input
                    type="file"
                    multiple={f.multiple}
                    onChange={(e) => updateField(f.name, e.target.files)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                ) : f.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    onChange={(e) => updateField(f.name, e.target.checked ? "on" : "")}
                    className="mt-1 h-4 w-4"
                  />
                ) : (
                  <input
                    type="text"
                    required={f.required}
                    onChange={(e) => updateField(f.name, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                )}
              </label>
            ))}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 rounded-xl bg-black px-4 py-2 font-semibold text-white disabled:opacity-60"
            >
              {submitting ? shared.actions.sending : shared.actions.send}
            </button>
          </form>
          <p className="mt-2 text-xs text-slate-500">
            {current.meta.privacyShort} <a href="/privacy" className="underline">{shared.tips.privacyLink}</a>
          </p>
          </SectionCard>
        </Page>
      </div>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  );
}
