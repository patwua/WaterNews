// @ts-nocheck
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/server/db';
import Post from '@/models/Post';
import { colors, LOGO_MARK } from '@/lib/brandkits/rev2';

export const config = { runtime: 'edge' };

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { pathname, searchParams } = req.nextUrl;
  const slug = pathname.split('/').pop();
  if (!slug) {
    return new Response('Invalid slug', { status: 400 });
  }

  await dbConnect();
  const post = await Post.findOne({ slug }).lean();
  if (!post) {
    return new Response('Not found', { status: 404 });
  }

  const isSquare = searchParams.get('square') === '1';
  const width = isSquare ? 1080 : 1200;
  const height = isSquare ? 1080 : 630;

  const logoData = await fetch(new URL(LOGO_MARK, req.url)).then((res) =>
    res.arrayBuffer()
  );

  const byline =
    (post as any).authorDisplay ||
    (post as any).author ||
    (post as any).byline ||
    '';
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundImage: `linear-gradient(to bottom, ${colors.brandBlue}, ${colors.brandBlueDark}, ${colors.brandBlueDarker})`,
          color: 'white',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: isSquare ? 84 : 64,
            fontWeight: 700,
            lineHeight: 1.2,
            fontFamily: 'Merriweather, serif',
            whiteSpace: 'pre-wrap',
          }}
        >
          {post.title}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: isSquare ? 36 : 32,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {byline && <span>{byline}</span>}
            {date && <span>{date}</span>}
          </div>
          <img src={logoData} width={120} height={120} />
        </div>
      </div>
    ),
    {
      width,
      height,
      headers: {
        'Cache-Control': 's-maxage=86400, stale-while-revalidate=604800',
      },
    }
  );
}

