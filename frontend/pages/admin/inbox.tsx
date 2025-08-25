import { useEffect, useState } from "react";
import Link from "next/link";
import type { GetServerSideProps } from "next";
// Unified SSR admin guard (NextAuth + shared helper)
import { requireAdminSSR } from '@/lib/admin-guard';

interface Ticket { _id: string; subject?: string; status?: string }

export default function AdminInbox() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  useEffect(() => {
    fetch("/api/inbox/list").then((r) => r.json()).then((d) => {
      if (d.ok) setTickets(d.items);
    });
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>
      <ul className="space-y-2">
        {tickets.map((t) => (
          <li key={t._id} className="p-3 rounded border">
            <Link href={`/admin/inbox/${t._id}`}>{t.subject || "(no subject)"}</Link>
            <span className="ml-2 text-sm text-gray-500">{t.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const guard = await requireAdminSSR(ctx);
  if (guard.redirect) return guard;
  return { props: {} };
};
