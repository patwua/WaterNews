import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SectionCard from "@/components/UX/SectionCard";
import Page from "@/components/UX/Page";
import Toast from "@/components/Toast";
import { SUBJECTS } from "@/lib/cms-routing";

const FIELDSETS = {
  tip: [
    { name: "message", label: "Message", type: "textarea", required: true },
    { name: "location", label: "Location", type: "text" },
    { name: "datetime", label: "Date & Time", type: "text" },
    { name: "caption", label: "What we're seeing", type: "text" },
    { name: "media", label: "Media", type: "file", multiple: true },
    { name: "anonymous", label: "Send anonymously", type: "checkbox" },
  ],
  correction: [
    { name: "article", label: "Article URL", type: "text", required: true },
    { name: "quote", label: "Line or quote in question", type: "text" },
    { name: "message", label: "Your correction", type: "textarea", required: true },
    { name: "media", label: "Attachments", type: "file", multiple: true },
  ],
  "suggest-story": [
    { name: "summary", label: "Summary", type: "textarea", required: true },
    { name: "people", label: "People involved", type: "text" },
    { name: "links", label: "Links / references", type: "text" },
    { name: "anonymous", label: "Send anonymously", type: "checkbox" },
  ],
  apply: [
    { name: "bio", label: "Bio", type: "textarea" },
    { name: "beats", label: "Beats / interests", type: "text" },
    { name: "links", label: "Clips / links", type: "text" },
    { name: "cv", label: "CV upload", type: "file" },
  ],
  partnerships: [
    { name: "org", label: "Organization", type: "text" },
    { name: "website", label: "Website", type: "text" },
    { name: "goals", label: "Campaign goals", type: "textarea" },
    { name: "timeline", label: "Timeline", type: "text" },
    { name: "budget", label: "Budget range", type: "text" },
  ],
  press: [
    { name: "outlet", label: "Outlet", type: "text" },
    { name: "topic", label: "Topic", type: "text" },
    { name: "deadline", label: "Deadline", type: "text" },
    { name: "format", label: "Format", type: "text" },
    { name: "links", label: "Links", type: "text" },
  ],
  careers: [
    { name: "role", label: "Role of interest", type: "text" },
    { name: "experience", label: "Experience", type: "textarea" },
    { name: "links", label: "Links", type: "text" },
    { name: "cv", label: "CV upload", type: "file" },
  ],
  general: [
    { name: "message", label: "Message", type: "textarea", required: true },
  ],
};

export default function ContactPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("general");
  const [fields, setFields] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const q = router.query.subject;
    if (typeof q === "string" && FIELDSETS[q.toLowerCase()]) {
      setSubject(q.toLowerCase());
    }
  }, [router.query.subject]);

  function updateField(name, value) {
    setFields((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("subject", subject);
      Object.entries(fields).forEach(([k, v]) => {
        if (v instanceof FileList) {
          Array.from(v).forEach((file) => fd.append(k, file));
        } else {
          fd.append(k, v);
        }
      });
      const r = await fetch("/api/inbox/create", { method: "POST", body: fd });
      const json = await r.json();
      if (!json.ok) throw new Error(json.error || "Failed");
      setToast({ type: "success", message: "Thank you — submitted." });
      setFields({ name: "", email: "" });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  }

  const current = FIELDSETS[subject] || FIELDSETS.general;

  return (
    <>
      <Head>
        <title>Contact Us — WaterNews</title>
        <meta name="description" content="Reach WaterNews" />
      </Head>
      <Page title="Contact WaterNews" subtitle="We read every message." style={{ minHeight: "70vh" }}>
        <SectionCard>
          <form onSubmit={onSubmit} className="grid gap-3">
            <label className="block">
              <span className="text-sm font-medium">Subject</span>
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
              <span className="text-sm font-medium">Your name</span>
              <input
                required
                value={fields.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                required
                type="email"
                value={fields.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            {current.map((f) => (
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
              {submitting ? "Sending…" : "Send"}
            </button>
          </form>
        </SectionCard>
      </Page>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  );
}
