import type { Metadata } from 'next'
import { reader } from '@/lib/keystatic-reader'
import { buildPageMetadata } from '@/lib/seo'
import ServicesClient, { type ServiceItem, type TestimonialItem } from './ServicesClient'

export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata('services', {
        title: 'Services | AquaVida Pools and Spas',
        description: 'Custom pool construction, outdoor kitchens, fire pits, pergolas, and more — precision-engineered for Dallas luxury living.',
    })
}

export default async function Page() {
    const data = await reader.singletons.servicesPage.read().catch(() => null)
    return (
        <ServicesClient
            initialServices={data?.services?.length ? [...data.services].map(s => ({ ...s })) as ServiceItem[] : undefined}
            initialTestimonials={data?.testimonials?.length ? [...data.testimonials].map(t => ({ ...t })) as TestimonialItem[] : undefined}
            initialFaqItems={data?.faqItems?.length ? [...data.faqItems].map(f => ({ ...f })) : undefined}
        />
    )
}
