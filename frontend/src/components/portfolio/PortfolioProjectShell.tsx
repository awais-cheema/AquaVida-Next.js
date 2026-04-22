'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Calendar, Layers, ShieldCheck, Zap } from 'lucide-react';
import FAQ from '@/components/layout/FAQ';
import { getAssetUrl } from '@/lib/constants';
import CmsContent from '@/components/cms/CmsContent';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ProjectDetail {
    id: string;
    title: string;
    description: any;
    heroImage: string;
    location: string;
    year: string;
    category: string;
    
    // Detailed Content
    philosophyTitle: string;
    philosophyBody: any;
    philosophyImage: string; // The "Atmosphere" image
    
    // Gallery Items (Irregular Grid)
    gallery: {
        url: string;
        title: string;
        spec: string; // e.g. "Material: Cold-Formed Concrete"
        size: string; // "col-span-1", "col-span-2", "row-span-2"
    }[];

    technicalTitle: string;
    technicalBody: any;
    
    accentColor: string;
    faqItems?: { question: string, answer: any }[];
}

// ── Animation Presets ──────────────────────────────────────────────────────────

const kineticEntry = {
    initial: { opacity: 0, y: 60 },
    whileInView: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
    } as any,
    viewport: { once: true, margin: "-10%" } as any
};

// ── Components ─────────────────────────────────────────────────────────────────

export default function PortfolioProjectShell({ p }: { p: ProjectDetail }) {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <div className="min-h-screen bg-[#05070A] text-[#DCE3F0] font-allomira selection:bg-[#0D5699] selection:text-white select-text">
            
            {/* ── HERO ── */}
            <section ref={heroRef} className="relative h-[50vh] lg:h-[100vh] flex flex-col justify-end overflow-hidden pb-[3vw] md:pb-32">
                <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
                    <Image src={getAssetUrl(p.heroImage)} alt={p.title} fill className="object-cover scale-105 saturate-[0.9]" priority />
                    <div className="absolute inset-x-0 bottom-0 h-[70vh] bg-gradient-to-t from-[#05070A] via-[#05070A]/80 to-transparent" />
                </motion.div>

                <div className="relative z-10 px-6 md:px-16 lg:px-24 max-w-[1900px] mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    >
                        <Link href="/portfolio" className="inline-flex items-center gap-4 text-[3.5vw] lg:text-[1.2vw] font-black leading-[1] tracking-[0.4em] text-white/40 uppercase mb-10 hover:text-white transition-colors group">
                           <ArrowLeft size={22} className="group-hover:-translate-x-2 transition-transform" /> Back to Archive
                        </Link>
                        
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                            <div>
                                <h1 className="text-[11.5vw] lg:text-[10vw] font-black leading-[1] tracking-normal uppercase mb-2 text-balance w-[100%]">
                                    {p.title}
                                </h1>
                                <div className="hidden lg:flex flex-wrap gap-8 items-center mt-12">
                                    <div className="flex items-center gap-3 text-[1vw] font-bold text-white/30 tracking-[0.3em] uppercase">
                                        <MapPin size={22} className="text-[#A68A33]" /> {p.location}
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                    <div className="flex items-center gap-3 text-[1vw] font-bold text-white/30 tracking-[0.3em] uppercase">
                                        <Calendar size={22} className="text-[#A68A33]" /> {p.year}
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                    <div className="flex items-center gap-3 text-[1vw] font-bold text-white/30 tracking-[0.3em] uppercase">
                                        <Layers size={22} className="text-[#A68A33]" /> {p.category}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── OVERVIEW STORY ── */}
            <section className="px-6 md:px-16 lg:px-24 max-w-[1900px] mx-auto pt-0 pb-32 lg:py-32 pb[0vw] md:mb-32 border-b border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                    <CmsContent 
                        content={p.description}
                        className="text-[4vw] md:text-[3vw] font-normal leading-relaxed text-white/90 tracking-normal"
                    />
                    
                    <motion.div 
                        {...kineticEntry}
                        transition={{ ...kineticEntry.whileInView.transition, delay: 0.2 }}
                        className="flex flex-col gap-12 lg:pt-8"
                    >
                        <div className="h-px w-32 bg-[#A68A33]" />
                        <h3 className="text-[5vw] md:text-[1.9vw]  font-bold uppercase tracking-widest text-[#A68A33]">The Architectural Intent</h3>
                        <CmsContent 
                            content={p.technicalBody}
                            className="text-[4vw] md:text-[1.6vw] text-white/80 leading-normal font-normal"
                        />
                    </motion.div>
                </div>
            </section>

            {/* ── IRREGULAR MASONRY GRID ── */}
            <section className="px-6 md:px-16 lg:px-24 max-w-[1900px] mx-auto mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[18px] auto-rows-[400px]">
                    {p.gallery.map((item, i) => (
                        <motion.div
                            key={i}
                            {...kineticEntry}
                            transition={{ ...kineticEntry.whileInView.transition, delay: i * 0.1 }}
                            className={`relative group overflow-hidden rounded-[48px] ${i === 1 ? 'col-span-2' : item.size || 'col-span-2'} ${i === p.gallery.length - 1 ? 'hidden' : i === 1 ? 'hidden md:block' : ''}`}
                        >
                            <Image src={getAssetUrl(item.url)} alt={item.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                            
                            {/* Technical Spec Glass Overlay */}
                            <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 transition-all duration-500" />
                            <div className="absolute inset-x-4 bottom-4 p-8 rounded-[32px] bg-white/10 backdrop-blur-[60px] border border-white/20 translate-y-32 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                                <span className="text-[0.9vw] font-black tracking-[0.2em] text-white/50 uppercase block mb-2">{item.title}</span>
                                <h4 className="text-2xl font-black text-white leading-none uppercase">{item.spec}</h4>
                            </div>
                            
                            {/* Subtle ID counter */}
                            <div className="absolute top-8 left-8 text-[10px] font-bold text-white/20 tracking-widest">
                                0{i + 1}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── ATMOSPHERE / PHILOSOPHY ── */}
            <section className="px-6 md:px-16 lg:px-24 max-w-[1900px] mx-auto mb-40 mt-[32px] lg:mt-0">
                <motion.div 
                    {...kineticEntry}
                    className="relative rounded-[80px] overflow-hidden min-h-[70vh] md:min-h-[80vh] flex items-center p-8 md:p-32"
                >
                    <Image src={getAssetUrl(p.philosophyImage)} alt="Atmosphere" fill className="object-cover scale-105 saturate-[0.8] brightness-[0.4]" />
                    <div className="absolute inset-0 bg-[#05070A]/40" />
                    
                    <div className="relative z-10 max-w-5xl">
                        <span className="text-[#A68A33] font-black tracking-[0.3em] uppercase text-[2.5vw] lg:text-[1vw]  mb-12 block leading-[1]" >THE ARCHITECTURE OF TRANQUILITY</span>
                        <h2 className="text-[8vw] md:text-[5vw] font-black leading-[1] uppercase mb-16" style={{ letterSpacing: '0.1em' }}>
                            {p.philosophyTitle}
                        </h2>
                        <CmsContent 
                            content={p.philosophyBody}
                            className="text-[4vw] lg:text-[1.6vw] text-white/90 font-normal leading-relaxed"
                        />
                    </div>
                </motion.div>
            </section>

            {/* ── FOOTER CTA ── */}
            <section className="px-6 md:px-16 lg:px-24 max-w-[1900px] mx-auto mb-10 text-center">
                <motion.div {...kineticEntry}>
                    <ShieldCheck size={48} className="mx-auto mb-8 text-[#63B589] opacity-40 md:mb-12 md:w-16 md:h-16" />
                    <h2 className="text-[10vw] md:text-[6vw] font-black leading-none uppercase mb-6 tracking-normal">Your Legacy Begins</h2>
                    <p className="text-[4vw] md:text-[1.5vw] text-white/30 font-light md:max-w-[50vw] mx-auto mb-10 leading-relaxed px-4">
                        Every AquaVida project is a permanent environmental artifact, engineered to last generations. Let's discuss your site's unique topographical potential.
                    </p>
                    <Link href="/contact" className="btn inline-flex items-center gap-5 bg-[#A68A33] hover:bg-[#fff] text-white px-8 py-4 rounded-full text-[4vw] md:text-[1.2vw] font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 group">
                        Inquire Now <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>

            {/* ── FAQ ── */}
            <FAQ 
                items={p.faqItems || [
                    { question: "What is the primary material used?", answer: "We use high-index shotcrete reinforced with Grade 60 structural steel, finished with custom-mixed limestone plasters for an organic, monolithic look." },
                    { question: "How is water clarity maintained?", answer: "This project features a high-volume bio-filtration system with ultraviolet sterilization and ozone injection, ensuring museum-grade water clarity without heavy chemical loads." }
                ]} 
                accentColor={p.accentColor} 
                theme="dark" 
            />
        </div>
    );
}
