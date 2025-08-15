import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getFollowedAuthors, getFollowedTags, toggleFollowAuthor, toggleFollowTag } from '../utils/follow'

type Article = {
  _id?: string
  slug: string
  title: string
  image?: string
  summary?: string
  tags?: string[]
  engagement?: { likes: number; shares: number; comments: number }
  publishedAt?: string
  authorId?: string
  authorName?: string
}

export default function HomePage() {
  const router = useRouter()
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [trending, setTrending] = useState<Article[]>([])
  const [diaspora, setDiaspora] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [resultCount, setResultCount] = useState<number | null>(null)
  const [activeSort, setActiveSort] = useState<'latest' | 'trending' | 'following'>('latest')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [followAuthors, setFollowAuthors] = useState<Set<string>>(new Set())
  const [followTags, setFollowTags] = useState<Set<string>>(new Set())

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

  // Load follows on mount (client-side)
  useEffect(() => {
    if (typeof window === 'undefined') return
    setFollowAuthors(getFollowedAuthors())
    setFollowTags(getFollowedTags())
  }, [])

  // Instant client-side filter on URL ?q= and on 'type' events
  useEffect(() => {
    const q = (router.query.q as string || '').trim().toLowerCase()
    if (!q) {
      // If no query, reapply category/follow filters
      applyMenuAndCategory(allArticles, activeSort, activeCategory)
      return
    }
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
    const onMenu = (e: Event) => {
      const key = (e as CustomEvent<'latest'|'trending'|'following'>).detail
      setActiveSort(key)
      applyMenuAndCategory(allArticles, key, activeCategory)
    }
    const onCategory = (e: Event) => {
      const cat = (e as CustomEvent<string | null>).detail || null
      setActiveCategory(cat)
      applyMenuAndCategory(allArticles, activeSort, cat)
    }
    window.addEventListener('wn-search-type' as any, onType as any)
    window.addEventListener('wn-search-submit' as any, onSubmit as any)
    window.addEventListener('wn-menu-change' as any, onMenu as any)
    window.addEventListener('wn-category-change' as any, onCategory as any)
    return () => {
      window.removeEventListener('wn-search-type' as any, onType as any)
      window.removeEventListener('wn-search-submit' as any, onSubmit as any)
      window.removeEventListener('wn-menu-change' as any, onMenu as any)
      window.removeEventListener('wn-category-change' as any, onCategory as any)
    }
  }, [allArticles, activeCategory, activeSort])

  function applyMenuAndCategory(source: Article[], sort: 'latest'|'trending'|'following', category: string | null) {
    let list = [...source]
    if (category) {
      const cat = category.toLowerCase()
      list = list.filter(a => (a.tags || []).some(t => (t || '').toLowerCase() === cat))
    }
    if (sort === 'following') {
      const authors = getFollowedAuthors()
      const tags = getFollowedTags()
      list = list.filter(a => {
        const byAuthor = a.authorId ? authors.has(a.authorId) : false
        const byTag = (a.tags || []).some(t => tags.has((t || '').toLowerCase()))
        return byAuthor || byTag
      })
    }
    if (sort === 'trending') {
      list.sort((a, b) => {
        const as = (a.engagement?.likes || 0) + (a.engagement?.shares || 0) + (a.engagement?.comments || 0)
        const bs = (b.engagement?.likes || 0) + (b.engagement?.shares || 0) + (b.engagement?.comments || 0)
        return bs - as
      })
    }
    setArticles(list)
  }

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

              {(article.authorName || article.authorId) && (
                <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <span>by {article.authorName || 'Author'}</span>
                  {article.authorId && (
                    <button
                      className="px-2 py-0.5 text-xs rounded border border-gray-300 hover:bg-gray-50"
                      onClick={() => {
                        const followed = toggleFollowAuthor(article.authorId!)
                        setFollowAuthors(new Set(getFollowedAuthors()))
                        if (activeSort === 'following') applyMenuAndCategory(allArticles, activeSort, activeCategory)
                      }}
                    >
                      {followAuthors.has(article.authorId) ? 'Following' : 'Follow author'}
                    </button>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 text-sm mb-1">
                {Array.isArray(article.tags) &&
                  article.tags.map((tag) => {
                    const k = (tag || '').toLowerCase()
                    const on = followTags.has(k)
                    return (
                      <button
                        key={tag}
                        onClick={() => {
                          const followed = toggleFollowTag(tag)
                          setFollowTags(new Set(getFollowedTags()))
                          if (activeSort === 'following') applyMenuAndCategory(allArticles, activeSort, activeCategory)
                        }}
                        className={[
                          'px-2 py-0.5 rounded border',
                          on ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-gray-300 text-blue-600 hover:bg-blue-50'
                        ].join(' ')}
                        title={on ? 'Unfollow tag' : 'Follow tag'}
                      >
                        #{tag}
                      </button>
                    )
                  })}
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
