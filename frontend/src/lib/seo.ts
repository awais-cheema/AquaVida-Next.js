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

export async function buildPageMetadata(
    pageSlug: string,
    fallbacks: { title: string; description?: string }
): Promise<Metadata> {
    const [g, p] = await Promise.all([
        getGlobalSeo(),
        reader.collections.pageSeo.read(pageSlug).catch(() => null),
    ])

    const siteUrl = g?.siteUrl || 'https://aquavidapools.com'
    const siteName = g?.siteName || 'AquaVida Pools and Spas'

    const title = p?.title || fallbacks.title
    const description = p?.description || fallbacks.description || g?.defaultDescription || ''
    const ogTitle = p?.ogTitle || title
    const ogDescription = p?.ogDescription || description
    const ogImage = p?.ogImage || g?.defaultOgImage || null
    const canonical = p?.canonicalUrl || undefined
    const noIndex = p?.noIndex ?? false
    const noFollow = p?.noFollow ?? false

    const meta: Metadata = {
        title: { absolute: title },
        description,
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            siteName,
            type: 'website',
            url: canonical || `${siteUrl}/${pageSlug === 'home' ? '' : pageSlug}`,
            ...(ogImage ? { images: [ogImage] } : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitle,
            description: ogDescription,
            ...(g?.twitterHandle ? { site: g.twitterHandle } : {}),
        },
        robots: { index: !noIndex, follow: !noFollow },
        ...(canonical ? { alternates: { canonical } } : {}),
    }

    if (p?.keywords) {
        meta.keywords = p.keywords.split(',').map(k => k.trim())
    }

    return meta
}
