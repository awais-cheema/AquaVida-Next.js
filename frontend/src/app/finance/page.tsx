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
    
    // Resolve rich text and complex nested fields
    const partners = (data as any)?.partners?.length 
        ? await Promise.all([...(data as any).partners].map(async (p: any) => ({ 
            ...p, 
            insight: await p.insight()
          }))) 
        : undefined

    const faqItems = (data as any)?.faqItems?.length 
        ? await Promise.all([...(data as any).faqItems].map(async (f: any) => ({ 
            ...f, 
            answer: await f.answer() 
          }))) 
        : undefined

    return (
        <>
            <FinancingClient 
                partners={partners} 
                faqItems={faqItems} 
                comparison={(data as any)?.comparison}
                // Pass new hero/cta fields
                heroLabel={data?.heroLabel}
                heroTitle={data?.heroTitle}
                heroDescription={data?.heroDescription}
                heroImage={data?.heroImage}
            />
            <SeoLinks internalLinks={data?.internalLinks} externalLinks={data?.externalLinks} />
        </>
    )
}
