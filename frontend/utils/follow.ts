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

// --- Server sync helpers (no dependency on next-auth hooks; just try/catch)
export async function loadServerFollows(): Promise<{ authors: string[]; tags: string[] } | null> {
  try {
    const res = await fetch('/api/follow')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function pushServerFollows(): Promise<void> {
  try {
    const authors = Array.from(readSet(AUTHORS_KEY))
    const tags = Array.from(readSet(TAGS_KEY))
    await fetch('/api/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authors, tags })
    })
  } catch {}
}

export async function syncFollowsIfAuthed(): Promise<void> {
  // If GET returns 401, user not logged in — do nothing.
  const server = await loadServerFollows()
  if (!server) return
  // Merge: union server + local (local wins additions)
  const localAuthors = readSet(AUTHORS_KEY); for (const a of server.authors || []) localAuthors.add(a)
  const localTags = readSet(TAGS_KEY); for (const t of (server.tags || [])) localTags.add((t || '').toLowerCase())
  writeSet(AUTHORS_KEY, localAuthors)
  writeSet(TAGS_KEY, localTags)
  // Push merged back to server
  await pushServerFollows()
}

let bootMerged = false;
let bootTimer: any;

export async function mergeFollowsOnBoot(fetchServerList: ()=>Promise<string[]>, readLocalList: ()=>string[], writeLocalList: (ids: string[])=>void) {
  if (bootMerged) return;
  bootMerged = true;

  const run = async () => {
    const [server, local] = await Promise.all([fetchServerList(), Promise.resolve(readLocalList())]);
    const set = new Set<string>([...server, ...local]);
    writeLocalList(Array.from(set));
  };

  clearTimeout(bootTimer);
  bootTimer = setTimeout(run, 120);
}
