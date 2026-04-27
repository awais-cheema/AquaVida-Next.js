import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PergolaClient from './PergolaClient'
import SeoLinks from '@/components/layout/SeoLinks'
import { resolveServicePage } from '@/lib/service-override'

export async function generateMetadata(): Promise<Metadata> {
    const entry = await reader.collections.servicePages.read('pergola-design').catch(() => null)
    return buildPageMetadata('pergola-design', {
        title: 'Custom Pergola Design & Construction | AquaVida Dallas',
        description: 'Architectural shade solutions for Dallas outdoor living. Custom pergolas and pavilions designed for durability and aesthetic impact.',
    }, entry)
}

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pergola-design').catch(() => null)
    const resolvedEntry = await resolveServicePage(entry).catch(() => null)
    
    return (
        <>
            <PergolaClient override={resolvedEntry} />
            <SeoLinks internalLinks={entry?.internalLinks} externalLinks={entry?.externalLinks} />
        </>
    )
}
