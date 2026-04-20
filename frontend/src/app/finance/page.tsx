import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import FinancingClient from './FinancingClient'

export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata('finance', {
        title: 'Financing | AquaVida Pools and Spas',
        description: 'Flexible financing options for your custom pool or outdoor living project — partnered with leading lenders for competitive rates.',
    })
}

export default async function Page() {
    const data = await reader.singletons.financePage.read().catch(() => null)
    return (
        <FinancingClient
            partners={data?.partners?.length ? data.partners : null}
            faqItems={data?.faqItems?.length ? data.faqItems : null}
        />
    )
}
