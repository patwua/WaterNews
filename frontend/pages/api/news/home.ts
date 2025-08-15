import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    articles: [{
      _id: '1',
      title: 'India Showcases Tech at Biodiversity Summit 🇮🇳🌱',
      slug: 'india-tech-biodiversity',
      image: 'https://via.placeholder.com/800x400?text=India+Summit',
      summary: 'India presented eco-tech innovations...',
      tags: ['India', 'Science'],
      engagement: { likes: 145, shares: 72, comments: 18 }
    }],
    trending: [{
      _id: 't1',
      title: 'Georgetown Fire Destroys Historic Market',
      slug: 'fire-historic-market',
      publishedAt: '2h ago'
    }],
    diaspora: [{
      _id: 'd1',
      title: 'Guyanese Parade Electrifies Queens, NY',
      slug: 'guyanese-parade-ny',
      publishedAt: '8h ago'
    }]
  });
}
