import { useEffect, useState, type FormEvent } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Head from 'next/head'

export default function Profile() {
  const { data: session, status } = useSession()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [saved, setSaved] = useState(false)

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

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setSaved(false)
    const res = await fetch('/api/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, bio })
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  if (status === 'loading') return <div className="p-6 text-gray-500">Loading…</div>
  if (!session?.user)
    return (
      <div className="p-6">
        <p className="text-gray-700">
          Please{' '}
          <Link href="/login" className="font-semibold text-[#1583c2]">
            sign in
          </Link>{' '}
          to view your profile.
        </p>
      </div>
    )

  return (
    <>
      <Head>
        <title>Your Profile — WaterNews</title>
      </Head>

      <header className="bg-gradient-to-b from-[#0f6cad] via-[#0b5d95] to-[#0a4f7f] px-4 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="m-0 text-3xl font-extrabold leading-tight md:text-5xl">
            Author Profile
          </h1>
          <p className="max-w-3xl text-sm opacity-95 md:text-base">
            Update your display name and bio shown on articles.
          </p>
        </div>
      </header>

      <main className="mx-auto my-10 max-w-5xl px-4 space-y-8">
        <section className="rounded-2xl bg-white p-6 shadow">
          <form onSubmit={save} className="grid gap-3">
            <label className="block">
              <span className="text-sm font-medium">Display name</span>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#1583c2] focus:ring-2 focus:ring-[#cfe6f7]"
                placeholder="Your display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Bio</span>
              <textarea
                className="mt-1 h-32 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#1583c2] focus:ring-2 focus:ring-[#cfe6f7]"
                placeholder="Short bio (shown under your articles)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </label>
            <div className="flex items-center gap-3">
              <button
                className="rounded-xl bg-[#1583c2] px-4 py-2 font-semibold text-white hover:brightness-110"
              >
                Save changes
              </button>
              {saved && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Saved
                </span>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-3 text-lg font-bold">Writer tools</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/newsroom"
              className="rounded-xl border border-slate-200 p-4 hover:shadow-md"
            >
              <div className="font-medium">Newsroom</div>
              <div className="text-sm text-slate-600">
                Create drafts, edit, and schedule posts
              </div>
            </Link>
            <Link
              href="/newsroom/posts"
              className="rounded-xl border border-slate-200 p-4 hover:shadow-md"
            >
              <div className="font-medium">My drafts</div>
              <div className="text-sm text-slate-600">
                View your published posts
              </div>
            </Link>
          </div>
        </section>

        <div>
          <Link href="/" className="font-semibold text-[#1583c2]">
            ← Back to Home
          </Link>
        </div>
      </main>
    </>
  )
}
