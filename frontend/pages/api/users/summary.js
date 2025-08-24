import { getDb } from "@/lib/db";

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const email = req.headers["x-user-email"];
    if (!email) return res.json({ me: null });
    const me = await db.collection("users").findOne(
      { email: String(email).toLowerCase() },
      { projection: { _id: 0, email: 1, displayName: 1, handle: 1, bio: 1, profilePhotoUrl: 1, isOrganization: 1 } }
    );
    return res.json({ me });
  } catch {
    return res.json({ me: null });
  }
}
