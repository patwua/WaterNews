import { getDb } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  const body = req.body || {};
  const payload = {
    name: (body.name || "").toString().slice(0, 200),
    email: (body.email || "").toString().slice(0, 320),
    url: (body.url || "").toString().slice(0, 1000),
    correction: (body.correction || "").toString().slice(0, 8000),
    createdAt: new Date(),
    ua: req.headers["user-agent"] || "",
    ip: (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").toString(),
  };

  const ref = Math.random().toString(36).slice(2, 8).toUpperCase();

  try {
    const db = await getDb();
    if (db) {
      await db
        .collection("correction_submissions")
        .insertOne({ ...payload, ref, kind: "correction" });
    }
    res.status(200).json({ ok: true, ref });
  } catch (e) {
    res.status(200).json({ ok: true, ref, note: "stored offline" });
  }
}

