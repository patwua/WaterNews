import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Hero from '../components/Hero'
import MasonryFeed from '../components/MasonryFeed'
import { getFollowedAuthors, getFollowedTags, toggleFollowAuthor, toggleFollowTag, syncFollowsIfAuthed, pushServerFollows } from '../utils/follow'

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

  useEffect(() => {
    if (typeof window === 'undefined') return
    setFollowAuthors(getFollowedAuthors())
    setFollowTags(getFollowedTags())
    // best-effort sync with server (if logged in)
    syncFollowsIfAuthed().then(() => {
      setFollowAuthors(getFollowedAuthors())
      setFollowTags(getFollowedTags())
      if (activeSort === 'following') applyMenuAndCategory(allArticles, activeSort, activeCategory)
    })
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
      <div className="px-3 py-4 md:px-4 max-w-7xl mx-auto">
        {/* Contextual hero */}
        <Hero
          category={activeCategory}
          articles={
            (activeCategory
              ? articles.filter(a => (a.tags || []).some(t => (t || '').toLowerCase() === activeCategory!.toLowerCase()))
              : articles
            ).slice(0, 6)
          }
        />

        {/* Results banner (when server search) */}
        {typeof resultCount === 'number' && (
          <div className="text-xs text-gray-600 mt-3 mb-2" aria-live="polite">
            {resultCount} results for ‘{(router.query.q as string) || ''}’
          </div>
        )}

        {/* Tight masonry feed (little padding) */}
        {loading
          ? <div className="text-gray-500 text-sm mt-4" role="status">Loading latest stories…</div>
          : <div className="mt-3">
              <MasonryFeed items={articles} />
            </div>
        }
      </div>
    </div>
  )
}
