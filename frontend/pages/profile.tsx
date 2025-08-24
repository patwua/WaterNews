import React from "react";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";

export default function ProfilePage() {
  const [revealDanger, setRevealDanger] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function onDelete(e: React.FormEvent) {
    e.preventDefault();
    if (confirmText !== "DELETE") return alert('Type DELETE to confirm.');
    setBusy(true);
    try {
      const r = await fetch("/api/users/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirm: "DELETE" }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Delete failed");
      window.location.href = "/"; // back to home
    } catch (err:any) {
      alert(err.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page title="Your Account" subtitle="Manage profile and settings.">
      <div className="grid gap-6">
        <SectionCard title="Writer tools">
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li><a className="underline" href="/newsroom">Open Newsroom</a></li>
            <li><a className="underline" href="/newsroom/posts">My Posts</a></li>
          </ul>
        </SectionCard>
        <SectionCard title="Danger zone">
          <p className="text-sm text-gray-700">Delete your account (this action cannot be undone).</p>
          {!revealDanger ? (
            <button onClick={() => setRevealDanger(true)} className="mt-3 text-sm px-3 py-2 rounded-md border hover:bg-gray-50">
              Show delete options
            </button>
          ) : (
            <form onSubmit={onDelete} className="mt-4 space-y-3">
              <p className="text-sm text-red-700">Type <b>DELETE</b> to confirm permanent removal.</p>
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="DELETE"
              />
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                  disabled={busy || confirmText !== "DELETE"}
                >
                  {busy ? "Deleting…" : "Delete account"}
                </button>
                <button type="button" onClick={() => { setRevealDanger(false); setConfirmText(""); }} className="px-4 py-2 rounded-md border hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </SectionCard>
      </div>
    </Page>
  );
}
