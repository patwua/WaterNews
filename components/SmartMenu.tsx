import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SmartMenu() {
  const [me, setMe] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/api/users/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!mounted) return;
        setMe(d);
        if (d && (d.isAdmin || d.role === 'admin' || d.role === 'editor' || d.isStaff)) {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

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
      <Link href="/credits" className="hover:underline">
        Credits
      </Link>
      {/* Newsroom link removed: logged-in users have persistent shell access */}
      {isAdmin && (
        <Link href="/admin" className="hover:underline">
          Admin
        </Link>
      )}
    </nav>
  );
}

