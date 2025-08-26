// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { screenComment } from '@/lib/moderation';

async function forwardToPatwua(payload) {
  const url = process.env.PATWUA_FORWARD_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.PATWUA_API_KEY ? { 'Authorization': `Bearer ${process.env.PATWUA_API_KEY}` } : {})
      },
      body: JSON.stringify(payload)
    }).catch(()=>{});
  } catch {}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();
  const col = db.collection('comments');
  await col.createIndex({ postSlug: 1, status: 1, createdAt: -1 });

  if (req.method === 'GET') {
    const { slug, all } = req.query || {};
    if (!slug) return res.status(400).json({ error: 'slug required' });
    const session = await getServerSession(req, res, authOptions);
    const email = session?.user?.email || null;
    const admin = email && ((await isAdminEmail(email)) || (await isAdminUser(email)));
    const query = { postSlug: String(slug), status: admin && all === '1' ? { $in: ['pending','approved','rejected'] } : 'approved' };
    const items = await col.find(query).sort({ createdAt: -1 }).limit(200).toArray();
    return res.json({ items });
  }

  if (req.method === 'POST') {
    if (String(process.env.COMMENTS_ENABLED || 'true') !== 'true') {
      return res.status(503).json({ error: 'Comments disabled' });
    }
    const requireLogin = String(process.env.COMMENTS_REQUIRE_LOGIN || 'true') === 'true';
    const session = await getServerSession(req, res, authOptions);
    const email = session?.user?.email || null;
    if (requireLogin && !email) return res.status(401).json({ error: 'Login required' });

    const { slug, body, parentId } = req.body || {};
    if (!slug || !body || String(body).trim().length < 3) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    const ok = await checkRateLimit({
      req,
      key: `comment:${slug}`,
      max: Number(process.env.COMMENTS_RATE_MAX || 5),
      windowMs: Number(process.env.COMMENTS_RATE_WINDOW_MS || 60000)
    });
    if (!ok) return res.status(429).json({ error: 'Too many comments, please slow down.' });

    const now = new Date().toISOString();
    const screened = screenComment(body);
    const doc = {
      postSlug: String(slug),
      body: String(body).slice(0, 5000),
      authorEmail: email || 'anonymous',
      parentId: parentId ? new ObjectId(String(parentId)) : null,
      // auto-approve only if clean; otherwise force pending
      status: screened.ok && String(process.env.COMMENTS_AUTO_APPROVE || 'false') === 'true' ? 'approved' : 'pending',
      toxicFlags: screened.flags,
      createdAt: now,
      updatedAt: now
    };
    const r = await col.insertOne(doc);
    const saved = { _id: r.insertedId, ...doc };
    // forward to Patwua (best effort)
    forwardToPatwua({ type: 'comment.created', data: saved }).catch(()=>{});
    return res.json(saved);
  }

  res.setHeader('Allow', 'GET,POST');
  res.status(405).end();
}
