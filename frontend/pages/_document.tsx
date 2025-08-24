import Document, { Html, Head, Main, NextScript } from "next/document";
import {
  FAVICON_16,
  FAVICON_32,
  APPLE_TOUCH,
  MASK_ICON,
} from "@/lib/brand-tokens";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Brand color meta & preconnects */}
          <meta name="theme-color" content="#0b6ea8" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link rel="icon" href={FAVICON_32} type="image/png" sizes="32x32" />
          <link rel="icon" href={FAVICON_16} type="image/png" sizes="16x16" />
          <link rel="apple-touch-icon" href={APPLE_TOUCH} />
          <link rel="mask-icon" href={MASK_ICON} color="#0b6ea8" />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <body>
          {/* Removed early dark-mode initializer: force light theme until tokens are fixed */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
