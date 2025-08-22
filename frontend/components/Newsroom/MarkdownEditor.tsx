import React, { useEffect, useMemo, useRef, useState } from 'react';
import MediaLibraryModal from '@/components/MediaLibraryModal';

type MarkdownEditorProps = {
  value: string;
  onChange: (v: string) => void;
  onSave?: () => void;
  draftId?: string; // for inline media attach
  // Expose editor APIs (selection, replacement) to parent features like AI chips
  exposeAPI?: (api: {
    getText: () => string;
    setText: (text: string) => void;
    getSelection: () => { start: number; end: number; text: string };
    replaceSelection: (next: string) => void;
    insertAtCursor: (text: string) => void;
  }) => void;
};

export default function MarkdownEditor(props: MarkdownEditorProps) {
  const { value, onChange, onSave } = props;
  const [local, setLocal] = useState(value || '');
  const [status, setStatus] = useState<'idle'|'dirty'|'saving'|'saved'>('idle');
  const ref = useRef<any>(null);
  const [mediaOpen, setMediaOpen] = useState(false);
  // Slash menu state
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [slashIdx, setSlashIdx] = useState(0);
  const commands = useMemo(() => ([
    { key: 'h1', label: 'Heading 1', run: () => prefixLine('# ') },
    { key: 'h2', label: 'Heading 2', run: () => prefixLine('## ') },
    { key: 'list', label: 'Bulleted list', run: () => prefixLine('- ') },
    { key: 'quote', label: 'Quote', run: () => prefixLine('> ') },
    { key: 'pull', label: 'Pull-quote block', run: () => wrapSelection('> **Pull quote:** ', '') },
    { key: 'callout', label: 'Callout/Note', run: () => wrapSelection('> **Note:** ', '') },
    { key: 'figure', label: 'Figure + caption', run: () => insertAtCursor('\n![caption](https://...)\n*Figure: add caption here.*\n') },
    { key: 'image', label: 'Image (from library)', run: () => setMediaOpen(true) },
    { key: 'embed', label: 'Embed URL (video/tweet)', run: () => insertAtCursor('\n[embed](https://...)\n') },
  ]), []);

  useEffect(() => {
    setLocal(value || '');
  }, [value]);

  // Expose editor APIs to parent consumers (e.g., AI rewrite chips)
  useEffect(() => {
    if (!props.exposeAPI) return;
    props.exposeAPI({
      getText: () => local || '',
      setText: (t: string) => { setLocal(t); onChange(t); },
      getSelection,
      replaceSelection,
      insertAtCursor,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local, props.exposeAPI]);

  useEffect(() => {
    if (status !== 'dirty') return;
    const t = setTimeout(async () => {
      setStatus('saving');
      try {
        await onSave?.();
        setStatus('saved');
        setTimeout(()=> setStatus('idle'), 1000);
      } catch {
        setStatus('idle');
      }
    }, 600);
    return () => clearTimeout(t);
  }, [status, onSave]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Ctrl/Cmd+S to save
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault?.();
      onSave?.();
    }
    // Slash menu
    if (e.key === '/') {
      setSlashOpen(true);
      setSlashQuery('');
      setSlashIdx(0);
    } else if (slashOpen) {
      if (e.key === 'Escape') { setSlashOpen(false); return; }
      if (e.key === 'Enter') {
        e.preventDefault?.();
        const list = filterCommands(slashQuery);
        const match = list[slashIdx] || list[0];
        if (match) match.run();
        setSlashOpen(false);
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'Tab') {
        e.preventDefault?.();
        const list = filterCommands(slashQuery);
        setSlashIdx((i) => (list.length ? (i + 1) % list.length : 0));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault?.();
        const list = filterCommands(slashQuery);
        setSlashIdx((i) => (list.length ? (i - 1 + list.length) % list.length : 0));
        return;
      }
      // crude query capture for letters/spaces/backspace
      if (e.key.length === 1) setSlashQuery((q)=> (q + e.key));
      if (e.key === 'Backspace') setSlashQuery((q)=> q.slice(0, -1));
    }
  }

  // Insert text at caret in the textarea
  function insertAtCursor(text: string) {
    const el = ref.current as any;
    if (!el) { setLocal((s)=> (s + text)); onChange(local + text); return; }
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const next = (local || '').slice(0, start) + text + (local || '').slice(end);
    setLocal(next);
    onChange(next);
    // restore caret
    setTimeout(()=>{ try{ el.focus(); el.selectionStart = el.selectionEnd = start + text.length; }catch{} }, 0);
  }

  function getSelection() {
    const el = ref.current as any;
    const start = el?.selectionStart ?? 0;
    const end = el?.selectionEnd ?? 0;
    const text = (local || '').slice(start, end);
    return { start, end, text };
  }

  function replaceSelection(next: string) {
    const el = ref.current as any;
    if (!el) return;
    const { start, end } = getSelection();
    const before = (local || '').slice(0, start);
    const after = (local || '').slice(end);
    const combined = before + next + after;
    setLocal(combined);
    onChange(combined);
    setTimeout(()=>{ try{ el.focus(); el.selectionStart = el.selectionEnd = before.length + next.length; }catch{} }, 0);
  }

  function wrapSelection(prefix: string, suffix: string) {
    const { text } = getSelection();
    const content = text || '…';
    replaceSelection(`${prefix}${content}${suffix}`);
  }

  async function onPickAsset(asset: any) {
    const url = asset?.secure_url || asset?.url;
    if (!url) return;
    // Simple heuristic: image => !/video|mp4|webm/
    const isImage = !/(\.mp4|\.webm|video)/i.test(url);
    const md = isImage ? `![image](${url})` : `[media](${url})`;
    insertAtCursor(md);
    setMediaOpen(false);
    // Attach to draft if id provided
    if ((props as any).draftId) {
      try {
        await fetch(`/api/newsroom/drafts/${encodeURIComponent((props as any).draftId)}/attach`, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
            url,
            publicId: asset?.public_id || null,
            width: asset?.width || null,
            height: asset?.height || null,
            mime: asset?.resource_type || null
          })
        });
        logActivity('insert_media', { url });
      } catch {}
    }
  }

  function filterCommands(q: string) {
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    return commands.filter(c => c.label.toLowerCase().includes(s) || c.key.includes(s));
  }

  function prefixLine(prefix: string) {
    const el = ref.current as any;
    if (!el) return insertAtCursor(prefix);
    const start = el.selectionStart || 0;
    // find start of line
    const text = local || '';
    const lineStart = text.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
    const next = text.slice(0, lineStart) + prefix + text.slice(lineStart);
    setLocal(next);
    onChange(next);
    setTimeout(()=>{ try{ el.focus(); el.selectionStart = el.selectionEnd = start + prefix.length; }catch{} }, 0);
  }

  // Drag & drop upload
  async function handleDrop(e: any) {
    e.preventDefault?.();
    const files = Array.from(e.dataTransfer?.files || []) as File[];
    if (!files.length) return;
    for (const f of files) {
      const dataUrl = await fileToDataUrl(f).catch(()=>null);
      if (!dataUrl) continue;
      // optimistic placeholder
      const placeholder = f.type.startsWith('video/') ? `[media](uploading...)` : `![image](uploading...)`;
      insertAtCursor(placeholder);
      try{
        const r = await fetch('/api/media/upload', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ dataUrl })});
        const d = await r.json();
        const url = d?.asset?.secure_url || d?.asset?.url;
        if (url) {
          // replace last "uploading..." occurrence with real URL
          setLocal((cur)=> cur.replace('(uploading...)', `(${url})`));
          onChange((local || '').replace('(uploading...)', `(${url})`));
          if ((props as any).draftId) {
            await fetch(`/api/newsroom/drafts/${encodeURIComponent((props as any).draftId)}/attach`, {
              method:'POST', headers:{'Content-Type':'application/json'},
              body: JSON.stringify({ url, publicId: d?.asset?.public_id || null, width: d?.asset?.width, height: d?.asset?.height, mime: d?.asset?.resource_type })
            });
            logActivity('upload_media', { name: (f as File).name, url });
          }
        }
      }catch{}
    }
  }

  function handleDragOver(e:any){ e.preventDefault?.(); }

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Activity logging helper
  async function logActivity(type: string, data?: any){
    if (!(props as any).draftId) return;
    try{
      await fetch(`/api/newsroom/drafts/${encodeURIComponent((props as any).draftId)}/activity`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type, data })
      });
    }catch{}
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="text-gray-600">
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : status === 'dirty' ? 'Unsaved changes' : 'Idle'}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-2 py-1 rounded border hover:bg-gray-50"
            onClick={()=> setMediaOpen(true)}
            title="Insert media"
          >
            Insert media
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded border hover:bg-gray-50"
            onClick={()=> onSave?.()}
            title="Save (⌘/Ctrl+S)"
          >
            Save
          </button>
        </div>
      </div>
      <textarea
        ref={ref}
        className="w-full border rounded px-3 py-2 min-h-[320px] focus-visible:ring-2"
        value={local}
        onChange={(e)=>{ setLocal(e.target.value); onChange(e.target.value); setStatus('dirty'); }}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      />
      <MediaLibraryModal
        open={mediaOpen}
        onClose={()=> setMediaOpen(false)}
        onSelect={onPickAsset}
      />
      {slashOpen ? (
        <div className="mt-2 border rounded-xl shadow bg-white p-2 max-w-xs relative">
          <input
            autoFocus
            value={slashQuery}
            onChange={(e:any)=> setSlashQuery(e.target.value)}
            placeholder="Type to filter…"
            className="w-full border rounded px-2 py-1 text-sm mb-2"
          />
          <ul className="max-h-56 overflow-auto">
            {filterCommands(slashQuery).map((c, i)=>(
              <li key={c.key}>
                <button
                  className={`w-full text-left px-2 py-1 rounded text-sm ${i===slashIdx ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                  onMouseEnter={()=> setSlashIdx(i)}
                  onClick={()=>{ c.run(); setSlashOpen(false); }}
                >
                  {c.label}
                </button>
              </li>
            ))}
            {!filterCommands(slashQuery).length ? <li className="px-2 py-1 text-sm text-gray-500">No matches</li> : null}
          </ul>
          <div className="absolute right-2 bottom-2 text-[10px] text-gray-500">Enter • Esc</div>
        </div>
      ) : null}
    </div>
  );
}

// Provide APIs to parent once ready
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
MarkdownEditor.defaultProps = {
  exposeAPI: undefined
};
