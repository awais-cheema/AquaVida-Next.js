'use client'

import CmsContent from '@/components/cms/CmsContent'

const contactItems = [
    {
        label: 'Email',
        value: 'info@aquavidapoolsandspas.com',
        href: 'mailto:info@aquavidapoolsandspas.com',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                 strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="2,4 12,13 22,4" />
            </svg>
        ),
    },
    {
        label: 'Phone',
        value: '+1 469-587-6255',
        href: 'tel:+14695876255',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                 strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
        ),
    },
    {
        label: 'Address',
        value: '2100 N Greenville Ave, Richardson, TX 75082',
        href: 'https://maps.app.goo.gl/Vv5TYqKWVKtWKj4q7',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                 strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
            </svg>
        ),
    },
]

const DEFAULT_SECTIONS = [
    { heading: '1. Services and Scope of Work', body: 'Aquavida Pools and Spas is a company that focuses on the creation, construction and upkeep of swimming pools, spas and exterior living features such as patios, kitchens and water elements. The schedule of a project might be changed due to circumstances such as weather, the availability of materials or the regulations of the municipal permits.' },
    { heading: '2. Quotes and Pricing', body: 'Any pricing available online or via automated tools should only be seen as indicative; final project quotes will only be provided after an in-person consultation and site evaluation has taken place; these quotes remain valid for 30 days (unless specified differently).' },
    { heading: '3. Payments and Financing', body: 'Your individual contract will outline a standard payment schedule tied to construction milestones, with payments needed on time to avoid project delays. Financing options such as HFS Financial are provided through third-party lenders (not Aquavida Pools and Spas). Aquavida Pools and Spas is not responsible for loan terms, approval or denial decisions made by these third-party lenders.' },
    { heading: '4. Permits and HOA Approvals', body: 'Customers are solely responsible for procuring city permits, inspections and approvals — we cannot be held liable for delays caused by HOA approval processes that fall outside our purview or municipal reviews that happen independently from us.' },
    { heading: '5. Warranties', body: "Most pool contracts include a structural warranty; other items, like pumps and heaters, are covered by separate manufacturer's warranties whose conditions and limitations can be found within documentation. Any issues surrounding the warranty must be handled in accordance with your signed agreement terms." },
    { heading: '6. Intellectual Property', body: "All texts, images, logos and designs found herein belong solely to Aquavida Pools and Spas and may not be copied or redistributed without our prior written approval. In addition, we may use photos from clients' projects for promotional purposes, unless they have made a clear written refusal." },
    { heading: '7. Limitation of Liability', body: 'Aquavida Pools and Spas LLC will not accept responsibility for damages sustained from use of our website, including an error-free browsing experience or legal disputes that arise as a result thereof. Any legal matters will be subject to Texas state law jurisdiction.' },
]

interface TermsData {
    sections?: ReadonlyArray<{ readonly heading: string; readonly body: any }> | { heading: string; body: any }[]
}

export default function TermsConditionsClient({ data }: { data?: TermsData | null }) {
    const sections = data?.sections?.length ? data.sections : DEFAULT_SECTIONS

    return (
        <main className="min-h-screen" style={{ background: '#05070A' }}>

            {/* ── Hero ── */}
            <section
                className="relative overflow-hidden pt-32 pb-20 sm:pt-36 sm:pb-24 md:pt-44 md:pb-32 px-5"
                style={{ background: 'linear-gradient(160deg, #05070A 0%, #0f1923 60%, #05070A 100%)' }}
            >
                <div aria-hidden="true"
                     className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-10"
                     style={{ background: 'radial-gradient(circle, #00d4aa 0%, transparent 70%)' }} />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <span className="inline-block uppercase tracking-[0.25em] font-bold mb-4 sm:mb-6"
                          style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)', color: '#00d4aa' }}>
                        Legal
                    </span>

                    <h1 className="font-black text-white leading-tight mb-5 sm:mb-7"
                        style={{ fontSize: 'clamp(2.4rem, 7vw, 5rem)' }}>
                        Terms &amp;{' '}
                        <span style={{ color: '#00d4aa' }}>Conditions</span>
                    </h1>

                    <p className="font-medium mx-auto"
                       style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: '#8ba3bc', maxWidth: '620px', lineHeight: 1.7 }}>
                        Please read these terms carefully before engaging with AquaVida Pools and Spas
                        for any of our services.
                    </p>

                    <div className="mt-8 sm:mt-10 mx-auto h-px w-24"
                         style={{ background: 'linear-gradient(90deg, transparent, #00d4aa, transparent)' }} />
                </div>
            </section>

            {/* ── Content ── */}
            <section className="px-5 pb-24 sm:pb-32">
                <div className="max-w-3xl mx-auto">

                    {/* Effective date + intro */}
                    <div className="rounded-2xl px-6 py-5 mb-12 sm:mb-16"
                         style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.15)' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="1.8"
                                 strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0" aria-hidden="true">
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <p style={{ color: '#8ba3bc', fontSize: '0.875rem' }}>
                                <span className="font-bold text-white">Effective Date:</span>&nbsp;January 1, 2026
                            </p>
                        </div>
                        <p className="font-medium leading-relaxed"
                           style={{ color: '#8ba3bc', fontSize: 'clamp(0.875rem, 1.8vw, 1rem)', lineHeight: 1.85 }}>
                            These Terms &amp; Conditions cover Aquavida Pools and Spas website services and websites
                            provided. By using all or any part of our services, you indicate your acceptance and
                            agreement to these terms of use.
                        </p>
                    </div>

                    {/* Numbered sections */}
                    <div className="flex flex-col gap-10 sm:gap-14">
                        {sections.map((sec, idx) => (
                            <article key={idx}>
                                <h2 className="font-black text-white mb-3 sm:mb-4"
                                    style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)' }}>
                                    {sec.heading}
                                </h2>
                                <div className="h-px mb-4 sm:mb-5"
                                     style={{ background: 'rgba(0,212,170,0.12)' }} />
                                <CmsContent
                                   content={sec.body}
                                   className="font-medium leading-relaxed"
                                />
                            </article>
                        ))}

                        {/* Contact section */}
                        <article>
                            <h2 className="font-black text-white mb-3 sm:mb-4"
                                style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)' }}>
                                Contact Information
                            </h2>
                            <div className="h-px mb-5 sm:mb-6"
                                 style={{ background: 'rgba(0,212,170,0.12)' }} />
                            <p className="font-medium mb-6"
                               style={{ color: '#8ba3bc', fontSize: 'clamp(0.875rem, 1.8vw, 1rem)', lineHeight: 1.85 }}>
                                For inquiries related to these terms and their definitions, contact us:
                            </p>
                            <div className="flex flex-col gap-4">
                                {contactItems.map(({ label, value, href, icon }) => (
                                    <a key={label}
                                       href={href}
                                       target={label === 'Address' ? '_blank' : undefined}
                                       rel={label === 'Address' ? 'noopener noreferrer' : undefined}
                                       className="contact-card flex items-start gap-4 rounded-xl px-5 py-4 transition-all duration-300">
                                        <span style={{ color: '#00d4aa' }} className="mt-0.5">{icon}</span>
                                        <div>
                                            <span className="block font-black uppercase tracking-widest mb-0.5"
                                                  style={{ color: '#5a7a96', fontSize: '0.7rem' }}>
                                                {label}
                                            </span>
                                            <span className="font-medium"
                                                  style={{ color: '#8ba3bc', fontSize: 'clamp(0.875rem, 1.8vw, 1rem)' }}>
                                                {value}
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </article>
                    </div>

                </div>
            </section>

        </main>
    )
}
