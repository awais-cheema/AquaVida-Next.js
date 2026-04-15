import { Metadata } from 'next';
import Link from 'next/link';
import { getPageBySlug } from '@/lib/api';
import { SITE_URL } from '@/lib/constants';
import JsonLd from '@/components/seo/JsonLd';
import { Compass, Leaf, Settings } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
    try {
        const page = await getPageBySlug('about');
        const seo = page.seo;
        return {
            title: seo?.effective_title || 'About Us | AquaVida',
            description: seo?.meta_description || 'Learn about our mission, vision, and team at AquaVida.',
            openGraph: {
                title: seo?.og_title || 'About Us | AquaVida',
                description: seo?.og_description,
                url: `${SITE_URL}/about`,
                images: seo?.og_image_url ? [seo.og_image_url] : [],
            },
            alternates: { canonical: seo?.canonical_url || `${SITE_URL}/about` },
        };
    } catch {
        return { title: 'About Us | AquaVida' };
    }
}

const methodology = [
    {
        icon: Compass,
        title: 'Site Integration',
        body: 'We analyze topography, sunlight, and architecture to ensure the water feature feels like a natural extension of the site.',
    },
    {
        icon: Leaf,
        title: 'Lush Ecology',
        body: 'Selection of native flora and advanced filtration systems that harmonize with the local ecosystem.',
    },
    {
        icon: Settings,
        title: 'Fluid Precision',
        body: 'Precision engineering meets artistic tile work to create water surfaces that mirror the sky with absolute clarity.',
    },
];

const team = [
    { name: 'Julian Sterling', role: 'Principal Designer', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcs_1y9kdwgK2JytQUd40Ih2n8TQa8QfhhZ9Ek9uSFNoVVrvL3fxwYDJEOynJuyUH2lcaqUC75Xbb1JONYqGHqaPOEjOvs4_4dSRRazIBRyT20G-FfEh-weFrimajpsw9CfI0iT-HDu7GVKxEcFre6Sp7XElxldpy9IEyIE4aqJY9gtoLYXpWDLcvWcLnUqNL9-ceBYdoS_d5d-OB5VvWWR4W2LR4O3HknSP4Jt_3u3NnfnoI-A4mrUuHMaqYvq-dLlkgFqBuVi4RB' },
    { name: 'Elena Thorne', role: 'Landscape Lead', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtRMFxHbLBua3EikFmqvYe9UpyCZoTUWTtPphIQ75qZpDK3zsQzXtO47zW1d6t0KS79hp-jOSFcuFL6CoOV08JTdmvPXVE2IjAUPgT7oSD1I6udSNLB7j1bOs0RJmal6ceyD81YJpZsbNiMFFflX6pJVqXgMVX9ezGtJMshqV1RCUJ56gHiqHyDDGL2a88xQ36InfZehKqwOws_iqreXiQCTSMDwzfPBeOEACllK8ESJrOFeZTi1jBBwf0dC8sPQ5tNY3thujADdaO' },
    { name: 'Marcus Chen', role: 'Hydraulic Engineer', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9as_Cx9iscdnp92FzQh9AplLFN3CjUF7uoIdL2eRNokREpCXOZFDA3O6_Jn6FqYvO8z_vplaQkKzM_TIICXgH58divl4mTNlZSR9EHC4crlxdcHGo-vKeqZ_5sIUkC5csj8_dIDQEPjERwMsDIZfMxAmtbwXz5ue5HnL0m1w3et8U4ZU3n-BwruDEZK8pnqQ-awm3x0KX4q6tiksoaVlnrwPEwuRbcv60efBWId2_bQcMCc9I9cwITZsWlxUhNNLyBDTou2sbsROc' },
    { name: 'Sarah Vance', role: 'Project Manager', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF63jVNoEBGqC5HFqQexZG2RN_0_vJ2soS17UwBuCywLkuS54CSg7-WgRUsj5gfvLuVEHRkspfJMwkef6Wdp_8hzIHY1kjYusV3CLrDQZEVZ-jgnzeBxQcEXHUnXHc9BM_xKw1kdzYqtkV0Rx8XaPs7AYGALIS2SXtn9I-0dNzW9vFp0I1incRA-XCD-yoO9wvNdhOanMwj2IThjqAvtTm9KF-NsntEVwhv7norbKNRmC0F40xL2oY2QYp_DvOTFzrYN54sC-GyNGg' },
];

export default async function AboutPage() {
    let jsonLd: Record<string, any> = {};
    try {
        const page = await getPageBySlug('about');
        jsonLd = page.seo?.json_ld || {};
    } catch { /* fallback */ }

    return (
        <>
            <JsonLd data={jsonLd} />
            <div className="flex flex-col flex-1 w-full">

                {/* ── Hero ── */}
                <section className="px-6 md:px-12 w-full py-8 md:py-12" aria-labelledby="about-hero-heading">
                    <div className="max-w-7xl w-full mx-auto">
                        <div
                            className="relative overflow-hidden rounded-3xl min-h-[500px] flex flex-col justify-end bg-background-dark"
                            style={{
                                backgroundImage: 'linear-gradient(to top, rgba(13,10,7,0.92) 0%, rgba(13,10,7,0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmOvrLFaWf0b3qTKPYAqMk7c0aUop-OdNlw3fRDeEun5r2JIKdls_eC1yWP8UDJSc7bBjpWyVK9nE6-55JhAJ_0AGM9Q9liLmypClMQV6hzgpFyrQy9Pv-aAE7K85rO5HYGWIB6XEtORxqORxqG9itUK3ycI-B0Sup9jpXXYqU58Mq1qujhQkpMwGzhuA39SL01UTzyupL4ADpl--UkyblQOK63yDENXrmZsaAFyB9AuKAnE7fc8Se9igQ81BaqZvAbRnW72_TJIgR")',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="p-8 md:p-16 max-w-3xl">
                                <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block backdrop-blur-sm">
                                    Our Philosophy
                                </span>
                                <h1 id="about-hero-heading" className="text-white text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
                                    The Art of Outdoor Luxury
                                </h1>
                                <p className="text-white/80 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl">
                                    Crafting aquatic masterpieces that serve as the heartbeat of your home&apos;s exterior architecture.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Vision ── */}
                <section className="px-6 md:px-12 w-full py-16 bg-white/[0.03]" aria-labelledby="about-vision-heading">
                    <div className="max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <p className="text-primary text-sm font-bold uppercase tracking-[0.2em] mb-4">The Vision</p>
                            <h2 id="about-vision-heading" className="text-white text-3xl sm:text-4xl font-black leading-tight mb-6">
                                Redefining the boundary between home and nature.
                            </h2>
                            <p className="text-white/65 text-lg leading-relaxed mb-8">
                                At Aqua Vida, we believe a pool is more than a utility—it is the centerpiece of a lifestyle. Our philosophy blends outdoor luxury with sustainable engineering to create private sanctuaries that reflect the soul of the landscape.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="border-l-4 border-primary pl-4">
                                    <h3 className="font-bold text-2xl text-white">150+</h3>
                                    <p className="text-white/55 text-sm">Bespoke Projects</p>
                                </div>
                                <div className="border-l-4 border-primary pl-4">
                                    <h3 className="font-bold text-2xl text-white">12</h3>
                                    <p className="text-white/55 text-sm">Design Awards</p>
                                </div>
                            </div>
                        </div>
                        <div
                            className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                            style={{
                                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAt4stVbtWQZ7BIz05-xCZAz5TcgVUCyuaVhq-Dw85CuUkiRWBcQQLTk766O7vlagn_KtGiZJW7cQLNZ52Nf101Oy3eyWYbVkyThKyyz8jH4REurbe9huAgUOtpf1dhOkVzD9W9jUrt1R1SFkGYwweqxeBZQu5DmDENdIkfD0xcOEBTBuXUvVFI9k-DKF6qCa8hcj0aFDhabjNSAZTPSwWhYbbnMw8IiGggtbyNeKdQznydyWvZB5dWj0BpN-nr6tNAY-fxa6bOpgFn")',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                            role="img"
                            aria-label="AquaVida pool design showcase"
                        />
                    </div>
                </section>

                {/* ── Methodology ── */}
                <section className="px-6 md:px-12 w-full py-20" aria-labelledby="about-method-heading">
                    <div className="max-w-7xl w-full mx-auto">
                        <header className="text-center mb-16 flex flex-col items-center">
                            <p className="text-primary text-sm font-bold uppercase tracking-[0.2em] mb-4">Our Process</p>
                            <h2 id="about-method-heading" className="text-white text-3xl sm:text-4xl font-black">
                                Design Methodology
                            </h2>
                        </header>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {methodology.map(({ icon: Icon, title, body }) => (
                                <article key={title} className="p-8 bg-white/[0.04] rounded-2xl border border-white/10 hover:border-primary/50 hover:bg-white/[0.07] transition-all">
                                    <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center text-primary mb-6 border border-primary/20" aria-hidden="true">
                                        <Icon size={20} strokeWidth={1.75} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
                                    <p className="text-white/60 leading-relaxed text-sm">{body}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Team ── */}
                <section className="px-6 md:px-12 w-full py-20 bg-background-dark overflow-hidden relative" aria-labelledby="about-team-heading">
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA3KobJOFkbz3j0_CNU1S5P8dumAqx58vL1CFqA65p39tApyL01n3hP-fukLBoJRydB-6_hKuyAIfJ_NNR8flOfOdXq_NkjlooSh8v8gl7ERz1O5oQPTE73Ppudy0vJg6enCNUq865AnhLJr6wTxiQv4UGpFVt-NLltDljc-bYccFq_kZBW4og7QD2BiRJdxYy56VEaWmZBsYG_SwCVFbDAkflAQxYXPEh_2KQgnQhdHPEcmmtrmZsKRLIjV3BDztsDMSyhJK7KFF3G")',
                            backgroundSize: 'cover',
                        }}
                        aria-hidden="true"
                    />
                    <div className="max-w-7xl w-full mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                            <div className="max-w-xl">
                                <p className="text-primary text-sm font-bold uppercase tracking-[0.2em] mb-4">The Artisans</p>
                                <h2 id="about-team-heading" className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                                    Mastery in Every Drop
                                </h2>
                            </div>
                            <p className="text-white/65 max-w-sm">
                                Our multidisciplinary team of landscape architects and hydraulic engineers work in unison to deliver excellence.
                            </p>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4" role="list" aria-label="Team members">
                            {team.map(({ name, role, src }) => (
                                <div key={name} role="listitem" className="group relative h-80 rounded-xl overflow-hidden ring-1 ring-white/10">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url("${src}")` }}
                                        role="img"
                                        aria-label={`Photo of ${name}`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" aria-hidden="true" />
                                    <div className="absolute bottom-4 left-4">
                                        <p className="font-bold text-white">{name}</p>
                                        <p className="text-xs text-primary font-bold uppercase">{role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Footer CTA ── */}
                <section className="px-6 md:px-12 w-full py-20 text-center flex flex-col items-center" aria-labelledby="about-cta-heading">
                    <div className="max-w-3xl mx-auto flex flex-col items-center">
                        <h2 id="about-cta-heading" className="text-3xl md:text-4xl font-black mb-8 text-white">
                            Ready to bring your vision to life?
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                aria-label="Start your pool project with AquaVida"
                                className="bg-primary text-white font-bold py-4 px-10 rounded-xl shadow-xl shadow-primary/25 hover:brightness-110 hover:-translate-y-0.5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
                            >
                                Start Your Project
                            </Link>
                            <Link
                                href="/portfolio"
                                aria-label="Browse the AquaVida portfolio"
                                className="border-2 border-primary text-primary font-bold py-4 px-10 rounded-xl hover:bg-primary/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
                            >
                                View Portfolio
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
