import React from "react";
import Head from "next/head";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import Callout from "@/components/UX/Callout";
import { absoluteCanonical } from "@/lib/seo";

export default function Login() {
  return (
    <>
      <Head>
        <title>Log in — WaterNews</title>
        <link rel="canonical" href={absoluteCanonical("/login")} />
      </Head>
      <Page title="Log in" subtitle="Access the Newsroom to draft and publish.">
      <div className="grid gap-6">
        <SectionCard>
          {/* Keep your existing NextAuth buttons or credentials form here */}
          <a href="/api/auth/signin" className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 inline-block">
            Continue with email
          </a>
        </SectionCard>
        <Callout variant="info" title="Trouble signing in?">
          If you don’t receive the email link, check spam or contact support via the <a href="/contact" className="underline">Contact</a> page.
        </Callout>
      </div>
    </Page>
    </>
  );
}
