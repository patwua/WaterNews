import { getDb } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, role, beats, samples = [], bio, portfolio } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

  const record = {
    name,
    email,
    role: role || null,
    beats: (beats || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    samples: Array.isArray(samples) ? samples : [],
    bio: bio || "",
    portfolio: portfolio || "",
    createdAt: new Date(),
    ref: "APL-" + Date.now().toString(36).toUpperCase(),
  };

  try {
    const db = await getDb();
    if (db) await db.collection("applications").insertOne(record);
    // (Optional) Add email dispatch here later
    return res.status(200).json({ ok: true, ref: record.ref });
  } catch (err) {
    console.error("apply-error", err);
    return res.status(500).json({ error: "Server error" });
  }
}
