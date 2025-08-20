import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

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
  const [mediaOpen, setMediaOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/drafts/get?id=${id}`).then(r=>r.json()).then(d=>setItem(d.item || null));
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

  function insertAtCursor(textarea, snippet) {
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const before = textarea.value.slice(0,start);
    const after = textarea.value.slice(end);
    const next = before + snippet + after;
    textarea.value = next;
    debouncedSave({ body: next });
  }

  return (
    <div className="p-6 grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3">
          <input
            className="w-full text-xl font-semibold border-b focus:outline-none"
            defaultValue={item.title}
            onChange={(e)=>debouncedSave({ title: e.target.value })}
            placeholder="Title…"
          />
          <span className="text-xs text-gray-500">{saving ? "Saving…" : "Saved"}</span>
        </div>

        <div className="mt-4">
          <textarea
            id="editor"
            className="w-full h-[420px] border rounded-lg p-3 font-mono"
            defaultValue={item.body}
            onChange={(e)=>debouncedSave({ body: e.target.value })}
            placeholder="Write in Markdown…"
          />
          <div className="mt-3 flex gap-2">
            <button onClick={()=>setMediaOpen(true)} className="px-3 py-2 rounded border">Insert Media</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-700">Status</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {["draft","in-review","ready","scheduled","published","archived"].map(s=>(
              <button key={s} onClick={()=>debouncedSave({ status: s })} className={`px-3 py-1 rounded border ${item.status===s?"bg-blue-600 text-white":"bg-white"}`}>{s}</button>
            ))}
          </div>
        </div>

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

        {item.ticketId && (
          <div className="text-xs text-gray-500">Linked Ticket: {String(item.ticketId)}</div>
        )}
      </div>

      {/* Media Library Modal */}
      {mediaOpen && <MediaModal onClose={()=>setMediaOpen(false)} onPick={(m)=>{
        setMediaOpen(false);
        const ta = document.getElementById("editor");
        if (!ta) return;
        const snippet = `\n![media](${m.url})\n`;
        insertAtCursor(ta, snippet);
      }} />}
    </div>
  );
}

function MediaModal({ onClose, onPick }) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  useEffect(()=>{
    fetch(`/api/media/list`).then(r=>r.json()).then(d=>{
      setItems(d.resources || []);
      setCursor(d.next_cursor || null);
    });
  },[]);
  async function loadMore() {
    const r = await fetch(`/api/media/list?cursor=${encodeURIComponent(cursor)}`);
    const d = await r.json();
    setItems(prev => [...prev, ...(d.resources||[])]);
    setCursor(d.next_cursor || null);
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Media Library</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-auto">
          {items.map((r)=>(
            <button key={r.public_id} className="border rounded-lg overflow-hidden hover:shadow"
              onClick={()=>onPick({ url: r.secure_url || r.url, public_id: r.public_id, resource_type: r.resource_type })}>
              <img src={r.secure_url || r.url} alt={r.public_id} className="w-full h-32 object-cover" />
              <div className="p-2 text-xs truncate">{r.public_id}</div>
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          {cursor && <button onClick={loadMore} className="px-4 py-2 rounded border">Load more</button>}
        </div>
      </div>
    </div>
  );
}
