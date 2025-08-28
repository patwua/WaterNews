import MasonryCard from "./MasonryCard";

type Item = {
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  publishedAt?: string | Date;
};

export default function MasonryFeed({ items = [] as Item[] }) {
  if (!items.length) return null;
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((it) => (
        <MasonryCard {...it} key={it.slug} />
      ))}
    </section>
  );
}

