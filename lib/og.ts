import { absoluteUrl } from "@/lib/brand";
import { OG_DEFAULT, colors } from "@/lib/brand-tokens";

export interface BuildOgParams {
  title: string;
  section?: string;
  author?: string;
  slug?: string;
}

function getCloudName(): string | null {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (cloudinaryUrl) {
    const match = cloudinaryUrl.match(/cloudinary:\/\/[^@]+@([^/]+)/);
    if (match) return match[1];
  }
  return process.env.CLOUDINARY_CLOUD_NAME || null;
}

const BASE_PUBLIC_ID = process.env.CLOUDINARY_OG_BASE_ID || "waternewsgy/og/base";
const LOGO_PUBLIC_ID = process.env.CLOUDINARY_LOGO_MARK_ID || "waternewsgy/brand/logo-mark";

function escapeColor(hex: string) {
  return hex.replace('#', '');
}

export function buildOgUrl(params: BuildOgParams): string {
  const generator = process.env.OG_GENERATOR || 'cloudinary';
  const cloud = getCloudName();
  if (generator !== 'cloudinary' || !cloud) {
    return absoluteUrl(OG_DEFAULT);
  }
  const { title, section, author } = params;
  const trunc = title.length > 100 ? `${title.slice(0, 100)}…` : title;
  const encTitle = encodeURIComponent(trunc);
  const transforms = [
    'f_auto,q_auto,w_1200,h_630,c_fill',
    `l_text:Arial_64_bold:${encTitle},co_rgb:${escapeColor(colors.brandBlueDarker)},g_south_west,x_60,y_140,w_1020,c_fit`,
  ];
  if (section) {
    const encSection = encodeURIComponent(section);
    transforms.push(`l_text:Arial_32_bold:${encSection},co_rgb:${escapeColor(colors.brandBlue)},g_south_west,x_60,y_220`);
  }
  if (author) {
    const encAuthor = encodeURIComponent(author);
    transforms.push(`l_text:Arial_28:${encAuthor},co_rgb:666666,g_south_west,x_60,y_80`);
  }
  transforms.push(`l_${LOGO_PUBLIC_ID},g_north_east,x_48,y_48,w_120`);
  const base = `https://res.cloudinary.com/${cloud}/image/upload`;
  return `${base}/${transforms.join('/')}/${BASE_PUBLIC_ID}`;
}

export function buildOgForPost(post: any): string {
  if (!post) return absoluteUrl(OG_DEFAULT);
  const section = post.section || post.category || (Array.isArray(post.tags) ? post.tags[0] : undefined);
  const author = post.authorDisplay || post.author || post.byline || post.authorName;
  return buildOgUrl({ title: post.title || '', section, author, slug: post.slug });
}

