import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { BellIcon } from './icons'
import { getFollowedAuthors, getFollowedTags } from '../utils/follow'

const LAST_VISIT_KEY = 'wn_last_visit'

type Article = {
  slug: string
  title: string
  image?: string
  tags?: string[]
  authorId?: string
  authorName?: string
  engagement?: { likes: number; shares: number; comments: number }
}

export default function NotificationsBellMenu() {
  const [open, setOpen] = useState(false)
  const [byAuthors, setByAuthors] = useState<Article[]>([])
  const [byTags, setByTags] = useState<Article[]>([])
  const [recs, setRecs] = useState<Article[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const [newCount, setNewCount] = useState(0)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return
      if (open && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const load = async () => {
    try {
      const res = await axios.get('/api/news/home')
      const data = res?.data || {}
      const all: Article[] = Array.isArray(data.articles) ? data.articles : []
      const fa = getFollowedAuthors()
      const ft = getFollowedTags()

      const authorHits = all.filter(a => a.authorId && fa.has(a.authorId)).slice(0, 5)
      const tagHits = all.filter(a => (a.tags || []).some(t => ft.has((t || '').toLowerCase()))).slice(0, 5)

      // simple recs: high engagement not in author/tag hits
      const taken = new Set([...authorHits.map(a => a.slug), ...tagHits.map(a => a.slug)])
      const recPool = all
        .filter(a => !taken.has(a.slug))
        .sort((x, y) => {
          const xs = (x.engagement?.likes || 0) + (x.engagement?.shares || 0) + (x.engagement?.comments || 0)
          const ys = (y.engagement?.likes || 0) + (y.engagement?.shares || 0) + (y.engagement?.comments || 0)
          return ys - xs
        })
        .slice(0, 5)

      setByAuthors(authorHits)
      setByTags(tagHits)
      setRecs(recPool)

      // since last visit
      const last = parseInt(localStorage.getItem(LAST_VISIT_KEY) || '0', 10)
      const since = (arr: Article[]) =>
        arr.filter(a => (data.now || Date.now()) && (a as any).publishedAt && new Date((a as any).publishedAt).getTime() > last).length
      const count = since(authorHits) + since(tagHits)
      setNewCount(count)
    } catch (e) {
      console.error('notifications load failed', e)
    }
  }

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next) load()
    if (!next) {
      // mark visit when closing
      try { localStorage.setItem(LAST_VISIT_KEY, String(Date.now())) } catch {}
      setNewCount(0)
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        className="p-2 rounded border border-gray-300 hover:bg-gray-100"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Notifications"
        title="Notifications"
      >
        <BellIcon className="w-5 h-5" />
        {newCount > 0 && (
          <span className="inline-flex items-center justify-center absolute -top-1 -right-1 text-[10px] leading-none px-1.5 py-[2px] rounded-full bg-red-600 text-white">
            {newCount > 9 ? '9+' : newCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[320px] bg-white border rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-[70vh] overflow-auto">
            <Section title="Latest from followed authors" items={byAuthors} />
            <Section title="New under your tags" items={byTags} />
            <Section title="You might like" items={recs} />
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, items }: { title: string; items: Article[] }) {
  if (!items.length) return null
  return (
    <div className="p-3 border-b last:border-b-0">
      <div className="text-xs font-semibold text-gray-600 mb-2">{title}</div>
      <ul className="space-y-2">
        {items.map(a => (
          <li key={a.slug} className="flex gap-2">
            {a.image && <img src={a.image} alt="" className="w-12 h-12 object-cover rounded" />}
            <div className="min-w-0">
              <Link href={`/article/${a.slug}`} className="text-sm font-medium hover:underline line-clamp-2">
                {a.title}
              </Link>
              {a.authorName && <div className="text-xs text-gray-500">by {a.authorName}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
