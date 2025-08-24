import Head from 'next/head';
import Link from 'next/link';

export default function FAQ() {
  return (
    <>
      <Head>
        <title>FAQ — WaterNews</title>
        <meta
          name="description"
          content="Answers for readers and visitors."
        />
      </Head>

      <header className="bg-gradient-to-b from-[#0f6cad] via-[#0b5d95] to-[#0a4f7f] px-4 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="m-0 text-3xl font-extrabold leading-tight md:text-5xl">
            FAQ
          </h1>
          <p className="max-w-3xl text-sm opacity-95 md:text-base">
            Answers for readers and visitors. For member help, see the NewsRoom dashboard.
          </p>
        </div>
      </header>

      <main className="mx-auto my-10 max-w-5xl px-4">
        <article className="rounded-2xl bg-white p-6 shadow">
          <div className="space-y-6">
            <section>
              <h2 className="font-medium">How do I submit a story tip?</h2>
              <p>
                Use the{' '}
                <Link className="font-semibold text-[#1583c2]" href="/suggest-story">
                  Suggest a Story
                </Link>{' '}
                page.
              </p>
            </section>
            <section>
              <h2 className="font-medium">How do I contact the newsroom?</h2>
              <p>
                Visit{' '}
                <Link className="font-semibold text-[#1583c2]" href="/contact">
                  Contact
                </Link>{' '}
                for email and forms.
              </p>
            </section>
            <section>
              <h2 className="font-medium">Corrections policy?</h2>
              <p>
                See{' '}
                <Link className="font-semibold text-[#1583c2]" href="/corrections">
                  Corrections
                </Link>{' '}
                and our{' '}
                <Link className="font-semibold text-[#1583c2]" href="/editorial-standards">
                  Editorial Standards
                </Link>
                .
              </p>
            </section>
          </div>
        </article>
      </main>
    </>
  );
}
