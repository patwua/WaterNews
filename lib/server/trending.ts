import { getDb } from "./db";

/**
 * Compute trending article order from streams_events with time decay.
 * - Half-life: 24h  (weight = exp(-ln2 * ageHours / 24))
 * - Base points:
 *   streams_view = 1
 *   streams_video_play = 2
 *   streams_video_complete = 4
 *   streams_focus (phase=end) contributes dwellMs / 5000  (≈1 point per 5s dwell)
 */
export async function getTrendingOrder(opts?: {
  hours?: number; // lookback window (default 48h)
  limit?: number; // number of slugs to return
  skip?: number; // pagination skip
}) {
  const hours = Math.max(1, Math.min(168, opts?.hours ?? 48)); // cap to 1..168h
  const limit = Math.max(1, Math.min(200, opts?.limit ?? 64));
  const skip = Math.max(0, opts?.skip ?? 0);
  const now = Date.now();
  const since = now - hours * 3600 * 1000;

  // Precomputed constant: -ln(2)/24 for 24h half-life
  const DECAY_PER_HOUR = -0.028881; // ≈ -ln(2)/24

  const db = await getDb();
  if (!db) return [];
  const coll = db.collection("streams_events");

  const rows = await coll
    .aggregate([
      { $match: { ts: { $gte: since } } },
      {
        $project: {
          slug: 1,
          ts: 1,
          type: 1,
          phase: 1,
          dwellMs: { $ifNull: ["$dwellMs", 0] },
          ageHours: { $divide: [{ $subtract: [now, "$ts"] }, 3600000] },
          base: {
            $switch: {
              branches: [
                { case: { $eq: ["$type", "streams_view"] }, then: 1 },
                { case: { $eq: ["$type", "streams_video_play"] }, then: 2 },
                { case: { $eq: ["$type", "streams_video_complete"] }, then: 4 },
                {
                  case: {
                    $and: [
                      { $eq: ["$type", "streams_focus"] },
                      { $eq: ["$phase", "end"] }
                    ]
                  },
                  then: { $divide: [{ $ifNull: ["$dwellMs", 0] }, 5000] }
                }
              ],
              default: 0
            }
          }
        }
      },
      {
        $project: {
          slug: 1,
          weighted: {
            $multiply: [
              "$base",
              { $exp: { $multiply: ["$ageHours", DECAY_PER_HOUR] } }
            ]
          }
        }
      },
      { $group: { _id: "$slug", score: { $sum: "$weighted" } } },
      { $sort: { score: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: { _id: 0, slug: "$_id", score: 1 } }
    ])
    .toArray();

  return rows as Array<{ slug: string; score: number }>;
}
