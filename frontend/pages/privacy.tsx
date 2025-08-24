import Head from "next/head";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — WaterNews</title>
        <meta
          name="description"
          content="Our commitment to protecting your data."
        />
      </Head>

      <header className="bg-gradient-to-b from-[#0f6cad] via-[#0b5d95] to-[#0a4f7f] px-4 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="m-0 text-3xl font-extrabold leading-tight md:text-5xl">
            Privacy Policy
          </h1>
          <p className="max-w-3xl text-sm opacity-95 md:text-base">
            How we handle your data and respect your privacy.
          </p>
        </div>
      </header>

      <main className="mx-auto my-10 max-w-5xl px-4">
        <article className="rounded-2xl bg-white p-6 shadow text-[15px] text-slate-700">
          <p>
            We value your privacy. We use local storage for the Follow feature and do not track personal data unless you
            explicitly provide it (e.g., via Suggest a Story). Full policy coming soon.
          </p>
        </article>
      </main>
    </>
  );
}
