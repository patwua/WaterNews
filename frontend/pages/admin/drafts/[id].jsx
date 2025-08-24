import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import SharedEditor from "@/components/Newsroom/SharedEditor";

function useDebouncedCallback(cb, delay=600) {
  const [t, setT] = useState(null);
  return (...args) => {
    if (t) clearTimeout(t);
    setT(setTimeout(()=>cb(...args), delay));
  };
}

export default function DraftEditor() {
  const { query } = useRouter();
  const { id } = query;
  const [item, setItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [threadUrl, setThreadUrl] = useState(null);
  const [threadBusy, setThreadBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      const r = await fetch(`/api/drafts/get?id=${id}`);
      const d = await r.json();
      if (!mounted) return;
      setItem(d.item || null);
      const slug = d?.item?.slug;
      if (slug) {
        try {
          const t = await fetch(`/api/news/posts/${encodeURIComponent(slug)}`).then(r=>r.json());
          setThreadUrl(t?.patwuaThreadUrl || null);
        } catch {}
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const scheduleStr = useMemo(()=>{
    if (!item?.scheduledAt) return "";
    const dt = new Date(item.scheduledAt);
    const z = n=>String(n).padStart(2,"0");
    return `${dt.getFullYear()}-${z(dt.getMonth()+1)}-${z(dt.getDate())}T${z(dt.getHours())}:${z(dt.getMinutes())}`;
  }, [item?.scheduledAt]);

  const debouncedSave = useDebouncedCallback(async (patch) => {
    setSaving(true);
    await fetch("/api/drafts/update", {
      method: "PATCH",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ id, patch })
    });
    const d = await (await fetch(`/api/drafts/get?id=${id}`)).json();
    setItem(d.item || null);
    setSaving(false);
  }, 600);

  if (!item) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 max-w-4xl">
        <input
          className="w-full text-xl font-semibold border-b focus:outline-none"
          defaultValue={item.title}
          onChange={(e)=>debouncedSave({ title: e.target.value })}
          placeholder="Title…"
        />
        <span className="text-xs text-gray-500">{saving ? "Saving…" : "Saved"}</span>
      </div>

      <SharedEditor
        value={item.body}
        onChange={(v)=>debouncedSave({ body: v })}
        status={item.status}
        onStatusChange={(s)=>debouncedSave({ status: s })}
        draftId={id}
        showModerationNotes
        rightPanel={
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700">Schedule</div>
              <input
                type="datetime-local"
                className="mt-2 w-full border rounded px-3 py-2"
                value={scheduleStr}
                onChange={(e)=>debouncedSave({ scheduledAt: e.target.value || null })}
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700">Assignment</div>
              <input className="mt-2 w-full border rounded px-3 py-2" placeholder="Assignee email"
                defaultValue={item.assignedTo?.email || ""}
                onBlur={(e)=>debouncedSave({ assignedTo: e.target.value ? { email: e.target.value } : null })}
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700">Reviewers</div>
              <textarea className="mt-2 w-full border rounded px-3 py-2" placeholder="Comma-separated reviewer emails"
                defaultValue={(item.reviewers||[]).map(r=>r.email).join(",")}
                onBlur={(e)=>{
                  const list = e.target.value.split(",").map(s=>s.trim()).filter(Boolean).map(email=>({ email }));
                  debouncedSave({ reviewers: list });
                }}
              />
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked={!!item.secondReviewRequired}
                  onChange={(e)=>debouncedSave({ secondReviewRequired: e.target.checked })}/>
                Second review required
              </label>
            </div>

            {item?.slug ? (
              <div className="border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Discussion Thread (Patwua)</div>
                  {threadUrl ? (
                    <a href={threadUrl} target="_blank" rel="noreferrer" className="text-sm underline">Open thread →</a>
                  ) : null}
                </div>
                {!threadUrl ? (
                  <div className="mt-2">
                    <button
                      disabled={threadBusy}
                      onClick={async ()=>{
                        setThreadBusy(true);
                        try {
                          const r = await fetch(`/api/admin/posts/${encodeURIComponent(item.slug)}/create-thread`, { method: 'POST' });
                          const d = await r.json();
                          if (!r.ok) return alert(d?.error || 'Failed to create thread');
                          setThreadUrl(d.threadUrl);
                        } finally { setThreadBusy(false); }
                      }}
                      className="px-3 py-2 rounded bg-black text-white text-sm disabled:opacity-50"
                    >
                      {threadBusy ? 'Creating…' : 'Create Patwua Thread'}
                    </button>
                    <div className="text-xs text-gray-500 mt-2">Creates a discussion thread on Patwua and links this post to it.</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 mt-2">Thread linked.</div>
                )}
              </div>
            ) : null}

            {item.ticketId && (
              <div className="text-xs text-gray-500">Linked Ticket: {String(item.ticketId)}</div>
            )}
          </div>
        }
      />
    </div>
  );
}
