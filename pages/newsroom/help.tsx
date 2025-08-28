import React from "react";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import Callout from "@/components/UX/Callout";

export default function NewsroomHelp() {
  return (
    <Page title="Help" subtitle="Guides, best practices, and shortcuts">
      <div className="grid gap-6">
        <Callout title="TL;DR">
          Draft → Add media → Submit for review → (optional) Schedule → Publish
        </Callout>
          <SectionCard id="newsroom-help-writing" title="Writing">
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li>Use headings and short paragraphs for scannability.</li>
            <li>Add captions and alt text for accessibility.</li>
            <li>Link sources — we encourage transparent citations.</li>
          </ul>
        </SectionCard>
          <SectionCard id="newsroom-help-media" title="Media">
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li>Prefer horizontal images ≥ 1600px on the long edge.</li>
            <li>Use the library to reuse approved assets.</li>
          </ul>
        </SectionCard>
      </div>
    </Page>
  );
}

