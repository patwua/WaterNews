import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
// Unified SSR admin guard (NextAuth + shared helper)
import { requireAdminSSR } from '@/lib/admin-guard';

interface Ticket { _id: string; subject: string; name: string; email: string; body: string; }

export default function TicketDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  useEffect(() => {
    if (id) {
      fetch(`/api/inbox/get?id=${id}`).then((r) => r.json()).then((d) => {
        if (d.ok) setTicket(d.ticket);
      });
    }
  }, [id]);

  async function createDraftFromTicket(): Promise<void> {
    const r = await fetch("/api/drafts/from-ticket", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ ticketId: id })
    });
    const d = await r.json();
    if (d.id) location.href = `/admin/drafts/${d.id}`;
  }

  if (!ticket) return <div className="p-6">Loading...</div>;
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{ticket.subject}</h1>
        <button onClick={createDraftFromTicket} className="px-3 py-1 rounded bg-blue-600 text-white">
          Create Draft
        </button>
      </div>
      <p><strong>Name:</strong> {ticket.name}</p>
      <p><strong>Email:</strong> {ticket.email}</p>
      <p className="mt-4 whitespace-pre-line">{ticket.body}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const guard = await requireAdminSSR(ctx);
  if (guard.redirect) return guard;
  return { props: {} };
};
