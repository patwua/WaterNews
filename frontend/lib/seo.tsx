// Minimal, framework-agnostic JSON-LD builders for WaterNews
// Keep objects small, avoid undefineds, and emit a single script per page.

import { absoluteUrl, BRAND_NAME } from "@/lib/brand";
import { LOGO_FULL, OG_DEFAULT } from "@/lib/brand-tokens";

export const DEFAULT_TWITTER_SITE = "@WaterNewsGY";

export const DEFAULT_OG_IMAGE = OG_DEFAULT;

export function ogImageForPost(post: any | null) {
  if (!post) return absoluteUrl("/api/og/site");
  const maybe = post.ogImageUrl || (post.slug ? `/api/og/${post.slug}` : null);
  return absoluteUrl(maybe || "/api/og/site");
}

type Publisher = {
  name: string;
  logoUrl: string;
  url: string;
};

export function getPublisher(origin: string): Publisher {
  const site = origin || "https://www.waternewsgy.com";
  return {
    name: BRAND_NAME,
    logoUrl: absoluteUrl(LOGO_FULL),
    url: site,
  };
}

// Organization JSON-LD with a square logo (>=112x112).
export function orgJsonLd(origin: string) {
  const url = origin || "https://www.waternewsgy.com";
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url,
    logo: absoluteUrl(LOGO_FULL),
  };
}

// WebSite JSON-LD for global site identity.
export function webSiteJsonLd(origin: string) {
  const url = origin || "https://www.waternewsgy.com";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url,
  };
}

export function aboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    logo: absoluteUrl(LOGO_FULL),
    sameAs: [
      "https://twitter.com/WaterNewsGY",
      "https://facebook.com/WaterNewsGY",
    ],
    hasPart: [
      { "@type": "WebPage", "@id": absoluteUrl("/about/masthead"), name: "Masthead & News Team" },
      { "@type": "WebPage", "@id": absoluteUrl("/about/leadership"), name: "Leadership Team" },
    ],
  };
}

export function publisherForArticle() {
  return {
    "@type": "Organization",
    name: BRAND_NAME,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(LOGO_FULL),
    },
  };
}

export function buildBreadcrumbsJsonLd(origin: string, items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${origin}${it.url}`,
    })),
  };
}

// Convenience builder for common page-level breadcrumbs: Home → section → page.
export function pageBreadcrumbsJsonLd(
  origin: string,
  section: { name: string; url: string },
  page?: { name: string; url: string }
) {
  const items = [{ name: "Home", url: "/" }, section];
  if (page) items.push(page);
  return buildBreadcrumbsJsonLd(origin, items);
}

export function buildNewsArticleJsonLd(params: {
  origin: string;
  url: string;
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished: string;
  dateModified?: string;
  section?: string;
  keywords?: string[];
  authorName?: string;
  authorUrl?: string;
}) {
  const {
    origin,
    url,
    headline,
    description,
    image,
    datePublished,
    dateModified,
    section,
    keywords,
    authorName,
    authorUrl,
  } = params;
  const publisher = getPublisher(origin);
  const canonical = url.startsWith("http") ? url : `${origin}${url}`;
  const images = Array.isArray(image) ? image : image ? [image] : [];
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    headline,
    ...(description ? { description } : {}),
    ...(images.length ? { image: images } : {}),
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    ...(section ? { articleSection: section } : {}),
    ...(keywords && keywords.length ? { keywords: keywords.join(", ") } : {}),
    author: authorName
      ? {
          "@type": "Person",
          name: authorName,
          ...(authorUrl
            ? { url: authorUrl.startsWith("http") ? authorUrl : `${origin}${authorUrl}` }
            : {}),
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: publisher.name,
      url: publisher.url,
      logo: {
        "@type": "ImageObject",
        url: publisher.logoUrl,
      },
    },
  };
}

export function buildPersonJsonLd(params: {
  origin: string;
  slugUrl: string;
  name: string;
  description?: string;
  image?: string;
}) {
  const { origin, slugUrl, name, description, image } = params;
  const url = slugUrl.startsWith("http") ? slugUrl : `${origin}${slugUrl}`;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    url,
  };
}

export function jsonLdScript(objOrArray: unknown) {
  return JSON.stringify(objOrArray, null, 0);
}

export function seoMetaTags(params: {
  title: string;
  description?: string;
  image?: string;
  slug?: string;
  twitterSite?: string;
}) {
  const { title, description, image, slug, twitterSite = DEFAULT_TWITTER_SITE } = params;
  const img = absoluteUrl(image || (slug ? `/api/og/${slug}` : "/api/og/site"));
  return (
    <>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:image" content={img} />
    </>
  );
}

