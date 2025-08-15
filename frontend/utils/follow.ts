const AUTHORS_KEY = 'wn_follow_authors'
const TAGS_KEY = 'wn_follow_tags'

function readSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key)
    const arr = raw ? JSON.parse(raw) as string[] : []
    return new Set(arr)
  } catch {
    return new Set()
  }
}

function writeSet(key: string, set: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(set)))
  } catch {}
}

export function getFollowedAuthors(): Set<string> {
  return readSet(AUTHORS_KEY)
}
export function getFollowedTags(): Set<string> {
  return readSet(TAGS_KEY)
}

export function toggleFollowAuthor(id: string): boolean {
  const s = readSet(AUTHORS_KEY)
  let following: boolean
  if (s.has(id)) { s.delete(id); following = false } else { s.add(id); following = true }
  writeSet(AUTHORS_KEY, s)
  return following
}
export function toggleFollowTag(tag: string): boolean {
  const s = readSet(TAGS_KEY)
  const t = tag.trim().toLowerCase()
  let following: boolean
  if (s.has(t)) { s.delete(t); following = false } else { s.add(t); following = true }
  writeSet(TAGS_KEY, s)
  return following
}
