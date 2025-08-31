import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Transparently rewrite newsroom draft publish → publish-with-media
export function middleware(req: NextRequest) {
  const { pathname, search, searchParams } = req.nextUrl;

  // Skip rewrite when marked as an internal request
  const internalHeader = (req as any).headers?.get?.('x-internal-request');
  const isInternal = internalHeader === '1' || searchParams.get('internal') === '1';
  if (isInternal) return NextResponse.next();

  // Match /api/newsroom/drafts/:id/publish exactly
  const m = pathname.match(/^\/api\/newsroom\/drafts\/([^/]+)\/publish$/);
  if (m && req.method === 'POST') {
    const id = m[1];
    const url = req.nextUrl.clone();
    url.pathname = `/api/newsroom/drafts/${id}/publish-with-media`;
    url.search = search; // preserve any ?force=true etc.
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/newsroom/drafts/:path*/publish'],
};

