import React from "react";
import Head from "next/head";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import Callout from "@/components/UX/Callout";
import { canonicalHref } from "@/lib/seo";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — WaterNews</title>
        <link rel="canonical" href={canonicalHref("/privacy")} />
      </Head>
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
              Anonymous tips can be submitted without logging in; we store only
              the text you send and the minimal routing data needed to deliver
              it. We do not retain IP addresses or device fingerprints, and tip
              contents are purged after review.
            </p>
            <p>
              Wherever possible, preferences and sessions live in your
              browser's local storage rather than our servers so control stays
              with you.
            </p>
            <p>
              We do not pool or sell user data and share it only with services
              strictly necessary to run WaterNews.
            </p>
            <p>
              WaterNews follows Guyana's data protection legislation and
              international frameworks like the EU's GDPR to guide responsible
              handling of personal information.
            </p>
          </div>
        </SectionCard>
      </div>
      </Page>
    </>
  );
}
