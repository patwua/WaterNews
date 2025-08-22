import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function NewsroomProfile() {
  return (
    <NewsroomLayout active="profile">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <p className="text-sm text-gray-600">Use the sidebar “Edit profile” to change your avatar, display name, and handle.</p>
    </NewsroomLayout>
  );
}
