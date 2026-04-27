import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import FirePitClient from './FirePitClient'
import SeoLinks from '@/components/layout/SeoLinks'
import { resolveServicePage } from '@/lib/service-override'

export async function generateMetadata(): Promise<Metadata> {
    const entry = await reader.collections.servicePages.read('fire-pit').catch(() => null)
    return buildPageMetadata('fire-pit', {
        title: 'Custom Fire Pits & Fire Features | AquaVida Dallas',
        description: 'Bespoke stone fire pits and gas fire features. Enhance your Dallas backyard with architectural warmth and focal points.',
    }, entry)
}

export default async function Page() {
    const entry = await reader.collections.servicePages.read('fire-pit').catch(() => null)
    const resolvedEntry = await resolveServicePage(entry).catch(() => null)
    
    return (
        <>
            <FirePitClient override={resolvedEntry} />
            <SeoLinks internalLinks={entry?.internalLinks} externalLinks={entry?.externalLinks} />
        </>
    )
}
