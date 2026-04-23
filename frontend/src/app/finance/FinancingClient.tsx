'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
    ArrowRight, Check, Shield, Percent, 
    DollarSign, Clock, Building2, SlidersHorizontal, 
    BarChart3, Lightbulb, ExternalLink
} from 'lucide-react';
import FAQ from '@/components/layout/FAQ';
import { getAssetUrl } from '@/lib/constants';
import CmsContent from '@/components/cms/CmsContent';

// ── Animation Presets (Kinetic) ────────────────────────────────────────────────
const kineticEntry = {
    initial: { opacity: 0, y: 40, scale: 0.98, rotateX: 5 },
    whileInView: { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        rotateX: 0,
        transition: { 
            duration: 1.2, 
            ease: [0.16, 1, 0.3, 1] 
        } 
    } as any,
    viewport: { once: true, margin: "-10%" } as any
};

const staggerContainer = {
    initial: {},
    whileInView: { 
        transition: { 
            staggerChildren: 0.1,
            delayChildren: 0.2
        } 
    }
};

const hoverScaleBloom = {
    whileHover: { 
        scale: 1.02, 
        y: -12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] }
    } as any,
    whileTap: { scale: 0.98 }
};

// ── Default Data ─────────────────────────────────────────────────────────────
const PARTNERS = [
    {
        key: 'vistafi',
        name: 'VISTAFI',
        subtitle: 'Frictionless Financing',
        details: 'Flexible Terms | Broad Credit Profiles | Renovation-Focused',
        insight: 'Vistafi pride ourselves on helping their clients find the best rates and terms to achieve their renovation project goals, regardless of their credit profile.',
        features: ['Rate and term matching', 'Options across credit profiles', 'Renovation project focused'],
        color: '#0D5699',
        logo: '/vistafi.png',
        href: 'https://vistafi.com/dynamic-contractor/?id=001UO00000lWM2L&accName=Aquavida%20Pools%20and%20Spas',
        ctaLabel: 'Engage with Vistafi'
    },
    {
        key: 'lyon',
        name: 'Lyon Financial',
        subtitle: 'The Pool Specialist',
        details: '$15K – $500K | Fixed Rates | Up to 20 Years',
        insight: 'Lyon works exclusively with pool & outdoor living loans. Their specialization means they understand the unique milestones of aquatic construction better than any general lender.',
        features: ['No home equity required', 'Direct-to-contractor payments', 'Fast pre-qualification'],
        color: '#0D5699',
        logo: '/lyon.png',
        href: 'https://www.lyonfinancial.net'
    },
    {
        key: 'hfs',
        name: 'HFS Financial',
        subtitle: 'Complete Site Versatility',
        details: 'Up to $500K | No Equity | Same-Day Pre-Qual',
        insight: 'HFS allows you to fund your entire outdoor master plan—pool, kitchen, patio, and landscaping—in a single streamlined application with industry-leading approval rates.',
        features: ['Coverage for all site work', 'Fixed rates from 6.99% APR', 'No prepayment penalties'],
        color: '#63B589',
        logo: '/hfs.png',
        href: 'https://www.hfsfinancial.net'
    },
    {
        key: 'viking',
        name: 'Viking Capital',
        subtitle: 'Strategic Rate Shopping',
        details: '$10K – $150K | Multi-Lender Network',
        insight: 'As a broker, Viking Capital shops multiple lenders simultaneously to secure the most competitive terms based specifically on your personal credit profile.',
        features: ['Broker model efficiency', 'Response within 24 hours', 'Specialists in pool brokering'],
        color: '#A68A33',
        logo: '/viking.png',
        href: 'https://www.vikingcapitalloan.com'
    },
    {
        key: 'heloc',
        name: 'HELOC',
        subtitle: 'Asset-Backed Flexibility',
        details: 'Equity-Based | Variable Rates | Max Draw',
        insight: 'A Home Equity Line of Credit utilizes your properties established value. It typically offers the lowest possible initial rate and maximum flexibility for drawn funds.',
        features: ['Draw only what you need', 'Potential tax deductions', 'Revolving credit line'],
        color: '#91792C',
        logo: '/heloc.png',
        href: '/contact'
    }
];

const COMPARISON = [
    { feature: 'Lender Type', vistafi: 'Direct', lyon: 'Specialist', hfs: 'Direct', viking: 'Broker', heloc: 'Bank' },
    { feature: 'Equity Needed', vistafi: 'No', lyon: 'No', hfs: 'No', viking: 'No', heloc: 'Yes' },
    { feature: 'Rate Type', vistafi: 'Mixed', lyon: 'Fixed', hfs: 'Fixed', viking: 'Mixed', heloc: 'Variable' },
    { feature: 'Max Term', vistafi: 'Varies', lyon: '20 Years', hfs: '20 Years', viking: '12 Years', heloc: '30 Years' },
    { feature: 'Approval', vistafi: 'Flexible', lyon: 'Fast', hfs: 'Same-Day', viking: '24 Hours', heloc: '2-6 Weeks' }
];

const FINANCE_FAQS = [
    {
        question: "What are the typical terms for a specialized pool loan?",
        answer: "Most of our partners offer terms ranging from 5 to 20 years. Shorter terms typically provide lower interest rates, while 20-year terms allow for the lowest possible monthly payment to keep your capital liquid."
    },
    {
        question: "Do I need home equity to qualify for HFS or Lyon?",
        answer: "No. Both Lyon Financial and HFS Financial specialize in signature-based lending, meaning your home's established equity is not required to secure the loan."
    },
    {
        question: "Can I bundle landscaping and outdoor kitchens into a single loan?",
        answer: "Yes. HFS Financial is specifically engineered to cover the entire 'outdoor living' master plan, including pool construction, landscaping, patio extensions, and custom outdoor kitchens."
    },
    {
        question: "How long does the approval process take?",
        answer: "HFS and Lyon typically provide a pre-qualification status within minutes. Full approval and funding coordination usually occur within 24–48 hours of document submission."
    },
    {
        question: "Are there penalties for early repayment?",
        answer: "Our primary partners—Lyon, HFS, and Viking—do not charge prepayment penalties, allowing you to pay off your investment ahead of schedule at your discretion."
    }
];

type PartnerOverride = { key: string; name: string; subtitle: string; details: string; insight: any; features: ReadonlyArray<string> | string[]; logo: string; href: string; ctaLabel?: string }
type FaqOverride = { question: string; answer: any }
type ComparisonItem = { feature: string; vistafi: string; lyon: string; hfs: string; viking: string; heloc: string }

interface FinancingClientProps {
    partners?: ReadonlyArray<PartnerOverride> | PartnerOverride[] | null
    faqItems?: ReadonlyArray<FaqOverride> | FaqOverride[] | null
    comparison?: ReadonlyArray<ComparisonItem> | ComparisonItem[] | null
    heroLabel?: string | null
    heroTitle?: string | null
    heroDescription?: string | null
    heroImage?: string | null
}

// ── Page Component ─────────────────────────────────────────────────────────────
export default function FinancingClient({ 
    partners: partnersOverride, 
    faqItems: faqOverride, 
    comparison: comparisonOverride,
    heroLabel,
    heroTitle,
    heroDescription,
    heroImage
}: FinancingClientProps = {}) {
    
    // Resolve dynamic values with defaults
    const activePartners = partnersOverride?.length
        ? partnersOverride.map(p => ({ 
            ...p, 
            color: PARTNERS.find(d => d.key === p.key)?.color ?? '#0D5699',
            logo: p.logo ? getAssetUrl(p.logo) : getAssetUrl(PARTNERS.find(d => d.key === p.key)?.logo || '')
          }))
        : PARTNERS.map(p => ({ ...p, logo: getAssetUrl(p.logo) }))

    const activeFaqs = faqOverride?.length ? [...faqOverride].map(f => ({ ...f })) : FINANCE_FAQS
    const activeComparison = comparisonOverride?.length ? comparisonOverride : COMPARISON
    
    const displayHeroLabel = heroLabel || "Investment Architecture"
    const displayHeroTitle = heroTitle || "Intelligent Investment"
    const displayHeroDesc  = heroDescription || "Curated financial partnerships engineered for high-performance capital. From specialists to flexible revolving credit."
    const displayHeroImage = heroImage ? getAssetUrl(heroImage) : getAssetUrl("/finance_hero.avif")

    const heroRef      = useRef(null);
    const carouselRef  = useRef<HTMLDivElement>(null);
    const [activeIdx,  setActiveIdx]  = useState(0);
    const [swipeHint,  setSwipeHint]  = useState(true);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;
        const onScroll = () => {
            const cardWidth = (el.children[0]?.children[0]?.clientWidth ?? 340) + 32;
            setActiveIdx(Math.round(el.scrollLeft / cardWidth));
            setSwipeHint(false);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
    };

    return (
        <div className="min-h-screen w-full bg-[#05070A] text-[#DCE3F0] font-allomira selection:bg-[#0D5699] selection:text-white select-text">
            
            {/* ── HERO ──────────────────────────────────────────────────────── */}
            <section ref={heroRef} className="relative h-[75vh] md:h-screen flex items-center overflow-hidden snap-start">
                <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0 opacity-40">
                    <Image 
                        src={displayHeroImage} 
                        alt="" 
                        fill 
                        className="object-cover scale-110 grayscale" 
                        priority 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#05070A] via-[#05070A]/85 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-[60vh] bg-gradient-to-t from-[#05070A] via-[#05070A]/95 to-transparent" />
                </motion.div>

                <div className="relative z-10 max-w-[1900px] mx-auto px-6 md:px-16 lg:px-24 w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -80 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-7xl"
                    >
                        <span className="inline-block text-[3.5vw] md:text-[1vw] font-bold tracking-[0.22em] md:tracking-[0.4em] uppercase mb-12 text-[#A68A33]">
                            {displayHeroLabel}
                        </span>
                        <h1 className="text-[12vw] md:text-[10vw] font-bold leading-[0.9] tracking-[-0.04em] mb-10 sm:mb-16 uppercase">
                            {displayHeroTitle}
                        </h1>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-12 sm:gap-16 mt-5 sm:mt-20">
                            <p className="text-[4.5vw] md:text-[1.6vw] text-white/60 leading-normal md:max-w-[50%] w-[100%] font-light">
                                {displayHeroDesc}
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0">
                                <Link href="/contact" className="w-[50vw] md:w-[16.5vw] btn group relative px-[2.3vw] py-4 bg-[#0D5699] text-white font-bold text-[4vw] md:text-[1.25vw] tracking-[0.05em] rounded-full overflow-hidden transition-all shadow-2xl flex items-center justify-center gap-[1.6vw] md:gap-4 whitespace-nowrap">
                                    Consult Advisor <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="relative z-20 space-y-12 pb-16">
                
                {/* ── PARTNERS GRID ────────────────────────────────────────────── */}
                <section className="relative px-6 md:px-16 lg:px-24 max-w-[1900px] mx-auto flex flex-col justify-start pt-0 md:pt-12 pb-12 snap-start overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-10">
                        <Image src={getAssetUrl("/structural_capital.avif")} alt="" fill className="object-cover grayscale" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#05070A] via-transparent to-[#05070A]" />
                    </div>
                    
                    <motion.div {...kineticEntry} className="relative z-10 mb-10">
                        <span className="text-[#63B589] font-black tracking-[0.35em] uppercase text-base mb-8 block">Structural Capital</span>
                        <h2 className="text-[clamp(50px,6vw,120px)] font-black tracking-normal leading-[0.85] uppercase">Lending Partners</h2>
                    </motion.div>

                    <style dangerouslySetInnerHTML={{ __html: `
                        .fin-carousel::-webkit-scrollbar { display: none; }
                        .fin-carousel { -ms-overflow-style: none; scrollbar-width: none; }
                    `}} />
                    <div ref={carouselRef} className="fin-carousel overflow-x-auto pb-4 -mx-4 px-4">
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={{ once: true, margin: "-10%" }}
                            className="flex md:grid md:grid-cols-2 gap-8 md:gap-x-8 md:gap-y-10 min-w-max md:min-w-0"
                        >
                            {activePartners.map((p, i) => (
                                <motion.div
                                    key={p.key}
                                    variants={{
                                        initial: { opacity: 0, y: 40, scale: 0.98 },
                                        whileInView: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8 } }
                                    }}
                                    {...hoverScaleBloom}
                                    className="relative px-8 pt-8 pb-10 md:px-10 md:pt-10 md:pb-12 rounded-[32px] flex flex-col justify-between w-[340px] md:w-auto shrink-0"
                                    style={glassStyle}
                                >
                                    <a href={p.href} target={p.href.startsWith('http') ? '_blank' : undefined} className="absolute inset-0 md:hidden z-10" aria-label={p.name} />
                                    <div>
                                        <div className="h-10 flex items-center mb-6 opacity-40">
                                            <div className="text-[5vw] md:text-[1.8vw] font-black tracking-widest text-white/90">{p.name}</div>
                                        </div>
                                        <span style={{ color: p.color }} className="font-black tracking-[0.3em] uppercase text-[3vw] md:text-[1vw] mb-3 block">{p.subtitle}</span>
                                        <h3 className="text-[4.5vw] md:text-[2vw] font-black mb-4 tracking-normal leading-normal">{p.details}</h3>
                                        <CmsContent
                                            content={p.insight}
                                            className="text-[3.5vw] md:text-[1.3vw] text-white/30 leading-relaxed font-light mb-6 italic"
                                            renderers={{
                                                block: {
                                                    paragraph: ({ children }) => <span>&ldquo;{children}&rdquo;</span>
                                                }
                                            }}
                                        />
                                        <ul className="space-y-3 mb-6">
                                            {p.features.map((feat, fi) => (
                                                <li key={fi} className="flex items-start gap-3 text-[3.5vw] md:text-[1.3vw] text-white/60 leading-normal">
                                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 shrink-0 mt-0.5">
                                                        <Check size={14} style={{ color: p.color }} />
                                                    </div>
                                                    {feat}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <a href={p.href} target={p.href.startsWith('http') ? '_blank' : undefined} className="inline-flex items-center gap-3 text-[3.5vw] md:text-[1.3vw] font-black group px-2">
                                        <span className="underline underline-offset-[16px] decoration-white/10 group-hover:decoration-white transition-all">{p.ctaLabel ?? `Engage with ${p.name}`}</span>
                                        <ExternalLink size={24} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Mobile Indicators */}
                    <div className="flex flex-col items-center gap-3 mb-6 md:hidden">
                        <div className="flex gap-2">
                            {activePartners.map((_, i) => (
                                <button key={i}
                                    onClick={() => {
                                        if (!carouselRef.current) return;
                                        const cardWidth = (carouselRef.current.children[0]?.children[0]?.clientWidth ?? 340) + 32;
                                        carouselRef.current.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
                                    }}
                                    aria-label={`Go to slide ${i + 1}`}
                                    style={{
                                        width: activeIdx === i ? 20 : 6, height: 6, borderRadius: 3,
                                        background: activeIdx === i ? '#63b589' : 'rgba(255,255,255,0.25)',
                                        transition: 'all 0.3s ease', border: 'none', padding: 0, cursor: 'pointer',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── COMPARISON GRID ───────────────────────────────────────────── */}
                <section className="px-6 md:px-16 lg:px-24 max-w-[1900px] mx-auto py-24 snap-start">
                    <motion.div {...kineticEntry} className="mb-16">
                        <span className="text-[#A68A33] font-black tracking-[0.35em] uppercase text-base mb-8 block">Comparative Analysis</span>
                        <h2 className="text-[clamp(40px,5vw,100px)] font-black tracking-normal leading-[0.85] uppercase">Institutional Matrix</h2>
                    </motion.div>

                    <div className="overflow-x-auto pb-8 scrollbar-hide">
                        <div className="min-w-[1000px] border border-white/5 rounded-[40px] overflow-hidden" style={glassStyle}>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.03]">
                                        <th className="p-8 text-[1vw] font-black tracking-[0.3em] uppercase text-white/40">Feature</th>
                                        <th className="p-8 text-[1.4vw] font-black text-center text-[#0D5699]">VISTAFI</th>
                                        <th className="p-8 text-[1.4vw] font-black text-center text-[#0D5699]">LYON</th>
                                        <th className="p-8 text-[1.4vw] font-black text-center text-[#63B589]">HFS</th>
                                        <th className="p-8 text-[1.4vw] font-black text-center text-[#A68A33]">VIKING</th>
                                        <th className="p-8 text-[1.4vw] font-black text-center text-[#91792C]">HELOC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeComparison.map((row, idx) => (
                                        <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                                            <td className="p-8 text-[1.1vw] font-bold text-white/50">{row.feature}</td>
                                            <td className="p-8 text-[1.2vw] font-light text-center border-l border-white/5">{row.vistafi}</td>
                                            <td className="p-8 text-[1.2vw] font-light text-center border-l border-white/5">{row.lyon}</td>
                                            <td className="p-8 text-[1.2vw] font-light text-center border-l border-white/5">{row.hfs}</td>
                                            <td className="p-8 text-[1.2vw] font-light text-center border-l border-white/5">{row.viking}</td>
                                            <td className="p-8 text-[1.2vw] font-light text-center border-l border-white/5">{row.heloc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* ── CTA ────────────────────────────────────────────────────────── */}
                <section className="px-6 md:px-16 lg:px-24 max-w-[1900px] mx-auto flex flex-col justify-start snap-start pt-8 pb-32">
                    <motion.div {...kineticEntry} className="relative rounded-[48px] overflow-hidden flex flex-col items-center justify-center text-center p-12 md:p-32 min-h-[60vh]" style={glassStyle}>
                         <div className="absolute inset-0 z-0 opacity-40">
                             <Image src={getAssetUrl("/finance_cta.avif")} alt="" fill className="object-cover grayscale" />
                             <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-[#0D5699]/30 via-[#05070A]/80 to-[#05070A]" />
                         </div>

                         <div className="relative z-10 max-w-[1200px]">
                             <h2 className="text-[clamp(40px,7vw,120px)] font-black mb-8 leading-[0.85] tracking-normal text-white uppercase">
                                 Define Your<br />Master Plan
                             </h2>
                             <p className="text-[4.5vw] md:text-[1.8vw] text-white/60 mb-16 font-light max-w-4xl mx-auto leading-relaxed">
                                 Ready to architect your outdoor legacy? Connect with our advisory team to navigate the investment matrix.
                             </p>
                             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                 <Link href="/contact" className="btn inline-flex items-center gap-6 px-16 py-6 bg-white text-black rounded-full font-black text-[4.5vw] md:text-[1.5vw] hover:bg-white/90 hover:text-black transition-all shadow-2xl uppercase tracking-widest">
                                     Consult Advisor <ArrowRight size={28} />
                                 </Link>
                             </motion.div>
                         </div>
                    </motion.div>
                </section>

                {/* ── FAQ ────────────────────────────────────────────────────────── */}
                <section className="snap-start">
                    <FAQ items={activeFaqs} theme="finance" accentColor="#0D5699" />
                </section>

            </div>
        </div>
    );
}
