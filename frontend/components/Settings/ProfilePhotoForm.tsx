import { useState } from "react";
import { profilePhotoCopy } from "@/data/profilePhotoCopy";

export default function ProfilePhotoForm({ userId, initialUrl, isOrganization=false }:{
  userId: string; initialUrl?: string|null; isOrganization?: boolean;
}) {
  const [url, setUrl] = useState(initialUrl || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  async function handleFile(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null);
    if (file.size > 2 * 1024 * 1024) return setErr(profilePhotoCopy.errors.tooLarge);
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return setErr(profilePhotoCopy.errors.badType);

    setBusy(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const upRes = await fetch("/api/user/profile-photo", { method: "POST", body: fd });
      const up = await upRes.json();
      if (!upRes.ok) throw new Error(up?.error || "Upload failed");
      const saveRes = await fetch("/api/user/save-profile-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId }, // swap to session
        body: JSON.stringify({ profilePhotoUrl: up.url, isOrganization }),
      });
      const sv = await saveRes.json();
      if (!saveRes.ok) throw new Error(sv?.error || "Save failed");
      setUrl(up.url);
    } catch (e:any) {
      setErr(e.message || profilePhotoCopy.errors.generic);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">{profilePhotoCopy.label}</label>
      <p className="text-xs text-gray-600">
        {profilePhotoCopy.help}
      </p>

      <div className="flex items-center gap-4">
        {url ? (
          <img src={url} alt="Current profile photo" className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200" />
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          disabled={busy}
          className="text-sm"
        />
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}
      {busy && <p className="text-sm text-gray-600">Uploading…</p>}
    </div>
  );
}
