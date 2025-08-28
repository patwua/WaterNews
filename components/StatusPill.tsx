export default function StatusPill({ status }: { status?: string }) {
  const s = (status || 'draft').toLowerCase();
  const color = s === 'published' ? 'bg-green-100 text-green-700'
    : s === 'scheduled' ? 'bg-blue-100 text-blue-700'
    : s === 'ready' ? 'bg-amber-100 text-amber-700'
    : s === 'needs_second_review' ? 'bg-purple-100 text-purple-700'
    : 'bg-gray-100 text-gray-700';
  const label = s.replace(/_/g, ' ');
  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${color}`}>{label}</span>;
}
