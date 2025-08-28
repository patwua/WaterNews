import { useEffect, useState } from 'react';

export default function CommentsBox({ slug }: { slug: string }) {
  const [me, setMe] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [threadUrl, setThreadUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [u, c, t] = await Promise.all([
          fetch('/api/users/me').then(r => r.ok ? r.json() : null),
          fetch(`/api/comments?slug=${encodeURIComponent(slug)}`).then(r => r.json()),
          fetch(`/api/news/posts/${encodeURIComponent(slug)}`).then(r => r.json()).catch(()=>({}))
        ]);
        if (!mounted) return;
        setMe(u);
        setItems(c?.items || []);
        setThreadUrl(t?.patwuaThreadUrl || null);
      } catch (e: any) {
        setError(e?.message || 'Failed to load comments');
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [slug]);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, body })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || 'Failed to comment');
      setBody('');
      // optimistic: show pending comment locally
      setItems([{ ...d }, ...items]);
      alert(d.status === 'approved' ? 'Comment posted' : 'Submitted for review');
    } catch (e: any) {
      setError(e?.message || 'Failed to comment');
    } finally { setSubmitting(false); }
  }

  return (
    <section className="border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Comments</h3>
        {threadUrl ? (
          <a href={threadUrl} target="_blank" rel="noreferrer" className="text-sm underline underline-offset-4">
            Discuss on Patwua →
          </a>
        ) : (
          <a href="https://patwua.com" target="_blank" rel="noreferrer" className="text-sm underline underline-offset-4">
            Discuss on Patwua →
          </a>
        )}
      </div>

      {loading ? <div className="text-gray-500 text-sm">Loading…</div> : null}
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}

      {me?.email ? (
        <div className="space-y-2">
          <textarea
            className="w-full border rounded p-3 min-h-[100px]"
            placeholder="Add your comment…"
            value={body}
            onChange={(e)=>setBody(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button disabled={submitting || body.trim().length < 3} onClick={submit} className="px-3 py-2 rounded bg-black text-white text-sm disabled:opacity-50">
              {submitting ? 'Submitting…' : 'Post comment'}
            </button>
            <div className="text-xs text-gray-500">Comments may be moderated.</div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-600">
          <a href={`/login?next=${encodeURIComponent(location.pathname)}`} className="underline">Log in</a> to comment.
        </div>
      )}

      <ul className="divide-y">
        {items.map((c) => (
          <li key={String(c._id)} className="py-3">
            <div className="text-sm">
              <span className="font-medium">{c.authorEmail || 'anonymous'}</span>
              <span className="text-gray-500"> • {new Date(c.createdAt).toLocaleString()}</span>
              {c.status !== 'approved' ? <span className="ml-2 text-xs text-amber-600">({c.status})</span> : null}
            </div>
            <div className="mt-1">{c.body}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
