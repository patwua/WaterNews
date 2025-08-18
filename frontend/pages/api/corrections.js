import { getDb } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url, name, email, issue, correction } = req.body || {};
  if (!url || !email || !issue || !correction) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const record = {
    url,
    name: name || "",
    email,
    issue,
    correction,
    createdAt: new Date(),
    status: "new",
    ref: "COR-" + Date.now().toString(36).toUpperCase(),
  };

  try {
    const db = await getDb();
    if (db) await db.collection("corrections").insertOne(record);
    // (Optional) Add email dispatch to corrections@waternewsgy.com here later
    return res.status(200).json({ ok: true, ref: record.ref });
  } catch (err) {
    console.error("corrections-error", err);
    return res.status(500).json({ error: "Server error" });
  }
}
