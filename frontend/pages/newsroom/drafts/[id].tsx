import React, { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { requireAuthSSR } from "@/lib/user-guard";
import Page from "@/components/UX/Page";
import SharedEditor from "@/components/Newsroom/SharedEditor";

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx);

export default function DraftEditor() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [draft, setDraft] = useState<any>(null);

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
    try {
      const r = await fetch(`/api/newsroom/drafts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const d = await r.json();
      setDraft(d);
    } catch {}
  }

  function onChange(body: string) {
    const next = { ...draft, body };
    setDraft(next);
    save(next);
  }

  async function onPublish() {
    if (!id) return;
    const r = await fetch(`/api/newsroom/drafts/${id}/publish`, {
      method: "POST",
    });
    const d = await r.json();
    setDraft(d);
    return d;
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
      <SharedEditor
        title={draft?.title}
        value={draft?.body || ""}
        onChange={onChange}
        status={draft?.status || "draft"}
        onStatusChange={(s) => {
          const next = { ...draft, status: s };
          setDraft(next);
          save(next);
        }}
        draftId={draft?._id}
        scheduleAt={draft?.publishAt || draft?.scheduledFor || null}
        onPreview={onPreview}
        onSubmit={onSubmit}
        onPublish={onPublish}
      />
    </Page>
  );
}
