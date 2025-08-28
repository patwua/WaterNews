import React, { useEffect, useState } from "react";
import Image from "next/image";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import { withCloudinaryAuto } from "@/lib/media";

export default function Media() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadRecent() {
    setLoading(true);
    try {
      const r = await fetch("/api/newsroom/media/recent");
      const d = await r.json();
      setItems(d?.items || []);
    } finally {
      setLoading(false);
    }
  }
  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(`/api/media/list?q=${encodeURIComponent(q)}`);
      const d = await r.json();
      setItems(d?.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecent();
  }, []);

  return (
    <Page title="Media Library" subtitle="Search and reuse newsroom images and video.">
      <div className="grid gap-6">
        <SectionCard>
          <form onSubmit={onSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search library…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full px-3 py-2 rounded-md border"
            />
            <button className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900">Search</button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Shows recent items by default. Searches call Cloudinary only when you submit.
          </p>
        </SectionCard>
        <SectionCard>
          {loading ? (
            <p className="text-gray-600">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-gray-600">No media found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((m) => {
                const src = withCloudinaryAuto(m.secure_url || m.url);
                return (
                  <div key={m.asset_id || m.public_id} className="relative w-full aspect-square overflow-hidden rounded-lg ring-1 ring-gray-200">
                    <Image
                      src={src}
                      alt={m.public_id || "Media"}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    </Page>
  );
}
