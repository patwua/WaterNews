import type { NextApiRequest, NextApiResponse } from 'next'
import { mockArticles, mockTrending, mockDiaspora } from '../../data/mockContent'

type Scored<T> = T & {
  score: number
  titleHTML?: string
  summaryHTML?: string
}

function editDistance(a: string, b: string): number {
  a = a.toLowerCase(); b = b.toLowerCase()
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = 0; i <= a.length; i++) dp[i][0] = i
  for (let j = 0; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,        // delete
        dp[i][j - 1] + 1,        // insert
        dp[i - 1][j - 1] + cost  // replace
      )
    }
  }
  return dp[a.length][b.length]
}

function tokenize(q: string) {
  return q.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 6)
}

function containsCI(hay: string, needle: string) {
  return hay.toLowerCase().includes(needle.toLowerCase())
}

function startsWithWord(hay: string, needle: string) {
  const re = new RegExp(`\\b${escapeRegExp(needle)}`, 'i')
  return re.test(hay)
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlightHTML(text: string, qs: string[]): string {
  if (!text) return ''
  // Combine tokens into one regex for simple highlighting (case-insensitive)
  const safe = qs.map(escapeRegExp).join('|')
  if (!safe) return text
  return text.replace(new RegExp(`(${safe})`, 'gi'), '<mark>$1</mark>')
}

function scoreOne(title: string, summary: string, tags: string[], q: string) {
  const qs = tokenize(q)
  const titleLC = (title || '').toLowerCase()
  const sumLC = (summary || '').toLowerCase()
  const tagLC = (tags || []).map(t => (t || '').toLowerCase())

  let score = 0
  for (const t of qs) {
    // exact contains
    if (containsCI(titleLC, t)) score += 3.0
    if (containsCI(sumLC, t)) score += 1.5
    if (tagLC.some(tag => tag.includes(t))) score += 1.0

    // starts-with bonus
    if (startsWithWord(titleLC, t)) score += 1.0

    // fuzzy bonus with small edit distance
    const titleWords = titleLC.split(/\W+/).filter(Boolean)
    const sumWords = sumLC.split(/\W+/).filter(Boolean)
    const maxEd = t.length <= 5 ? 1 : 2
    const fuzzyHitTitle = titleWords.some(w => editDistance(w, t) <= maxEd)
    const fuzzyHitSummary = sumWords.some(w => editDistance(w, t) <= maxEd)
    if (fuzzyHitTitle) score += 1.0
    if (fuzzyHitSummary) score += 0.5
  }

  // exact phrase bonus
  const qlc = q.toLowerCase()
  if (qlc && titleLC.includes(qlc)) score += 2

  return score
}

function processBucket<T extends { title: string; summary?: string; tags?: string[] }>(
  bucket: T[],
  q: string,
  limit: number
): Scored<T>[] {
  const qs = tokenize(q)
  const arr: Scored<T>[] = bucket.map((a) => {
    const s = scoreOne(a.title, a.summary || '', a.tags || [], q)
    return {
      ...(a as any),
      score: s,
      titleHTML: highlightHTML(a.title, qs),
      summaryHTML: a.summary ? highlightHTML(a.summary.slice(0, 280), qs) : undefined
    }
  })
  arr.sort((a, b) => b.score - a.score)
  return arr.filter(a => a.score > 0).slice(0, limit)
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q as string || '').trim()
  if (!q) return res.status(400).json({ error: 'Missing query param q' })

  const articles = processBucket(mockArticles, q, 10)
  const trending = processBucket(mockTrending, q, 5)
  const diaspora = processBucket(mockDiaspora, q, 5)

  const count = articles.length + trending.length + diaspora.length
  res.status(200).json({ q, count, articles, trending, diaspora })
}
