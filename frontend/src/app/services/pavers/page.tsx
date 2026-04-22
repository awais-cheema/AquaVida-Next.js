import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PaverClient from './PaverClient'
import SeoLinks from '@/components/layout/SeoLinks'
import { resolveServicePage } from '@/lib/service-override'

export async function generateMetadata(): Promise<Metadata> {
    const entry = await reader.collections.servicePages.read('pavers').catch(() => null)
    return buildPageMetadata('pavers', {
        title: 'Patio Extensions & Paver Hardscapes | AquaVida Dallas',
        description: 'Premium hardscape solutions in Dallas, TX. Custom patio extensions and stone paving engineered for both beauty and Texas soil stability.',
    }, entry)
}

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pavers').catch(() => null)
    const resolvedEntry = await resolveServicePage(entry)
    
    return (
        <>
            <PaverClient override={resolvedEntry} />
            <SeoLinks internalLinks={entry?.internalLinks} externalLinks={entry?.externalLinks} />
        </>
    )
}
