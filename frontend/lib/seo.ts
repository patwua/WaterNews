// Minimal, framework-agnostic JSON-LD builders for WaterNews
// Keep objects small, avoid undefineds, and emit a single script per page.

import { absoluteUrl, BRAND_NAME, LOGO_MINI } from "@/lib/brand";

type Publisher = {
  name: string;
  logoUrl: string;
  url: string;
};

export function getPublisher(origin: string): Publisher {
  const site = origin || "https://www.waternewsgy.com";
  return {
    name: BRAND_NAME,
    logoUrl: absoluteUrl(LOGO_MINI),
    url: site,
  };
}

// Organization JSON-LD with a square logo (>=112x112).
export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    logo: absoluteUrl(LOGO_MINI),
  };
}

export function publisherForArticle() {
  return {
    "@type": "Organization",
    name: BRAND_NAME,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(LOGO_MINI),
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
    author: authorName ? { "@type": "Person", name: authorName } : undefined,
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

