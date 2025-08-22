import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function HelpPage(){
  return (
    <NewsroomLayout>
      <h1 className="text-2xl font-semibold mb-4">Help for Members</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <section className="border rounded-xl p-4">
          <div className="font-medium mb-1">Getting started</div>
          <p className="text-sm text-gray-600">Use Publisher to create drafts, insert media, and submit for review. The Dashboard shows your stats and quick actions.</p>
        </section>
        <section className="border rounded-xl p-4">
          <div className="font-medium mb-1">Editorial workflow</div>
          <p className="text-sm text-gray-600">Submit for review when ready. Editors will approve or request changes; you’ll receive email notifications.</p>
        </section>
        <section className="border rounded-xl p-4">
          <div className="font-medium mb-1">Media tips</div>
          <p className="text-sm text-gray-600">Open Media from the draft to insert images/videos. Uploads live in Cloudinary and can be reused across drafts.</p>
        </section>
        <section className="border rounded-xl p-4">
          <div className="font-medium mb-1">Policies</div>
          <p className="text-sm text-gray-600">Review our <a className="text-blue-600 underline" href="/editorial-standards">Editorial Standards</a> and <a className="text-blue-600 underline" href="/privacy">Privacy</a>.</p>
        </section>
      </div>
    </NewsroomLayout>
  );
}
