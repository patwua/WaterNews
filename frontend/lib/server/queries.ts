import Post from "@/models/Post";

export async function getBreaking(limit = 10) {
  return Post.find({ isBreaking: true }).sort({ publishedAt: -1 }).limit(limit).lean();
}

export async function getHeroBundle() {
  const rail = await Post.find({}).sort({ engagementScore: -1, publishedAt: -1 }).limit(4).lean();
  return { primary: rail[0] || null, rail: rail.slice(1) };
}
