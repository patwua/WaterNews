import Link from 'next/link'

type Article = {
  _id?: string
  slug: string
  title: string
  image?: string
  summary?: string
  tags?: string[]
}

export default function Hero({ articles, category }: { articles: Article[]; category: string | null }) {
  if (!articles?.length) return null
  const top = articles.slice(0, 3)
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
