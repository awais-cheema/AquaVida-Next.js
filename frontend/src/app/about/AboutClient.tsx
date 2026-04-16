'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

// ── Helper Components ────────────────────────────────────────────────────────

const BackgroundLines = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.15]">
        <svg className="absolute top-0 right-0 w-full h-full" viewBox="0 0 1440 900" fill="none">
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
    <div className={`absolute px-4 py-1.5 rounded-full border border-black/10 bg-white/50 backdrop-blur-sm text-[9px] tracking-[0.2em] font-bold uppercase whitespace-nowrap ${className}`}>
        {text}
    </div>
);

const TeamCard = ({ name, role, image }: { name: string; role: string; image: string }) => (
    <div className="flex flex-col gap-4 group">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">
            <img
                src={image}
                alt={name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                referrerPolicy="no-referrer"
            />
        </div>
        <div className="flex flex-col gap-1">
            <h4 className="text-sm font-medium tracking-tight text-black uppercase">{name}</h4>
            <p className="text-[10px] tracking-widest text-black/40 uppercase font-bold">{role}</p>
        </div>
    </div>
);

// ── Section Components ───────────────────────────────────────────────────────

const AboutHeroSection = () => (
    <section className="relative min-h-screen flex flex-col items-center px-6 py-16 md:px-12 lg:px-24 overflow-hidden bg-[#121212]">
        <BackgroundLines />
        <nav className="w-full h-8 mb-32 z-10" aria-hidden="true" />

        <div className="max-w-5xl w-full text-center mb-24 z-10">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="flex items-center justify-center gap-3 mb-10"
            >
                <span className="text-[8px] text-white/30">◆</span>
                <span className="text-[10px] tracking-[0.4em] font-bold text-white/50 uppercase">About Aquavida</span>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl font-light tracking-tight leading-[1.05] text-white"
            >
                Passionately shaping backyards <br />
                <span className="text-white/90">into timeless designs</span>
            </motion.h2>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full aspect-[21/9] mb-32 z-10"
        >
            <video autoPlay loop muted playsInline className="w-full h-full object-cover brightness-[0.85] contrast-[1.05]">
                <source src="https://player.vimeo.com/progressive_redirect/playback/1159684129/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&signature=843a80bd88c05b86dd94a82ade50a0fd1596b25855a1d9705244a3ca2c9db364" type="video/mp4" />
            </video>
        </motion.div>

        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-12 items-start z-10 pb-20">
            <div className="md:col-span-4 flex items-center gap-3">
                <span className="text-[8px] text-white/30">◆</span>
                <span className="text-[10px] tracking-[0.4em] font-bold text-white/50 uppercase">Manifesto</span>
            </div>
            <div className="md:col-span-8 flex justify-end">
                <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-lg md:text-xl font-light text-white/60 leading-relaxed max-w-2xl text-left"
                >
                    Aquavida transforms architectural vision into built reality. We specialise in luxury pool environments that shape water, define space, and elevate design. Every project is guided by precision, craftsmanship, and a commitment to enduring beauty.
                </motion.p>
            </div>
        </div>
        <div className="w-full h-px bg-white/5" />
    </section>
);

const ApproachSection = () => (
    <section className="relative min-h-screen flex flex-col items-center px-6 py-24 md:px-12 lg:px-24 bg-[#121212] overflow-hidden">
        <div className="w-full max-w-7xl mb-20 md:mb-32">
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1] text-white max-w-4xl text-center mx-auto"
            >
                Each phase of our work carries the same intent; to understand before we create, to refine before we build, and to craft with care that lasts.
            </motion.h2>
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">
            <div className="flex flex-col gap-12 lg:sticky lg:top-24">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <button className="group flex items-center gap-3 bg-[#2a2a2a] hover:bg-[#333333] px-5 py-3 text-[10px] tracking-[0.3em] font-bold text-white transition-all shadow-lg">
                        <CustomArrow />
                        OUR APPROACH
                    </button>
                </motion.div>

                <div className="mt-24 lg:mt-48 flex flex-col gap-8 max-w-sm">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3"
                    >
                        <span className="text-[8px] text-white/30">◆</span>
                        <span className="text-[10px] tracking-[0.4em] font-bold text-white/50 uppercase">About Aquavida</span>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-sm md:text-base font-light text-white/50 leading-relaxed"
                    >
                        We&apos;re a collective of craftsmen, engineers, and thinkers united by a deep respect for detail. Our culture is built on collaboration and care. Every project begins with understanding and ends with precision. Guided by clarity in how we think, communicate, and build, we turn complex ideas into seamless architectural experiences that endure.
                    </motion.p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="relative aspect-[4/5] lg:aspect-[3/4] w-full overflow-hidden shadow-2xl"
            >
                <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200"
                    alt="Team collaborating on architectural plans"
                    className="w-full h-full object-cover brightness-[0.9] contrast-[1.05]"
                    referrerPolicy="no-referrer"
                />
            </motion.div>
        </div>
    </section>
);

const MoreAboutSections = () => (
    <div className="bg-[#e5e5e2] text-[#121212]">

        {/* Beliefs */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
            <div className="absolute top-12 left-12 flex items-center gap-3">
                <span className="text-[8px] text-black/20">◆</span>
                <span className="text-[10px] tracking-[0.4em] font-bold text-black/40 uppercase">The beliefs that shape us</span>
            </div>

            <div className="relative w-full max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-4 md:gap-8"
                >
                    <div className="relative self-start md:ml-[10%]">
                        <h2 className="text-[15vw] md:text-[12vw] font-light leading-none tracking-tighter">Authenticity</h2>
                        <FloatingPill text="A fundamental trust in materials" className="-top-8 -right-12 md:-right-32" />
                    </div>
                    <div className="relative self-center">
                        <h2 className="text-[15vw] md:text-[12vw] font-light leading-none tracking-tighter">Aesthetic</h2>
                        <FloatingPill text="Curated designs that inspire" className="top-1/2 -left-20 md:-left-40" />
                    </div>
                    <div className="relative self-end md:mr-[10%]">
                        <h2 className="text-[15vw] md:text-[12vw] font-light leading-none tracking-tighter">Advocacy</h2>
                        <FloatingPill text="Standards you can trust" className="-bottom-8 -right-12 md:-right-40" />
                    </div>
                </motion.div>
            </div>
        </section>

        {/* Values */}
        <section className="px-6 py-32 md:px-12 lg:px-24 border-t border-black/5">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="flex items-center gap-3 mb-16">
                    <span className="text-[8px] text-black/20">◆</span>
                    <span className="text-[10px] tracking-[0.4em] font-bold text-black/40 uppercase">Our Values</span>
                </div>

                <div className="max-w-4xl w-full text-center">
                    <h3 className="text-4xl md:text-5xl font-light leading-tight mb-20">
                        Everything we create is rooted in our values, we do not just build, we build with purpose
                    </h3>

                    <div className="space-y-12 text-left">
                        {[
                            {
                                title: 'Authenticity',
                                desc: 'At our company, authenticity means transparency and structural integrity. Beginning each project with an honest assessment of your outdoor space and using top-grade materials and proven construction techniques will guarantee not just beauty on opening day, but lasting value in your home for years to come.',
                            },
                            {
                                title: 'Aesthetic',
                                desc: 'The pool needs to flow into the architecture of your house. Our designers incorporate those materials found in their surrounds — be it natural stone, custom lighting fixtures, or water features — so that each project is a study in visual harmony, to make something truly bespoke.',
                            },
                            {
                                title: 'Advocacy',
                                desc: 'As your construction partners, we serve as your ardent representatives throughout every stage of this intricate building process. From navigating local permits to post-build maintenance education, our aim is to make your journey from groundbreaking to first splash as stress-free and rewarding as possible.',
                            },
                        ].map((v, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-12 border-t border-black/10">
                                <h4 className="md:col-span-4 text-sm font-bold tracking-widest uppercase">{v.title}</h4>
                                <p className="md:col-span-8 text-sm md:text-base text-black/60 leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Founder */}
        <section className="px-6 py-32 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="flex flex-col gap-12">
                    <div className="flex items-center gap-3">
                        <span className="text-[8px] text-black/20">◆</span>
                        <span className="text-[10px] tracking-[0.4em] font-bold text-black/40 uppercase">Founders Journey</span>
                    </div>
                    <p className="text-xl md:text-2xl font-light text-black/80 leading-relaxed">
                        Hassan Bari, CEO and Founder of AquaVida Pools and Spas. He specializes in designing luxury outdoor living spaces while offering premium custom pool construction with unparalleled craftsmanship for homeowners across America.
                    </p>
                </div>
                <div className="w-full max-w-md ml-auto">
                    <TeamCard
                        name="Hassan Bari"
                        role="CEO & Founder"
                        image="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800"
                    />
                </div>
            </div>
        </section>

        {/* Client Stories */}
        <section className="px-6 py-32 md:px-12 lg:px-24 bg-white/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <span className="text-[8px] text-black/20">◆</span>
                            <span className="text-[10px] tracking-[0.4em] font-bold text-black/40 uppercase">Client Stories</span>
                        </div>
                        <span className="text-[10px] tracking-widest text-black/30 font-bold">01 / 05</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-3 border border-black/10 hover:bg-black hover:text-white transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="p-3 border border-black/10 hover:bg-black hover:text-white transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-2">
                        <div className="aspect-square w-full bg-gray-200 overflow-hidden grayscale">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                                alt="Client"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-10 relative">
                        <span className="absolute -top-12 -left-8 text-[120px] font-serif text-black/5 leading-none">&ldquo;</span>
                        <blockquote className="text-3xl md:text-5xl font-light leading-tight mb-12">
                            Aquavida are great. We have finalised a few projects with them in London and abroad, and always had very professional, punctual service from them. Would recommend to all other professionals and clients.
                        </blockquote>
                        <div className="flex flex-col gap-1">
                            <cite className="text-sm font-bold uppercase not-italic">Andreja Beric</cite>
                            <p className="text-[10px] tracking-widest text-black/40 uppercase font-bold">Founder, Twist in Architecture</p>
                        </div>
                        <div className="mt-12 flex items-center gap-2">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Final */}
        <section className="relative h-screen w-full overflow-hidden">
            <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"
                alt="Aquavida Landscape"
                className="w-full h-full object-cover brightness-50"
                referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h1 className="text-[15vw] font-light tracking-tighter opacity-20 select-none">Aquavida</h1>
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
                    <span className="text-[8px] text-white/30">◆</span>
                    <span className="text-[10px] tracking-[0.4em] font-bold text-white/50 uppercase">Enduring Beauty</span>
                </div>
            </div>
        </section>
    </div>
);

export default function AboutClient() {
    return (
        <main className="min-h-screen bg-[#121212] text-white selection:bg-white/20">
            <AboutHeroSection />
            <ApproachSection />
            <MoreAboutSections />
        </main>
    );
}
