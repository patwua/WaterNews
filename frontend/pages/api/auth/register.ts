import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { dbConnect } from '../../../lib/mongodb'
import User from '../../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { name, email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  await dbConnect()
  const exists = await User.findOne({ email })
  if (exists) return res.status(409).json({ error: 'Email already in use' })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name: name || '', email, passwordHash })
  return res.status(201).json({ id: user._id, email: user.email })
}
