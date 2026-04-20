import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PortfolioClient from './PortfolioClient'

export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata('portfolio', {
        title: 'Portfolio | AquaVida Pools and Spas',
        description: 'Explore our curated archive of high-end aquatic architecture and luxury outdoor living spaces.',
    })
}

export default async function PortfolioPage() {
    const data = await reader.singletons.portfolioListingPage.read().catch(() => null)
    const faqItems = data?.faqItems?.length ? [...data.faqItems].map(f => ({ ...f })) : undefined
    return <PortfolioClient faqItems={faqItems} />
}
