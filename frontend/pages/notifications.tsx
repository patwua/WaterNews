import React, { useEffect, useState } from "react";
import Head from "next/head";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import Callout from "@/components/UX/Callout";
import { absoluteCanonical } from "@/lib/seo";

export default function NotificationsPage() {
  const [items, setItems] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/notifications");
        const d = await r.json();
        if (!alive) return;
        setItems(Array.isArray(d?.items) ? d.items : []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);
  return (
    <>
      <Head>
        <title>Notifications — WaterNews</title>
        <link rel="canonical" href={absoluteCanonical("/notifications")} />
      </Head>
      <Page title="Notifications" subtitle="Mentions, assignments, reviews, and publication updates.">
      <div className="grid gap-6">
        <Callout variant="info">Notifications appear here and in the bell menu. Older items may auto-archive.</Callout>
        <SectionCard>
          {loading && <div>Loading…</div>}
          {!loading && (!items || items.length === 0) && <div>No notifications yet.</div>}
          {!loading && items && (
            <ul className="divide-y">
              {items.map((n) => (
                <li key={n.id || n._id} className="py-3">
                  <div className="font-medium">{n.title || "Update"}</div>
                  <div className="text-sm text-gray-600">{n.message || n.body}</div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </Page>
    </>
  );
}
