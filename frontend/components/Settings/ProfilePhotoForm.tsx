import React from "react";

export default function ProfilePhotoForm({ initialUrl, isOrganization=false }:{
  initialUrl?: string|null; isOrganization?: boolean;
}) {
  const [url, setUrl] = React.useState(initialUrl || "");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string|null>(null);

  async function handleFile(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null);
    if (file.size > 2 * 1024 * 1024) return setErr("File too large (≤ 2 MB).");
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return setErr("Use JPG, PNG, or WebP.");

    setBusy(true);
    try {
      // Convert file -> data URL and POST JSON (no multipart; no sharp)
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result));
        fr.onerror = () => reject(new Error("Failed to read file"));
        fr.readAsDataURL(file);
      });
      const upRes = await fetch("/api/user/profile-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, isOrganization }),
      });
      const up = await upRes.json();
      if (!upRes.ok) throw new Error(up?.error || "Upload failed");
      const saveRes = await fetch("/api/user/save-profile-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePhotoUrl: up.url, isOrganization }),
      });
      const sv = await saveRes.json();
      if (!saveRes.ok) throw new Error(sv?.error || "Save failed");
      setUrl(up.url);
    } catch (e:any) {
      setErr(e.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Profile photo</label>
      <p className="text-xs text-gray-600">
        Upload a photo or avatar (JPG/PNG/WebP, square, <strong>512×512+</strong>, ≤2 MB).
        We’ll crop it to a circle. Logos are OK for organizations.
      </p>

      <div className="flex items-center gap-4">
        {url ? (
          <img src={url} alt="Current profile photo" className="w-16 h-16 rounded-full object-cover border" />
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
