import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PoolRemodelingClient from './PoolRemodelingClient'
import SeoLinks from '@/components/layout/SeoLinks'

export async function generateMetadata(): Promise<Metadata> {
    const entry = await reader.collections.servicePages.read('pool-remodeling').catch(() => null)
    return buildPageMetadata('pool-remodeling', {
        title: 'Pool Remodeling | AquaVida Pools and Spas',
        description: 'Expert pool renovation and remodeling in Dallas, TX — resurfacing, technology upgrades, and complete transformations.',
    }, entry)
}

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pool-remodeling').catch(() => null)
    return (
        <>
            <PoolRemodelingClient override={entry ?? null} />
            <SeoLinks internalLinks={entry?.internalLinks} externalLinks={entry?.externalLinks} />
        </>
    )
}
