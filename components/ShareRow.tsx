type Props = {
  title?: string;
  url?: string;
  className?: string;
};

export default function ShareRow({ title, url, className = "" }: Props) {
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const currentTitle = title || (typeof document !== "undefined" ? document.title : "");

  async function nativeShare() {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title: currentTitle, url: currentUrl });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
      } catch {}
      alert("Link copied!");
    }
  }
  const enc = encodeURIComponent;
  const tw = `https://twitter.com/intent/tweet?text=${enc(currentTitle)}&url=${enc(currentUrl)}`;
  const wa = `https://api.whatsapp.com/send?text=${enc(currentTitle + " " + currentUrl)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${enc(currentUrl)}`;

  return (
    <div className={`flex items-center gap-3 text-sm ${className}`.trim()}>
      <button onClick={nativeShare} className="rounded-xl border px-3 py-1.5 hover:bg-neutral-50">
        Share
      </button>
      <a href={tw} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
        Twitter/X
      </a>
      <a href={wa} target="_blank" rel="noreferrer" className="text-green-700 hover:underline">
        WhatsApp
      </a>
      <a href={fb} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
        Facebook
      </a>
    </div>
  );
}

