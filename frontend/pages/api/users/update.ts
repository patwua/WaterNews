import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { dbConnect } from '../../../lib/mongodb'
import User from '../../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' })

  const { name, bio } = req.body || {}
  await dbConnect()
  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { $set: { name: name || '', bio: bio || '' } },
    { new: true }
  )
  return res.status(200).json({ ok: true, name: user?.name, bio: user?.bio })
}
