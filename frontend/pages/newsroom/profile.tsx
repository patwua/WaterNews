import React from "react";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import ProfilePhotoForm from "@/components/Settings/ProfilePhotoForm";
import ProfileSettings from "@/components/ProfileSettings";

export default function Profile() {
  return (
    <Page title="Profile & Settings" subtitle="Update your details, photo, and preferences.">
      <div className="grid gap-6 sm:grid-cols-2">
        <SectionCard title="Profile photo">
          <ProfilePhotoForm />
        </SectionCard>
        <SectionCard title="Account">
          <p className="text-sm text-gray-700">Edit display name, handle, and contact preferences.</p>
          {/* Existing settings form goes here */}
        </SectionCard>
      </div>
      <div className="mt-6">
        <ProfileSettings />
      </div>
    </Page>
  );
}
