import React, { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/UX/DashboardLayout";
import SectionCard from "@/components/UX/SectionCard";
import KPI from "@/components/UX/KPI";

export default function WriterDashboard() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/newsroom/stats");
        const d = await r.json();
        if (!alive) return;
        setStats(d || {});
      } catch {
        if (!alive) return;
        setStats({});
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <DashboardLayout title="Writer Dashboard" subtitle="Your newsroom overview">
      <div className="grid gap-6">
          <SectionCard id="writer-dashboard-stats">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPI title="Drafts" value={stats?.drafts ?? 0} data={stats?.spark?.drafts ?? []} />
            <KPI title="Scheduled" value={stats?.scheduled ?? 0} data={stats?.spark?.scheduled ?? []} />
            <KPI title="Published" value={stats?.published ?? 0} data={stats?.spark?.published ?? []} />
            <KPI
              title="Views (7d)"
              value={stats?.views7d ?? 0}
              delta={stats?.viewsDelta ?? 0}
              data={stats?.spark?.views ?? []}
            />
          </div>
        </SectionCard>
        <div className="grid lg:grid-cols-2 gap-6">
            <SectionCard id="writer-dashboard-actions" title="Quick actions">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/newsroom"
                className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900"
              >
                New draft
              </Link>
              <Link
                href="/newsroom/posts"
                className="px-4 py-2 rounded-md border hover:bg-gray-50"
              >
                My posts
              </Link>
              <Link
                href="/newsroom/notice-board#new"
                className="px-4 py-2 rounded-md border hover:bg-gray-50"
              >
                New notice
              </Link>
              <Link
                href="/newsroom/media"
                className="px-4 py-2 rounded-md border hover:bg-gray-50"
              >
                Media library
              </Link>
            </div>
          </SectionCard>
            <SectionCard id="writer-dashboard-tips" title="Tips">
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>
                Attach media directly from the editor via <em>/</em> menu or drag-drop.
              </li>
              <li>
                Use “Submit for review” to notify editors; scheduling auto-publishes.
              </li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

