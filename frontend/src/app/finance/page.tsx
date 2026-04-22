import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import FinancingClient from './FinancingClient'
import SeoLinks from '@/components/layout/SeoLinks'

export async function generateMetadata(): Promise<Metadata> {
    const data = await reader.singletons.financePage.read().catch(() => null)
    return buildPageMetadata('finance', {
        title: 'Financing | AquaVida Pools and Spas',
        description: 'Flexible financing options for your custom pool or outdoor living project — partnered with leading lenders for competitive rates.',
    }, data)
}

export default async function Page() {
    const data = await reader.singletons.financePage.read().catch(() => null)
    return (
        <>
            <FinancingClient 
                partners={(data as any)?.partners?.length ? [...(data as any).partners].map((p: any) => ({ ...p, insight: p.insight as any })) : undefined} 
                faqItems={(data as any)?.faqItems?.length ? [...(data as any).faqItems].map((f: any) => ({ ...f, answer: f.answer as any })) : undefined} 
                comparison={(data as any)?.comparison?.length ? [...(data as any).comparison].map((c: any) => ({ ...c })) : undefined}
            />
            <SeoLinks internalLinks={data?.internalLinks} externalLinks={data?.externalLinks} />
        </>
    )
}
