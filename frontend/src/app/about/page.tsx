'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';



// ── Helper Components ────────────────────────────────────────────────────────

const BackgroundLines = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.15]" role="presentation">
        <svg className="absolute top-0 right-0 w-full h-full" viewBox="0 0 1440 900" fill="none" aria-hidden="true">
            <path d="M1440 0L1000 300L1100 600L1440 800" stroke="white" strokeWidth="0.5" />
            <path d="M1100 0L800 200L900 500" stroke="white" strokeWidth="0.5" />
            <path d="M0 400L300 600L100 900" stroke="white" strokeWidth="0.5" />
            <path d="M600 900L900 700L1200 900" stroke="white" strokeWidth="0.5" />
        </svg>
    </div>
);

const CustomArrow = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
        <path d="M2 4V9H10M10 9L7 6M10 9L7 12" stroke="currentColor" strokeWidth="1.2" />
    </svg>
);

const FloatingPill = ({ text, className }: { text: string; className?: string }) => (
    <div className={`absolute px-4 py-1.5 rounded-full border border-black/10 bg-white/50 backdrop-blur-sm text-[2.5vw] md:text-[clamp(9px,0.75vw,13px)] tracking-[0.2em] font-bold uppercase whitespace-nowrap ${className}`}>
        {text}
    </div>
);

const TeamCard = ({ name, role, image }: { name: string; role: string; image: string }) => (
    <div className="flex flex-col gap-4 group">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">
            <img src={image} alt={name} className="w-full h-full object-cover rounded-[10px]" />
        </div>
        <div className="flex flex-col gap-1">
            <h4 className="text-[4.5vw] md:text-[clamp(0.9rem,1.2vw,1.6rem)] tracking-[0.24rem] font-bold text-black uppercase">{name}</h4>
            <p className="text-[4.5vw] md:text-[clamp(0.75rem,0.85vw,1.1rem)] tracking-[0.3rem] text-black/40 uppercase font-bold">{role}</p>
        </div>
    </div>
);

// ── Section Components ───────────────────────────────────────────────────────

const AboutHeroSection = () => (
    <section className="relative min-h-screen flex flex-col items-center px-6 py-16 md:px-12 lg:px-24 overflow-hidden bg-[#05070A] font-sans">
        <BackgroundLines />
        <nav className="w-full h-8 mb-10 md:mb-32 z-10" aria-hidden="true" />

        <div className="w-full max-w-[90vw] md:max-w-5xl text-center mb-24 z-10">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="flex items-center justify-center gap-3 mb-10"
            >
                <span className="text-[4.5vw] md:text-[clamp(11px,0.85vw,15px)] text-white/30">◆</span>
                <span className="text-[4.5vw] md:text-[clamp(11px,0.85vw,15px)] tracking-[0.25em] font-bold text-white/50 uppercase">About AquaVida</span>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-[7vw] md:text-[clamp(1.6rem,3vw,4rem)] font-light tracking-tight leading-[1.1] md:leading-[1] text-white max-w-[90vw] md:max-w-[60vw] text-center mx-auto"
            >
                Passionately shaping backyards <br />
                <span className="text-white/90">into timeless designs</span>
            </motion.h2>
        </div>

        <div className="relative w-full aspect-video md:aspect-[21/9] mb-32 z-10">
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover brightness-[0.85] contrast-[1.05]"
            >
                <source src="/About%20Video%20(compressed).mp4" type="video/mp4" />
            </video>
        </div>

        <div className="w-full max-w-[90vw] md:max-w-[80vw] grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start z-10 pb-20">
            <div className="md:col-span-4 flex items-center gap-3">
                <span className="text-[4.5vw] md:text-[clamp(11px,0.85vw,15px)] text-white/30">◆</span>
                <span className="text-[4.5vw] md:text-[clamp(11px,0.85vw,15px)] tracking-[0.4em] font-bold text-white/50 uppercase">Manifesto</span>
            </div>
            <div className="md:col-span-8 flex justify-end">
                <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-[5.5vw] md:text-[clamp(0.85rem,1.2vw,1.4rem)] font-light text-white/60 leading-relaxed max-w-2xl text-left"
                >
                    AquaVida transforms architectural vision into built reality. We specialise in luxury pool environments that shape water, define space, and elevate design. Every project is guided by precision, craftsmanship, and a commitment to enduring beauty.
                </motion.p>
            </div>
        </div>
        <div className="w-full h-px bg-white/5" />
    </section>
);

const ApproachSection = () => (
    <section className="relative min-h-screen flex flex-col items-center px-6 py-24 md:px-12 lg:px-24 bg-[#05070A] font-sans overflow-hidden">
        <div className="w-full max-w-[90vw] md:max-w-[80vw] mb-20 md:mb-32">
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="text-[7vw] md:text-[clamp(1.5rem,2.8vw,3.8rem)] font-light tracking-tight leading-[1.2] md:leading-[1] text-white max-w-[90vw] md:max-w-[60vw] text-center mx-auto"
            >
                Each phase of our work carries the same intent; to understand before we create, to refine before we build, and to craft with care that lasts.
            </motion.h2>
        </div>

        <div className="w-full max-w-[90vw] md:max-w-[80vw] grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">
            <div className="flex flex-col gap-12 lg:sticky lg:top-24">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <button className="group flex items-center gap-3 bg-[#2a2a2a] hover:bg-[#333333] px-5 py-3 text-[4vw] md:text-[clamp(13px,1vw,17px)] tracking-[0.3em] font-bold text-white transition-all shadow-lg">
                        <CustomArrow />
                        OUR APPROACH
                    </button>
                </motion.div>

                <div className="mt-12 lg:mt-48 flex flex-col gap-8 max-w-[90%]">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3"
                    >
                        <span className="text-[4.5vw] md:text-[clamp(11px,0.85vw,15px)] text-white/30">◆</span>
                        <span className="text-[4.5vw] md:text-[clamp(11px,0.85vw,15px)] tracking-[0.3em] font-bold text-white/50 uppercase">About AquaVida</span>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-[5.5vw] md:text-[clamp(0.85rem,1.2vw,1.4rem)] font-light text-white/50 leading-relaxed"
                    >
                        We&apos;re a collective of craftsmen, engineers, and thinkers united by a deep respect for detail. Our culture is built on collaboration and care. Every project begins with understanding and ends with precision. Guided by clarity in how we think, communicate, and build, we turn complex ideas into seamless architectural experiences that endure.
                    </motion.p>
                </div>
            </div>

            <div className=" hidden md:flex relative aspect-[4/5] lg:aspect-[3/4] w-full overflow-hidden shadow-2xl">
                <img
                    src="/about-2.avif"
                    alt="Team collaborating on architectural plans"
                    className="w-full h-full object-cover brightness-[0.9] contrast-[1.05]"
                />
            </div>
        </div>
    </section>
);

const MoreAboutSections = () => (
    <div className="bg-[#e5e5e2] text-[#121212] font-sans" data-nav-theme="light">

        {/* Beliefs */}
        <section className="min-h-0 md:min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-36 pt-36 md:py-24 overflow-hidden">
            <div className="w-full max-w-[95vw] md:max-w-[80vw] mx-auto mb-10 md:mb-0 -mt-10 md:-mt-16">
                <div className="flex items-center gap-3">
                    <span className="text-[3vw] md:text-[clamp(9px,0.7vw,12px)] text-black/20">◆</span>
                    <span className="text-[3vw] md:text-[clamp(11px,0.9vw,16px)] tracking-[0.3em] font-bold text-black/40 uppercase">The beliefs that shape us</span>
                </div>
            </div>

            <div className="w-full max-w-[95vw] md:max-w-[80vw] mx-auto">
                <div className="flex flex-col gap-8 md:gap-4">

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        viewport={{ once: true }}
                        className="relative w-full pb-8 md:pb-0 md:self-end md:mr-[10%]"
                    >
                        <h2 className="ml-[16vw] md:ml-[32vw] text-[13vw] md:text-[clamp(4rem,9vw,13rem)] font-light text-[#121212] leading-none tracking-tighter">Authenticity</h2>
                        <FloatingPill
                            text="A fundamental trust in materials"
                            className="top-full mt-2 left-0 md:top-[0%] md:mt-0 md:left-auto md:right-[-6vw]"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        viewport={{ once: true }}
                        className="relative w-full pb-8 md:pb-0 md:self-center"
                    >
                        <h2 className="ml-[8vw] md:ml-[7vw] text-[13vw] md:text-[clamp(4rem,9vw,13rem)] font-light leading-none tracking-tighter text-[#121212]">Aesthetic</h2>
                        <FloatingPill
                            text="Curated designs that inspire"
                            className="top-full mt-2 right-0 md:top-0 md:mt-0 md:right-auto md:left-0"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        viewport={{ once: true }}
                        className="relative w-full pb-8 md:pb-0 md:self-end md:mr-[10%]"
                    >
                        <h2 className="ml-[16vw] md:ml-[32vw] text-[13vw] md:text-[clamp(4rem,9vw,13rem)] font-light leading-none tracking-tighter text-[#121212]">Advocacy</h2>
                        <FloatingPill
                            text="Standards you can trust"
                            className="top-full mt-2 left-0 md:top-auto md:mt-0 md:left-auto md:bottom-0 md:right-[-8vw]"
                        />
                    </motion.div>

                </div>
            </div>
        </section>

        {/* Values */}
        <section className="px-6 py-20 md:py-32 md:px-12 lg:px-24 border-t border-black/5">
            <div className="max-w-[90vw] md:max-w-[70vw] mx-auto flex flex-col items-center">
                <div className="flex items-center gap-3 mb-12 md:mb-16">
                    <span className="text-[4.5vw] md:text-[clamp(11px,0.85vw,15px)] text-black/20">◆</span>
                    <span className="text-[4.5vw] md:text-[clamp(11px,0.85vw,15px)] tracking-[0.3em] font-bold text-black/40 uppercase">Our Values</span>
                </div>

                <div className="max-w-[90%] w-full text-center">
                    <h3 className="text-[6.5vw] md:text-[clamp(1.5rem,2.8vw,3.8rem)] font-light leading-[1.15] md:leading-[1] mb-16 md:mb-20 text-[#121212]">
                        Everything we create is rooted in our values, we do not just build, we build with purpose
                    </h3>

                    <div className="space-y-10 md:space-y-12 text-left">
                        {[
                            {
                                title: 'Authenticity',
                                desc: 'At our company, authenticity means transparency and structural integrity. Beginning each project with an honest assessment of your outdoor space and using top-grade materials and proven construction techniques will guarantee not just beauty on opening day, but lasting value in your home for years to come.',
                            },
                            {
                                title: 'Aesthetic',
                                desc: 'The pool needs to flow into the architecture of your house. Our designers incorporate those materials found in their surrounds so that each project is a study in visual harmony — sleek infinity edges, natural stone, custom lighting fixtures, and water features that make something truly bespoke.',
                            },
                            {
                                title: 'Advocacy',
                                desc: 'As your construction partners, we serve as your ardent representatives throughout every stage of this intricate building process. From navigating local permits to post-build maintenance education, our aim is to make your journey from groundbreaking to first splash as stress-free and rewarding as possible.',
                            },
                        ].map((v, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pt-10 md:pt-12 border-t border-black/10">
                                <h4 className="md:col-span-4 text-[4.5vw] md:text-[clamp(0.85rem,1.1vw,1.4rem)] font-bold tracking-widest uppercase text-[#121212]">{v.title}</h4>
                                <p className="md:col-span-8 text-[5.5vw] md:text-[clamp(0.85rem,1.1vw,1.35rem)] text-black/60 leading-[1.6] md:leading-[1.5]">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Founder */}
        <section className="px-6 pt-20 pb-32 md:pt-32 md:pb-48 md:px-12 lg:px-24">
            <div className="max-w-[90vw] md:max-w-[80vw] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 items-center">
                <div className="flex flex-col gap-8 md:gap-12">
                    <div className="flex items-center gap-3">
                        <span className="text-[4.5vw] md:text-[clamp(11px,0.85vw,15px)] text-black/20">◆</span>
                        <span className="text-[4.5vw] md:text-[clamp(11px,0.85vw,15px)] tracking-[0.3em] font-bold text-black/40 uppercase">Founders Journey</span>
                    </div>
                    <p className="text-[5.5vw] md:text-[clamp(0.85rem,1.2vw,1.4rem)] font-light text-black/80 leading-relaxed">
                        Hassan Bari, CEO and Founder of AquaVida Pools and Spas. He specializes in designing luxury outdoor living spaces while offering premium custom pool construction with unparalleled craftsmanship for homeowners across America.
                    </p>
                </div>
                <div className="w-full max-w-md lg:ml-auto">
                    <TeamCard name="Hassan Bari" role="CEO & Founder" image="/Hassan-Bari-(Aquavida).avif" />
                </div>
            </div>
        </section>
    </div>
);

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#05070A] text-white selection:bg-white/20">
            <AboutHeroSection />
            <ApproachSection />
            <MoreAboutSections />
        </main>
    );
}
