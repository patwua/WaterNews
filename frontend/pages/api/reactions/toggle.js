import { getDb } from '@/lib/db';

function getDeviceId(req, res) {
  const cookie = (req.headers.cookie || '').split(';').map(s=>s.trim()).find(s=>s.startsWith('wn_did='));
  let did = cookie ? cookie.split('=')[1] : '';
  if (!did) {
    did = Math.random().toString(36).slice(2) + Date.now().toString(36);
    res.setHeader('Set-Cookie', `wn_did=${did}; Path=/; Max-Age=31536000; SameSite=Lax`);
  }
  return did;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { slug, type } = req.body || {};
  if (!slug || !type) return res.status(400).json({ error: 'slug and type required' });
  const db = await getDb();
  const col = db.collection('reactions');
  const did = getDeviceId(req, res);
  const key = { slug, type, deviceId: did };
  const found = await col.findOne(key);
  if (found) {
    await col.deleteOne(key);
    return res.json({ toggled: false });
  }
  await col.updateOne(key, { $set: { createdAt: new Date().toISOString() } }, { upsert: true });
  return res.json({ toggled: true });
}
