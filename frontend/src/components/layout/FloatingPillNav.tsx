'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import { getAssetUrl } from '@/lib/constants';

// ── Data ───────────────────────────────────────────────────────────────────────
const SERVICES: { label: string; href: string }[] = [
    { label: 'Pool Design',        href: '/services/pool-design' },
    { label: 'Pool Construction',  href: '/services/pool-construction' },
    { label: 'Outdoor Kitchens',   href: '/services/outdoor-kitchens' },
    { label: 'Fire Pits',          href: '/services/fire-pit' },
    { label: 'Pool Remodeling',    href: '/services/pool-remodeling' },
    { label: 'Pergola Design',     href: '/services/pergola-design' },
    { label: 'Patio Extensions',   href: '/services/paver-installation' },
];

const PROJECTS: { label: string; href: string }[] = [
    { label: 'Spruce Hills', href: '/portfolio/spruce-hills' },
    { label: 'Montalcino',   href: '/portfolio/montalcino' },
    { label: 'Brycewood',    href: '/portfolio/brycewood' },
];

const NAV_LINKS_BEFORE: { href: string; label: string }[] = [
    { href: '/', label: 'Home' },
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

    const navRef = useRef<HTMLElement>(null);

    const closeMobile = () => {
        setMobileOpen(false);
        setMobileServicesOpen(false);
        setMobileProjectsOpen(false);
    };

    const linkCls = `text-white/75 hover:text-white text-[clamp(13px,1.2vw,19px)] font-medium
                     tracking-wide transition-colors duration-150 font-allomira py-2 cursor-pointer`;

    const mobileLinkCls = `block w-full px-4 py-3 rounded-xl text-[clamp(14px,1.3vw,20px)] font-medium
                           text-white/75 hover:text-white hover:bg-white/10
                           transition-colors duration-150 font-allomira text-left`;

    const dropCls = `absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 rounded-2xl p-3 flex flex-col gap-1 z-[120] transition-all duration-300 origin-top
                     bg-black/95 backdrop-blur-[40px] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.9)]`;

    return (
        <nav
            ref={navRef}
            className="fixed top-3 md:top-4 lg:top-5 left-1/2 -translate-x-1/2 w-[88%] max-w-[78rem] z-[200]
                       rounded-full px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-[9px] lg:px-8 lg:py-[11px] pointer-events-auto"
            style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(13, 86, 153, 0.05) 50%, rgba(0,0,0,0.2) 100%)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid rgba(145, 121, 44, 0.25)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            }}
        >
            <div className="flex items-center gap-3 md:gap-4 lg:gap-6 xl:gap-8">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                    <Image src={getAssetUrl("/logo.avif")} alt="AquaVida" width={165} height={50} priority className="h-[clamp(26px,2.6vw,44px)] w-auto object-contain" />
                </Link>

                {/* Desktop Nav */}
                <ul className="hidden md:flex items-center gap-[clamp(14px,2vw,42px)] flex-1 justify-center" role="list">
                    {NAV_LINKS_BEFORE.map(({ href, label }) => (
                        <li key={href}><Link href={href} className={linkCls}>{label}</Link></li>
                    ))}

                    {/* Portfolio Hover */}
                    <li 
                        className="relative group py-2"
                        onMouseEnter={() => setPortfolioOpen(true)}
                        onMouseLeave={() => setPortfolioOpen(false)}
                    >
                        <div className="flex items-center gap-1">
                            <Link href="/portfolio" className={linkCls}>Portfolio</Link>
                            <ChevronDown size={16} className={`text-white/40 transition-transform ${portfolioOpen ? 'rotate-180' : ''}`} />
                        </div>
                        {portfolioOpen && (
                            <ul className={dropCls}>
                                {PROJECTS.map((p) => (
                                    <li key={p.label}>
                                        <Link href={p.href} onClick={() => setPortfolioOpen(false)} className="block px-4 py-2 rounded-xl text-[clamp(12px,1vw,15px)] text-white/70 hover:text-white hover:bg-white/10 transition-colors font-allomira">
                                            {p.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    {/* Services Hover */}
                    <li 
                        className="relative group py-2"
                        onMouseEnter={() => setServicesOpen(true)}
                        onMouseLeave={() => setServicesOpen(false)}
                    >
                        <div className="flex items-center gap-1">
                            <Link href="/services" className={linkCls}>Services</Link>
                            <ChevronDown size={16} className={`text-white/40 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                        </div>
                        {servicesOpen && (
                            <ul className={dropCls}>
                                {SERVICES.map((s) => (
                                    <li key={s.label}>
                                        <Link href={s.href} onClick={() => setServicesOpen(false)} className="block px-4 py-2 rounded-xl text-[clamp(12px,1vw,15px)] text-white/70 hover:text-white hover:bg-white/10 transition-colors font-allomira">
                                            {s.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    {NAV_LINKS_AFTER.map(({ href, label }) => (
                        <li key={href}><Link href={href} className={linkCls}>{label}</Link></li>
                    ))}
                </ul>

                {/* Desktop CTA */}
                <Link href="/contact" className="btn hidden md:inline-flex items-center px-[clamp(12px,1.1vw,24px)] py-[clamp(8px,0.75vw,14px)] rounded-full text-[clamp(13px,1.2vw,19px)] font-semibold text-white bg-[#0d5699] transition-all hover:scale-110 active:scale-95 font-allomira whitespace-nowrap">
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
