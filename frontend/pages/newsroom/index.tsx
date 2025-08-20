import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx);

export default function NewsroomHome() {
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch('/api/newsroom/drafts');
        if (!r.ok) throw new Error('Failed to load drafts');
        const d = await r.json();
        if (!mounted) return;
        setDrafts(d.items || d.drafts || []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load drafts');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const createDraft = async () => {
    try {
      const r = await fetch('/api/newsroom/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled', body: '' }),
      });
      const d = await r.json();
      if (r.ok && d?._id) {
        location.href = `/newsroom/drafts/${d._id}`;
      } else {
        throw new Error(d?.error || 'Could not create draft');
      }
    } catch (e: any) {
      alert(e?.message || 'Could not create draft');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Newsroom</h1>
        <button
          onClick={createDraft}
          className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
        >
          Start a Draft
        </button>
      </div>

      <p className="text-gray-600">
        Write, save, and schedule your stories. Only logged-in members can access this area.
      </p>

      {loading ? (
        <div className="text-gray-500">Loading your drafts…</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : drafts.length === 0 ? (
        <div className="border rounded-xl p-6 text-gray-600">
          No drafts yet. Click <span className="font-medium">Start a Draft</span> to begin.
        </div>
      ) : (
        <ul className="divide-y rounded-xl border">
          {drafts.map((it: any) => (
            <li key={it._id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{it.title || 'Untitled'}</div>
                <div className="text-xs text-gray-500">
                  {it.status || 'draft'} • updated {it.updatedAt ? new Date(it.updatedAt).toLocaleString() : '—'}
                </div>
              </div>
              <Link href={`/newsroom/drafts/${it._id}`} className="text-blue-600 hover:underline">
                Open
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="pt-4">
        <Link href="/profile" className="text-sm text-gray-600 underline underline-offset-4">
          Go to your profile
        </Link>
      </div>
    </div>
  );
}

