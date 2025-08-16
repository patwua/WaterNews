// Zero-dep similarity based on tags + title tokens
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
