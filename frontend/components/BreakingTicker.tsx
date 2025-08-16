import { useEffect, useState } from 'react'
import axios from 'axios'

export default function BreakingTicker() {
  const [items, setItems] = useState<Array<{ title: string; slug: string }>>([])

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.get('/api/news/home')
        const articles = res?.data?.articles || []
        const trending = res?.data?.trending || []
        const TAGS = ['breaking', 'alert']
        const tagHits = (articles as any[])
          .filter(a => Array.isArray(a.tags) && a.tags.some((t: string) => TAGS.includes((t || '').toLowerCase())))
          .slice(0, 12)
        const pick = (tagHits.length ? tagHits : trending).slice(0, 12)
        setItems(pick.map((x: any) => ({ title: x.title, slug: x.slug })))
      } catch (e) {
        console.error('ticker load failed', e)
      }
    }
    run()
  }, [])

  if (!items.length) return null

  return (
    <div className="w-full bg-red-600 text-white text-sm overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-3 px-3 py-2">
        <span className="font-bold uppercase tracking-wide">Breaking</span>
        <div className="relative flex-1 overflow-hidden">
          <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite]">
            {items.map((it, i) => (
              <span key={it.slug || i} className="mx-4 opacity-95 hover:opacity-100">
                • {it.title}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
