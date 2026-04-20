import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PaverClient from './PaverClient'

export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata('pavers', {
        title: 'Paver Installation | AquaVida Pools and Spas',
        description: 'Custom paver design and installation in Dallas, TX — natural stone, travertine, and concrete solutions for luxury outdoor living.',
    })
}

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pavers').catch(() => null)
    return <PaverClient override={entry ?? null} />
}
