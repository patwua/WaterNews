import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import EditorBar from "@/components/Newsroom/EditorBar";
import MarkdownEditor from "@/components/Newsroom/MarkdownEditor";
import { slugify } from "@/lib/slugify";

export default function EditorPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const [draftId, setDraftId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [type, setType] = useState<"news" | "vip" | "post" | "ads">("news");
  const [status, setStatus] = useState<"draft" | "scheduled" | "published">("draft");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await api<{ draft: any }>(`/api/newsroom/drafts/${id}`);
      const d = res.draft;
      setDraftId(d._id);
      setTitle(d.title || "");
      setSummary(d.summary || "");
      setCoverImage(d.coverImage || "");
      setTags(d.tags || []);
      setType(d.type || "news");
      setStatus(d.status || "draft");
      setBody(d.body || "");
    })();
  }, [id]);

  async function save() {
    const res = await api<{ draft: any; ok: boolean }>(`/api/newsroom/drafts`, {
      method: "POST",
      body: JSON.stringify({
        id: draftId,
        title,
        summary,
        body,
        coverImage,
        tags,
        type,
        status,
      }),
    });
    setDraftId(res.draft._id);
    // optional: toast
  }

  async function publish() {
    if (!draftId) {
      await save();
    }
    const realId = draftId ?? (await api<{ draft: any; ok: boolean }>(`/api/newsroom/drafts`, {
      method: "POST",
      body: JSON.stringify({ title, summary, body, coverImage, tags, type, status }),
    })).draft._id;

    await api(`/api/newsroom/drafts/${realId}?action=publish`, { method: "POST" });
    // Redirect to the public news page (assumes /news/[slug])
    const slug = slugify(title);
    router.push(`/news/${slug}`);
  }

  const barValue = useMemo(
    () => ({ title, summary, coverImage, tags, type, status }),
    [title, summary, coverImage, tags, type, status]
  );

  return (
    <main className="max-w-6xl mx-auto pb-24">
      <EditorBar
        value={barValue as any}
        onChange={(patch) => {
          if (patch.title !== undefined) setTitle(patch.title);
          if (patch.summary !== undefined) setSummary(patch.summary);
          if (patch.coverImage !== undefined) setCoverImage(patch.coverImage);
          if (patch.tags !== undefined) setTags(patch.tags as string[]);
          if (patch.type !== undefined) setType(patch.type as any);
          if (patch.status !== undefined) setStatus(patch.status as any);
        }}
        onSave={save}
        onPublish={publish}
      />

      {coverImage ? (
        <div className="max-w-4xl mx-auto mt-6 rounded-3xl overflow-hidden ring-1 ring-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverImage} alt="" className="w-full h-auto object-cover" />
        </div>
      ) : null}

      <section className="max-w-4xl mx-auto mt-6 p-3">
        <MarkdownEditor value={body} onChange={setBody} />
        <div className="mt-4 flex gap-3">
          <button onClick={save} className="rounded-xl border px-4 py-2 hover:bg-neutral-50">Save Draft</button>
          <button onClick={publish} className="rounded-xl bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">Publish</button>
        </div>
      </section>
    </main>
  );
}
