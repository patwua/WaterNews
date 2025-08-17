import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import '@/styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <a href="#main-content" className="skip-to-main">Skip to main content</a>
      <div id="main-content">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  )
}
