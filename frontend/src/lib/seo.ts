import { cache } from 'react'
import type { Metadata } from 'next'
import { reader } from './keystatic-reader'

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
