// Very light content screen for comments
const BAD_WORDS: string[] = [
  // keep short & maintainable; extend as needed
  'fuck','shit','bitch','asshole','bastard','dick','cunt',
  'nigger','fag','whore','slut',
  'scam','crypto pump','loan shark','whatsapp','telegram'
];

export interface ScreenResult {
  ok: boolean;
  flags: string[];
}

export function screenComment(body: string): ScreenResult {
  const text = String(body || '').toLowerCase();
  const flags: string[] = [];

  // URL gate: >=3 links in one comment → hold for review
  const urlMatches = text.match(/\bhttps?:\/\/|\bwww\.|[a-z0-9-]+\.(com|net|org|xyz|ru|cn|io)\b/gi);
  if (urlMatches && urlMatches.length >= 3) flags.push('too_many_urls');

  // Profanity / phrases (word boundary where applicable)
  for (const w of BAD_WORDS) {
    const pat = new RegExp(`\\b${escapeRegExp(w)}\\b`,'i');
    if (pat.test(text)) {
      flags.push('profanity:' + w);
      break;
    }
  }

  return { ok: flags.length === 0, flags };
}

function escapeRegExp(s: string): string { return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
