import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Profile() {
  const { data: session, status } = useSession()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!session?.user) return
      const res = await fetch('/api/users/me')
      const json = await res.json()
      if (res.ok) {
        setName(json.name || '')
        setBio(json.bio || '')
      }
    }
    load()
  }, [session])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('')
    const res = await fetch('/api/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, bio })
    })
    if (res.ok) setMsg('Saved ✓')
  }

  if (status === 'loading') return <div className="p-6 text-gray-500">Loading…</div>
  if (!session?.user) return (
    <div className="p-6">
      <p className="text-gray-700">Please <Link href="/login" className="text-blue-700 underline">sign in</Link> to view your profile.</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Author Profile</h1>
      <form onSubmit={save} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Your display name" value={name} onChange={e=>setName(e.target.value)} />
        <textarea className="w-full border rounded px-3 py-2 h-32" placeholder="Short bio (shown under your articles)" value={bio} onChange={e=>setBio(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        {msg && <span className="text-green-700 text-sm ml-3">{msg}</span>}
      </form>
      <div>
        <Link href="/" className="text-blue-700 underline">← Back to Home</Link>
      </div>
    </div>
  )
}
