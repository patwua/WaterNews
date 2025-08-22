import { MongoClient, ObjectId } from "mongodb";
// If you already have a db util, swap this for it.
let client; async function db() {
  if (!client) client = new MongoClient(process.env.MONGODB_URI);
  if (!client.topology?.isConnected?.()) await client.connect();
  return client.db(process.env.MONGODB_DB || "waternews");
}

async function getUserId(req) {
  // Replace with your session logic. Fallback allows header for admin tooling.
  const id = req.headers["x-user-id"] || req.body?.userId;
  return id;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { profilePhotoUrl, isOrganization } = req.body || {};
    if (!profilePhotoUrl) return res.status(400).json({ error: "Missing profilePhotoUrl" });

    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const $set = { profilePhotoUrl, ...(typeof isOrganization === "boolean" ? { isOrganization } : {}) };
    const result = await (await db()).collection("users")
      .updateOne({ _id: new ObjectId(String(userId)) }, { $set });

    return res.status(200).json({ ok: true, modified: result.modifiedCount });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
