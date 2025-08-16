export function readingTime(text: string, wpm = 200) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / wpm));
  return { words, minutes: mins };
}

