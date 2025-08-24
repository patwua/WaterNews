import Head from "next/head";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";

export default function EditorialStandards() {
  return (
    <>
      <Head>
        <title>Editorial Standards — WaterNews</title>
        <meta
          name="description"
          content="WaterNews is committed to accuracy, independence, and transparency."
        />
      </Head>
      <Page title="Editorial Standards">
        <SectionCard>
          <article className="prose prose-neutral max-w-none">
            <p>
              WaterNews is committed to accuracy, independence, and transparency. These
              standards guide our newsroom and contributors.
            </p>
            <h2>Accuracy &amp; Corrections</h2>
            <ul>
              <li>We verify facts with primary sources whenever possible.</li>
              <li>Material errors are corrected promptly and labeled with a correction note.</li>
            </ul>
            <h2>Sourcing</h2>
            <ul>
              <li>Anonymous sources are used sparingly and require editor approval.</li>
              <li>Conflicts of interest must be disclosed and mitigated.</li>
            </ul>
            <h2>Attribution &amp; Plagiarism</h2>
            <ul>
              <li>Quotes and material from other outlets are clearly attributed.</li>
              <li>We use internal duplicate checks to prevent plagiarism.</li>
            </ul>
            <h2>Corrections &amp; Feedback</h2>
            <p>
              To request a correction, please use our <a href="/corrections">Corrections
              form</a>. For general feedback, contact us via the <a href="/contact">Contact
              page</a>.
            </p>
            <hr />
            <p className="text-sm text-neutral-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </article>
        </SectionCard>
      </Page>
    </>
  );
}

