import React from "react";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import Callout from "@/components/UX/Callout";

export default function Privacy() {
  return (
    <Page title="Privacy Policy" subtitle="How we collect, use, and protect your data.">
      <div className="grid gap-6">
        <Callout variant="info">
          We keep things simple: only what’s necessary to run the site and improve your experience.
        </Callout>
        <SectionCard>
          <div className="prose max-w-none">
            <h3>What we collect</h3>
            <ul>
              <li>Account basics: email, display name, and optional profile photo.</li>
              <li>Usage: pages viewed and basic device info (aggregated analytics).</li>
              <li>Submissions: tips, corrections, and applications you send to us.</li>
            </ul>
            <h3>How we use it</h3>
            <p>To deliver content, send critical notifications, fight spam, and improve WaterNews.</p>
            <h3>Your choices</h3>
            <p>Update or delete your account anytime in <strong>Newsroom → Profile &amp; Settings</strong>.</p>
          </div>
        </SectionCard>
        <SectionCard>
          <div className="prose max-w-none">
            <h3>Governance &amp; Compliance</h3>
            <p>
              WaterNews operates under Guyanese and international privacy laws and is committed to legal compliance and reader protections.
            </p>
          </div>
        </SectionCard>
      </div>
    </Page>
  );
}
