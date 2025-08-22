import Link from 'next/link';
import { useEffect, useState } from 'react';
import StatusPill from '@/components/StatusPill';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function PublisherHub() {
  const [drafts, setDrafts] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const r = await fetch('/api/newsroom/drafts');
      const d = await r.json();
      setDrafts(d.items || d.drafts || []);
    })();
  }, []);
  useEffect(() => {
    // quick-create new draft if ?new=1
    if (typeof window === 'undefined') return;
    const u = new URL(window.location.href);
    if (u.searchParams.get('new') === '1') {
      u.searchParams.delete('new');
      history.replaceState({}, '', u.toString());
      fetch('/api/newsroom/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled draft' })
      })
        .then(r => r.json())
        .then(d => {
          if (d?.id || d?._id) location.href = `/newsroom/drafts/${d.id || d._id}`;
        });
    }
  }, []);
  return (
    <NewsroomLayout active="publisher">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">Publisher</h1>
        <Link href="/newsroom?new=1" className="px-3 py-2 rounded bg-black text-white text-sm">
          New draft
        </Link>
      </div>
      <ul className="divide-y rounded-xl border">
        {drafts.map((it: any) => (
          <li key={it._id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium flex items-center gap-2">
                {it.title || 'Untitled'} <StatusPill status={it.status} />
              </div>
              <div className="text-xs text-gray-500">
                {it.status === 'scheduled' && it.publishAt ? (
                  <>scheduled for {new Date(it.publishAt).toLocaleString()} • </>
                ) : null}
                updated {it.updatedAt ? new Date(it.updatedAt).toLocaleString() : '—'}
              </div>
            </div>
            <Link href={`/newsroom/drafts/${it._id}`} className="text-blue-600 hover:underline">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </NewsroomLayout>
  );
}
