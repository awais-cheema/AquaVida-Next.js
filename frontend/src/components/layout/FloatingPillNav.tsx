'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { getAssetUrl } from '@/lib/constants';

const dropdownVariants: Variants = {
    hidden:  { opacity: 0, y: -6, scale: 0.97 },
    visible: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
    exit:    { opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.13, ease: [0.42, 0, 1, 1] as [number, number, number, number] } },
};

// ── Data ───────────────────────────────────────────────────────────────────────
const SERVICES: { label: string; href: string }[] = [
    { label: 'Pool Design',        href: '/services/pool-design' },
    { label: 'Pool Construction',  href: '/services/pool-construction' },
    { label: 'Outdoor Grill',   href: '/services/outdoor-grill' },
    { label: 'Fire Pits',          href: '/services/fire-pit' },
    { label: 'Pool Remodeling',    href: '/services/pool-remodeling' },
    { label: 'Pergola Design',     href: '/services/pergola-design' },
    { label: 'Patio Extensions',   href: '/services/pavers' },
];

const PROJECTS: { label: string; href: string }[] = [
    { label: 'Spruce Hills', href: '/portfolio/spruce-hills' },
    { label: 'Montalcino',   href: '/portfolio/montalcino' },
    { label: 'Brycewood',    href: '/portfolio/brycewood' },
];

const NAV_LINKS_BEFORE: { href: string; label: string }[] = [
    { href: '/',       label: 'Home' },
    { href: '/about',  label: 'About' },
];

const NAV_LINKS_AFTER: { href: string; label: string }[] = [
    { href: '/finance',   label: 'Finance' },
    { href: '/contact',   label: 'Contact Us' },
];

export default function FloatingPillNav() {
    const [servicesOpen, setServicesOpen]   = useState(false);
    const [portfolioOpen, setPortfolioOpen] = useState(false);
    const [mobileOpen, setMobileOpen]       = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
    const [overLight, setOverLight]         = useState(false);

    // Darken nav when scrolled over a light-background section
    useEffect(() => {
        const update = () => {
            const lightSections = document.querySelectorAll('[data-nav-theme="light"]');
            const NAV_BOTTOM = 80; // px — approximate bottom edge of the nav pill
            let over = false;
            lightSections.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < NAV_BOTTOM && rect.bottom > 0) over = true;
            });
            setOverLight(over);
        };
        window.addEventListener('scroll', update, { passive: true });
        update(); // run once on mount
        return () => window.removeEventListener('scroll', update);
    }, []);

    const navRef          = useRef<HTMLElement>(null);
    const servicesTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
    const portfolioTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

    const openServices  = useCallback(() => {
        if (servicesTimer.current)  clearTimeout(servicesTimer.current);
        setServicesOpen(true);
    }, []);
    const closeServices = useCallback(() => {
        servicesTimer.current = setTimeout(() => setServicesOpen(false), 200);
    }, []);

    const openPortfolio  = useCallback(() => {
        if (portfolioTimer.current) clearTimeout(portfolioTimer.current);
        setPortfolioOpen(true);
    }, []);
    const closePortfolio = useCallback(() => {
        portfolioTimer.current = setTimeout(() => setPortfolioOpen(false), 200);
    }, []);

    const closeMobile = () => {
        setMobileOpen(false);
        setMobileServicesOpen(false);
        setMobileProjectsOpen(false);
    };

    const linkCls = `text-white/75 hover:text-white text-[clamp(13px,1.1vw,20px)] font-medium
                     tracking-wide transition-colors duration-150 font-allomira py-2 cursor-pointer`;

    const mobileLinkCls = `block w-full px-4 py-3 rounded-xl text-[clamp(14px,1.3vw,20px)] font-medium
                           text-white/75 hover:text-white hover:bg-white/10
                           transition-colors duration-150 font-allomira text-left`;

    const dropCls = `absolute top-full left-0 pt-2 w-56 z-[120]`;

    return (
        <nav
            ref={navRef}
            className="fixed top-5 md:top-6 lg:top-8 left-1/2 -translate-x-1/2 w-[94vw] max-w-[90rem] z-[200]
                       rounded-full px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-[9px] lg:px-8 lg:py-[11px] pointer-events-auto"
            style={{
                background: overLight
                    ? 'rgba(5, 7, 10, 0.65)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(13, 86, 153, 0.05) 50%, rgba(0,0,0,0.2) 100%)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: overLight
                    ? '1px solid rgba(255,255,255,0.1)'
                    : '1px solid rgba(145, 121, 44, 0.25)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                transition: 'background 0.4s ease, border-color 0.4s ease',
            }}
        >
            <div className="flex items-center gap-3 md:gap-4 lg:gap-6 xl:gap-8">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                    <Image src={getAssetUrl("/logo.avif")} alt="AquaVida" width={165} height={50} priority className="no-skeleton h-[38px] md:h-[clamp(32px,2.6vw,44px)] w-auto object-contain" />
                </Link>

                {/* Desktop Nav */}
                <ul className="hidden md:flex items-center gap-[clamp(12px,1.6vw,32px)] flex-1 justify-center" role="list">
                    {NAV_LINKS_BEFORE.map(({ href, label }) => (
                        <li key={href}><Link href={href} className={linkCls}>{label}</Link></li>
                    ))}

                    {/* Portfolio Hover */}
                    <li
                        className="relative group"
                        onMouseEnter={openPortfolio}
                        onMouseLeave={closePortfolio}
                    >
                        <div className="flex items-center gap-1">
                            <Link href="/portfolio" className={linkCls}>Portfolio</Link>
                            <ChevronDown size={16} className={`text-white/40 transition-transform ${portfolioOpen ? 'rotate-180' : ''}`} />
                        </div>
                        <AnimatePresence>
                        {portfolioOpen && (
                            <motion.div
                                className={dropCls}
                                onMouseEnter={openPortfolio}
                                onMouseLeave={closePortfolio}
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <ul className="rounded-2xl p-4 flex flex-col gap-1 bg-black/90 backdrop-blur-[60px] border border-white/15 shadow-[0_20px_80px_rgba(0,0,0,0.9)]">
                                    {PROJECTS.map((p) => (
                                        <li key={p.label}>
                                            <Link href={p.href} onClick={() => setPortfolioOpen(false)} className="block px-4 py-2 rounded-xl text-[clamp(12px,1vw,18px)] text-white/70 hover:text-white hover:bg-white/10 transition-colors font-allomira">
                                                {p.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </li>

                    {/* Services Hover */}
                    <li
                        className="relative group"
                        onMouseEnter={openServices}
                        onMouseLeave={closeServices}
                    >
                        <div className="flex items-center gap-1">
                            <Link href="/services" className={linkCls}>Services</Link>
                            <ChevronDown size={16} className={`text-white/40 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                        </div>
                        <AnimatePresence>
                        {servicesOpen && (
                            <motion.div
                                className={dropCls}
                                onMouseEnter={openServices}
                                onMouseLeave={closeServices}
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <ul className="rounded-2xl p-4 flex flex-col gap-1 bg-black/90 backdrop-blur-[60px] border border-white/15 shadow-[0_20px_80px_rgba(0,0,0,0.9)]">
                                    {SERVICES.map((s) => (
                                        <li key={s.label}>
                                            <Link href={s.href} onClick={() => setServicesOpen(false)} className="block px-4 py-2 rounded-xl text-[clamp(12px,1vw,18px)] text-white/70 hover:text-white hover:bg-white/10 transition-colors font-allomira">
                                                {s.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </li>

                    {NAV_LINKS_AFTER.map(({ href, label }) => (
                        <li key={href}><Link href={href} className={linkCls}>{label}</Link></li>
                    ))}
                </ul>

                {/* Desktop CTA */}
                <Link href="/contact" className="btn hidden md:inline-flex items-center px-[clamp(10px,1vw,20px)] py-[clamp(6px,0.6vw,12px)] rounded-full text-[clamp(12px,0.95vw,17px)] font-semibold text-white bg-[#0d5699] transition-all hover:scale-110 active:scale-95 font-allomira whitespace-nowrap">
                    Get a Quote
                </Link>

                {/* Mobile Menu Toggle */}
                <div className="flex md:hidden items-center gap-3 ml-auto">
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white/75 p-1">
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {mobileOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 mt-3 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex flex-col gap-1 z-[210]">
                    <Link href="/" onClick={closeMobile} className={mobileLinkCls}>Home</Link>
                    <Link href="/about" onClick={closeMobile} className={mobileLinkCls}>About</Link>

                    {/* Mobile Portfolio */}
                    <div className="flex items-center justify-between">
                        <Link href="/portfolio" onClick={closeMobile} className={`${mobileLinkCls} flex-1`}>Portfolio</Link>
                        <button onClick={() => setMobileProjectsOpen(!mobileProjectsOpen)} className="p-4"><ChevronDown size={18} className={mobileProjectsOpen ? 'rotate-180' : ''}/></button>
                    </div>
                    {mobileProjectsOpen && (
                        <div className="pl-6 flex flex-col gap-1">
                            {PROJECTS.map(p => <Link key={p.label} href={p.href} onClick={closeMobile} className="py-2 text-white/50 text-lg">{p.label}</Link>)}
                        </div>
                    )}

                    {/* Mobile Services */}
                    <div className="flex items-center justify-between">
                        <Link href="/services" onClick={closeMobile} className={`${mobileLinkCls} flex-1`}>Services</Link>
                        <button onClick={() => setMobileServicesOpen(!mobileServicesOpen)} className="p-4"><ChevronDown size={18} className={mobileServicesOpen ? 'rotate-180' : ''}/></button>
                    </div>
                    {mobileServicesOpen && (
                        <div className="pl-6 flex flex-col gap-1">
                            {SERVICES.map(s => <Link key={s.label} href={s.href} onClick={closeMobile} className="py-2 text-white/50 text-lg">{s.label}</Link>)}
                        </div>
                    )}

                    {NAV_LINKS_AFTER.map(({href, label}) => (
                        <Link key={href} href={href} onClick={closeMobile} className={mobileLinkCls}>{label}</Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
