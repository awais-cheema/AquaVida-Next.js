import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PoolConstructionClient from './PoolConstructionClient'

export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata('pool-construction', {
        title: 'Pool Construction | AquaVida Pools and Spas',
        description: 'Expert custom pool construction in Dallas, TX — gunite, fiberglass, and infinity-edge pools engineered to perfection.',
    })
}

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pool-construction').catch(() => null)
    return <PoolConstructionClient override={entry ?? null} />
}
