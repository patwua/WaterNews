import React from "react";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import ProfilePhotoForm from "@/components/Settings/ProfilePhotoForm";

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
        <SectionCard title="Danger zone">
          <p className="text-sm text-gray-700">Delete your account (this action cannot be undone).</p>
          <button className="mt-3 px-3 py-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50">
            Delete account
          </button>
        </SectionCard>
      </div>
    </Page>
  );
}
