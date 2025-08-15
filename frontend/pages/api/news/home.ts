import type { NextApiRequest, NextApiResponse } from 'next'
import { mockArticles, mockTrending, mockDiaspora } from '../../../data/mockContent'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    articles: mockArticles,
    trending: mockTrending,
    diaspora: mockDiaspora
  })
}
