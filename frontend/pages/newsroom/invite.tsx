import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import { useState } from 'react';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function InvitePage(){
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string| null>(null);
  async function send(){
    setSending(true); setMsg(null);
    try{
      const r = await fetch('/api/newsroom/invite', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email })});
      const d = await r.json().catch(()=>({}));
      if (!r.ok) setMsg(d?.error || 'Failed to send invite');
      else setMsg('Invite sent!');
    } finally { setSending(false); }
  }
  return (
    <NewsroomLayout>
      <h1 className="text-2xl font-semibold mb-4">Invite a Friend</h1>
      <div className="max-w-md border rounded-xl p-4">
        <label className="block text-sm text-gray-600 mb-1">Email address</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full border rounded px-3 py-2 mb-3" placeholder="name@example.com"/>
        <button onClick={send} disabled={!email || sending} className="px-3 py-2 rounded bg-black text-white text-sm disabled:opacity-50">{sending?'Sending…':'Send invite'}</button>
        {msg ? <div className="mt-2 text-sm">{msg}</div> : null}
      </div>
    </NewsroomLayout>
  );
}
