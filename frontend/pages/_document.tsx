import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    const inlineThemeInit = `
(function() {
  try {
    var ls = localStorage.getItem('theme');
    var m = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var wantDark = (ls === 'dark') || (ls === null && m);
    if (wantDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch(e) {}
})();`;
    return (
      <Html>
        <Head>
          <script dangerouslySetInnerHTML={{ __html: inlineThemeInit }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
