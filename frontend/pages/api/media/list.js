// Guarded require so installs without the SDK return 503 gracefully
let cloudinary;
try {
  // Defer to runtime; avoids type resolution during build/typecheck
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  cloudinary = require('cloudinary').v2;
  require('@/lib/cloudinary'); // keep your config side-effects
} catch (_) {
  cloudinary = null;
}

export default async function handler(req, res) {
  if (!cloudinary || !process.env.CLOUDINARY_URL) {
    res.status(503).json({ error: 'Media service unavailable' });
    return;
  }
  const { q, nextCursor } = req.query;
  const search = q ? `filename:${q} OR tags:${q}` : "";
  const result = await cloudinary.search
    .expression(search || "folder=waternews/*")
    .max_results(50)
    .next_cursor(nextCursor || undefined)
    .execute();
  res.json({ resources: result.resources, nextCursor: result.next_cursor || null });
}
