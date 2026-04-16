'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowRight, Zap, Droplets, MapPin, Calendar, LayoutGrid } from 'lucide-react';
import FAQ from '@/components/layout/FAQ';
import { getAssetUrl } from '@/lib/constants';

// ── Data ───────────────────────────────────────────────────────────────────────

const PROJECTS = [
    {
        id: 'brycewood',
        slug: 'brycewood',
        name: "Brycewood Courtyard",
        category: "Residential Architecture",
        year: "2024",
        location: "Seattle, WA",
        description: "An intimate architectural enclosure featuring silent water walls and high-fidelity aquatic illumination. Designed for ultimate privacy and crystalline reflection.",
        image: "/images/portfolio/landing/Brycewood_Cover.avif",
        gridSize: "col-span-2 row-span-2", // Large Featured
        color: "#91792C"
    },
    {
        id: 'spruce-hills',
        slug: 'spruce-hills',
        name: "Spruce Hills Estate",
        category: "Luxury Estate",
        year: "2023",
        location: "Los Angeles, CA",
        description: "A multi-level structural masterpiece featuring a zero-edge infinity pool and natural stone masonry. Brutalist concrete meets organic tranquility.",
        image: "/images/portfolio/landing/Spruce_Hills_Cover.avif",
        gridSize: "col-span-1 row-span-1",
        color: "#0D5699"
    },
    {
        id: 'montalcino',
        slug: 'montalcino',
        name: "Montalcino Heights",
        category: "Modernist Landscape",
        year: "2023",
        location: "Austin, TX",
        description: "Modernist approach integrating extreme topography with custom bio-filtration systems and a sunken fire-feature focal point.",
        image: "/images/portfolio/landing/Montalcino_Cove.avif",
        gridSize: "col-span-1 row-span-1",
        color: "#63B589"
    },
    {
        id: 'residential',
        slug: 'residential',
        name: "Residential Archive",
        category: "Collection",
        year: "Ongoing",
        location: "Global",
        description: "A thematic exploration of private luxury water spaces, from hidden courtyard oases to expansive coastal infinity pools.",
        image: "/images/portfolio/landing/Residential_Category.avif",
        gridSize: "col-span-2 row-span-2",
        color: "#A68A33"
    },
    {
        id: 'commercial',
        slug: 'commercial',
        name: "Commercial Projects",
        category: "Hospitality & Wellness",
        year: "Ongoing",
        location: "Global",
        description: "Scale and performance engineered for the world's most demanding environments. Spas, luxury hotels, and civic water features.",
        image: "/images/portfolio/landing/Commercial_Category.avif",
        gridSize: "col-span-2 row-span-1",
        color: "#0A447A"
    },
    {
        id: 'vault',
        slug: 'vault',
        name: "The Vault",
        category: "Conceptual",
        year: "Archive",
        location: "AquaVida R&D",
        description: "Experimental designs and architectural artifacts focusing on the future of hydraulic precision and liquid light.",
        image: "/images/portfolio/landing/Vault_Hero.avif",
        gridSize: "col-span-1 row-span-1",
        color: "#000000"
    }
];

// ── Components ─────────────────────────────────────────────────────────────────

const ProjectCard = ({ project }: { project: typeof PROJECTS[0] }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            className={`relative overflow-hidden rounded-[32px] cursor-pointer group col-span-1 h-[260px] md:h-auto ${project.gridSize.split(' ').map(c => `md:${c}`).join(' ')}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={`/portfolio/${project.slug}`} className="block w-full h-full">
                {/* Background Image */}
                <Image
                    src={getAssetUrl(project.image)}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105 saturate-[0.85] group-hover:saturate-100"
                    priority
                />

                {/* Glass Overlay (revealed on hover) */}
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                            className="absolute bottom-4 left-4 right-4 p-5 rounded-[20px] z-10
                                       bg-black/50 backdrop-blur-[40px] border border-white/20
                                       shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-[11px] md:text-[0.8vw] font-black tracking-[0.2em] text-white/50 uppercase block mb-1">
                                        {project.category}
                                    </span>
                                    <h3 className="text-lg md:text-[1.5vw] font-black text-white leading-tight uppercase">
                                        {project.name}
                                    </h3>
                                </div>
                                <div className="p-2 rounded-full bg-white/10 border border-white/20 text-white">
                                    <ArrowUpRight size={16} />
                                </div>
                            </div>

                            <p className="text-white/80 text-sm md:text-[1.2vw] font-normal leading-relaxed mb-4 line-clamp-2 max-w-2xl">
                                {project.description}
                            </p>

                            <div className="flex gap-4 items-center">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-white/50 uppercase tracking-widest">
                                    <MapPin size={14} /> {project.location}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-bold text-white/50 uppercase tracking-widest">
                                    <Calendar size={14} /> {project.year}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Default Bottom info overlay (always visible but fades out) */}
                <div className={`absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}`}>
                    <h3 className="text-[7vw] md:text-[2vw] font-bold text-white uppercase tracking-normal">{project.name}</h3>
                    <p className="text-white/40 md:text-[1.1vw] font-black tracking-[0.1em] uppercase">{project.category}</p>
                </div>

                {/* Subtle Glow on hover */}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-white/30 transition-all duration-500 rounded-[32px] pointer-events-none" />
            </Link>
        </motion.div>
    );
};

// ── MAIN PAGE ──────────────────────────────────────────────────────────────────

export default function PortfolioClient() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="min-h-screen bg-[#05070A]" />;

    return (
        <div className="min-h-screen bg-[#05070A] text-[#DCE3F0] font-allomira selection:bg-[#0D5699] selection:text-white select-text overflow-x-hidden">
            
            {/* ── STICKY NAVIGATION ANCHOR ── */}
            <div className="h-[18vh] md:h-[22vh]" />

            {/* ── HEADER SECTION ── */}
            <section className="px-6 md:px-16 lg:px-24 max-w-[1900px] mx-auto mb-20">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl"
                    >
                        <span className="flex items-center gap-3 text-[#A68A33] font-black tracking-[0.3em] uppercase lg:text-[0.9vw] md:text-[0.9vw] text-[3.5vw] leading-[1] mb-8">
                            <Droplets size={22} className="text-[#A68A33]" /> ARCHITECTURAL ARCHIVE
                        </span>
                        <h1 className="text-[clamp(50px,8.5vw,160px)] font-black tracking-normal leading-[1] uppercase mb-12">
                            The Liquid<br />Portfolio
                        </h1>
                        <p className="text-2xl md:text-[1.5vw] text-white/40 font-light max-w-xl leading-normal">
                            A curated exhibition of high-performance aquatic engineering. Where structural brutalism meets the silent architecture of tranquility.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="h-px w-32 bg-white/10" />
                        <div className="flex gap-12">
                            <div>
                                <span className="text-2xl md:text-[1.2vw] font-black text-white/50 tracking-widest uppercase block mb-1">Curation</span>
                                <span className="text-2xl md:text-[1.4vw] font-bold">Volume III</span>
                            </div>
                            <div>
                                <span className="text-2xl md:text-[1.2vw] font-black text-white/50 tracking-widest uppercase block mb-1">Focus</span>
                                <span className="text-2xl md:text-[1.4vw] font-bold">Infinite Edge</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── BENTO GRID ── */}
            <section className="px-6 md:px-16 lg:px-24 max-w-[1900px] mx-auto mb-40 ">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[260px] md:auto-rows-[280px] grid-flow-dense">
                    {PROJECTS.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </section>

            {/* ── CTA / PHILOSOPHY ── */}
            <section className="px-6 md:px-16 lg:px-24 max-w-[1900px] mx-auto lg:mb-40 md:mb-40  flex justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-6xl p-10 md:p-16 rounded-[48px] bg-white/5 backdrop-blur-[40px] border border-white/10 text-center relative overflow-hidden group"
                >
                    {/* Background visual grain */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

                    <Zap className="mx-auto mb-6 text-[#A68A33] opacity-20 group-hover:opacity-100 transition-opacity duration-1000" size={40} />
                    <h2 className="text-[clamp(28px,3.5vw,60px)] font-black leading-none uppercase mb-6 tracking-tighter">
                        Next Generation<br />Pool Design
                    </h2>
                    <p className="text-base md:text-[1.3vw] text-white/40 font-light max-w-3xl md:max-w-[40vw] mx-auto mb-8 leading-relaxed">
                        We don't just build pools. We engineer permanent environmental artifacts that redefine how water interacts with human architecture.
                    </p>
                    <Link href="/contact" className="btn inline-flex items-center justify-center gap-4 w-[60vw] md:w-auto md:gap-6 bg-[#0D5699] hover:bg-[#A68A33] text-white px-[6vw] py-[3vw] md:px-10 md:py-4 rounded-full text-base font-bold uppercase tracking-normal transition-all hover:scale-105 active:scale-95 group">
                        Begin Your Project
                        <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </motion.div>
            </section>

            {/* ── FAQ ── */}
            <section className="snap-start border-t border-white/5">
                <FAQ 
                    items={[
                        { question: "How are projects selected for the archive?", answer: "We feature projects that push the boundaries of hydraulic engineering, material innovation, and architectural integration. Each entry represents a unique structural challenge solved." },
                        { question: "Can I request a custom design based on an archive entry?", answer: "Absolutely. Our portfolio serves as a catalog of possibilities. While every design is bespoke to its site, the principles—like 'zero-gravity' edges or 'silent hydraulics'—can be integrated into any new project." },
                        { question: "Do you offer private consultations at featured sites?", answer: "Due to client privacy, we do not offer public tours. However, we maintain a small number of 'Signature Reference' sites where private viewings can be arranged for serious inquiries." }
                    ]} 
                    theme="dark" 
                    accentColor="#0D5699" 
                />
            </section>
        </div>
    );
}
