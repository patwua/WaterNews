// Some local Next.js shims don't export GetServerSidePropsContext.
// Use a portable alias derived from GetServerSideProps instead.
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

/**
 * requireAuthSSR
 * Redirects visitors to /login?next=… if no session.
 * Does NOT enforce admin/staff; suitable for member-only newsroom.
 */
type GsspCtx = Parameters<GetServerSideProps>[0] & {
  req: any;
  res: any;
  resolvedUrl?: string;
};
export async function requireAuthSSR(ctx: GsspCtx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions as any);
  if (!session?.user?.email) {
    return {
      redirect: {
        destination: '/login?next=' + encodeURIComponent(ctx.resolvedUrl || '/newsroom'),
        permanent: false,
      },
    };
  }
  return { props: {} };
}
