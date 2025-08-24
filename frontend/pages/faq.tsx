import Head from "next/head";
import Link from "next/link";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import { colors } from "@/lib/brand-tokens";

export default function FAQ() {
  const brandVars = {
    "--brand": colors.primary,
  } as Record<string, string>;

  return (
    <>
      <Head>
        <title>FAQ — WaterNews</title>
        <meta name="description" content="Answers for readers and visitors." />
      </Head>
      <Page
        title="FAQ"
        subtitle="Answers for readers and visitors. For member help, see the NewsRoom dashboard."
      >
        <SectionCard>
          <div style={brandVars} className="space-y-6">
            <section>
              <h2 className="font-medium">How do I submit a story tip?</h2>
              <p>
                Use the{" "}
                <Link className="font-semibold text-[var(--brand)]" href="/suggest-story">
                  Suggest a Story
                </Link>{" "}
                page.
              </p>
            </section>
            <section>
              <h2 className="font-medium">How do I contact the newsroom?</h2>
              <p>
                Visit{" "}
                <Link className="font-semibold text-[var(--brand)]" href="/contact">
                  Contact
                </Link>{" "}
                for email and forms.
              </p>
            </section>
            <section>
              <h2 className="font-medium">Corrections policy?</h2>
              <p>
                See{" "}
                <Link className="font-semibold text-[var(--brand)]" href="/corrections">
                  Corrections
                </Link>{" "}
                and our{" "}
                <Link className="font-semibold text-[var(--brand)]" href="/editorial-standards">
                  Editorial Standards
                </Link>
                .
              </p>
            </section>
          </div>
        </SectionCard>
      </Page>
    </>
  );
}
