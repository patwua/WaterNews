import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import { useEffect, useState } from 'react';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function NewsroomProfile() {
  const [form, setForm] = useState<any>({ name:'', handle:'', image:'', bio:'', prefs: { emails:true, notifications:true, compact:false }});
  useEffect(()=>{ (async()=>{ const r=await fetch('/api/users/summary'); if(r.ok){ const d=await r.json(); setForm((f:any)=>({ ...f, name:d.name||'', handle:d.handle||'', image:d.image||'' })); } })(); },[]);
  async function save(){
    const r = await fetch('/api/users/update', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: form.name, handle: form.handle, image: form.image })});
    const d = await r.json().catch(()=>({}));
    if (!r.ok) return alert(d?.error || 'Failed to update profile');
    alert('Profile saved');
  }
  async function del(){
    if (!confirm('Delete your account? This is permanent.')) return;
    // Soft endpoint placeholder (replace with actual account deletion when ready)
    alert('Account deletion queued. (Wire actual deletion API when ready.)');
  }
  return (
    <NewsroomLayout>
      <h1 className="text-2xl font-semibold mb-4">Profile & Settings</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <section className="border rounded-xl p-4 space-y-3">
          <div className="font-medium">Profile</div>
          <div>
            <label className="block text-sm text-gray-600">Display name</label>
            <input className="w-full border rounded px-3 py-2" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Handle (one-time)</label>
            <input className="w-full border rounded px-3 py-2" value={form.handle} onChange={e=>setForm({...form, handle:e.target.value.replace(/[^a-z0-9_]/gi,'')})}/>
            <div className="text-xs text-gray-500 mt-1">Use letters, numbers, underscore.</div>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Avatar URL</label>
            <input className="w-full border rounded px-3 py-2" value={form.image} onChange={e=>setForm({...form, image:e.target.value})}/>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Bio</label>
            <textarea className="w-full border rounded px-3 py-2 min-h-[100px]" value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})}/>
          </div>
          <div><button onClick={save} className="px-3 py-2 rounded bg-black text-white text-sm">Save</button></div>
        </section>
        <section className="border rounded-xl p-4 space-y-3">
          <div className="font-medium">Preferences</div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.prefs.emails} onChange={e=>setForm({...form, prefs:{...form.prefs, emails:e.target.checked}})}/> Email digests</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.prefs.notifications} onChange={e=>setForm({...form, prefs:{...form.prefs, notifications:e.target.checked}})}/> In-app notifications</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.prefs.compact} onChange={e=>setForm({...form, prefs:{...form.prefs, compact:e.target.checked}})}/> Compact layout</label>
          <div className="pt-4">
            <details>
              <summary className="text-sm text-red-700 cursor-pointer">Danger zone</summary>
              <button onClick={del} className="mt-2 px-3 py-2 rounded border border-red-600 text-red-700 text-sm">Delete account</button>
            </details>
          </div>
        </section>
      </div>
    </NewsroomLayout>
  );
}
