import { cache } from 'react'
import type { Metadata } from 'next'
import { reader } from './keystatic-reader'

const PATHNAME_TO_SLUG: Record<string, string> = {
  '/': 'home',
  '/about': 'about',
  '/services': 'services',
  '/services/pool-construction': 'pool-construction',
  '/services/pavers': 'pavers',
  '/services/fire-pit': 'fire-pit',
  '/services/outdoor-grill': 'outdoor-grill',
  '/services/pergola-design': 'pergola-design',
  '/services/pool-design': 'pool-design',
  '/services/pool-remodeling': 'pool-remodeling',
  '/portfolio': 'portfolio',
  '/portfolio/brycewood': 'brycewood',
  '/portfolio/montalcino': 'montalcino',
  '/portfolio/spruce-hills': 'spruce-hills',
  '/contact': 'contact',
  '/finance': 'finance',
  '/privacy-policy': 'privacy-policy',
  '/terms-conditions': 'terms-conditions',
  '/blog': 'blog',
}

export function pathnameToSeoSlug(pathname: string): string | null {
  return PATHNAME_TO_SLUG[pathname] ?? null
}

export async function getPageSeoEntry(slug: string) {
  return reader.collections.pageSeo.read(slug).catch(() => null)
}

export const getGlobalSeo = cache(async () =>
    reader.singletons.globalSeo.read().catch(() => null)
)

/* ── Inline SEO shape — matches the shared seoFieldsDef in keystatic.config ── */
export interface InlineSeoData {
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  seoNoIndex?: boolean | null
  seoNoFollow?: boolean | null
  seoCanonicalUrl?: string | null
}

/**
 * Build Next.js Metadata for any page.
 *
 * Priority chain (first non-empty wins):
 *   1. Inline SEO fields embedded in the content entry (WordPress-style)
 *   2. Per-page SEO collection entry  (advanced override)
 *   3. Hardcoded fallbacks passed by the page component
 *   4. Global SEO defaults
 */
export async function buildPageMetadata(
    pageSlug: string,
    fallbacks: { title: string; description?: string },
    inlineSeo?: InlineSeoData | null,
): Promise<Metadata> {
    const [g, p] = await Promise.all([
        getGlobalSeo(),
        reader.collections.pageSeo.read(pageSlug).catch(() => null),
    ])

    const siteUrl = g?.siteUrl || 'https://aquavidapools.com'
    const siteName = g?.siteName || 'AquaVida Pools and Spas'

    const title = inlineSeo?.seoTitle || p?.title || fallbacks.title
    const description = inlineSeo?.seoDescription || p?.description || fallbacks.description || g?.defaultDescription || ''
    const ogTitleVal = inlineSeo?.ogTitle || p?.ogTitle || title
    const ogDescVal = inlineSeo?.ogDescription || p?.ogDescription || description
    const ogImage = inlineSeo?.ogImage || p?.ogImage || g?.defaultOgImage || null
    const canonical = inlineSeo?.seoCanonicalUrl || p?.canonicalUrl || undefined
    const noIndex = inlineSeo?.seoNoIndex ?? p?.noIndex ?? false
    const noFollow = inlineSeo?.seoNoFollow ?? p?.noFollow ?? false
    const keywords = inlineSeo?.seoKeywords || p?.keywords || undefined

    const meta: Metadata = {
        title: { absolute: title },
        description,
        openGraph: {
            title: ogTitleVal,
            description: ogDescVal,
            siteName,
            type: 'website',
            url: canonical || `${siteUrl}/${pageSlug === 'home' ? '' : pageSlug}`,
            ...(ogImage ? { images: [ogImage] } : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitleVal,
            description: ogDescVal,
            ...(g?.twitterHandle ? { site: g.twitterHandle } : {}),
        },
        robots: { index: !noIndex, follow: !noFollow },
        ...(canonical ? { alternates: { canonical } } : {}),
    }

    if (keywords) {
        meta.keywords = keywords.split(',').map(k => k.trim())
    }

    return meta
}
