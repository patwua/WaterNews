import Head from "next/head";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import StreamsEditor from '@/components/Newsroom/StreamsEditor';

export async function getServerSideProps(ctx: any) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return {
      redirect: { destination: '/login?next=/newsroom/streams', permanent: false },
    };
  }
  return { props: {} };
}

export default function NewsroomStreamsPage() {
  return (
    <>
      <Head>
        <title>Newsroom · Streams Editor</title>
      </Head>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-1">Streams Editor</h1>
        <p className="text-gray-600 mb-6">
          Attach images and videos to drafts or published articles to power the public Streams experience.
        </p>
        <StreamsEditor />
      </main>
    </>
  );
}
