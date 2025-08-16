import Link from 'next/link'

type Article = {
  _id?: string
  slug: string
  title: string
  image?: string
  summary?: string
  tags?: string[]
  engagement?: { likes: number; shares: number; comments: number }
  publishedAt?: string
}

export default function Hero({ articles, category }: { articles: Article[]; category: string | null }) {
  if (!articles?.length) return null
  const top = pickTop(articles, category, 3)
  const main = top[0]
  const side = top.slice(1)

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* main card */}
      <Link href={`/article/${main.slug}`} className="md:col-span-2 block group">
        <div className="relative overflow-hidden rounded-lg border bg-white">
          {main.image && <img src={main.image} alt={main.title} className="w-full h-64 md:h-80 object-cover group-hover:scale-[1.01] transition" />}
          <div className="p-3">
            {category && <div className="text-xs font-semibold uppercase text-blue-700 mb-1">{category}</div>}
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">{main.title}</h2>
            {main.summary && <p className="text-gray-700 mt-2 line-clamp-2">{main.summary}</p>}
          </div>
        </div>
      </Link>
      {/* side cards */}
      <div className="grid grid-rows-2 gap-3">
        {side.map(s => (
          <Link key={s.slug} href={`/article/${s.slug}`} className="block group">
            <div className="overflow-hidden rounded-lg border bg-white">
              {s.image && <img src={s.image} alt={s.title} className="w-full h-36 object-cover" />}
              <div className="p-3">
                <h3 className="text-lg font-bold leading-snug">{s.title}</h3>
                {s.summary && <p className="text-gray-700 text-sm line-clamp-2 mt-1">{s.summary}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function pickTop(list: Article[], category: string | null, n: number): Article[] {
  // score: recency (0..1) + engagement (0..1) + category bonus (0 or 0.25)
  const now = Date.now()
  const scored = list.map(a => {
    const likes = a.engagement?.likes ?? 0
    const shares = a.engagement?.shares ?? 0
    const comments = a.engagement?.comments ?? 0
    const e = likes + shares + comments
    // normalize engagement roughly: map 0..300+ to 0..1
    const engagementScore = Math.min(1, e / 300)
    let recencyScore = 0.5
    if (a.publishedAt) {
      const ageHrs = Math.max(1, (now - new Date(a.publishedAt).getTime()) / 36e5)
      // 0h -> 1.0 ; 48h -> ~0.2
      recencyScore = Math.max(0, Math.min(1, 1 / Math.log10(ageHrs + 1.5)))
    }
    const hasCat = !!(category && (a.tags || []).some(t => (t || '').toLowerCase() === category.toLowerCase()))
    const categoryBonus = hasCat ? 0.25 : 0
    const score = 0.55 * recencyScore + 0.35 * engagementScore + categoryBonus
    return { a, score }
  })
  scored.sort((x, y) => y.score - x.score)
  return scored.slice(0, Math.max(1, n)).map(s => s.a)
}
