import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PaverClient from './PaverClient'
import SeoLinks from '@/components/layout/SeoLinks'

export async function generateMetadata(): Promise<Metadata> {
    const entry = await reader.collections.servicePages.read('pavers').catch(() => null)
    return buildPageMetadata('pavers', {
        title: 'Paver Installation | AquaVida Pools and Spas',
        description: 'Custom paver design and installation in Dallas, TX — natural stone, travertine, and concrete solutions for luxury outdoor living.',
    }, entry)
}

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pavers').catch(() => null)
    return (
        <>
            <PaverClient override={entry ?? null} />
            <SeoLinks internalLinks={entry?.internalLinks} externalLinks={entry?.externalLinks} />
        </>
    )
}
