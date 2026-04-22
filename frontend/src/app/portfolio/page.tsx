import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PortfolioClient from './PortfolioClient'
import SeoLinks from '@/components/layout/SeoLinks'

export async function generateMetadata(): Promise<Metadata> {
    const data = await reader.singletons.portfolioListingPage.read().catch(() => null)
    return buildPageMetadata('portfolio', {
        title: 'Portfolio | AquaVida Pools and Spas',
        description: 'Explore our curated archive of high-end aquatic architecture and luxury outdoor living spaces.',
    }, data)
}

export default async function PortfolioPage() {
    const data = await reader.singletons.portfolioListingPage.read().catch(() => null)
    return (
        <>
            <PortfolioClient
                faqItems={data?.faqItems?.length ? [...data.faqItems].map(f => ({ ...f, answer: f.answer as any })) : undefined}
                headerLabel={data?.headerLabel || undefined}
                headerTitle={data?.headerTitle || undefined}
                headerDescription={data?.headerDescription as any}
                curationLabel={data?.curationLabel || undefined}
                curationValue={data?.curationValue || undefined}
                focusLabel={data?.focusLabel || undefined}
                focusValue={data?.focusValue || undefined}
                projects={data?.projects?.length ? [...data.projects].map(p => ({ ...p, image: p.image ?? '', description: p.description as any })) as any : undefined}
                ctaTitle={data?.ctaTitle || undefined}
                ctaDescription={data?.ctaDescription as any}
                ctaButtonText={data?.ctaButtonText || undefined}
                ctaButtonHref={data?.ctaButtonHref || undefined}
            />
            <SeoLinks internalLinks={data?.internalLinks} externalLinks={data?.externalLinks} />
        </>
    )
}
