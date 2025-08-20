import { getDb } from "@/lib/db";

export default async function handler(req, res) {
  try {
    const db = await getDb();
    if (!db) return res.status(200).json({ items: [] });
    const { q = "", status = "", assigned = "" } = req.query;
    const where = {};
    if (status && status !== "all") where.status = status;
    if (assigned === "me") {
      // TODO: resolve actual user email via auth
      where["assignedTo.email"] = "__your_email__";
    }
    if (q) {
      where.$or = [
        { title: { $regex: q, $options: "i" } },
        { body: { $regex: q, $options: "i" } }
      ];
    }
    const items = await db.collection("drafts").find(where).sort({ updatedAt: -1 }).limit(200).toArray();
    return res.status(200).json({ items });
  } catch (e) {
    console.error(e);
    return res.status(200).json({ items: [] });
  }
}
