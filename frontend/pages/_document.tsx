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
          {/* No-flash theme initializer: reads localStorage + system and applies .dark on <html> before paint */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
(function(){
  try {
    var ls = localStorage.getItem('wn-theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var shouldDark = ls ? (ls === 'dark') : prefersDark;
    var html = document.documentElement;
    if (shouldDark) html.classList.add('dark'); else html.classList.remove('dark');
  } catch(e){}
})();`,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
