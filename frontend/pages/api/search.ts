import type { NextApiRequest, NextApiResponse } from 'next'
import { mockArticles, mockTrending, mockDiaspora } from '../../data/mockContent'

function match(q: string, text?: string) {
  if (!q || !text) return false
  return text.toLowerCase().includes(q.toLowerCase())
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q as string || '').trim()
  if (!q) {
    return res.status(400).json({ error: 'Missing query param q' })
  }

  const haystack = (a: any) =>
    [a.title, a.summary, (a.tags || []).join(' ')].filter(Boolean).join(' ')

  const articles = mockArticles.filter(a => match(q, haystack(a))).slice(0, 20)
  const trending = mockTrending.filter(a => match(q, haystack(a))).slice(0, 10)
  const diaspora = mockDiaspora.filter(a => match(q, haystack(a))).slice(0, 10)

  res.status(200).json({ q, articles, trending, diaspora })
}
