import { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import PortfolioClient from './PortfolioClient'

export const metadata: Metadata = {
    title: 'Portfolio | AquaVida Pools and Spas',
    description: 'Explore our curated archive of high-end aquatic architecture and luxury outdoor living spaces.',
}

export default async function PortfolioPage() {
    const data = await reader.singletons.portfolioListingPage.read().catch(() => null)
    const faqItems = data?.faqItems?.length ? [...data.faqItems].map(f => ({ ...f })) : undefined
    return <PortfolioClient faqItems={faqItems} />
}
