// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendEmail } from '@/lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' });
  const { email } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) return res.status(400).json({ error: 'Valid email required' });
  const ok = await checkRateLimit({
    req,
    key: `newsroom:invite:${session.user.email}`,
    max: 5,
    windowMs: 60_000
  });
  if (!ok) return res.status(429).json({ error: 'Too many invites, slow down.' });
  const subject = 'Invitation to write with WaterNews';
  const text = `You've been invited to join WaterNews. Visit ${process.env.NEXTAUTH_URL || 'https://waternews.onrender.com'}/login to get started.`;
  try {
    // Support both common signatures without TS syntax:
    // 1) sendEmail(to, subject, text/html)
    // 2) sendEmail({ to, subject, text })
    try { await sendEmail(email, subject, text); }
    catch {
      await sendEmail({ to: email, subject, text });
    }
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'Failed to send invite' });
  }
}
