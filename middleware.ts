import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Transparently rewrite newsroom draft publish → publish-with-media
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
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

