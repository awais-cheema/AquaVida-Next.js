import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PoolRemodelingClient from './PoolRemodelingClient'
import SeoLinks from '@/components/layout/SeoLinks'
import { resolveServicePage } from '@/lib/service-override'

export async function generateMetadata(): Promise<Metadata> {
    const entry = await reader.collections.servicePages.read('pool-remodeling').catch(() => null)
    return buildPageMetadata('pool-remodeling', {
        title: 'Pool Remodeling & Renovation | AquaVida Dallas',
        description: 'Complete pool transformation services in Dallas, TX. Modernize your aquatic space with new finishes, equipment, and structural updates.',
    }, entry)
}

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pool-remodeling').catch(() => null)
    const resolvedEntry = await resolveServicePage(entry).catch(() => null)
    
    return (
        <>
            <PoolRemodelingClient override={resolvedEntry} />
            <SeoLinks internalLinks={entry?.internalLinks} externalLinks={entry?.externalLinks} />
        </>
    )
}
