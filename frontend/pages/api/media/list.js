import { listMedia } from "@/lib/cloudinary";

export default async function handler(req, res) {
  try {
    const { cursor, prefix = "waternews" } = req.query;
    const r = await listMedia({ prefix, next_cursor: cursor || undefined, max_results: 40 });
    return res.status(200).json({ resources: r.resources || [], next_cursor: r.next_cursor || null });
  } catch (e) {
    console.error(e);
    return res.status(200).json({ resources: [], next_cursor: null });
  }
}
