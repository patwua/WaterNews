import { useEffect, useState } from "react";
import Link from "next/link";
import { isAdminEmail, isAdminUser } from "@/lib/admin-auth";

export default function AdminInbox() {
  const [tickets, setTickets] = useState([]);
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

export async function getServerSideProps(ctx) {
  const email = ctx.req?.headers["x-user-email"] || null;
  const ok = (await isAdminEmail(email)) || (await isAdminUser(email));
  if (!ok) {
    return { redirect: { destination: "/profile", permanent: false } };
  }
  return { props: {} };
}
