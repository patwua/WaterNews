import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { isAdminEmail, isAdminUser } from "@/lib/admin-auth";

interface SSRContext {
  req: any;
  res: any;
  resolvedUrl?: string;
}

interface Redirect {
  destination: string;
  permanent: boolean;
}

interface SSRResult {
  redirect?: Redirect;
  props?: Record<string, unknown>;
}

export async function requireAdminSSR(ctx: SSRContext): Promise<SSRResult> {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const email =
    (session?.user?.email as string | null | undefined) ||
    (ctx.req?.headers["x-user-email"] as string | undefined) ||
    null; // legacy header fallback
  const ok = (await isAdminEmail(email)) || (await isAdminUser(email));
  if (!ok) {
    return {
      redirect: {
        destination:
          "/login?next=" + encodeURIComponent(ctx.resolvedUrl || "/admin"),
        permanent: false,
      },
    };
  }
  return { props: {} };
}
