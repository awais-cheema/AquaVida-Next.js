import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PoolConstructionClient from './PoolConstructionClient'
import SeoLinks from '@/components/layout/SeoLinks'

import { resolveServicePage } from '@/lib/service-override'

export async function generateMetadata(): Promise<Metadata> {
    const entry = await reader.collections.servicePages.read('pool-construction').catch(() => null)
    return buildPageMetadata('pool-construction', {
        title: 'Pool Construction | AquaVida Pools and Spas',
        description: 'Expert custom pool construction in Dallas, TX — gunite, fiberglass, and infinity-edge pools engineered to perfection.',
    }, entry)
}

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pool-construction').catch(() => null)
    const resolvedEntry = await resolveServicePage(entry).catch(() => null)
    
    return (
        <>
            <PoolConstructionClient override={resolvedEntry} />
            <SeoLinks internalLinks={entry?.internalLinks} externalLinks={entry?.externalLinks} />
        </>
    )
}
