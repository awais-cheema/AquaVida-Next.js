import { reader } from '@/lib/keystatic-reader'
import ServicesClient, { type ServiceItem, type TestimonialItem } from './ServicesClient'

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
