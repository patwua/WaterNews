export default function EditorialStandards() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <div className="sticky top-0 -mx-4 mb-6 h-28 bg-[image:var(--wn-grad-hero)] bg-[length:100%_100%] bg-no-repeat" />
      <article className="wn-card-lg p-6 prose prose-neutral max-w-none">
        <h1>Editorial Standards</h1>
        <p>
          WaterNews is committed to accuracy, independence, and transparency. These standards guide our newsroom and contributors.
        </p>
        <h2>Accuracy & Corrections</h2>
        <ul>
          <li>We verify facts with primary sources whenever possible.</li>
          <li>Material errors are corrected promptly and labeled with a correction note.</li>
        </ul>
        <h2>Sourcing</h2>
        <ul>
          <li>Anonymous sources are used sparingly and require editor approval.</li>
          <li>Conflicts of interest must be disclosed and mitigated.</li>
        </ul>
        <h2>Attribution & Plagiarism</h2>
        <ul>
          <li>Quotes and material from other outlets are clearly attributed.</li>
          <li>We use internal duplicate checks to prevent plagiarism.</li>
        </ul>
        <h2>Corrections & Feedback</h2>
        <p>
          To request a correction, please use our <a href="/corrections">Corrections form</a>. For general feedback, contact us via the <a href="/contact">Contact page</a>.
        </p>
        <hr />
        <p className="text-sm text-neutral-500">Last updated: {new Date().toLocaleDateString()}</p>
      </article>
    </main>
  );
}
