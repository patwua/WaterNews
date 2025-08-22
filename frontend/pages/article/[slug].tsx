import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios'
import { buildBreadcrumbsJsonLd, buildNewsArticleJsonLd, jsonLdScript } from '@/lib/seo'
import dynamic from 'next/dynamic'

const TrendingRail = dynamic(() => import('@/components/Recirculation/TrendingRail'), { ssr: false })
const ReactionBar = dynamic(() => import('@/components/Engagement/ReactionBar'), { ssr: false })
const CommentsBox = dynamic(() => import('@/components/Comments/CommentsBox'), { ssr: false })

export default function ArticlePage() {
  const router = useRouter()
  const { slug } = router.query
  const [article, setArticle] = useState<any>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get('/api/news/home') // temporary reuse
        const found = res.data.articles.find((a: any) => a.slug === slug)
        setArticle(found || null)
      } catch (err) {
        console.error('Failed to load article', err)
      }
    }

    if (slug) fetchArticle()
  }, [slug])

  if (!article) {
    return <div className="p-4 text-center text-gray-500">Loading or not found...</div>
  }

  const origin =
    typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_SITE_URL || 'https://www.waternewsgy.com'
      : window.location.origin
  const canonicalPath = `/article/${article.slug}`
  const breadcrumbs = buildBreadcrumbsJsonLd(origin, [
    { name: 'Home', url: '/' },
    { name: 'Articles', url: '/article' },
    { name: article.title, url: canonicalPath }
  ])
  const articleLd = buildNewsArticleJsonLd({
    origin,
    url: canonicalPath,
    headline: article.title,
    description: article.summary || undefined,
    image: article.image || undefined,
    datePublished: article.publishedAt || new Date().toISOString(),
    dateModified: article.updatedAt || undefined,
    section: article.section || undefined,
    keywords: Array.isArray(article.tags) ? article.tags : undefined,
    authorName: article.author?.name || undefined
  })

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbs, articleLd]) }}
        />
      </Head>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">{article.title}</h1>
        {article.image && <img src={article.image} alt={article.title} className="rounded w-full" />}
        <p className="text-gray-700">{article.summary}</p>

      <div className="text-sm text-blue-500 space-x-2">
        {article.tags?.map((tag: string) => <span key={tag}>#{tag}</span>)}
      </div>

      {article.engagement && (
        <div className="text-xs text-gray-500 pt-2">
          👍 {article.engagement.likes} | 🔁 {article.engagement.shares} | 💬 {article.engagement.comments}
        </div>
      )}
      <div className="mt-8">
        <ReactionBar slug={String(slug)} />
      </div>
      <div className="mt-8">
        <CommentsBox slug={String(slug)} />
      </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <TrendingRail />
      </div>
    </>
  )
}
