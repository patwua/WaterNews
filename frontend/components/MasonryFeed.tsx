import MasonryCard from "./MasonryCard";
import { useMemo } from "react";

export default function MasonryFeed({ items = [], loading }: { items?: any[]; loading?: boolean }) {
  const skeletons = useMemo(() => Array.from({ length: 8 }), []);
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-4 [column-fill:_balance]">
      {(loading ? skeletons : items).map((it, i) => (
        <div key={loading ? i : it.id} className="mb-4 break-inside-avoid">
          {loading ? (
            <div className="animate-pulse rounded-2xl bg-neutral-100 h-64" />
          ) : (
            <MasonryCard item={it} variantSeed={it.variantSeed} density="compact" clamp={2} />
          )}
        </div>
      ))}
    </div>
  );
}
