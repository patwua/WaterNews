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
        <div key={`block-${key}`} className="break-inside-avoid bg-blue-50 text-blue-900 font-semibold px-3 py-2 rounded">
          {label}
        </div>
      )
    }
    cards.push(<Card key={a._id || a.slug} a={a} />)
  })

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 [column-fill:_balance]">
      {cards}
    </div>
  )
}

function Card({ a }: { a: Article }) {
  return (
    <article className="mb-3 break-inside-avoid rounded border bg-white overflow-hidden">
      {a.image && <img src={a.image} alt="" className="w-full object-cover" />}
      <div className="p-2">
        <Link href={`/article/${a.slug}`} className="block">
          <h3 className="text-base font-semibold leading-snug hover:underline"
              dangerouslySetInnerHTML={{ __html: (a as any).titleHTML || a.title }} />
        </Link>
        {a.summary && (
          <p className="text-sm text-gray-700 mt-1"
             dangerouslySetInnerHTML={{ __html: (a as any).summaryHTML || a.summary }} />
        )}
        {Array.isArray(a.tags) && (
          <div className="mt-1 flex flex-wrap gap-1 text-xs text-blue-700">
            {a.tags.map(t => <span key={t}>#{t}</span>)}
          </div>
        )}
      </div>
    </article>
  )
}
