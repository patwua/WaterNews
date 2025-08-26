// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { checkRateLimit } from '@/lib/rate-limit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const ok = await checkRateLimit({
    req,
    key: 'newsroom:assistant:rewrite',
    max: 20,
    windowMs: 60_000
  });
  if (!ok) return res.status(429).json({ error: 'Slow down' });
  const { text = '', mode = 'concise' } = req.body || {};
  const src = String(text || '').trim();
  if (!src) return res.status(400).json({ error: 'text required' });
  let out = src;
  if (mode === 'concise') {
    out = concise(src);
  } else if (mode === 'neutral') {
    out = neutral(src);
  } else if (mode === 'seo_headline') {
    out = seoHeadline(src);
  } else if (mode === 'summarize') {
    out = summarize(src);
  }
  res.json({ text: out });
}

function concise(s) {
  // Collapse whitespace, remove filler words, trim length
  const stop = /\b(just|really|very|that|quite|actually|basically|literally|kind of|sort of|some|many)\b/gi;
  let t = s.replace(/\s+/g, ' ').replace(stop, '').replace(/\s{2,}/g, ' ').trim();
  if (t.length > 600) t = t.slice(0, 600).replace(/[,;:]?\s+\S*$/, '…');
  return t;
}
function neutral(s) {
  let t = s.replace(/[!]+/g, '.').replace(/\b(awful|terrible|amazing|incredible|disaster|catastrophe)\b/gi, (m)=> {
    const map = { awful:'poor', terrible:'poor', amazing:'notable', incredible:'notable', disaster:'setback', catastrophe:'setback' };
    return map[m.toLowerCase()] || m;
  });
  t = t.replace(/\b(always|never)\b/gi, (m)=> m.toLowerCase()==='always'?'often':'rarely');
  return t;
}
function seoHeadline(s) {
  // Take first clause, Title Case-ish, <= 60 chars
  let t = s.split(/[.\n]/)[0].trim();
  t = t.replace(/[:;,\-–—]+/g, ' ').replace(/\s{2,}/g, ' ');
  const small = new Set(['a','an','the','and','or','but','for','nor','on','at','to','from','by','of','in','with']);
  t = t.split(' ').map((w,i)=> {
    const lw = w.toLowerCase();
    if (i>0 && small.has(lw)) return lw;
    return lw.charAt(0).toUpperCase()+lw.slice(1);
  }).join(' ');
  if (t.length > 60) t = t.slice(0, 57) + '…';
  return t;
}
function summarize(s) {
  // Naive one-sentence extractor
  const m = s.match(/[^.!?]+[.!?]/);
  return (m ? m[0] : s.split('\n')[0]).trim();
}
