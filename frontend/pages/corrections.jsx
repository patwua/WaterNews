export default function Corrections() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <div className="sticky top-0 -mx-4 mb-6 h-28 bg-[image:var(--wn-grad-hero)] bg-[length:100%_100%] bg-no-repeat" />
      <section className="wn-card p-6">
        <h1 className="mb-2 text-2xl font-semibold">Request a Correction</h1>
        <p className="mb-6 text-sm text-neutral-600">Provide the URL and what needs to be fixed.</p>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            const el = e.currentTarget.querySelector(":invalid");
            if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus(); }
          }}
        >
          <div className="wn-field">
            <label htmlFor="r-url">Article URL</label>
            <input id="r-url" name="url" type="url" required placeholder=" " className="wn-input w-full rounded-xl border p-3" />
          </div>
          <div className="wn-field">
            <label htmlFor="r-name">Your name (optional)</label>
            <input id="r-name" name="name" placeholder=" " className="wn-input w-full rounded-xl border p-3" />
          </div>
          <div className="wn-field">
            <label htmlFor="r-details">What’s incorrect?</label>
            <textarea id="r-details" name="details" rows={6} required placeholder=" " className="wn-input w-full rounded-xl border p-3" />
          </div>
          <div className="flex items-center justify-end">
            <button className="wn-btn rounded-xl border px-4 py-2 font-medium">Send correction</button>
          </div>
        </form>
      </section>
    </main>
  );
}

