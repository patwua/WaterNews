export type Article = {
  _id: string
  title: string
  slug: string
  image?: string
  summary?: string
  tags?: string[]
  engagement?: { likes: number; shares: number; comments: number }
  publishedAt?: string
  authorId?: string
  authorName?: string
}

export const mockArticles: Article[] = [
  {
    _id: '1',
    title: 'India Showcases Tech at Biodiversity Summit 🇮🇳🌱',
    slug: 'india-tech-biodiversity',
    image: 'https://via.placeholder.com/800x400?text=India+Summit',
    summary: 'India presented eco-tech innovations during the global biodiversity summit, highlighting sustainability solutions.',
    tags: ['India', 'Science'],
    authorId: 'auth-india',
    authorName: 'Priya Deshmukh',
    engagement: { likes: 145, shares: 72, comments: 18 }
  },
  {
    _id: '2',
    title: 'President Ali launches Clean Energy Initiative 🌿⚡',
    slug: 'ali-clean-energy',
    image: 'https://via.placeholder.com/800x400?text=Clean+Energy+Plan',
    summary: 'President Irfaan Ali unveils a bold renewable energy policy aiming to transform Guyana’s energy sector by 2030.',
    tags: ['GreenEnergy', 'Guyana', 'Politics'],
    authorId: 'auth-ali',
    authorName: 'WaterNews Desk',
    engagement: { likes: 240, shares: 108, comments: 36 }
  },
  {
    _id: '3',
    title: 'Guyanese Artists Win Big at Caribbean Awards 🖌️🏆',
    slug: 'guyanese-artists-awards',
    image: 'https://via.placeholder.com/800x400?text=Caribbean+Awards',
    summary: 'Guyanese artists were among top winners celebrated at a Caribbean regional awards ceremony.',
    tags: ['Culture', 'Art', 'Awards', 'Entertainment'],
    authorId: 'auth-culture',
    authorName: 'Alicia Persaud',
    engagement: { likes: 98, shares: 44, comments: 12 }
  }
]

export const mockTrending: Article[] = [
  { _id: 't1', title: 'Georgetown Fire Destroys Historic Market', slug: 'fire-historic-market', publishedAt: '2h ago' },
  { _id: 't2', title: 'CARICOM Pushes Regional Food Security Plan', slug: 'caricom-food-security', publishedAt: '6h ago' }
]

export const mockDiaspora: Article[] = [
  { _id: 'd1', title: 'Guyanese Parade Electrifies Queens, NY', slug: 'guyanese-parade-ny', publishedAt: '8h ago' },
  { _id: 'd2', title: 'Toronto Hosts Caribbean Women’s Leadership Gala', slug: 'toronto-caribbean-leaders', publishedAt: '12h ago' }
]
