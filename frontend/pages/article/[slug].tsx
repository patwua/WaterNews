import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'

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

  return (
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
    </div>
  )
}
