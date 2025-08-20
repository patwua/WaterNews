export default function Apply() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <div className="sticky top-0 -mx-4 mb-6 h-28 bg-[image:var(--wn-grad-hero)] bg-[length:100%_100%] bg-no-repeat" />
      <section className="wn-card p-6">
        <h1 className="mb-2 text-2xl font-semibold">Apply to Contribute</h1>
        <p className="mb-6 text-sm text-neutral-600">Tell us about your beat and clips.</p>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            const el = e.currentTarget.querySelector(":invalid");
            if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus(); }
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="wn-field">
              <label htmlFor="a-name">Full name</label>
              <input id="a-name" name="name" required placeholder=" " className="wn-input w-full rounded-xl border p-3" />
            </div>
            <div className="wn-field">
              <label htmlFor="a-email">Email</label>
              <input id="a-email" name="email" type="email" required placeholder=" " className="wn-input w-full rounded-xl border p-3" />
            </div>
          </div>
          <div className="wn-field">
            <label htmlFor="a-beat">Primary beat</label>
            <input id="a-beat" name="beat" required placeholder=" " className="wn-input w-full rounded-xl border p-3" />
          </div>
          <div className="wn-field">
            <label htmlFor="a-links">Links to clips (comma‑separated)</label>
            <input id="a-links" name="links" placeholder="https://example.com/clip‑1, https://…" className="wn-input w-full rounded-xl border p-3" />
          </div>
          <div className="wn-field">
            <label htmlFor="a-notes">Notes</label>
            <textarea id="a-notes" name="notes" rows={6} placeholder=" " className="wn-input w-full rounded-xl border p-3" />
          </div>
          <div className="flex items-center justify-end">
            <button className="wn-btn rounded-xl border px-4 py-2 font-medium">Submit application</button>
          </div>
        </form>
      </section>
    </main>
  );
}

