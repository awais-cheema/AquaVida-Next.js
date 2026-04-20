import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PoolRemodelingClient from './PoolRemodelingClient'

export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata('pool-remodeling', {
        title: 'Pool Remodeling | AquaVida Pools and Spas',
        description: 'Expert pool renovation and remodeling in Dallas, TX — resurfacing, technology upgrades, and complete transformations.',
    })
}

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pool-remodeling').catch(() => null)
    return <PoolRemodelingClient override={entry ?? null} />
}
