import Link from "next/link";
import { isAdminEmail, isAdminUser } from "@/lib/admin-auth";

export default function AdminHome() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <ul className="space-y-2">
        <li>
          <Link href="/admin/inbox" className="text-blue-600 hover:underline">Inbox</Link>
        </li>
        <li>
          <Link href="/admin/newsroom" className="text-blue-600 hover:underline">Newsroom</Link>
        </li>
        <li>
          <Link href="/admin/drafts" className="text-blue-600 hover:underline">Drafts</Link>
        </li>
        <li>
          <Link href="/admin/moderation/queue" className="text-blue-600 hover:underline">Moderation</Link>
        </li>
      </ul>
    </main>
  );
}

export async function getServerSideProps(ctx) {
  const email = ctx.req?.headers["x-user-email"] || null;
  const ok = (await isAdminEmail(email)) || (await isAdminUser(email));
  if (!ok) {
    return { redirect: { destination: "/profile", permanent: false } };
  }
  return { props: {} };
}
