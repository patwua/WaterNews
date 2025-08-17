import Post from "@/models/Post";

/** Return breaking posts, including tag-based breaking. */
export async function getBreaking(limit = 10) {
  // Prefer explicit breaking flag or tags
  const breaking = await Post.find({
    $or: [
      { isBreaking: true },
      { tags: { $in: ["breaking", "#breaking", "alert", "#alert"] } },
    ],
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

  if (breaking.length > 0) return breaking;

  // Fallback: trending by engagement, newest first (keeps ticker populated)
  const trending = await Post.find({})
    .sort({ engagementScore: -1, publishedAt: -1 })
    .limit(limit)
    .lean();

  return trending;
}

export async function getHeroBundle() {
  const rail = await Post.find({})
    .sort({ engagementScore: -1, publishedAt: -1 })
    .limit(4)
    .lean();
  return { primary: rail[0] || null, rail: rail.slice(1) };
}
