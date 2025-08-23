import React, { useEffect, useState } from "react";
import Link from "next/link";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";

export default function NoticeBoard() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/api/newsroom/notice");
        const d = await r.json();
        if (mounted) setItems(d?.items || []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Page
      title="Notice Board"
      subtitle="Internal posts for authors and editors."
      actions={<Link href="/newsroom" className="px-3 py-2 rounded-md border hover:bg-gray-50">Back to Publisher</Link>}
    >
      <SectionCard>
        {loading ? (
          <p className="text-gray-600">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-gray-600">No notices yet.</p>
        ) : (
          <ul className="divide-y">
            {items.map((n) => (
              <li key={n._id} className="py-3">
                <div className="font-medium">{n.title || "Notice"}</div>
                <p className="text-sm text-gray-700 mt-1">{n.body}</p>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </Page>
  );
}
