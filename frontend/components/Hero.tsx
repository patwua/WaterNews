export default function Hero({ primary, rail }: { primary: any; rail: any[] }) {
  return (
    <section className="grid lg:grid-cols-3 gap-6">
      <article className="lg:col-span-2 rounded-3xl overflow-hidden ring-1 ring-black/5 bg-white">
        {primary?.image ? (
          <div className="aspect-[21/9] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={primary.image} alt={primary.title} className="w-full h-full object-cover" />
          </div>
        ) : null}
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 text-xs text-neutral-600 mb-2">
            {primary?.category ? <span className="px-2 py-0.5 bg-neutral-100 rounded-full">{primary.category}</span> : null}
            {primary?.publishedAt ? <time dateTime={primary.publishedAt}>{new Date(primary.publishedAt).toLocaleString()}</time> : null}
            {typeof primary?.engagementScore === "number" ? <span aria-label="engagement">• ★ {Math.round(primary.engagementScore)}</span> : null}
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold leading-tight mb-3">{primary?.title}</h2>
          {primary?.excerpt ? <p className="text-neutral-700 text-base md:text-lg">{primary.excerpt}</p> : null}
        </div>
      </article>

      <div className="grid gap-4">
        {rail?.slice(0, 3).map((r: any) => (
          <a key={r.id} href={`/news/${r.slug}`} className="rounded-2xl ring-1 ring-black/5 bg-white p-4 hover:shadow-sm transition-shadow outline-none focus:ring-2 focus:ring-blue-500">
            <div className="flex gap-3">
              {r.image ? (
                <div className="w-28 shrink-0 aspect-[4/3] overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ) : null}
              <div className="min-w-0">
                <h3 className="text-sm font-semibold leading-snug line-clamp-2">{r.title}</h3>
                {r.publishedAt ? <time className="text-xs text-neutral-500">{new Date(r.publishedAt).toLocaleDateString()}</time> : null}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
