'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { getAssetUrl } from '@/lib/constants';
import CorePrinciplesGlobe from './CorePrinciplesGlobe';
import FAQ from '@/components/layout/FAQ';

/* ── data ─────────────────────────────────────────────────────────────── */

const SERVICES = [
    { title: 'Pool Design',        sub: 'Design Consultation',        href: '/services/pool-design',        image: '/images/services/pool_design_hero.avif',       accent: '#0d5699' },
    { title: 'Pool Construction',  sub: 'Full Build Management',      href: '/services/pool-construction',  image: '/images/services/pool_construction_hero.avif', accent: '#0a447a' },
    { title: 'Outdoor Kitchens',   sub: 'Custom Outdoor Fabrication', href: '/services/outdoor-grill',   image: '/images/services/outdoor_kitchen_hero.avif',   accent: '#91792c' },
    { title: 'Fire Pits',          sub: 'Stone Masonry & Gas',        href: '/services/fire-pit',           image: '/images/services/fire_pit_hero.avif',          accent: '#a68a33' },
    { title: 'Pool Remodeling',    sub: 'Renovation & Refresh',       href: '/services/pool-remodeling',    image: '/images/services/pool_remodeling_hero.avif',   accent: '#63b589' },
    { title: 'Pergola Design',     sub: 'Shade Structures',           href: '/services/pergola-design',     image: '/images/services/pergola_design_hero.avif',     accent: '#0d5699' },
    { title: 'Patio Extensions',   sub: 'Hardscape Solutions',        href: '/services/pavers', image: '/images/services/patio_extensions_hero.avif', accent: '#91792c' },
];


const TESTIMONIALS = [
    {
        client: 'The Martinez Family',
        location: 'Frisco, TX',
        type: 'Pool Construction · Outdoor Kitchen',
        quote: 'The AquaVida team brought our vision to life better than we imagined. Every detail — from the pool shell to the stone fire pit — was executed with real precision. Our backyard is now the neighborhood gathering spot.',
        image: '/images/services/svc-pool-construction.avif',
    },
    {
        client: 'Thompson Residence',
        location: 'Dallas, TX',
        type: 'Pool Design · Outdoor Kitchen',
        quote: 'AquaVida transformed our backyard into a true retreat. The pool design and outdoor kitchen came together seamlessly — every detail exceeded our expectations. Six months in, it still looks brand new every single morning.',
        image: '/images/services/svc-pool-design.avif',
    },
    {
        client: 'The Anderson Family',
        location: 'Plano, TX',
        type: 'Pergola Design · Patio Extensions',
        quote: 'Our patio extension and pergola have extended our living season by months. Built for Texas weather, designed with intention — AquaVida delivered on both counts without any compromise.',
        image: '/images/services/svc-pergola.avif',
    },
];

// Floating images for CTA
const FLOAT_IMGS = [
    { src: '/images/services/outdoor_kitchen_cta.avif', top: '7%',    left: '3%',   right: undefined, bottom: undefined, w: 275, h: 195, rot: -2,  delay: 0.10 },
    { src: '/images/services/pool_design_hero.avif',     top: '4%',    left: '35%',  right: undefined, bottom: undefined, w: 245, h: 178, rot:  0,  delay: 0.20 },
    { src: '/images/services/pergola_design_hero.avif',         top: '8%',    left: undefined, right: '3%',  bottom: undefined, w: 262, h: 188, rot:  2,  delay: 0.15 },
    { src: '/images/services/fire_pit_cta.avif',        top: undefined, left: '2%', right: undefined, bottom: '9%',  w: 258, h: 186, rot:  3,  delay: 0.25 },
    { src: '/images/services/patio_extensions_hero.avif',           top: undefined, left: '38%', right: undefined, bottom: '5%', w: 248, h: 178, rot:  1,  delay: 0.30 },
    { src: '/images/services/pool_remodeling_cta.avif', top: undefined, left: undefined, right: '2%', bottom: '8%', w: 268, h: 192, rot: -3,  delay: 0.18 },
];

const MARQUEE_A = ['Pool Design','Pool Construction','Outdoor Kitchens','Fire Pits','Pool Remodeling','Pergola Design','Patio Extensions'];
const MARQUEE_B = ['Dallas, TX','Premier Pool Builders','Luxury Outdoor Living','Stone Craftsmanship','Custom Water Features','Year-Round Entertaining','Backyard Transformations','Design-Build Excellence'];

/* ── Reveal ───────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0, className = '' }: {
    children: React.ReactNode; delay?: number; className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) { setVis(true); return; }
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.06 });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return (
        <div ref={ref} className={className}
             style={{ opacity: vis ? 1 : 0, transition: 'none', transform: 'none' }}>
            {children}
        </div>
    );
}

/* ── Marquee ──────────────────────────────────────────────────────────── */

function MarqueeStrip({ items, reverse = false, accent = false }: { items: string[]; reverse?: boolean; accent?: boolean }) {
    const SEP = <span className="mx-6 opacity-25" aria-hidden="true">·</span>;
    const row = items.map((t, i) => (
        <span key={i} className="inline-flex items-center">
            <span style={{ color: accent ? 'rgba(255,255,255,0.50)' : 'rgba(255,255,255,0.30)' }}>{t}</span>
            {SEP}
        </span>
    ));
    return (
        <div className="overflow-hidden select-none" aria-hidden="true">
            <div className="flex whitespace-nowrap"
                 style={{ animation: `${reverse ? 'marquee-right' : 'marquee-left'} 36s linear infinite`, fontSize: 'clamp(11px,1vw,14px)', letterSpacing: '0.10em', textTransform: 'uppercase', fontFamily: 'var(--font-allomira)' }}>
                <span className="flex">{row}</span>
                <span className="flex" aria-hidden="true">{row}</span>
                <span className="flex" aria-hidden="true">{row}</span>
            </div>
        </div>
    );
}





/* ── Trusted Partnerships ─────────────────────────────────────────────── */

function TrustedPartnerships() {
    const [idx, setIdx] = useState(0);
    const [fade, setFade] = useState(true);
    const t = TESTIMONIALS[idx];

    const go = (dir: 1 | -1) => {
        setFade(false);
        setTimeout(() => {
            setIdx(i => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
            setFade(true);
        }, 220);
    };

    return (
        <section className="w-full px-6 md:px-16 py-28"
                 style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr_1.6fr] gap-10 md:gap-16 items-start">

                {/* Left */}
                <div>
                    <h2 className="font-allomira font-bold text-white leading-tight mb-10"
                        style={{ fontSize: 'clamp(40px, 5vw, 66px)' }}>
                        Trusted<br />Partnerships
                    </h2>
                    <Link href="/portfolio"
                          className="inline-flex items-center justify-center px-6 py-3 text-md font-medium text-white/70 hover:text-white transition-colors duration-200"
                          style={{ border: '1px solid rgba(255,255,255,0.28)' }}>
                        See all Work
                    </Link>
                </div>

                {/* Center: project photo card */}
                <div className="relative overflow-hidden"
                     style={{ height: 290, borderRadius: 4 }}>
                    {/* quote marks */}
                    <div className="absolute top-5 left-5 z-20" aria-hidden="true">
                        <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                            <path d="M0 22V12.5C0 5.596 4.164 1.32 12.49 0l1.176 2.31C9.02 3.466 6.862 5.792 6.272 9.308H11V22H0zm16 0V12.5C16 5.596 20.164 1.32 28.49 0l1.176 2.31C24.02 3.466 21.862 5.792 21.272 9.308H27V22H16z"
                                  fill="rgba(255,255,255,0.75)" />
                        </svg>
                    </div>
                    <div className="absolute inset-0 transition-opacity duration-220"
                         style={{ opacity: fade ? 1 : 0 }}>
                        <Image src={getAssetUrl(t.image)} alt={t.client} fill className="object-cover" sizes="400px" />
                        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />
                    </div>
                </div>

                {/* Right: testimonial text */}
                <div className="flex flex-col gap-5"
                     style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.22s ease' }}>
                    <div>
                        <h3 className="font-allomira font-bold text-white mb-3 md:mb-1"
                            style={{ fontSize: 'clamp(30px, 2vw, 28px)' }}>
                            {t.client}
                        </h3>
                        <p className="text-[13px] uppercase tracking-[0.22em]"
                           style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {t.type}
                        </p>
                    </div>
                    <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)', fontSize: 'clamp(18px,1.2vw,17px)' }}>
                        {t.quote}
                    </p>
                    <p className="text-md uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.28)' }}>
                        {t.location}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => go(-1)} aria-label="Previous testimonial"
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/08"
                                style={{ border: '1px solid rgba(255,255,255,0.25)' }}>
                            <ArrowLeft size={15} className="text-white" />
                        </button>
                        <button onClick={() => go(1)} aria-label="Next testimonial"
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/08"
                                style={{ border: '1px solid rgba(255,255,255,0.25)' }}>
                            <ArrowRight size={15} className="text-white" />
                        </button>
                        <span className="text-md ml-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
                            {idx + 1} / {TESTIMONIALS.length}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ── Floating images CTA ──────────────────────────────────────────────── */

function FloatingCTA() {
    const secRef = useRef<HTMLElement>(null);
    const [vis, setVis] = useState(false);

    useEffect(() => {
        const el = secRef.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
            { threshold: 0.12 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <section ref={secRef} className="relative h-[65vw] md:h-screen flex items-center justify-center overflow-hidden"
                 style={{background: '#070a10' }}>

            {/* very subtle global bg */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <Image src={getAssetUrl("/images/services/svc-pool-remodeling.avif")} alt="" fill sizes="100vw"
                       className="object-cover" style={{ opacity: 0.05 }} />
                <div className="absolute inset-0"
                     style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(7,10,16,0.30) 0%, rgba(7,10,16,0.96) 100%)' }} />
            </div>

            {/* Floating images — desktop only */}
            {FLOAT_IMGS.map((img, i) => (
                <div key={i}
                     className="hidden md:block absolute overflow-hidden"
                     style={{
                         top: img.top, left: img.left, right: img.right, bottom: img.bottom,
                         width: img.w, height: img.h,
                         borderRadius: 8,
                         boxShadow: '0 12px 40px rgba(0,0,0,0.60)',
                         opacity: vis ? 1 : 0,
                         transform: `rotate(${img.rot}deg) translateY(${vis ? 0 : 36}px)`,
                         transition: `opacity 0.85s ease ${img.delay}s, transform 0.85s ease ${img.delay}s`,
                     }}>
                    <div className="relative w-full h-full">
                        <Image src={getAssetUrl(img.src)} alt="" fill sizes="275px" className="object-cover" />
                    </div>
                </div>
            ))}

            {/* Center text */}
            <div className="relative z-10 text-center px-6 max-w-2xl">
                <Reveal>
                    <p className="text-base uppercase tracking-[0.32em] font-medium mb-6"
                       style={{ color: '#63b589' }}>
                        What We Do
                    </p>
                    <h2 className="font-allomira font-bold text-white leading-tight mb-10"
                        style={{ fontSize: 'clamp(22px, 3.5vw, 48px)' }}>
                        Bring Your Vision to Life&mdash;<br />Connect with AquaVida Today
                    </h2>
                    <Link href="/contact"
                          className="relative z-20 inline-flex items-center justify-center px-10 py-4 font-semibold text-white font-allomira transition-all duration-200 hover:brightness-110 active:scale-95"
                          style={{
                              background: 'rgba(236,91,19,0.92)',
                              boxShadow: '0 0 0 1px rgba(236,91,19,0.40), 0 6px 18px rgba(236,91,19,0.28)',
                              borderRadius: 4,
                              fontSize: 'clamp(15px, 1.1vw, 18px)',
                          }}>
                        Send Your Inquiry
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function ServicesClient() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
                if (scrollRef.current.scrollLeft >= maxScrollLeft - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    const cardWidth = scrollRef.current.children[0]?.clientWidth ?? 400;
                    scrollRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' }); // card + gap
                }
            }
        }, 2800);
        return () => clearInterval(interval);
    }, [isHovered]);

    const handleScrollPrev = () => {
        if (scrollRef.current) {
            const cardWidth = scrollRef.current.children[0]?.clientWidth ?? 400;
            scrollRef.current.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
        }
    };
    const handleScrollNext = () => {
        if (scrollRef.current) {
            const cardWidth = scrollRef.current.children[0]?.clientWidth ?? 400;
            scrollRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
        }
    };

    return (
        <>
            <style>{`
                @keyframes marquee-left  { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
                @keyframes marquee-right { from{transform:translateX(-33.333%)} to{transform:translateX(0)} }
            `}</style>

            <div className="min-h-screen">

                {/* ── Hero ───────────────────────────────────────── */}
                <section ref={heroRef} className="relative h-[45vh] md:h-screen flex items-center justify-center overflow-hidden">
                    {/* Parallax background image */}
                    <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
                        <Image
                            src="https://www.exscapedesigns.com/hubfs/Imported_Blog_Media/Who-Do-You-Go-to-for-High-Quality-Pool-Installation_--1-1.jpg"
                            alt=""
                            fill
                            className="object-cover scale-110"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="absolute inset-x-0 bottom-0 h-[55vh] bg-gradient-to-t from-[#05070A] via-[#05070A]/80 to-transparent" />
                    </motion.div>

                    {/* Title */}
                    <div className="relative z-10 max-w-[1600px] mx-auto flex items-center justify-center w-full gap-4 md:gap-10 px-6 md:px-16">
                        <Reveal>
                            <h1 className="font-allomira font-bold text-white leading-none select-none"
                                style={{ fontSize: 'clamp(40px, 12vw, 170px)' }}>Our</h1>
                        </Reveal>
                        <Reveal delay={0.08}>
                            <h1 className="font-allomira font-bold leading-none select-none text-white"
                                style={{ fontSize: 'clamp(40px, 12vw, 170px)' }}>
                                Services
                            </h1>
                        </Reveal>
                    </div>
                </section>

                {/* ── Divider ────────────────────────────────────── */}
                <div className="px-6 md:px-16">
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />
                </div>

                {/* ── Expertise heading ───────────────────────────── */}
                <section className="px-6 md:px-16 pt-10 pb-12 max-w-[1600px] mx-auto">
                    <Reveal>
                        <p className="text-[16.5px] uppercase tracking-[0.32em] font-medium mb-5" style={{ color: '#63b589' }}>Services</p>
                    </Reveal>
                    <Reveal delay={0.08}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-10">
                            <h2 className="font-allomira font-bold text-white leading-tight md:whitespace-nowrap"
                                style={{ fontSize: 'clamp(32px, 4.5vw, 58px)' }}>
                                Our Area of Expertise Space
                            </h2>
                            <p className="text-white/40 leading-relaxed max-w-md md:text-left"
                               style={{ fontSize: 'clamp(20px, 1.2vw, 17px)' }}>
                                AquaVida: A trusted leader in pool construction and outdoor living,
                                providing seamless experiences to Dallas homeowners.
                            </p>
                        </div>
                    </Reveal>

                    <style dangerouslySetInnerHTML={{ __html: `
                        .hide-scrollbar::-webkit-scrollbar { display: none; }
                        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    `}} />

                    <div
                        ref={scrollRef}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="flex flex-nowrap overflow-x-auto gap-6 mt-14 mb-10 w-full snap-x snap-mandatory hide-scrollbar">
                        {SERVICES.map((s, i) => (
                            <Link key={i} href={s.href}
                                className="flex-none w-[85vw] sm:w-[48vw] md:w-[35vw] lg:w-[calc(25%-18px)] group relative overflow-hidden h-[500px] snap-start block"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.09)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    touchAction: 'manipulation',
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                }}>
                                <Image src={getAssetUrl(s.image)} alt={s.title} fill className="object-cover absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-100" />
                                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                     style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
                                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:opacity-80 transition-opacity duration-300" />

                                <div className="relative z-20 flex flex-col h-full p-8 mt-auto justify-end">
                                    <h3 className="text-white font-medium whitespace-pre-line group-hover:-translate-y-2 transition-transform duration-300"
                                        style={{ fontSize: 'clamp(36px, 2.2vw, 30px)' }}>
                                        {s.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="flex gap-4 items-center">
                        <button 
                            onClick={handleScrollPrev}
                            className="bg-white/5 border border-white/10 hover:bg-white/15 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group"
                            style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                            <ArrowLeft size={28} className="text-white group-hover:-translate-x-1 transition-transform duration-300" />
                        </button>
                        <button 
                            onClick={handleScrollNext}
                            className="bg-white/5 border border-white/10 hover:bg-white/15 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group"
                            style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                            <ArrowRight size={28} className="text-white group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>
                </section>



                {/* ── Marquee ─────────────────────────────────────── */}
                {/*<div className="py-5 space-y-15"
                     style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    <MarqueeStrip items={MARQUEE_A} />
                    <MarqueeStrip items={MARQUEE_B} reverse accent />
                </div>*/}

                {/* ── Core Principles Globe ───────────────────────── */}
                <CorePrinciplesGlobe />

                {/* ── Trusted Partnerships ────────────────────────── */}
                <Reveal>
                    <TrustedPartnerships />
                </Reveal>

                {/* ── Floating images CTA ─────────────────────────── */}
                <FloatingCTA />

                {/* ── FAQ ─────────────────────────────────────────── */}
                <FAQ 
                    items={[
                        { question: "What is the typical investment for a custom pool?", answer: "Most AquaVida projects range from $85k to $250k+, depending on structural complexity, material selection, and site topography." },
                        { question: "Do you offer full design-build services?", answer: "Yes, we manage every phase from initial 3D architectural rendering to final stone fabrication and structural start-up." },
                        { question: "How long does a project stay in the design phase?", answer: "Typically 2-4 weeks, ensuring every detail of the hydraulic and structural plan is perfected before excavation." }
                    ]}
                    theme="dark"
                    accentColor="#0D5699"
                />

            </div>
        </>
    );
}
