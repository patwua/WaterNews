import { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { requireAdminSSR } from "@/lib/admin-guard";

interface SectionItem {
  id: string;
  enabled: boolean;
}

export default function AdminSections() {
  const [items, setItems] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/sections");
        const data = await res.json();
        if (!cancelled && Array.isArray(data.sections)) setItems(data.sections);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggle(id: string, current: boolean) {
    const next = !current;
    setItems(items.map((it) => (it.id === id ? { ...it, enabled: next } : it)));
    try {
      await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, enabled: next }),
      });
    } catch (e) {
      setItems(items.map((it) => (it.id === id ? { ...it, enabled: current } : it)));
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sections</h1>
      {loading ? (
        <div className="text-gray-500">Loading…</div>
      ) : (
        <ul className="space-y-2">
          {items.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between p-3 border rounded"
            >
              <span className="font-mono text-sm">{s.id}</span>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={s.enabled}
                  onChange={() => toggle(s.id, s.enabled)}
                />
                <span className="text-sm">{s.enabled ? "On" : "Off"}</span>
              </label>
            </li>
          ))}
          {!items.length && (
            <li className="text-gray-500">No sections found.</li>
          )}
        </ul>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const guard = await requireAdminSSR(ctx);
  if (guard.redirect) return guard;
  return { props: {} };
};

