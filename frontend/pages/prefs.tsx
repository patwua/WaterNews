import { useEffect, useId, useMemo, useState } from 'react'
import Link from 'next/link'
import { getFollowedAuthors, getFollowedTags, toggleFollowAuthor, toggleFollowTag } from '@/utils/follow'

type Cadence = 'realtime' | 'daily' | 'off'
const CADENCE_KEY = 'wn_notify_cadence'

export default function PreferencesPage() {
  const [authors, setAuthors] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [cadence, setCadence] = useState<Cadence>('realtime')
  const [authorInput, setAuthorInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [json, setJson] = useState('')

  const cadenceId = useId()

  // Load from localStorage on mount
  useEffect(() => {
    try {
      setAuthors(Array.from(getFollowedAuthors()))
      setTags(Array.from(getFollowedTags()))
      const c = (localStorage.getItem(CADENCE_KEY) as Cadence) || 'realtime'
      setCadence(c)
    } catch {}
  }, [])

  const prefsJson = useMemo(() => {
    return JSON.stringify(
      {
        authors,
        tags,
        cadence
      },
      null,
      2
    )
  }, [authors, tags, cadence])

  const addAuthor = () => {
    const v = authorInput.trim()
    if (!v) return
    const following = toggleFollowAuthor(v)
    setAuthors((list) => {
      const set = new Set(list)
      if (following) set.add(v)
      else set.delete(v)
      return Array.from(set)
    })
    setAuthorInput('')
  }

  const removeAuthor = (id: string) => {
    const following = toggleFollowAuthor(id) // toggles off if present
    if (!following) setAuthors(list => list.filter(a => a !== id))
  }

  const addTag = () => {
    const v = tagInput.trim().toLowerCase().replace(/^#/, '')
    if (!v) return
    const following = toggleFollowTag(v)
    setTags((list) => {
      const set = new Set(list)
      if (following) set.add(v)
      else set.delete(v)
      return Array.from(set)
    })
    setTagInput('')
  }

  const removeTag = (t: string) => {
    const following = toggleFollowTag(t) // toggles off if present
    if (!following) setTags(list => list.filter(x => x !== t))
  }

  const saveCadence = (c: Cadence) => {
    setCadence(c)
    try { localStorage.setItem(CADENCE_KEY, c) } catch {}
  }

  const doExport = () => {
    setJson(prefsJson)
  }

  const doImport = () => {
    try {
      const data = JSON.parse(json || '{}')
      const importedAuthors: string[] = Array.isArray(data.authors) ? data.authors : []
      const importedTags: string[] = Array.isArray(data.tags) ? data.tags : []
      const importedCadence: Cadence = (['realtime','daily','off'].includes(data.cadence) ? data.cadence : 'realtime') as Cadence

      // Replace local sets with imported values
      // (Use utils to ensure consistent serialization)
      for (const a of authors) toggleFollowAuthor(a) // clear existing
      for (const t of tags) toggleFollowTag(t)
      for (const a of importedAuthors) if (a) toggleFollowAuthor(String(a))
      for (const t of importedTags) if (t) toggleFollowTag(String(t))

      setAuthors(Array.from(getFollowedAuthors()))
      setTags(Array.from(getFollowedTags()))
      saveCadence(importedCadence)
      alert('Imported preferences')
    } catch {
      alert('Invalid JSON — please check and try again')
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Preferences</h1>
        <p className="text-sm text-neutral-600">
          These settings are saved on this device only. No account required.
        </p>
      </header>

      {/* Followed authors */}
      <section className="rounded-2xl ring-1 ring-black/5 bg-white p-4 mb-4">
        <h2 className="text-lg font-semibold">Authors you follow</h2>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={authorInput}
            onChange={(e) => setAuthorInput(e.target.value)}
            placeholder="Add author (slug, name, or id)"
            className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
          />
          <button
            type="button"
            onClick={addAuthor}
            className="rounded-lg px-3 py-2 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
          >
            Add
          </button>
        </div>

        {authors.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-600">
            You’re not following any authors. Follow from an author page or add one above.
          </p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {authors.map((a) => (
              <li key={a} className="inline-flex items-center gap-2 rounded-full bg-neutral-100 text-neutral-800 px-3 py-1">
                <span className="text-sm">{a}</span>
                <button
                  type="button"
                  onClick={() => removeAuthor(a)}
                  className="text-xs text-neutral-600 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded"
                  aria-label={`Unfollow ${a}`}
                  title="Unfollow"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Followed tags */}
      <section className="rounded-2xl ring-1 ring-black/5 bg-white p-4 mb-4">
        <h2 className="text-lg font-semibold">Tags you follow</h2>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tag (e.g., #floods)"
            className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
          />
          <button
            type="button"
            onClick={addTag}
            className="rounded-lg px-3 py-2 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
          >
            Add
          </button>
        </div>

        {tags.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-600">
            You’re not following any tags. Try topics like <span className="font-medium">#floods</span> or <span className="font-medium">#infrastructure</span>.
          </p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {tags.map((t) => (
              <li key={t} className="inline-flex items-center gap-2 rounded-full bg-neutral-100 text-neutral-800 px-3 py-1">
                <span className="text-sm">#{t.replace(/^#/, '')}</span>
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  className="text-xs text-neutral-600 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded"
                  aria-label={`Unfollow ${t}`}
                  title="Unfollow"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Notification cadence */}
      <section className="rounded-2xl ring-1 ring-black/5 bg-white p-4 mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <label htmlFor={cadenceId} className="block text-sm font-medium">
          Cadence
        </label>
        <select
          id={cadenceId}
          className="mt-1 rounded-lg border px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
          value={cadence}
          onChange={(e) => saveCadence(e.target.value as Cadence)}
        >
          <option value="realtime">Realtime (site only)</option>
          <option value="daily">Daily summary (site only)</option>
          <option value="off">Off</option>
        </select>
        <p className="text-xs text-neutral-600 mt-1">
          Stored locally in your browser — not sent to a server.
        </p>
      </section>

      {/* Export / Import */}
      <section className="rounded-2xl ring-1 ring-black/5 bg-white p-4">
        <h2 className="text-lg font-semibold">Export / Import</h2>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={doExport}
            className="rounded-lg px-3 py-2 text-sm font-medium bg-white ring-1 ring-black/10 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
          >
            Export to JSON
          </button>
          <button
            type="button"
            onClick={doImport}
            className="rounded-lg px-3 py-2 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
          >
            Import from JSON
          </button>
        </div>
        <textarea
          className="mt-2 w-full min-h-[140px] rounded-lg border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
          placeholder="Paste exported JSON here…"
          value={json}
          onChange={(e) => setJson(e.target.value)}
        />
        <p className="text-xs text-neutral-600 mt-1">
          Tip: Export on one device and import on another to carry over your preferences.
        </p>
      </section>

      <div className="mt-6">
        <Link href="/" className="text-blue-700 underline">← Back to Home</Link>
      </div>
    </main>
  )
}

