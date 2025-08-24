import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

async function who(req) {
  try {
    const session = await getServerSession(req, null, authOptions);
    const email = session?.user?.email || null;
    return { email, id: session?.user?.id || null };
  } catch {
    return { email: null, id: req.headers["x-user-id"] || null };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { profilePhotoUrl, isOrganization } = req.body || {};
    if (!profilePhotoUrl) return res.status(400).json({ error: "Missing profilePhotoUrl" });

    const identity = await who(req);
    if (!identity.email && !identity.id) return res.status(401).json({ error: "Unauthorized" });

    const db = await getDb();
    const query = identity.id ? { _id: new ObjectId(String(identity.id)) } : { email: identity.email?.toLowerCase() };
    const $set = { profilePhotoUrl, ...(typeof isOrganization === "boolean" ? { isOrganization } : {}) };
    const result = await db.collection("users").updateOne(query, { $set });

    return res.status(200).json({ ok: true, modified: result.modifiedCount });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
