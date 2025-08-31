import { getServerSession } from 'next-auth/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../../pages/api/auth/[...nextauth]';

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

export async function isCronAuthorized(req: NextApiRequest, res: NextApiResponse) {
  // Allow: signed-in admin
  const session = await getServerSession(req, res, authOptions);
  if (session && isAdminEmail((session.user as any)?.email)) return true;

  // Allow: Bearer token via WATERNEWS_CRON_SECRET only
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token && process.env.WATERNEWS_CRON_SECRET && token === process.env.WATERNEWS_CRON_SECRET)
    return true;

  return false;
}

