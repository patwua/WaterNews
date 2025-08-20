import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

/**
 * requireAuthSSR
 * Redirects visitors to /login?next=… if no session.
 * Does NOT enforce admin/staff; suitable for member-only newsroom.
 */
export async function requireAuthSSR(ctx: any) {
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
