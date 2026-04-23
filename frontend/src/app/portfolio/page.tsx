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
                faqItems={data?.faqItems?.length ? await Promise.all([...data.faqItems].map(async f => ({ ...f, answer: await f.answer() }))) : undefined}
                headerLabel={data?.headerLabel || undefined}
                headerTitle={data?.headerTitle || undefined}
                headerDescription={data?.headerDescription ? await data.headerDescription() : undefined}
                curationLabel={data?.curationLabel || undefined}
                curationValue={data?.curationValue || undefined}
                focusLabel={data?.focusLabel || undefined}
                focusValue={data?.focusValue || undefined}
                projects={data?.projects?.length ? await Promise.all([...data.projects].map(async p => ({ ...p, image: p.image ?? '', description: await p.description() }))) : undefined}
                ctaTitle={data?.ctaTitle || undefined}
                ctaDescription={data?.ctaDescription ? await data.ctaDescription() : undefined}
                ctaButtonText={data?.ctaButtonText || undefined}
                ctaButtonHref={data?.ctaButtonHref || undefined}
            />
            <SeoLinks internalLinks={data?.internalLinks} externalLinks={data?.externalLinks} />
        </>
    )
}
