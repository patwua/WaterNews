export default function PrevNext({
  prev,
  next,
}: {
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}) {
  if (!prev && !next) return null;
  return (
    <nav className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="min-h-[64px]">
        {prev && (
          <a
            href={`/news/${prev.slug}`}
            className="block rounded-xl ring-1 ring-black/5 p-3 hover:bg-neutral-50"
          >
            <div className="text-xs text-neutral-500">Previous</div>
            <div className="text-sm font-medium line-clamp-2">{prev.title}</div>
          </a>
        )}
      </div>
      <div className="min-h-[64px] sm:text-right">
        {next && (
          <a
            href={`/news/${next.slug}`}
            className="block rounded-xl ring-1 ring-black/5 p-3 hover:bg-neutral-50"
          >
            <div className="text-xs text-neutral-500">Next</div>
            <div className="text-sm font-medium line-clamp-2">{next.title}</div>
          </a>
        )}
      </div>
    </nav>
  );
}

