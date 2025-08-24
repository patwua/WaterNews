import React from "react";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import ProfileSettings from "@/components/ProfileSettings";

export default function ProfilePage() {
  return (
    <Page title="Your Account" subtitle="Manage profile and settings.">
      <div className="grid gap-6">
        <SectionCard title="Writer tools">
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li><a className="underline" href="/newsroom">Open Newsroom</a></li>
            <li><a className="underline" href="/newsroom/posts">My Posts</a></li>
          </ul>
        </SectionCard>
        <ProfileSettings />
      </div>
    </Page>
  );
}
