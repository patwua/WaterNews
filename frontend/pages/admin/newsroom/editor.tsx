import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import EditorBar from "@/components/Newsroom/EditorBar";
import MarkdownEditor from "@/components/Newsroom/MarkdownEditor";
import EditorSidePanel from "@/components/Newsroom/EditorSidePanel";
import ModerationNotesDrawer from "@/components/Newsroom/ModerationNotesDrawer";
import { slugify } from "@/lib/slugify";

// Helper to pull follow affinities from local (merged elsewhere by your boot util)
function readAffinity() {
  if (typeof window === "undefined") return { tagList: [], authorList: [] };
  try {
    const tagList = JSON.parse(localStorage.getItem("wn:follows:tags") || "[]");
    const authorList = JSON.parse(localStorage.getItem("wn:follows:authors") || "[]");
    return {
      tagList: Array.isArray(tagList) ? tagList : [],
      authorList: Array.isArray(authorList) ? authorList : [],
    };
  } catch {
    return { tagList: [], authorList: [] };
  }
}

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
    let realId = draftId;
    if (!realId) {
      const created = await api<{ draft: any; ok: boolean }>(`/api/newsroom/drafts`, {
        method: "POST",
        body: JSON.stringify({ id: null, title, summary, body, coverImage, tags, type, status }),
      });
      realId = created.draft._id;
      setDraftId(realId);
    }

    const res = await api<{ ok: boolean; postSlug: string }>(`/api/newsroom/drafts/${realId}?action=publish`, { method: "POST" });
    const slug = res.postSlug || slugify(title);
    router.push(`/news/${slug}`);
  }

  const barValue = useMemo(
    () => ({ title, summary, coverImage, tags, type, status }),
    [title, summary, coverImage, tags, type, status]
  );

  const { tagList, authorList } = readAffinity();

  return (
    <main className="max-w-7xl mx-auto pb-24">
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

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-4">
        <div className="max-w-4xl">
          <MarkdownEditor value={body} onChange={setBody} />
          <div className="mt-4 flex gap-3">
            <button onClick={save} className="rounded-xl border px-4 py-2 hover:bg-neutral-50">Save Draft</button>
            <button onClick={publish} className="rounded-xl bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">Publish</button>
          </div>
        </div>

        <EditorSidePanel
          title={title}
          tags={tags}
          onInsertReferences={(items) => {
            if (!items?.length) return;
            const bullets = items.map(it => `- [${it.title}](/news/${it.slug})`).join("\n");
            setBody(prev => prev ? `${prev}\n\n### Related\n${bullets}\n` : `### Related\n${bullets}\n`);
          }}
        />
      </section>

      {/* Moderation notes (internal) */}
      <ModerationNotesDrawer targetId={draftId} />
    </main>
  );
}
