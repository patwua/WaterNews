import Head from 'next/head';

export default function FAQ(){
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Head><title>FAQ • WaterNews</title></Head>
      <h1 className="text-3xl font-semibold mb-4">Frequently Asked Questions</h1>
      <p className="text-gray-600 mb-6">Answers for readers and visitors. For member help, see the NewsRoom dashboard.</p>
      <div className="space-y-6">
        <section>
          <h2 className="font-medium mb-1">How do I submit a story tip?</h2>
          <p>Use the <a className="text-blue-600 underline" href="/suggest-story">Suggest a Story</a> page.</p>
        </section>
        <section>
          <h2 className="font-medium mb-1">How do I contact the newsroom?</h2>
          <p>Visit <a className="text-blue-600 underline" href="/contact">Contact</a> for email and forms.</p>
        </section>
        <section>
          <h2 className="font-medium mb-1">Corrections policy?</h2>
          <p>See <a className="text-blue-600 underline" href="/corrections">Corrections</a> and our <a className="text-blue-600 underline" href="/editorial-standards">Editorial Standards</a>.</p>
        </section>
      </div>
    </div>
  );
}
