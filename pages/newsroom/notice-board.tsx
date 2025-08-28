import React, { useEffect, useState } from "react";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import Callout from "@/components/UX/Callout";

type Notice = {
  _id?: string;
  title?: string;
  body?: string;
  createdAt?: string;
  comments?: any[];
};

export default function NoticeBoard() {
  const [items, setItems] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/newsroom/notice");
        const d = await r.json();
        if (!alive) return;
        setItems(Array.isArray(d?.items) ? d.items : []);
        // mark seen to clear unread badge
        fetch("/api/newsroom/notice/seen", { method: "POST" }).catch(() => {});
      } catch {
        if (!alive) return;
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function onPost(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setPosting(true);
    try {
      const r = await fetch("/api/newsroom/notice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Failed");
      setItems((prev) => [
        { ...(d?.item || { title, body, createdAt: new Date().toISOString() }) },
        ...prev,
      ]);
      setTitle("");
      setBody("");
    } catch (e: any) {
      alert(e.message || "Failed");
    } finally {
      setPosting(false);
    }
  }

  async function onComment(id: string, text: string) {
    if (!text.trim()) return;
    try {
      const r = await fetch("/api/newsroom/notice/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, text }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Failed");
      setItems((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, comments: [...(n.comments || []), d.comment] } : n
        )
      );
    } catch (e: any) {
      alert(e.message || "Failed");
    }
  }

  return (
    <Page title="Notice Board" subtitle="Newsroom updates, suggestions, and discussion">
      <div className="grid gap-6">
        <Callout variant="info">
          Use this space for platform notes, suggestions, and coordination.
        </Callout>
        <div id="new">
            <SectionCard id="notice-board-new" title="Post a notice">
            <form onSubmit={onPost} className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full border px-3 py-2 rounded"
                placeholder="Write your notice…"
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <button
                className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900"
                disabled={posting}
              >
                {posting ? "Posting…" : "Publish notice"}
              </button>
            </form>
          </SectionCard>
        </div>
          <SectionCard id="notice-board-list" title="All notices">
          {loading ? (
            <div>Loading…</div>
          ) : items.length === 0 ? (
            <div>No notices yet.</div>
          ) : (
            <ul className="space-y-4">
              {items.map((n) => (
                <li
                  key={n._id || n.title}
                  className="rounded-xl ring-1 ring-gray-200 p-3"
                >
                  <div className="font-medium">{n.title || "Notice"}</div>
                  <div className="text-sm text-gray-700 whitespace-pre-line mt-1">
                    {n.body}
                  </div>
                  <CommentsMini
                    noticeId={String(n._id || "")}
                    items={n.comments || []}
                    onAdd={onComment}
                  />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </Page>
  );
}

function CommentsMini({
  noticeId,
  items,
  onAdd,
}: {
  noticeId: string;
  items: any[];
  onAdd: (id: string, text: string) => void;
}) {
  const [text, setText] = React.useState("");
  return (
    <div className="mt-3">
      <ul className="space-y-2">
        {items.map((c, i) => (
          <li key={c._id || i} className="text-sm text-gray-700">
            <span className="font-medium">{c.author?.name || "Member"}:</span> {c.text}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={() => {
            onAdd(noticeId, text);
            setText("");
          }}
          className="px-3 py-2 rounded-md border hover:bg-gray-50"
        >
          Comment
        </button>
      </div>
    </div>
  );
}

