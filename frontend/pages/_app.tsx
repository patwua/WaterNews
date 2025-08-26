import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShellProvider from '@/components/Newsroom/ShellContext';
import GlobalShell from '@/components/Newsroom/GlobalShell';
import { jsonLdScript, orgJsonLd, webSiteJsonLd } from '@/lib/seo';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const origin =
    typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_SITE_URL || 'https://www.waternewsgy.com'
      : window.location.origin;
  const orgLd = orgJsonLd(origin);
  const siteLd = webSiteJsonLd(origin, [
    'https://twitter.com/WaterNewsGY',
    'https://facebook.com/WaterNewsGY',
  ]);
  return (
    <>
      <Head>
        {/* Establish early connections to key origins (adjust hosts as needed) */}
        <link rel="preconnect" href="https://waternews.onrender.com" />
        {/* Example: if you serve images or fonts from a CDN, add it here */}
        {/* <link rel="preconnect" href="https://cdn.example.com" crossOrigin="anonymous" /> */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript([orgLd, siteLd]) }}
        />
      </Head>
      <SessionProvider session={session}>
        <ShellProvider>
          {/* GlobalShell renders only for logged-in users; add top padding on mobile for sticky bar */}
          <GlobalShell>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-black text-white px-3 py-2 rounded"
            >
              Skip to main content
            </a>
            <div className="md:pt-0 pt-14">
              <Header />
              <main
                id="main-content"
                className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
              >
                <Component {...pageProps} />
              </main>
              <Footer />
            </div>
          </GlobalShell>
        </ShellProvider>
      </SessionProvider>
    </>
  );
}
