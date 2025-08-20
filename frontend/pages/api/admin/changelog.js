// Simple JSON export hook for your in-app changelog or to stitch external notes.
export default async function handler(_req, res) {
  // This is a static placeholder. If you later persist a changelog collection,
  // you can read from Mongo here.
  const items = [
    { ver: "Rev.3 Patch 7d", ts: new Date().toISOString(), notes: "Type/Build cleanup + API changelog export." },
  ];
  res.status(200).json({ ok: true, items });
}
