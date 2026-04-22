'use client'

import CmsContent from '@/components/cms/CmsContent'

type Section = { heading: string; body: any; items?: ReadonlyArray<string> | string[] }

interface PrivacyData {
    effectiveDate?: string
    intro?: any
    sections?: ReadonlyArray<{ readonly heading: string; readonly body: string; readonly items?: ReadonlyArray<string> }> | Section[]
}

const DEFAULT_EFFECTIVE_DATE = 'January 1, 2026'
const DEFAULT_INTRO = "AquaVida Pools and Spas\u2019 Privacy Policy details how it collects, uses and safeguards personal information provided to us from visitors and clients of AquaVida Pools and Spas. By engaging our services, you agree to the data practices described."

const DEFAULT_SECTIONS: Section[] = [
    {
        heading: 'Information Acquisition and Use',
        body: "As part of your engagement with our services or website, we may collect certain personally identifiable data in order to facilitate communication and service provision. This could include, but isn't limited to:",
        items: ['First and Last name', 'Email and phone numbers (for communication with them)', 'Mailing address with City/State and ZIP/Postal code', 'Usage data as well as browser cookies'],
    },
    {
        heading: 'Usage Data and Tracking',
        body: "Every time you visit our website, our servers automatically collect information that's sent from your browser or mobile device — such as IP address, browser type, pages visited and duration of stay. Cookies or similar tracking technologies may be employed in order to assess site traffic and optimize the user experience; you may manage these preferences through browser settings; however, some website features may become inaccessible due to this change in preference settings.",
    },
    {
        heading: 'Purpose of Data Processing',
        body: 'Information gathered for various professional purposes includes:',
        items: ['To provide and manage our pool construction and maintenance services.', 'Maintaining client accounts and registering projects.', 'Keeping everyone abreast of project developments, security alerts, or marketing offers.', 'To fulfill legal obligations and limit liabilities.'],
    },
    {
        heading: 'Sharing and Dissemination',
        body: 'AquaVida Pools and Spas will never sell your personal information. However, bona fide third-party service providers who assist us with our operations, such as payment processors or analytics providers, will have access to it. Under certain conditions, we may share data if required by law or as part of an asset sale transaction or merger deal transaction.',
    },
    {
        heading: 'Security and Retention',
        body: 'We implement commercially reasonable security measures to maintain the confidentiality and integrity of your personal data, though no method of electronic storage or transmission over the internet can ever be entirely safe. Your information will only remain with us as long as necessary to fulfill its intended use or meet legal obligations.',
    },
    {
        heading: 'Your Rights',
        body: 'According to GDPR regulations, you have the right to request access, correction and deletion of data stored about you. Should you wish to exercise these rights, please reach out to us through info@aquavidapoolsandspas.com',
    },
]

export default function PrivacyPolicyClient({ data }: { data?: PrivacyData | null }) {
    const effectiveDate = data?.effectiveDate || DEFAULT_EFFECTIVE_DATE
    const intro = data?.intro || DEFAULT_INTRO
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
                        Privacy{' '}
                        <span style={{ color: '#00d4aa' }}>Policy</span>
                    </h1>

                    <p className="font-medium mx-auto"
                       style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: '#8ba3bc', maxWidth: '620px', lineHeight: 1.7 }}>
                        Your privacy matters to us. This policy explains how AquaVida Pools and Spas
                        handles your personal information.
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
                                <span className="font-bold text-white">Effective Date:</span>&nbsp;{effectiveDate}
                            </p>
                        </div>
                        <CmsContent
                            content={intro}
                            className="font-medium leading-relaxed"
                        />
                    </div>

                    {/* Policy sections */}
                    <div className="flex flex-col gap-10 sm:gap-14">
                        {sections.map((sec, idx) => (
                            <article key={idx}>
                                <h2 className="font-black text-white mb-3 sm:mb-4"
                                    style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)' }}>
                                    {sec.heading}
                                </h2>
                                <div className="h-px mb-4 sm:mb-5"
                                     style={{ background: 'rgba(0,212,170,0.12)' }} />
                                <div className="flex flex-col gap-4">
                                    {sec.body && (
                                        <CmsContent
                                            content={sec.body}
                                            className="font-medium leading-relaxed"
                                        />
                                    )}
                                    {sec.items?.length ? (
                                        <ul className="flex flex-col gap-2 pl-1">
                                            {sec.items.map((item, j) => (
                                                <li key={j} className="flex items-start gap-3 font-medium"
                                                    style={{ color: '#8ba3bc', fontSize: 'clamp(0.875rem, 1.8vw, 1rem)', lineHeight: 1.8 }}>
                                                    <span className="mt-[0.45em] shrink-0 w-1.5 h-1.5 rounded-full"
                                                          style={{ background: '#00d4aa' }} aria-hidden="true" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </div>
                            </article>
                        ))}
                    </div>

                </div>
            </section>
        </main>
    )
}
