export default function Contact() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      {/* Hero band with soft brand gradient */}
      <div className="sticky top-0 -mx-4 mb-6 h-28 bg-[image:var(--wn-grad-hero)] bg-[length:100%_100%] bg-no-repeat"></div>
      <section className="wn-card-lg p-6">
        <h1 className="mb-2 text-2xl font-semibold">Contact Us</h1>
        <p className="mb-6 text-sm text-neutral-600">We’ll get back within 1–2 business days.</p>

        {/* a11y live region for submit state */}
        <div aria-live="polite" aria-atomic="true" className="sr-only" id="contact-status" />

        <form
          className="space-y-4"
          onSubmit={(e) => {
            const form = e.currentTarget;
            const firstInvalid = form.querySelector(":invalid");
            if (firstInvalid) {
              e.preventDefault();
              firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
              firstInvalid.focus();
            }
          }}
        >
          <div className="wn-field">
            <label htmlFor="c-name">Your name</label>
            <input id="c-name" name="name" required placeholder=" " className="wn-input w-full rounded-xl border p-3" />
          </div>
          <div className="wn-field">
            <label htmlFor="c-email">Email</label>
            <input id="c-email" name="email" type="email" required placeholder=" " className="wn-input w-full rounded-xl border p-3" />
          </div>
          <div className="wn-field">
            <label htmlFor="c-msg">How can we help?</label>
            <textarea id="c-msg" name="message" rows={6} required placeholder=" " className="wn-input w-full rounded-xl border p-3" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-neutral-500">We’ll email you a confirmation.</span>
            <button className="wn-btn rounded-xl border px-4 py-2 font-medium">Send</button>
          </div>
        </form>
      </section>
    </main>
  );
}

