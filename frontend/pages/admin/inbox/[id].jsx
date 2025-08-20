import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isAdminEmail, isAdminUser } from "@/lib/admin-auth";

export default function TicketDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [ticket, setTicket] = useState(null);
  useEffect(() => {
    if (id) {
      fetch(`/api/inbox/get?id=${id}`).then((r) => r.json()).then((d) => {
        if (d.ok) setTicket(d.ticket);
      });
    }
  }, [id]);
  if (!ticket) return <div className="p-6">Loading...</div>;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{ticket.subject}</h1>
      <p><strong>Name:</strong> {ticket.name}</p>
      <p><strong>Email:</strong> {ticket.email}</p>
      <p className="mt-4 whitespace-pre-line">{ticket.body}</p>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const email = ctx.req?.headers["x-user-email"] || null;
  const ok = (await isAdminEmail(email)) || (await isAdminUser(email));
  if (!ok) {
    return { redirect: { destination: "/profile", permanent: false } };
  }
  return { props: {} };
}
