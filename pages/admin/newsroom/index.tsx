import Link from "next/link";
import DraftList, { Column } from "@/components/Newsroom/DraftList";

const columns: Column[] = [
  { key: "title", label: "Title" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  {
    key: "updatedAt",
    label: "Updated",
    render: (r) => new Date(r.updatedAt).toLocaleString(),
  },
];

export default function NewsroomListPage() {
  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Newsroom</h1>
        <Link
          href="/admin/newsroom/editor"
          className="rounded-xl bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
        >
          New Draft
        </Link>
      </div>

      <DraftList
        fetchUrl="/api/newsroom/drafts"
        columns={columns}
        actions={(r) => (
          <Link
            href={`/admin/newsroom/editor?id=${r._id}`}
            className="text-blue-600 hover:underline"
          >
            Edit
          </Link>
        )}
        showSearch
      />
    </main>
  );
}
