export async function createPatwuaThread({ slug, title, excerpt, url }) {
  const endpoint = process.env.PATWUA_CREATE_THREAD_URL;
  if (!endpoint) return null;
  try {
    const r = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.PATWUA_API_KEY ? { Authorization: `Bearer ${process.env.PATWUA_API_KEY}` } : {})
      },
      body: JSON.stringify({ slug, title, excerpt, url })
    });
    if (!r.ok) return null;
    const d = await r.json();
    // Expect { threadUrl: "https://patwua.com/threads/abc123" }
    return d?.threadUrl || null;
  } catch {
    return null;
  }
}
