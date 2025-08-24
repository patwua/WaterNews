import React from "react";
import BrandLogo from "@/components/BrandLogo";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import Callout from "@/components/UX/Callout";

export default function Apply() {
  return (
    <Page title="Apply to join" subtitle="Writers, editors, photographers — we’d love to hear from you.">
      <div className="grid gap-6">
        <Callout title="What we look for">
          Share recent work (links), a short bio, and the topics you know best. We review applications weekly.
        </Callout>
        <SectionCard>
          {/* Existing form markup preserved (fields handled by /api/apply). */}
          <form method="post" action="/api/apply" className="space-y-4">
            <input name="name" className="w-full border px-3 py-2 rounded" placeholder="Your name" required />
            <input name="email" type="email" className="w-full border px-3 py-2 rounded" placeholder="Your email" required />
            <input name="portfolio" className="w-full border px-3 py-2 rounded" placeholder="Portfolio or samples (links)" />
            <textarea name="cover" rows={6} className="w-full border px-3 py-2 rounded" placeholder="Tell us about your experience" />
            <button className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900">Submit application</button>
          </form>
        </SectionCard>
        <div className="flex items-center gap-3 opacity-80">
          <BrandLogo variant="mark" width={20} height={20} /> <span className="text-sm">WaterNewsGY</span>
        </div>
      </div>
    </Page>
  );
}
