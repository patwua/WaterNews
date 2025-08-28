import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import { useState } from 'react';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function AssistantHub() {
  const [input, setInput] = useState('');
  const [resp, setResp] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  async function run() {
    setBusy(true); setResp(null);
    try {
      const r = await fetch('/api/newsroom/assistant/suggest', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text: input }) });
      const d = await r.json();
      setResp(d);
    } finally { setBusy(false); }
  }
  return (
    <NewsroomLayout title="AI Assistant">
      <p className="text-sm text-gray-600 mb-3">Paste a draft. We’ll surface related context (site + web), angle suggestions, links, and outline tweaks.</p>
      <textarea className="w-full border rounded p-3 min-h-[200px]" placeholder="Paste your draft or notes…" value={input} onChange={e=>setInput(e.target.value)} />
      <div className="mt-2"><button disabled={!input.trim() || busy} onClick={run} className="px-3 py-2 rounded bg-black text-white text-sm disabled:opacity-50">{busy? 'Thinking…' : 'Get suggestions'}</button></div>
      {resp ? (
        <div className="mt-6 space-y-4">
          <Section title="Related posts" items={resp.related || []} />
          <Section title="External sources" items={resp.web || []} />
          <Bullets title="Angles & improvements" items={resp.angles || []} />
          <Bullets title="Media suggestions" items={resp.media || []} />
        </div>
      ) : null}
    </NewsroomLayout>
  );
}

function Section({ title, items }: { title: string; items: any[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <div className="font-medium mb-2">{title}</div>
      <ul className="list-disc pl-5 space-y-1">
        {items.map((it:any, i:number)=>(
          <li key={i}><a className="text-blue-600 underline" href={it.url} target="_blank" rel="noreferrer">{it.title || it.url}</a></li>
        ))}
      </ul>
    </div>
  );
}
function Bullets({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <div className="font-medium mb-2">{title}</div>
      <ul className="list-disc pl-5 space-y-1">
        {items.map((t, i)=>(<li key={i}>{t}</li>))}
      </ul>
    </div>
  );
}
