import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import PoolDesignClient from './PoolDesignClient'
import SeoLinks from '@/components/layout/SeoLinks'

export async function generateMetadata(): Promise<Metadata> {
    const entry = await reader.collections.servicePages.read('pool-design').catch(() => null)
    return buildPageMetadata('pool-design', {
        title: 'Pool Design | AquaVida Pools and Spas',
        description: 'Visionary aquatic design in Dallas, TX — 3D-rendered pool concepts engineered for your specific site and lifestyle.',
    }, entry)
}

export default async function Page() {
    const entry = await reader.collections.servicePages.read('pool-design').catch(() => null)
    return (
        <>
            <PoolDesignClient override={entry ?? null} />
            <SeoLinks internalLinks={entry?.internalLinks} externalLinks={entry?.externalLinks} />
        </>
    )
}
