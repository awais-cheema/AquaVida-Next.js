import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import OutdoorKitchensClient from './OutdoorKitchensClient'
import SeoLinks from '@/components/layout/SeoLinks'
import { resolveServicePage } from '@/lib/service-override'

export async function generateMetadata(): Promise<Metadata> {
    const entry = await reader.collections.servicePages.read('outdoor-grill').catch(() => null)
    return buildPageMetadata('outdoor-grill', {
        title: 'Outdoor Kitchens & Grills | AquaVida Dallas',
        description: 'Custom outdoor kitchen design and fabrication in Dallas, TX. High-performance culinary spaces built for the Texas lifestyle.',
    }, entry)
}

export default async function Page() {
    const entry = await reader.collections.servicePages.read('outdoor-grill').catch(() => null)
    const resolvedEntry = await resolveServicePage(entry).catch(() => null)
    
    return (
        <>
            <OutdoorKitchensClient override={resolvedEntry} />
            <SeoLinks internalLinks={entry?.internalLinks} externalLinks={entry?.externalLinks} />
        </>
    )
}
