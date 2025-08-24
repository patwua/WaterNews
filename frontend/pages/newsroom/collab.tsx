import React, { useEffect, useState } from "react";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import Callout from "@/components/UX/Callout";

type Draft = {
  _id: string;
  title?: string;
  collabVisible?: boolean;
  updatedAt?: string;
  author?: any;
};

export default function Collab() {
  const [mine, setMine] = useState<Draft[]>([]);
  const [network, setNetwork] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Assume /api/newsroom/drafts?mine=1 and /api/newsroom/collab/assist list network-visible
        const [r1, r2] = await Promise.all([
          fetch("/api/newsroom/drafts?mine=1"),
          fetch("/api/newsroom/collab/assist"),
        ]);
        const d1 = await r1.json();
        const d2 = await r2.json();
        if (!alive) return;
        setMine(Array.isArray(d1?.items) ? d1.items : []);
        setNetwork(Array.isArray(d2?.items) ? d2.items : []);
      } catch {
        if (!alive) return;
        setMine([]);
        setNetwork([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function toggle(id: string, on: boolean) {
    setBusy(id);
    try {
      const r = await fetch("/api/newsroom/collab/toggle-visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: id, visible: on }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Failed");
      setMine((prev) => prev.map((x) => (x._id === id ? { ...x, collabVisible: on } : x)));
    } catch (e: any) {
      alert(e.message || "Failed");
    } finally {
      setBusy(null);
    }
  }

  async function offerHelp(id: string) {
    setBusy(id);
    try {
      const r = await fetch("/api/newsroom/collab/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: id }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Failed");
      alert("Offer sent to the author.");
    } catch (e: any) {
      alert(e.message || "Failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Page
      title="Collaboration"
      subtitle="Invite help or offer to collaborate on works-in-progress"
    >
      <div className="grid gap-6">
        <Callout variant="info">
          Toggle visibility to let other authors discover and offer help on your draft.
        </Callout>
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="My drafts (visibility)">
            {loading ? (
              <div>Loading…</div>
            ) : mine.length === 0 ? (
              <div>No drafts yet.</div>
            ) : (
              <ul className="divide-y">
                {mine.map((d) => (
                  <li key={d._id} className="py-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {d.title || "Untitled"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated {new Date(d.updatedAt || Date.now()).toLocaleString()}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                      <label className="text-sm flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!d.collabVisible}
                          onChange={(e) => toggle(d._id, e.target.checked)}
                          disabled={busy === d._id}
                        />
                        Visible to network
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
          <SectionCard title="Network drafts">
            {loading ? (
              <div>Loading…</div>
            ) : network.length === 0 ? (
              <div>No network drafts yet.</div>
            ) : (
              <ul className="divide-y">
                {network.map((d) => (
                  <li key={d._id} className="py-3">
                    <div className="font-medium">{d.title || "Untitled"}</div>
                    <div className="text-xs text-gray-500">
                      by {d.author?.name || "Author"}
                    </div>
                    <div className="mt-2">
                      <button
                        className="text-sm px-3 py-2 rounded-md border hover:bg-gray-50"
                        onClick={() => offerHelp(d._id)}
                        disabled={busy === d._id}
                      >
                        {busy === d._id ? "Sending…" : "Offer help"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>
    </Page>
  );
}

