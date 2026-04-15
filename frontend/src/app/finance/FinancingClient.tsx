'use client';

import { useRef } from 'react';
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

// ── Data ───────────────────────────────────────────────────────────────────────
const PARTNERS = [
    {
        key: 'vistafi',
        name: 'VISTAFI',
        subtitle: 'Frictionless Financing',
        details: 'Flexible Terms | Broad Credit Profiles | Renovation-Focused',
        insight: 'Vistafi pride ourselves on helping their clients find the best rates and terms to achieve their renovation project goals, regardless of their credit profile.',
        features: ['Rate and term matching', 'Options across credit profiles', 'Renovation project focused'],
        color: '#0D5699',
        logo: getAssetUrl('/vistafi.png'),
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
        logo: getAssetUrl('/lyon.png'),
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
        logo: getAssetUrl('/hfs.png'),
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
        logo: getAssetUrl('/viking.png'),
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
        logo: getAssetUrl('/heloc.png'),
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

// ── Page Component ─────────────────────────────────────────────────────────────
export default function FinancingClient() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
            <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden snap-start">
                <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0 opacity-40">
                    <Image 
                        src={getAssetUrl("/finance_hero.avif")} 
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
                        <span className="inline-block text-lg md:text-xl font-black tracking-[0.8em] uppercase mb-8 text-[#91792C] drop-shadow-xl">
                            Investment Architecture
                        </span>
                        <h1 className="text-[clamp(55px,9vw,160px)] font-black leading-[0.82] tracking-[-0.05em] mb-12 uppercase">
                            Intelligent<br />
                            <span className="text-white/10 italic font-thin tracking-[-0.01em]">Investment</span>
                        </h1>
                        
                        <div className="flex flex-col md:flex-row items-start lg:items-center gap-12 mt-16">
                            <p className="text-[clamp(18px,1.4vw,28px)] text-white/40 leading-[1.2] max-w-2xl font-light tracking-tight">
                                Curated financial partnerships engineered for high-performance capital. From specialists to flexible revolving credit.
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0">
                                <Link href="/contact" className="btn group relative px-12 py-5 bg-[#0D5699] text-white font-black text-2xl rounded-full overflow-hidden transition-all shadow-2xl flex items-center gap-4">
                                    Consult Advisor <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="relative z-20 space-y-12 pb-16">
                
                {/* ── PARTNERS GRID ────────────────────────────────────────────── */}
                <section className="relative px-6 md:px-16 lg:px-24 max-w-[1900px] mx-auto flex flex-col justify-start pt-12 pb-12 snap-start overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-10">
                        <Image src={getAssetUrl("/structural_capital.avif")} alt="" fill className="object-cover grayscale" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#05070A] via-transparent to-[#05070A]" />
                    </div>
                    
                    <motion.div {...kineticEntry} className="relative z-10 mb-32">
                        <span className="text-[#63B589] font-black tracking-[0.35em] uppercase text-base mb-8 block">Structural Capital</span>
                        <h2 className="text-[clamp(50px,6vw,120px)] font-black tracking-tighter leading-[0.85] uppercase">Lending Partners</h2>
                    </motion.div>

                    <div className="overflow-x-auto pb-12 -mx-4 px-4 scrollbar-hide">
                        <motion.div 
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={{ once: true, margin: "-10%" }}
                            className="flex md:grid md:grid-cols-2 gap-16 md:gap-x-16 md:gap-y-28 min-w-max md:min-w-0"
                        >
                            {PARTNERS.map((p, i) => (
                                <motion.div 
                                    key={p.key}
                                    variants={{
                                        initial: { opacity: 0, y: 40, scale: 0.98 },
                                        whileInView: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8 } }
                                    }}
                                    {...hoverScaleBloom}
                                    className="px-16 pt-12 pb-24 md:px-24 md:pt-16 md:pb-32 rounded-[64px] flex flex-col justify-between h-[860px] w-[400px] md:w-auto shrink-0"
                                    style={glassStyle}
                                >
                                    <div>
                                        <div className="h-16 flex items-center mb-16 opacity-40">
                                            <div className="text-4xl font-black tracking-widest text-white/50">{p.name}</div>
                                        </div>
                                        <span style={{ color: p.color }} className="font-black tracking-[0.5em] uppercase text-sm mb-6 block">{p.subtitle}</span>
                                        <h3 className="text-[clamp(24px,2.5vw,45px)] font-black mb-8 tracking-tighter leading-none">{p.details}</h3>
                                        <p className="text-xl md:text-2xl text-white/30 leading-snug font-light mb-16 italic">
                                            &ldquo;{p.insight}&rdquo;
                                        </p>
                                        <ul className={`space-y-8 ${p.key === 'vistafi' ? 'mb-6' : 'mb-16'}`}>
                                            {p.features.map((feat, fi) => (
                                                <li key={fi} className="flex items-start gap-6 text-lg md:text-xl text-white/60 leading-tight">
                                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shrink-0 mt-0.5">
                                                        <Check size={20} style={{ color: p.color }} />
                                                    </div>
                                                    {feat}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <a href={p.href} target={p.href.startsWith('http') ? '_blank' : undefined} className="inline-flex items-center gap-6 text-2xl font-black group px-4">
                                        <span className="underline underline-offset-[16px] decoration-white/10 group-hover:decoration-white transition-all">{p.ctaLabel ?? `Engage with ${p.name}`}</span>
                                        <ExternalLink size={24} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ── SELECTION MATRIX ────────────────────────────────────────── */}
                <section className="relative px-6 md:px-16 lg:px-24 max-w-[1900px] mx-auto flex flex-col justify-start pt-0 pb-40 snap-start">
                    <div className="absolute inset-0 z-0 opacity-10">
                        <Image src={getAssetUrl("/selection_matrix.avif")} alt="" fill className="object-cover grayscale" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#05070A] via-transparent to-[#05070A]" />
                    </div>

                    <motion.div {...kineticEntry} className="relative z-10 p-16 md:p-32 rounded-[80px]" style={glassStyle}>
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16 mb-32">
                            <div>
                                <span className="text-[#A68A33] font-black tracking-[0.6em] uppercase text-sm mb-8 block">Comparative Analysis</span>
                                <h2 className="text-[clamp(40px,4vw,90px)] font-black leading-[0.85] tracking-tighter uppercase">Selection Matrix</h2>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[1200px]">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="py-12 text-xl font-black text-white/20 uppercase tracking-[0.4em]">Structural Feature</th>
                                        <th className="py-12 text-[40px] font-black text-[#0D5699] tracking-tighter">Vistafi</th>
                                        <th className="py-12 text-[40px] font-black text-[#0D5699] tracking-tighter">Lyon</th>
                                        <th className="py-12 text-[40px] font-black text-[#63B589] tracking-tighter">HFS</th>
                                        <th className="py-12 text-[40px] font-black text-[#A68A33] tracking-tighter">Viking</th>
                                        <th className="py-12 text-[40px] font-black text-[#91792C] tracking-tighter">HELOC</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {COMPARISON.map((row, i) => (
                                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="py-12 text-3xl font-black text-white/30 group-hover:text-white transition-colors">{row.feature}</td>
                                            <td className="py-12 text-2xl text-white/50">{row.vistafi}</td>
                                            <td className="py-12 text-2xl text-white/50">{row.lyon}</td>
                                            <td className="py-12 text-2xl text-white/50">{row.hfs}</td>
                                            <td className="py-12 text-2xl text-white/50">{row.viking}</td>
                                            <td className="py-12 text-2xl text-white/50">{row.heloc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </section>

                {/* ── STRATEGIC INSIGHT (Expert Guidance) ────────────────────────── */}
                <section className="px-6 md:px-16 lg:px-24 max-w-[1900px] mx-auto flex flex-col lg:flex-row items-start gap-20 snap-start pt-0 pb-0">
                    <motion.div {...kineticEntry} className="lg:w-2/5">
                        <span className="text-[#63B589] font-black tracking-[0.6em] uppercase text-sm mb-8 block">Visionary Insight</span>
                        <h2 className="text-[clamp(40px,4vw,90px)] font-black tracking-tighter leading-[0.85] mb-16 uppercase">Expert<br />Guidance</h2>
                        <p className="text-2xl md:text-3xl text-white/30 font-light leading-snug tracking-tight">
                            Strategic balance of rate optimization and structural simplicity.
                        </p>
                    </motion.div>
                    
                    <div className="flex-1 space-y-16">
                        {[
                            { icon: Trophy, label: 'Master Selection', title: 'HFS Financial', body: 'Universal site coverage from pool to landscape in a single streamlined request.', color: '#63B589' },
                            { icon: Medal, label: 'Bespoke Selection', title: 'Lyon Financial', body: 'The industry specialists. Milestone-based accountability engineered into every draw.', color: '#0D5699' }
                        ].map((insight, i) => (
                            <motion.div 
                                key={i}
                                {...kineticEntry}
                                className="p-16 md:p-24 rounded-[64px] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent flex gap-12"
                            >
                                <div className="w-24 h-24 rounded-[40px] flex items-center justify-center bg-white/5 border border-white/10 flex-shrink-0">
                                    <insight.icon size={56} style={{ color: insight.color }} strokeWidth={1} />
                                </div>
                                <div className="pt-2">
                                    <span style={{ color: insight.color }} className="font-black tracking-[0.6em] uppercase text-sm mb-6 block">{insight.label}</span>
                                    <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-none">{insight.title}</h3>
                                    <p className="text-xl md:text-2xl text-white/30 font-light leading-relaxed tracking-tight">{insight.body}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── CTA ────────────────────────────────────────────────────────── */}
                <section className="px-6 md:px-16 lg:px-24 max-w-[1900px] mx-auto flex flex-col justify-start snap-start pt-8 pb-12">
                    <motion.div {...kineticEntry} className="relative rounded-[100px] overflow-hidden min-h-[700px] flex flex-col items-center justify-center text-center p-24" style={glassStyle}>
                         <div className="absolute inset-0 z-0 opacity-40">
                             <Image src={getAssetUrl("/finance_cta.avif")} alt="" fill className="object-cover grayscale" />
                             <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-[#0D5699]/20 via-transparent to-[#0D5699]/20" />
                         </div>
                         
                         <div className="relative z-10 max-w-[1200px]">
                             <h2 className="text-[clamp(50px,8vw,140px)] font-black mb-12 leading-[0.8] tracking-tighter text-white uppercase">
                                 Engineer<br />Your Capital
                             </h2>
                             <p className="text-2xl md:text-4xl text-white/30 mb-20 font-light max-w-5xl mx-auto leading-[1.2] tracking-tight">
                                 Ready to define your legacy? Let our architectural advisors navigate the selection matrix with you.
                             </p>
                             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                 <Link href="/contact" className="btn inline-flex items-center gap-6 px-16 py-8 bg-white text-black rounded-full font-black text-2xl hover:bg-white/90 transition-all shadow-xl">
                                     Consult with Expert <ArrowRight size={32} />
                                 </Link>
                             </motion.div>
                         </div>
                    </motion.div>
                </section>

                {/* ── FAQ ────────────────────────────────────────────────────────── */}
                <section className="snap-start">
                    <FAQ items={FINANCE_FAQS} theme="finance" accentColor="#0D5699" />
                </section>

            </div>
        </div>
    );
}

// Support Icons
function Trophy({ size, style, strokeWidth }: any) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} style={style} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 22V18" /><path d="M14 22V18" /><path d="M18 4H6v7a6 6 0 0 0 12 0V4Z" />
        </svg>
    );
}

function Medal({ size, style, strokeWidth }: any) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} style={style} strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" /><path d="M11 12 5.12 2.2" /><path d="m13 12 5.88-9.8" /><path d="M8 7h8" /><circle cx="12" cy="17" r="5" /><path d="M12 18v-2" /><path d="m10 20 2-2 2 2" />
        </svg>
    );
}
