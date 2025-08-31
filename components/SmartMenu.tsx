import Link from 'next/link';
import useSWR from 'swr';

export default function SmartMenu() {
  const { data } = useSWR<{ isAdmin: boolean }>(
    '/api/admin/is-admin',
    (u) => fetch(u).then((r) => r.json()),
    { revalidateOnFocus: false }
  );
  const isAdmin = !!data?.isAdmin;
  return (
    <nav className="flex items-center gap-6">
      <Link href="/?sort=latest" className="hover:underline">
        Latest
      </Link>
      <Link href="/?sort=trending" className="hover:underline">
        Trending
      </Link>
      <Link href="/topics" className="hover:underline">
        Categories
      </Link>
      <Link href="/streams" className="hover:underline">
        Streams
      </Link>
      <Link href="/credits" className="hover:underline">
        Credits
      </Link>
      <Link
        href="/admin/analytics/streams"
        className="text-sm px-3 py-1.5 rounded hover:bg-gray-100 flex items-center gap-2"
      >
        <span>Streams Analytics</span>
        {isAdmin && (
          <span className="text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-black text-white">
            Admin
          </span>
        )}
      </Link>
      {isAdmin && (
        <Link href="/admin" className="hover:underline">
          Admin
        </Link>
      )}
    </nav>
  );
}

