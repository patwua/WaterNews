import Link from 'next/link'

type Article = {
  _id?: string
  slug: string
  title: string
  image?: string
  summary?: string
  tags?: string[]
  engagement?: { likes: number; shares: number; comments: number }
  titleHTML?: string
  summaryHTML?: string
}

export default function MasonryFeed({ articles }: { articles: Article[] }) {
  if (!articles?.length) return null

  // Inject simple category blocks every ~6 cards (based on first tag if any)
  const blocks: Array<{ key: string; label: string }> = []
  const cards: JSX.Element[] = []
  articles.forEach((a, i) => {
    if (i && i % 6 === 0) {
      const label = (a.tags && a.tags[0]) ? a.tags[0] : 'From the feed'
      const key = `${label}-${i}`
      blocks.push({ key, label })
      cards.push(
        <div key={`block-${key}`} className="break-inside-avoid bg-blue-50/70 text-blue-900 font-semibold px-2 py-1.5 rounded">
          {label}
        </div>
      )
    }
    cards.push(<Card key={a._id || a.slug} a={a} index={i} />)
  })

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-2 [column-fill:_balance]">
      {cards}
    </div>
  )
}

// Choose a card variant: tighter pack overall, with a mix of "headline-only" and "expanded"
// We use a deterministic hash so the same article renders the same way across sessions.
function variantFor(a: Article, index: number): 'headline' | 'compact' | 'expanded' {
  const seed = hashCode(a.slug || String(index))
  const engagement = (a.engagement?.likes || 0) + (a.engagement?.shares || 0) + (a.engagement?.comments || 0)
  // Highly engaged stories skew to expanded
  if (engagement > 250) return 'expanded'
  const r = (seed % 100 + 100) % 100
  if (r < 35) return 'headline'   // ~35% title-only
  if (r < 70) return 'compact'    // ~35% compact (few lines)
  return 'expanded'               // ~30% expanded
}

function Card({ a, index }: { a: Article, index: number }) {
  const v = variantFor(a, index)
  const showImage = !!a.image && v !== 'headline'
  const showSummary = !!a.summary && v !== 'headline'
  const summaryLines = v === 'compact' ? 2 : 4

  return (
    <article className="mb-2 break-inside-avoid rounded bg-white overflow-hidden border border-gray-100">
      {showImage && (
        <img src={a.image} alt="" className={`w-full object-cover ${v === 'expanded' ? 'max-h-64' : 'max-h-44'}`} />
      )}
      <div className={`px-2 ${v === 'headline' ? 'py-2' : 'py-2'}`}>
        <Link href={`/article/${a.slug}`} className="block">
          <h3
            className={[
              'leading-snug hover:underline',
              v === 'headline' ? 'text-base font-semibold' :
              v === 'compact' ? 'text-[15px] font-semibold' : 'text-lg font-bold'
            ].join(' ')}
            dangerouslySetInnerHTML={{ __html: (a as any).titleHTML || a.title }}
          />
        </Link>
        {showSummary && (
          <p
            className={[
              'text-gray-700 mt-1',
              v === 'compact' ? 'text-[13px]' : 'text-sm',
              `line-clamp-${summaryLines}`
            ].join(' ')}
            dangerouslySetInnerHTML={{ __html: (a as any).summaryHTML || a.summary }}
          />
        )}
        {Array.isArray(a.tags) && a.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-blue-700">
            {a.tags.slice(0, v === 'expanded' ? 6 : 3).map(t => <span key={t}>#{t}</span>)}
          </div>
        )}
      </div>
    </article>
  )
}

function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return h
}
