import { getDb } from "@/lib/db";

// POST { topic: string, follow?: boolean }  |  GET ?topic=topic-slug
export default async function handler(req, res) {
  const db = await getDb().catch(() => null);
  if (!db) {
    // Graceful offline: act like success without persistence
    if (req.method === "POST") return res.status(200).json({ ok: true, persisted: false });
    if (req.method === "GET")  return res.status(200).json({ ok: true, following: false, items: [] });
    return res.status(405).json({ error: "Method not allowed" });
  }

  const col = db.collection("topic_follows");

  if (req.method === "POST") {
    const { topic, follow } = req.body || {};
    if (!topic || typeof topic !== "string") return res.status(400).json({ error: "topic required" });
    // Anonymous device scope by cookie `wn_did`; users (staff) could be joined later if needed
    const did = (req.cookies && req.cookies.wn_did) || null;
    const key = { topic, did };
    if (follow === false) {
      await col.deleteOne(key);
      return res.status(200).json({ ok: true, following: false });
    }
    await col.updateOne(key, { $set: { topic, did, ts: new Date() } }, { upsert: true });
    return res.status(200).json({ ok: true, following: true });
  }

  if (req.method === "GET") {
    const topic = (req.query && req.query.topic) || null;
    const did = (req.cookies && req.cookies.wn_did) || null;
    if (!topic) {
      const rows = await col.find({ did }).limit(200).toArray();
      return res.status(200).json({ ok: true, items: rows.map(r => r.topic) });
    }
    const one = await col.findOne({ topic, did });
    return res.status(200).json({ ok: true, following: !!one });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
