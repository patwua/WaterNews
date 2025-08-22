import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import MediaLibraryModal from '@/components/MediaLibraryModal';
import { useState } from 'react';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function MediaHub() {
  const [open, setOpen] = useState(true);
  const [picked, setPicked] = useState<any>(null);
  return (
    <NewsroomLayout active="media">
      <h1 className="text-2xl font-semibold mb-4">Media Library</h1>
      <p className="text-sm text-gray-600 mb-3">Search and pick images/videos from Cloudinary. Recently used media appears first.</p>
      <button className="px-3 py-2 border rounded text-sm" onClick={()=>setOpen(true)}>Open Library</button>
      {picked ? (
        <div className="mt-4">
          <div className="text-sm text-gray-600 mb-2">Selected:</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={picked.secure_url || picked.url} alt="" className="w-48 h-48 object-cover rounded border"/>
        </div>
      ) : null}
      <MediaLibraryModal open={open} onClose={()=>setOpen(false)} onSelect={(asset:any)=>{ setPicked(asset); setOpen(false); }} />
    </NewsroomLayout>
  );
}
