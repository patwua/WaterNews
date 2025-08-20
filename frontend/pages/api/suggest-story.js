import formidable from "formidable";
import { MongoClient } from "mongodb";

// Tell Next.js we’re handling multipart ourselves
export const config = { api: { bodyParser: false } };

async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({ multiples: true, keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  try {
    const { fields, files } = await parseForm(req);
    const tip = {
      name: String(fields.name || "").trim(),
      email: String(fields.email || "").trim(),
      phone: String(fields.phone || "").trim(),
      anonymous: String(fields.anonymous || "") === "on" || fields.anonymous === true,
      story: String(fields.story || "").trim(),
      attachments: files?.media
        ? []
            .concat(files.media)
            .map((f) => ({
              filepath: f.filepath,
              mimetype: f.mimetype,
              size: f.size,
              originalFilename: f.originalFilename,
            }))
        : [],
      createdAt: new Date(),
    };

    // Frontend also enforces these; double‑check on server
    if (!tip.name) return res.status(400).json({ ok: false, error: "Name is required for verification." });
    if (!tip.email) return res.status(400).json({ ok: false, error: "Email is required." });
    if (!tip.story) return res.status(400).json({ ok: false, error: "Story is required." });

    // Write to Mongo if configured; otherwise stub success
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (uri) {
      const client = await MongoClient.connect(uri);
      const db = client.db(process.env.MONGO_DB || "waternews");
      await db.collection("tips").insertOne(tip);
      await client.close();
    }

    // Email alerts intentionally deferred (Rev.3.X).
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
