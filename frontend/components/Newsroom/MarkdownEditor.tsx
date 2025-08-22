import React, { useEffect, useRef, useState } from 'react';
import MediaLibraryModal from '@/components/MediaLibraryModal';

 type MarkdownEditorProps = {
   value: string;
   onChange: (v: string) => void;
   onSave?: () => void;
   draftId?: string; // for inline media attach
 };
 
 export default function MarkdownEditor(props: MarkdownEditorProps) {
   const { value, onChange, onSave } = props;
   const [local, setLocal] = useState(value || '');
   const [status, setStatus] = useState<'idle'|'dirty'|'saving'|'saved'>('idle');
   const ref = useRef<any>(null);
   const [mediaOpen, setMediaOpen] = useState(false);
 
   useEffect(() => {
     setLocal(value || '');
   }, [value]);
 
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
 
   function handleKeyDown(e /* React.KeyboardEvent<HTMLTextAreaElement> */) {
     // Ctrl/Cmd+S to save
     if ((e.metaKey || e.ctrlKey) && e.key === 's') {
       e.preventDefault?.();
       onSave?.();
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
       } catch {}
     }
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
         className="w-full border rounded px-3 py-2 min-h-[320px]"
         value={local}
         onChange={(e)=>{ setLocal(e.target.value); onChange(e.target.value); setStatus('dirty'); }}
         onKeyDown={handleKeyDown}
       />
       <MediaLibraryModal
         open={mediaOpen}
         onClose={()=> setMediaOpen(false)}
         onSelect={onPickAsset}
       />
     </div>
   );
 }
