import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { urls } = req.body as { urls: string[] };
  if (!Array.isArray(urls)) return res.status(400).json({ error: "urls must be an array" });

  async function check(url: string) {
    const result: any = { url, status: 0, ok: false, hint: [] as string[] };
    try {
      let r = await fetch(url, { method: "HEAD" });
      if (!r.ok && r.status === 405) r = await fetch(url, { method: "GET" });
      result.status = r.status;
      result.ok = r.ok;
      const robots = r.headers.get("x-robots-tag") || "";
      if (robots.includes("noindex")) result.hint.push("noindex");
      if (robots.includes("nofollow")) result.hint.push("nofollow");
      if (!robots && r.headers.get("content-type")?.includes("text/html")) {
        const text = await r.text();
        const lower = text.toLowerCase();
        if (lower.includes("noindex")) result.hint.push("noindex");
        if (lower.includes("nofollow")) result.hint.push("nofollow");
      }
    } catch {
      result.status = 0;
      result.ok = false;
      result.hint.push("timeout");
    }
    return result;
  }

  const out = await Promise.all(urls.map(check));
  res.json({ results: out });
}

