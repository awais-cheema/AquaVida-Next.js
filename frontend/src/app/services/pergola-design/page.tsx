import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PergolaClient from './PergolaClient'

export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata('pergola-design', {
        title: 'Pergola Design | AquaVida Pools and Spas',
        description: 'Custom pergola design and construction in Dallas, TX — architectural shade structures in cedar, redwood, and aluminum.',
    })
}

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pergola-design').catch(() => null)
    return <PergolaClient override={entry ?? null} />
}
