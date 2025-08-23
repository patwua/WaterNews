import React from "react";
import Link from "next/link";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";

export default function Dashboard() {
  return (
    <Page
      title="Newsroom"
      subtitle="Your writing hub — drafts, schedules, and activity."
      actions={
        <div className="flex gap-2">
          <Link href="/newsroom" className="px-3 py-2 rounded-md bg-black text-white hover:bg-gray-900">
            Write
          </Link>
          <Link href="/newsroom/notice-board" className="px-3 py-2 rounded-md border hover:bg-gray-50">
            New notice
          </Link>
        </div>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <SectionCard title="At a glance">
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              Drafts in progress: <span className="font-medium">—</span>
            </li>
            <li>
              Scheduled for publish: <span className="font-medium">—</span>
            </li>
            <li>
              Last 7 days views: <span className="font-medium">—</span>
            </li>
          </ul>
        </SectionCard>
        <SectionCard title="Shortcuts">
          <div className="flex flex-wrap gap-2">
            <Link href="/newsroom" className="px-3 py-2 rounded-md border hover:bg-gray-50">
              Open Publisher
            </Link>
            <Link href="/newsroom/media" className="px-3 py-2 rounded-md border hover:bg-gray-50">
              Browse Media
            </Link>
            <Link href="/newsroom/collab" className="px-3 py-2 rounded-md border hover:bg-gray-50">
              Collaboration
            </Link>
            <Link href="/newsroom/profile" className="px-3 py-2 rounded-md border hover:bg-gray-50">
              Profile & Settings
            </Link>
          </div>
        </SectionCard>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <SectionCard title="Recent activity">
          <p className="text-gray-600 text-sm">Your latest edits, comments, and approvals will appear here.</p>
        </SectionCard>
        <SectionCard title="Tips">
          <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>Use the Media Library to re-use newsroom assets.</li>
            <li>Submit for review early; you can keep editing.</li>
            <li>Try the AI Assistant to outline complex explainers.</li>
          </ul>
        </SectionCard>
      </div>
    </Page>
  );
}
