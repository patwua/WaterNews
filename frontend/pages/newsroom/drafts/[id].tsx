import React, { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { requireAuthSSR } from "@/lib/user-guard";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import MarkdownEditor from "@/components/Newsroom/MarkdownEditor";
import StatusPill from "@/components/StatusPill";
import EditorBar from "@/components/Newsroom/EditorBar";

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx);

export default function DraftEditor() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [draft, setDraft] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/newsroom/drafts/${id}`);
        const d = await r.json();
        if (alive) setDraft(d);
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  async function save(next: any) {
    if (!id) return;
    setSaving(true);
    try {
      const r = await fetch(`/api/newsroom/drafts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const d = await r.json();
      setDraft(d);
    } finally {
      setSaving(false);
    }
  }

  function onChange(body: string) {
    const next = { ...draft, body };
    setDraft(next);
    save(next);
  }

  async function onPublish() {
    if (!id) return;
    await fetch(`/api/newsroom/drafts/${id}/publish`, { method: "POST" });
    router.push("/newsroom/posts");
  }

  function onPreview() {
    if (id) window.open(`/newsroom/drafts/${id}?preview=1`, "_blank");
  }

  async function onSubmit() {
    if (!id) return;
    await fetch(`/api/newsroom/drafts/${id}/submit`, { method: "POST" });
  }

  return (
    <Page title="Editor" subtitle="Write, attach media, and publish">
      <EditorBar
        title={draft?.title}
        status={draft?.status}
        saving={saving}
        onPreview={onPreview}
        onSubmit={onSubmit}
        onPublish={onPublish}
        onBack={() => router.push("/newsroom/writer-dashboard")}
        rightExtra={draft?.status ? <StatusPill status={draft.status} /> : null}
      />
      <SectionCard className="mt-4">
        <MarkdownEditor value={draft?.body || ""} onChange={onChange} />
      </SectionCard>
    </Page>
  );
}
