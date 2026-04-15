'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronRight, Check } from 'lucide-react';
import FAQ from '@/components/layout/FAQ';
import { getAssetUrl } from '@/lib/constants';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface ServiceFeature {
    icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; strokeWidth?: number; className?: string }>;
    title: string;
    body: string;
}

export interface ProcessStep {
    title: string;
    body: string;
}

export interface ServiceData {
    accentColor: string;
    accentRgb: string; 

    heroLabel: string;
    heroTitle: string;
    heroHighlight: string;
    heroBody: string;
    heroImage: string;

    overviewTitle: string;
    overviewBody: string;
    overviewImage: string;

    processTitle: string;
    processSteps: ProcessStep[];

    investmentTitle: string;
    investmentBody: string;
    investmentImage: string;

    servicesTitle: string;
    servicesItems: { title: string; body: string }[];

    featuresTitle: string;
    features: ServiceFeature[];

    standardsTitle: string;
    standards: { title: string; body: string }[];

    ctaTitle: string;
    ctaBody: string;
    ctaImage: string;

    faqItems?: { question: string, answer: string }[];
}

const DEFAULT_POOL_FAQS = [
    {
        question: "How long is the typical construction timeline?",
        answer: "A standard shotcrete pool typically takes 8–12 weeks from excavation to start-up, depending on site conditions and complex structural requirements like infinity edges or retaining walls."
    },
    {
        question: "Do I need a permit for my outdoor living project?",
        answer: "Yes. AquaVida manages the entire engineering and permitting process, ensuring your project meets all local city codes and structural safety standards."
    },
    {
        question: "What maintenance is required for a saltwater pool?",
        answer: "Saltwater systems require periodic pH monitoring and salt cell cleaning every 3–6 months. They offer a much softer, skin-friendly swimming experience compared to traditional chlorine pools."
    },
    {
        question: "Can I use my pool year-round in Texas?",
        answer: "Absolutely. With high-efficiency gas heaters or electric heat pumps, your pool and spa can be maintained at optimal temperatures throughout the winter months."
    }
];

// ── Animation Presets ──────────────────────────────────────────────────────────
const kineticEntry = {
    initial: { opacity: 0, y: 40, scale: 0.98, rotateX: 5 },
    whileInView: { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        rotateX: 0,
        transition: { 
            duration: 1, 
            ease: [0.16, 1, 0.3, 1] 
        } 
    } as any,
    viewport: { once: true, margin: "-10% 0px -10% 0px" } as any
};

const staggerContainer = {
    initial: {},
    whileInView: { 
        transition: { 
            staggerChildren: 0.12,
            delayChildren: 0.1
        } 
    }
};

const hoverScale = {
    whileHover: { 
        scale: 1.02, 
        y: -10,
        transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] }
    } as any,
    whileTap: { scale: 0.98 }
};

// ── Components ─────────────────────────────────────────────────────────────────

export default function ServicePageShell({ d }: { d: ServiceData }) {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        border: `1px solid rgba(255, 255, 255, 0.06)`,
        boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
    };

    const goldGlassStyle = {
        ...glassStyle,
        border: `1px solid rgba(145, 121, 44, 0.15)`,
    };

    return (
        <div className="min-h-screen w-full bg-[#0D0A07] text-[#dce3f0] font-allomira selection:bg-[#0D5699] selection:text-white select-text">
            
            {/* ── HERO SECTION ────────────────────────────────────────────────── */}
            <section ref={heroRef} className="relative h-[115vh] flex items-center overflow-hidden">
                <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
                    <Image 
                        src={getAssetUrl(d.heroImage)} 
                        alt="" 
                        fill 
                        className="object-cover scale-110" 
                        priority 
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0D0A07] via-[#0D0A07]/50 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-[50vh] bg-gradient-to-t from-[#0D0A07] via-[#0D0A07]/80 to-transparent" />
                </motion.div>

                <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-16 lg:px-24 w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -80 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-7xl"
                    >
                        <span className="inline-block text-sm md:text-base lg:text-xl font-bold tracking-[0.6em] uppercase mb-12 text-[#A68A33]">
                            {d.heroLabel}
                        </span>
                        <h1 className="text-[clamp(44px,12vw,180px)] font-bold leading-[0.9] tracking-[-0.04em] mb-12 sm:mb-16">
                            {d.heroTitle}<br />
                            <span className="text-white/20 italic font-light tracking-[-0.02em]">{d.heroHighlight}</span>
                        </h1>
                        
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-12 sm:gap-16 mt-12 sm:mt-20">
                            <p className="text-[clamp(24px,2.2vw,48px)] text-white/60 leading-relaxed max-w-4xl font-light">
                                {d.heroBody}
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link href="/contact" className="btn group relative px-14 py-7 bg-[#91792C] text-white font-bold text-2xl rounded-full overflow-hidden transition-all shadow-2xl shadow-[#91792C]/30 flex items-center gap-4">
                                    Estimate Project <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="relative z-20 space-y-64 -mt-32 pb-64">
                
                {/* ── OVERVIEW (PHILOSOPHY) ────────────────────────────────────── */}
                <section className="px-6 md:px-16 lg:px-24 max-w-[1800px] mx-auto">
                    <motion.div 
                        {...kineticEntry} 
                        className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-0 rounded-[64px] overflow-hidden" 
                        style={goldGlassStyle}
                    >
                        <div className="p-16 md:p-32 flex flex-col justify-center">
                            <span className="text-[#63B589] font-bold tracking-[0.4em] uppercase text-sm sm:text-base mb-8">Philosophy</span>
                            <h2 className="text-[clamp(40px,6.5vw,110px)] font-bold leading-[1] mb-12 tracking-tight">
                                {d.overviewTitle}
                            </h2>
                            <p className="text-[clamp(28px,2.1vw,51px)] text-white/60 leading-relaxed mb-16 max-w-4xl font-light">
                                {d.overviewBody}
                            </p>
                            <Link href="/portfolio" className="inline-flex items-center gap-6 text-2xl font-bold group">
                                <span className="underline underline-offset-[12px] decoration-[#91792C]/30 group-hover:decoration-[#91792C] transition-all">Explore Process Gallery</span>
                                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                                    <ChevronRight size={28} />
                                </div>
                            </Link>
                        </div>
                        <div className="relative min-h-[700px] hidden lg:block">
                            <Image src={getAssetUrl(d.overviewImage)} alt="" fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0D0A07]/10 to-[#0D0A07]/60" />
                        </div>
                    </motion.div>
                </section>

                {/* ── PROCESS STEPS ───────────────────────────────────────────── */}
                <section className="px-6 md:px-16 lg:px-24 max-w-[1800px] mx-auto">
                    <motion.div {...kineticEntry} className="mb-32">
                        <span className="text-[#A68A33] font-bold tracking-[0.45em] uppercase text-base mb-8 block">{d.processTitle}</span>
                        <h2 className="text-[clamp(56px,7vw,130px)] font-bold tracking-tight leading-[0.9]">The Precision Journey</h2>
                    </motion.div>
                    
                    <motion.div 
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, margin: "-10%" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-12"
                    >
                        {d.processSteps.map((step, i) => (
                            <motion.div 
                                key={i}
                                variants={{
                                    initial: { opacity: 0, y: 50, rotateY: 10 },
                                    whileInView: { opacity: 1, y: 0, rotateY: 0, transition: { duration: 0.8 } }
                                }}
                                {...hoverScale}
                                className="group p-16 rounded-[48px] cursor-default"
                                style={glassStyle}
                            >
                                <span className="text-8xl font-bold text-white/[0.03] block mb-12 group-hover:text-[#91792C]/10 transition-colors">0{i+1}</span>
                                <h3 className="text-4xl font-bold mb-8 text-white group-hover:text-[#A68A33] transition-colors tracking-tight">{step.title}</h3>
                                <p className="text-[33px] md:text-[36px] text-white/40 leading-relaxed font-light">{step.body}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ── INVESTMENT SECTION ───────────────────────────────────────── */}
                <section className="px-6 md:px-16 lg:px-24 max-w-[1800px] mx-auto">
                    <motion.div {...kineticEntry} className="relative rounded-[80px] overflow-hidden min-h-[850px] flex items-center">
                        <Image src={getAssetUrl(d.investmentImage)} alt="" fill className="object-cover brightness-[0.3] scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A07] via-transparent to-[#0D0A07]/20" />
                        
                        <div className="relative z-10 p-16 md:p-32 max-w-6xl">
                            <span className="text-[#63B589] font-bold tracking-[0.4em] uppercase text-base mb-8 block">Legacy & Value</span>
                            <h2 className="text-[clamp(56px,7.5vw,140px)] font-bold leading-[0.9] mb-12 tracking-tighter">
                                {d.investmentTitle}
                            </h2>
                            <p className="text-[clamp(36px,2.4vw,57px)] text-white/60 leading-relaxed font-light mb-16">
                                {d.investmentBody}
                            </p>
                            <motion.div whileHover={{ x: 10 }} className="inline-block">
                                <Link href="/finance" className="btn inline-flex items-center gap-8 px-14 py-7 rounded-full border border-white/20 hover:border-[#63B589] hover:bg-[#63B589] text-white hover:text-black font-bold text-2xl transition-all">
                                    Investment Options <ArrowRight size={32} />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* ── FEATURES GRID ────────────────────────────────────────────── */}
                <section className="px-6 md:px-16 lg:px-24 max-w-[1800px] mx-auto py-32">
                    <div className="flex flex-col lg:flex-row gap-32">
                        <motion.div {...kineticEntry} className="lg:w-2/5">
                            <span className="text-[#A68A33] font-bold tracking-[0.4em] uppercase text-base mb-8 block">Capabilities</span>
                            <h2 className="text-[clamp(56px,6vw,110px)] font-bold leading-[0.95] tracking-tighter mb-12">
                                {d.featuresTitle}
                            </h2>
                            <div className="w-32 h-1.5 bg-[#91792C]/30" />
                        </motion.div>
                        <motion.div 
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={{ once: true }}
                            className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-32"
                        >
                            {d.features.map((f, i) => (
                                <motion.div 
                                    key={i} 
                                    variants={{
                                        initial: { opacity: 0, scale: 0.9, y: 30 },
                                        whileInView: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6 } }
                                    }}
                                    className="flex flex-col gap-10 group"
                                >
                                    <div className="w-24 h-24 rounded-[32px] flex items-center justify-center transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        <f.icon size={48} strokeWidth={1} className="text-[#91792C]" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-bold text-white tracking-tight group-hover:text-[#A68A33] transition-colors">{f.title}</h3>
                                        <p className="text-[33px] md:text-[36px] text-white/40 leading-relaxed font-light">{f.body}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ── SERVICES & STANDARDS ────────────────────────────────────── */}
                <section className="px-6 md:px-16 lg:px-24 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_0.45fr] gap-24">
                    <motion.div {...kineticEntry} className="p-20 md:p-32 rounded-[64px]" style={glassStyle}>
                        <h2 className="text-6xl font-bold mb-24 tracking-tighter">Specialized Construction Solutions</h2>
                        <div className="space-y-20">
                            {d.servicesItems.map((item, i) => (
                                <div key={i} className="flex gap-16 group">
                                    <div className="pt-2 text-[#91792C] font-bold text-2xl opacity-20 group-hover:opacity-100 transition-all group-hover:scale-125">0{i+1}</div>
                                    <div>
                                        <h3 className="text-4xl font-bold mb-6 text-white group-hover:text-[#A68A33] transition-all tracking-tight">{item.title}</h3>
                                        <p className="text-[33px] md:text-[36px] text-white/50 leading-relaxed font-light">{item.body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="flex flex-col gap-16">
                        <motion.div {...kineticEntry} className="p-16 rounded-[48px] bg-gradient-to-br from-[#91792C]/10 to-transparent border border-[#91792C]/20">
                            <h3 className="text-3xl font-bold mb-12 text-white/90">Operational Excellence</h3>
                            <div className="space-y-12">
                                {d.standards.map((s, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <Check className="text-[#63B589] flex-shrink-0 mt-1.5 transition-transform group-hover:scale-150" size={24} />
                                        <div>
                                            <h4 className="text-2xl font-bold text-white mb-3 tracking-tight">{s.title}</h4>
                                            <p className="text-xl text-white/40 leading-relaxed font-light">{s.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ── CTA SECTION ─────────────────────────────────────────────── */}
                <section className="px-6 md:px-16 lg:px-24 max-w-[1800px] mx-auto">
                    <motion.div {...kineticEntry} className="relative rounded-[80px] overflow-hidden min-h-[650px] flex flex-col items-center justify-center text-center p-20" style={glassStyle}>
                         <div className="absolute inset-0 z-0">
                            <Image src={getAssetUrl(d.ctaImage)} alt="" fill className="object-cover brightness-[0.3]" />
                            <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-[#0D0A07] via-transparent to-[#0D0A07]" />
                         </div>
                         
                         <div className="relative z-10 max-w-6xl">
                             <h2 className="text-[clamp(56px,8vw,140px)] font-bold mb-12 leading-[0.9] tracking-tighter">
                                 {d.ctaTitle}
                             </h2>
                             <p className="text-[clamp(36px,2.4vw,63px)] text-white/50 mb-20 font-light max-w-6xl mx-auto leading-tight">
                                 {d.ctaBody}
                             </p>
                             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                 <Link href="/contact" className="btn inline-flex items-center gap-6 px-16 py-8 bg-white text-black rounded-full font-bold text-2xl hover:bg-white/90 transition-all shadow-[0_30px_90px_rgba(255,255,255,0.15)]">
                                     Start Your Journey <ArrowRight size={32} />
                                 </Link>
                             </motion.div>
                         </div>
                    </motion.div>
                </section>

                {/* ── FAQ SECTION ─────────────────────────────────────────────── */}
                <FAQ 
                    items={d.faqItems || DEFAULT_POOL_FAQS} 
                    accentColor={d.accentColor} 
                    theme="glass" 
                />

            </div>
        </div>
    );
}
