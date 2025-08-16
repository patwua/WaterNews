// Zero-dep similarity based on tags + title tokens, plus optional affinity boosts
export function tokenizeTitle(title: string): string[] {
  return (title || "")
    .toLowerCase()
  .replace(/['"]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map(t => (t.length > 24 ? t.slice(0, 24) : t));
}

export function scoreRelated(
  aTitle: string,
  aTags: string[],
  bTitle: string,
  bTags: string[]
): number {
  const aT = new Set(tokenizeTitle(aTitle));
  const bT = new Set(tokenizeTitle(bTitle));
  const aG = new Set((aTags || []).map(t => t.toLowerCase()));
  const bG = new Set((bTags || []).map(t => t.toLowerCase()));

  // Jaccard components
  const titleInter = [...aT].filter(x => bT.has(x)).length;
  const tagInter = [...aG].filter(x => bG.has(x)).length;

  const titleUnion = new Set([...aT, ...bT]).size || 1;
  const tagUnion = new Set([...aG, ...bG]).size || 1;

  const titleScore = titleInter / titleUnion; // 0..1
  const tagScore = tagInter / tagUnion;       // 0..1

  // Weighted blend (favor tags slightly)
  return 0.45 * titleScore + 0.55 * tagScore;
}

// New: apply affinity boosts for tags/authors and engagement
export function applyAffinityBoosts(base: number, opts: {
  postTags?: string[];
  postAuthorId?: string | null;
  affinityTags?: string[];
  affinityAuthors?: string[];
  engagementScore?: number | null;
}): number {
  let score = base;

  // Tag affinity: +0.05 per match, capped
  if (opts.affinityTags?.length && opts.postTags?.length) {
    const set = new Set(opts.affinityTags.map(t => t.toLowerCase()));
    const matches = opts.postTags.filter(t => set.has(String(t).toLowerCase())).length;
    score += Math.min(0.20, matches * 0.05);
  }

  // Author affinity: +0.12 if followed
  if (opts.affinityAuthors?.length && opts.postAuthorId) {
    const aSet = new Set(opts.affinityAuthors.map(x => String(x)));
    if (aSet.has(String(opts.postAuthorId))) score += 0.12;
  }

  // Engagement nudge (normalize around ~0..1k)
  if (typeof opts.engagementScore === "number") {
    const e = Math.max(0, Math.min(1, opts.engagementScore / 1000));
    score += 0.1 * e;
  }

  return score;
}
