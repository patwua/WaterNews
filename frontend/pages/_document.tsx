import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Brand color meta & preconnects */}
          <meta name="theme-color" content="#0F6CAD" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
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
