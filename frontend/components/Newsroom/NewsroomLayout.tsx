import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import MediaLibraryModal from '@/components/MediaLibraryModal';

export default function NewsroomLayout({ active, children }: { active: string; children: React.ReactNode }) {
  const [me, setMe] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<{ displayName?: string; handle?: string; photoUrl?: string }>({});

  useEffect(() => {
    (async () => {
      const r = await fetch('/api/users/me');
      if (r.ok) {
        const d = await r.json();
        setMe(d);
        setForm({ displayName: d?.name || '', handle: d?.handle || '', photoUrl: d?.image || '' });
      }
    })();
  }, []);

  async function saveProfile() {
    const r = await fetch('/api/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.displayName, handle: form.handle, image: form.photoUrl })
    });
    if (!r.ok) {
      const d = await r.json().catch(()=>({}));
      alert(d?.error || 'Failed to update profile');
      return;
    }
    alert('Profile updated');
    setEditOpen(false);
    const meR = await fetch('/api/users/me');
    setMe(meR.ok ? await meR.json(): me);
  }

  return (
    <div className="min-h-screen grid grid-cols-12">
      {/* Sidebar */}
      <aside className="col-span-12 lg:col-span-3 xl:col-span-2 border-r bg-white">
        <div className="p-4 space-y-4">
          <div className="text-xs uppercase tracking-widest text-gray-500">NewsRoom</div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={me?.image || '/apple-touch-icon.png'}
              alt=""
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div className="min-w-0">
              <div className="font-medium truncate">{me?.name || 'Your Name'}</div>
              <div className="text-xs text-gray-600 truncate">@{me?.handle || 'handle'}</div>
              <button className="text-xs underline text-blue-600" onClick={() => setEditOpen(true)}>Edit profile</button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-2">
            <Link href="/newsroom?new=1" className="border rounded px-3 py-2 text-center text-sm hover:shadow">New draft</Link>
            <Link href="/newsroom" className="border rounded px-3 py-2 text-center text-sm hover:shadow">My drafts</Link>
            <Link href="/newsroom/posts" className="border rounded px-3 py-2 text-center text-sm hover:shadow col-span-2">My posts</Link>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            <NavItem href="/newsroom/dashboard" label="Dashboard" active={active==='dashboard'} />
            <NavItem href="/newsroom/notice-board" label="Notice Board" active={active==='notice'} />
            <NavItem href="/newsroom" label="Publisher" active={active==='publisher'} />
            <NavItem href="/newsroom/collab" label="Collaboration" active={active==='collab'} />
            <NavItem href="/newsroom/media" label="Media" active={active==='media'} />
            <NavItem href="/newsroom/assistant" label="AI Assistant" active={active==='assistant'} />
            <NavItem href="/newsroom/profile" label="Profile" active={active==='profile'} />
            <button onClick={()=>signOut({ callbackUrl: '/' })} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-red-700">Logout</button>
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className="col-span-12 lg:col-span-9 xl:col-span-10 p-6">
        {children}
      </main>

      {/* Profile editor modal (uses MediaLibraryModal for avatar) */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-4 w-[92vw] max-w-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">Edit Profile</div>
              <button className="text-sm underline" onClick={()=>setEditOpen(false)}>Close</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600">Display name</label>
                <input className="w-full border rounded px-3 py-2" value={form.displayName || ''} onChange={e=>setForm({ ...form, displayName: e.target.value })}/>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Handle (unique; one-time)</label>
                <input className="w-full border rounded px-3 py-2" value={form.handle || ''} onChange={e=>setForm({ ...form, handle: e.target.value.replace(/[^a-z0-9_]/gi,'') })}/>
                <div className="text-xs text-gray-500 mt-1">Use letters, numbers, underscore. Choose wisely — one-time handle.</div>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Photo</label>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.photoUrl || '/apple-touch-icon.png'} alt="" className="w-14 h-14 rounded-full border object-cover"/>
                  <MediaPicker onPick={(url)=>setForm({ ...form, photoUrl: url })}/>
                </div>
              </div>
              <div className="pt-2">
                <button onClick={saveProfile} className="px-3 py-2 rounded bg-black text-white text-sm">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link href={href} className={`block px-3 py-2 rounded ${active ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>{label}</Link>
  );
}

function MediaPicker({ onPick }: { onPick: (url: string)=>void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="px-3 py-2 border rounded text-sm" onClick={()=>setOpen(true)}>Choose from Library</button>
      <MediaLibraryModal open={open} onClose={()=>setOpen(false)} onSelect={(asset:any)=>onPick(asset.secure_url || asset.url)} />
    </>
  );
}

