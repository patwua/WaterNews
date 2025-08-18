import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        {/* Establish early connections to key origins (adjust hosts as needed) */}
        <link rel="preconnect" href="https://waternews.onrender.com" />
        {/* Example: if you serve images or fonts from a CDN, add it here */}
        {/* <link rel="preconnect" href="https://cdn.example.com" crossOrigin="anonymous" /> */}
      </Head>
      <SessionProvider session={session}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-black text-white px-3 py-2 rounded"
        >
          Skip to main content
        </a>
        <Header />
        {/* Global ticker under header on all routes */}
        <BreakingTicker />
        <main id="main">
          <Component {...pageProps} />
        </main>
        <Footer />
      </SessionProvider>
    </>
  );
}
