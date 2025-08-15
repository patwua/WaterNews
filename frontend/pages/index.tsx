import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'

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

export default function HomePage() {
  const router = useRouter()
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [trending, setTrending] = useState<Article[]>([])
  const [diaspora, setDiaspora] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [resultCount, setResultCount] = useState<number | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.get('/api/news/home')
        const data = res?.data || {}
        const base = Array.isArray(data.articles) ? data.articles : []
        setAllArticles(base)
        setArticles(base)
        setTrending(Array.isArray(data.trending) ? data.trending : [])
        setDiaspora(Array.isArray(data.diaspora) ? data.diaspora : [])
        setResultCount(null)
      } catch (e) {
        // fail silently but render empty states
        console.error('Failed to load /api/news/home', e)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  // Instant client-side filter on URL ?q= and on 'type' events
  useEffect(() => {
    const q = (router.query.q as string || '').trim().toLowerCase()
    if (!q) { setArticles(allArticles); return }
    const filter = (a: Article) =>
      [a.title, a.summary, (a.tags || []).join(' ')].filter(Boolean).join(' ').toLowerCase().includes(q)
    setArticles(allArticles.filter(filter))
    setResultCount(null)
  }, [router.query.q, allArticles])

  useEffect(() => {
    const onType = (e: Event) => {
      const q = (e as CustomEvent<string>).detail || ''
      const lq = q.trim().toLowerCase()
      if (!lq) { setArticles(allArticles); return }
      const filter = (a: Article) =>
        [a.title, a.summary, (a.tags || []).join(' ')].filter(Boolean).join(' ').toLowerCase().includes(lq)
      setArticles(allArticles.filter(filter))
      setResultCount(null)
    }
    const onSubmit = async (e: Event) => {
      const q = (e as CustomEvent<string>).detail || ''
      if (!q) return
      try {
        const res = await axios.get('/api/search', { params: { q } })
        const data = res?.data || {}
        if (typeof data.count === 'number') setResultCount(data.count)
        if (Array.isArray(data.articles)) setArticles(data.articles)
        if (Array.isArray(data.trending)) setTrending(data.trending)
        if (Array.isArray(data.diaspora)) setDiaspora(data.diaspora)
      } catch (err) {
        console.error('Server search failed', err)
      }
    }
    window.addEventListener('wn-search-type' as any, onType as any)
    window.addEventListener('wn-search-submit' as any, onSubmit as any)
    return () => {
      window.removeEventListener('wn-search-type' as any, onType as any)
      window.removeEventListener('wn-search-submit' as any, onSubmit as any)
    }
  }, [allArticles])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 py-8 max-w-7xl mx-auto">
        <section className="md:col-span-3 space-y-8">
          {typeof resultCount === 'number' && (
            <div className="text-sm text-gray-600" aria-live="polite">
              {resultCount} results for ‘{(router.query.q as string) || ''}’
            </div>
          )}

          {loading && (
            <div className="text-gray-500 text-sm" role="status">Loading latest stories…</div>
          )}

          {!loading && articles.length === 0 && (
            <div className="text-gray-500 text-sm">
              No stories yet. Check back shortly.
            </div>
          )}

          {articles.map((article) => (
            <article key={article._id || article.slug} className="bg-white border rounded p-4 shadow-sm">
              <Link href={`/article/${article.slug}`}>
                <h2 className="text-2xl font-semibold mb-2 hover:underline cursor-pointer"
                    dangerouslySetInnerHTML={{ __html: (article as any).titleHTML || article.title }} />
              </Link>

              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-auto mb-4 rounded"
                />
              )}

              {article.summary && (
                <p className="text-gray-700 mb-3"
                   dangerouslySetInnerHTML={{ __html: (article as any).summaryHTML || article.summary }} />
              )}

              <div className="text-sm text-blue-600 space-x-2 mb-1">
                {Array.isArray(article.tags) &&
                  article.tags.map((tag) => (
                    <span key={tag} className="inline-block">#{tag}</span>
                  ))}
              </div>

              {article.engagement && (
                <div className="text-xs text-gray-500">
                  👍 {article.engagement.likes} | 🔁 {article.engagement.shares} | 💬 {article.engagement.comments}
                </div>
              )}
            </article>
          ))}
        </section>

        <aside className="space-y-6">
          <div className="bg-white border rounded p-4 shadow-sm">
            <h3 className="text-lg font-semibold border-b pb-2 mb-3">Trending Stories</h3>
            <ul className="space-y-3 text-sm">
              {trending.map((t) => (
                <li key={t._id || t.slug}>
                  <Link href={`/article/${t.slug}`} className="text-blue-700 hover:underline">
                    {t.title}
                  </Link>
                  {t.publishedAt && (
                    <div className="text-xs text-gray-400">{t.publishedAt}</div>
                  )}
                </li>
              ))}
              {trending.length === 0 && (
                <li className="text-gray-500">No trending stories yet.</li>
              )}
            </ul>
          </div>

          <div className="bg-white border rounded p-4 shadow-sm">
            <h3 className="text-lg font-semibold border-b pb-2 mb-3">Diaspora Highlights 🌍</h3>
            <ul className="space-y-3 text-sm">
              {diaspora.map((d) => (
                <li key={d._id || d.slug}>
                  <Link href={`/article/${d.slug}`} className="text-blue-700 hover:underline">
                    {d.title}
                  </Link>
                  {d.publishedAt && (
                    <div className="text-xs text-gray-400">{d.publishedAt}</div>
                  )}
                </li>
              ))}
              {diaspora.length === 0 && (
                <li className="text-gray-500">No diaspora stories yet.</li>
              )}
            </ul>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  )
}
