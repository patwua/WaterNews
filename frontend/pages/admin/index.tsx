import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const session = await getServerSession(ctx.req, ctx.res, authOptions as any);
    const email = session?.user?.email || null;
    const ok = (await isAdminEmail(email)) || (await isAdminUser(email));
    if (!ok) {
      return { redirect: { destination: '/login?next=/admin', permanent: false } };
    }
    return { props: {} };
  } catch {
    return { redirect: { destination: '/login?next=/admin', permanent: false } };
  }
};

export default function AdminHome() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Newsroom</h1>
      <p className="text-gray-600">Choose a workspace:</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/admin/inbox" className="block border rounded-xl p-4 hover:shadow">
          <div className="font-medium">Inbox</div>
          <div className="text-sm text-gray-600">Tips, corrections, contact, apply</div>
        </Link>
        <Link href="/admin/drafts" className="block border rounded-xl p-4 hover:shadow">
          <div className="font-medium">Drafts</div>
          <div className="text-sm text-gray-600">Write, schedule, assign, review</div>
        </Link>
        <Link href="/admin/moderation/queue" className="block border rounded-xl p-4 hover:shadow">
          <div className="font-medium">Moderation</div>
          <div className="text-sm text-gray-600">Queue & notes</div>
        </Link>
        <Link href="/admin/newsroom" className="block border rounded-xl p-4 hover:shadow">
          <div className="font-medium">Tools</div>
          <div className="text-sm text-gray-600">Link check, similarity, summaries</div>
        </Link>
        <Link href="/admin/moderation/drafts" className="block border rounded-xl p-4 hover:shadow">
          <div className="font-medium">Draft Reviews</div>
          <div className="text-sm text-gray-600">Approve, request changes, assign reviewers</div>
        </Link>
      </div>
    </div>
  );
}
