import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';

export async function requireAdminSSR(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const email = session?.user?.email || ctx.req?.headers['x-user-email'] || null; // legacy header fallback
  const ok = (await isAdminEmail(email)) || (await isAdminUser(email));
  if (!ok) {
    return { redirect: { destination: '/login?next=' + encodeURIComponent(ctx.resolvedUrl || '/admin'), permanent: false } };
  }
  return { props: {} };
}
