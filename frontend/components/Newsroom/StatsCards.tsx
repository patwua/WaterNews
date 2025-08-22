export default function StatsCards({ data }: { data: any }) {
  const items = [
    { label: 'Drafts', value: data?.drafts ?? 0 },
    { label: 'Scheduled', value: data?.scheduled ?? 0 },
    { label: 'Published', value: data?.published ?? 0 },
    { label: 'Views (48h)', value: data?.views48h ?? 0 },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((it)=>(
        <div key={it.label} className="border rounded-xl p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">{it.label}</div>
          <div className="text-3xl font-semibold">{it.value}</div>
        </div>
      ))}
    </div>
  );
}
