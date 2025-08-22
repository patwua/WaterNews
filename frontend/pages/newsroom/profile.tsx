import type { GetServerSideProps } from 'next';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import { requireAuthSSR } from '@/lib/user-guard';
import { useEffect, useState } from 'react';
import ProfilePhotoForm from '@/components/Settings/ProfilePhotoForm';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function ProfilePage(){
  const [me, setMe] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string|null>(null);
  useEffect(()=>{ (async()=>{
    const r = await fetch('/api/users/summary');
    const d = await r.json(); setMe(d.me||null);
    setDisplayName(d?.me?.displayName || ''); setHandle(d?.me?.handle || '');
    setBio(d?.me?.bio || '');
  })(); },[]);
  async function save(){
    setBusy(true); setMsg(null);
    try{
      const r = await fetch('/api/users/update', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ displayName, handle, bio })});
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || 'Update failed');
      setMsg('Saved!');
      setMe(d.user || me);
    } catch (e:any) {
      setMsg(e.message || 'Failed');
    } finally { setBusy(false); }
  }
  return (
    <NewsroomLayout>
      <h1 className="text-2xl font-semibold mb-4">Profile & Settings</h1>
      <div className="max-w-xl border rounded-xl p-4 space-y-3">
        <label className="block text-sm text-gray-600 mb-1">Display name</label>
        <input className="w-full border rounded px-3 py-2" value={displayName} onChange={e=>setDisplayName(e.target.value)} />
        <label className="block text-sm text-gray-600 mb-1 mt-3">Handle</label>
        <input className="w-full border rounded px-3 py-2" value={handle} onChange={e=>setHandle(e.target.value)} placeholder="unique-handle" />
        <label className="block text-sm text-gray-600 mb-1 mt-3">Bio</label>
        <textarea className="w-full border rounded px-3 py-2 min-h-[120px]" value={bio} onChange={e=>setBio(e.target.value)} placeholder="Tell readers about you…" />
        <div className="mt-3">
          {me?._id ? (
            <ProfilePhotoForm userId={String(me._id)} initialUrl={me?.profilePhotoUrl} isOrganization={me?.isOrganization === true} />
          ) : null}
        </div>
        <div className="pt-3">
          <button onClick={save} className="px-3 py-2 rounded bg-black text-white text-sm disabled:opacity-50" disabled={busy}>{busy?'Saving…':'Save'}</button>
          {msg ? <span className="ml-3 text-sm">{msg}</span> : null}
        </div>
      </div>
    </NewsroomLayout>
  );
}

