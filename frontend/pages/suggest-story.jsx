import { useState } from "react";
import Head from "next/head";
import { SUBJECTS } from "@/lib/cms-routing";
import Toast from "@/components/Toast";

export default function SuggestStory() {
  const [anonymous, setAnonymous] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({ name: "", email: "", story: "" });

  function validate(form) {
    const next = { name: "", email: "", story: "" };
    if (!form.name?.trim()) next.name = "Name is required (for newsroom verification only).";
    if (!form.email?.trim()) next.email = "Email is required.";
    if (!form.story?.trim()) next.story = "Please describe the story.";
    setErrors(next);
    return !next.name && !next.email && !next.story;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    const ok = validate(Object.fromEntries(fd.entries()));
    if (!ok) {
      // If name missing, also surface the WHY modal to educate.
      if (!fd.get("name")) setShowWhy(true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/inbox/create", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to submit.");
      setToast({ type: "success", message: "Thank you — submitted." });
      formEl.reset();
      setAnonymous(false);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Suggest a Story • WaterNews</title>
      </Head>

      {/* Hero (align with About/Contact aesthetic) */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Suggest a Story</h1>
        <p className="mt-2 text-lg text-blue-100">
          Share your tip with confidence — your privacy is our priority.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 grid gap-8 lg:grid-cols-3">
        {/* Left Info Cards (trust/privacy cues) */}
        <div className="space-y-6 hidden lg:block">
          <InfoCard
            title="Your Privacy"
            text="Anonymous tips are welcome. Your name is collected privately for newsroom verification and will not be published if you select Anonymous."
          />
          <InfoCard
            title="Secure Handling"
            text="Only editors can view private details. We retain records solely for verification, legal review, and safety."
          />
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:col-span-2">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <select
                name="subject"
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Name + Anonymous toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                type="text"
                placeholder="Your full name (kept private if Anonymous)"
                className={`mt-1 w-full rounded-md border ${errors.name ? "border-red-400" : "border-gray-300"} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                required
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              <div className="mt-2 text-xs text-gray-600">
                We require a real name for newsroom verification.
                If Anonymous is on, your name will <span className="font-semibold">not be published</span>.
                <button type="button" className="text-blue-600 ml-2 underline" onClick={() => setShowWhy(true)}>
                  Why?
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Submit <span className="font-medium">Anonymous</span> (we won’t publish your name)
                </span>
              </div>
            </div>

            {/* Email + Phone inline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`mt-1 w-full rounded-md border ${errors.email ? "border-red-400" : "border-gray-300"} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+592 600 0000"
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Story details */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Story Details</label>
              <textarea
                name="story"
                rows={6}
                placeholder="Describe the story you want to suggest..."
                className={`mt-1 w-full rounded-md border ${errors.story ? "border-red-400" : "border-gray-300"} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                required
              />
              {errors.story && <p className="mt-1 text-sm text-red-600">{errors.story}</p>}
            </div>

            {/* Media upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Media (optional)</label>
              <input
                name="media"
                type="file"
                className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*,video/*,.pdf,.doc,.docx,.zip"
                multiple
              />
              <p className="mt-1 text-xs text-gray-500">
                Accepted: images, videos, PDF/Docs, ZIP. Large files may take longer to upload.
              </p>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-70"
              >
                {submitting ? "Submitting…" : "Submit Story"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Cards */}
        <div className="space-y-6 hidden lg:block">
          <InfoCard
            title="Responsible Journalism"
            text="We verify submissions to reduce misinformation and protect the public interest."
          />
        </div>
      </main>

      {toast && <Toast {...toast} onDone={() => setToast(null)} />}

      {/* WHY modal */}
      {showWhy && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold">Why we need your name</h3>
            <p className="mt-2 text-sm text-gray-600">
              Responsible newsrooms verify tips to protect the public interest and reduce misinformation.
              A real name helps editors authenticate submissions and follow up for clarity.
              If you choose Anonymous, we will not publish or share your name as the source.
            </p>
            <ul className="mt-3 list-disc pl-5 text-sm text-gray-600">
              <li>Industry best practice in responsible journalism</li>
              <li>Supports fact‑checking and legal review</li>
              <li>Protects you while preserving story integrity</li>
            </ul>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 rounded-md bg-blue-600 text-white" onClick={() => setShowWhy(false)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, text }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-blue-700">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{text}</p>
    </div>
  );
}
