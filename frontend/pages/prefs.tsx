import React, { useState, useEffect } from "react";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import InlineHelp from "@/components/UX/InlineHelp";

export default function Prefs() {
  const [prefs, setPrefs] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/users/me");
        const d = await r.json();
        setPrefs(d?.prefs || {});
      } catch {
        setPrefs({});
      }
    })();
  }, []);
  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await fetch("/api/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prefs }),
      });
      if (!r.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }
  return (
    <Page title="Preferences" subtitle="Control notifications and reading experience.">
      <SectionCard>
        <form onSubmit={onSave} className="space-y-5">
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!prefs?.emailDigest}
                onChange={(e) => setPrefs({ ...prefs, emailDigest: e.target.checked })}
              />
              Email digests for new comments on my posts
            </label>
            <InlineHelp>We’ll email a brief summary instead of individual messages.</InlineHelp>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!prefs?.productUpdates}
                onChange={(e) => setPrefs({ ...prefs, productUpdates: e.target.checked })}
              />
              Product updates and tips
            </label>
            <InlineHelp>Occasional notes on new newsroom features.</InlineHelp>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            {saved && (
              <span className="text-sm px-2 py-1 rounded bg-green-50 text-green-700 ring-1 ring-green-200">
                Saved
              </span>
            )}
          </div>
        </form>
      </SectionCard>
    </Page>
  );
}
