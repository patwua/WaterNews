// Minimal privacy-aware redactor + stable hash
export function redact(input: string): string {
  if (!input) return "";
  let text = input;

  // Remove emails/phones/ids
  text = text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "〈email〉");
  text = text.replace(/\+?\d[\d\s\-().]{7,}\d/g, "〈phone〉");
  text = text.replace(/\b(GYD|\$|USD)?\s?\d[\d,]*(\.\d+)?\b/g, m => m.replace(/\d/g, "#"));

  // Strip URLs
  text = text.replace(/\bhttps?:\/\/\S+/gi, "〈url〉");

  // Collapse whitespace
  return text.replace(/\s+/g, " ").trim();
}

export function stableHash(s: string): string {
  // Simple FNV-1a 32-bit
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return ("00000000" + h.toString(16)).slice(-8);
}
