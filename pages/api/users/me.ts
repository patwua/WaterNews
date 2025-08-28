import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { dbConnect } from '../../../lib/mongodb'
import User from '../../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' })
  await dbConnect()
  const user = await User.findOne({ email: session.user.email })
  if (!user) return res.status(404).json({ error: 'Not found' })
  return res.status(200).json({ email: user.email, name: user.name, bio: user.bio, profilePhotoUrl: user.profilePhotoUrl, role: user.role })
}
