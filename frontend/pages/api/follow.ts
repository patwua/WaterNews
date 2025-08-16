import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { dbConnect } from '../../lib/mongodb'
import User from '../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: any = await getServerSession(req, res, authOptions as any)
  if (!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' })
  await dbConnect()
  const email = session.user.email as string
  const user = await (User as any).findOne({ email }).exec()
  if (!user) return res.status(404).json({ error: 'User not found' })

  if (req.method === 'GET') {
    return res.status(200).json({
      authors: user.followedAuthors || [],
      tags: user.followedTags || []
    })
  }

  if (req.method === 'POST') {
    try {
      const body = (req.body || {}) as { authors?: string[]; tags?: string[] }
      const authors = Array.isArray(body.authors) ? body.authors : []
      const tags = Array.isArray(body.tags) ? body.tags : []
      // merge unique (case-insensitive for tags)
      const sAuthors = new Set([...(user.followedAuthors || []), ...authors])
      const norm = (t: string) => (t || '').toLowerCase()
      const sTags = new Set([...(user.followedTags || []).map(norm), ...tags.map(norm)])
      user.followedAuthors = Array.from(sAuthors)
      user.followedTags = Array.from(sTags)
      await user.save()
      return res.status(200).json({ authors: user.followedAuthors, tags: user.followedTags })
    } catch (e) {
      console.error('follow sync failed', e)
      return res.status(400).json({ error: 'Bad Request' })
    }
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).end('Method Not Allowed')
}
