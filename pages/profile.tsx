import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import ProfileSettings from "@/components/ProfileSettings";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/users/me");
        if (!r.ok) return;
        const me = await r.json();
        if (me) {
          const qs = typeof window !== "undefined" ? window.location.search : "";
          router.replace(`/newsroom/profile${qs}`);
        }
      } catch {
        /* ignore */
      }
    })();
  }, [router]);

  return (
    <Page title="Your Account" subtitle="Manage profile and settings.">
      <div className="grid gap-6">
          <SectionCard id="profile-writer-tools" title="Writer tools">
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
