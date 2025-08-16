export default function ShareRow({ title, url }: { title: string; url: string }) {
  async function nativeShare() {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title, url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch {}
      alert("Link copied!");
    }
  }
  const enc = encodeURIComponent;
  const tw = `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`;
  const wa = `https://api.whatsapp.com/send?text=${enc(title + " " + url)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;

  return (
    <div className="mt-3 flex items-center gap-3 text-sm">
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

