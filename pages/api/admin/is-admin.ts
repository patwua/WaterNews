import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { isAdminEmail } from '../../../lib/server/cron-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const email = (session?.user as any)?.email as string | undefined;
  const isAdmin = isAdminEmail(email);
  return res.status(200).json({ isAdmin });
}
