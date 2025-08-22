import { useEffect, useState } from 'react';

export default function ActivityTrail({ draftId }: { draftId: string }) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{ load(); const t=setInterval(load, 15000); return ()=>clearInterval(t); }, [draftId]);
  async function load(){
    const r = await fetch(`/api/newsroom/drafts/${encodeURIComponent(draftId)}/activity`);
    const d = await r.json().catch(()=>({}));
    setItems(d.items || []);
  }
  if (!items.length) return null;
  return (
    <section className="mt-6 border rounded-xl p-4">
      <div className="font-medium mb-2">Activity</div>
      <ul className="space-y-2 text-sm">
        {items.map((a:any)=>(
          <li key={String(a._id)} className="flex items-center gap-2">
            <span className="text-gray-500">{new Date(a.createdAt).toLocaleTimeString()}</span>
            <span className="px-2 py-0.5 rounded bg-gray-100">{a.type}</span>
            <span className="text-gray-700 truncate">{a.authorEmail}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
