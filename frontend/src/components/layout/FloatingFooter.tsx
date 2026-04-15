'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import heroFrameRef from '@/lib/heroFrameRef';
import { getF, TIMELINE } from '@/lib/heroBreakpoints';
import { getAssetUrl } from '@/lib/constants';

function LinkedInIcon({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

function TikTokIcon({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.86 4.86 0 0 1-1.01-.07z" />
        </svg>
    );
}

function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
        </svg>
    );
}

function FacebookIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
    );
}


const lk = 'text-white/80 hover:text-white transition-colors duration-200';

export default function FloatingFooter() {
    const [mounted,  setMounted]  = useState(false);
    const [opacity,  setOpacity]  = useState(0);
    const [visible,  setVisible]  = useState(false);
    const pathname = usePathname();
    const isHome   = pathname === '/';

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!isHome) { setVisible(true); setOpacity(1); }
    }, [isHome]);

    useEffect(() => {
        if (!isHome) return;
        let rafId: number;
        let alive = true;
        const tick = () => {
            if (!alive) return;
            const f     = heroFrameRef.current;
            const isM   = heroFrameRef.isMobile;
            const total = heroFrameRef.total;
            const APPEAR_F = getF(596, isM, total);

            if (f < APPEAR_F) { setVisible(false); setOpacity(0); }
            else { setVisible(true); setOpacity(Math.min((f - APPEAR_F) / 3, 1)); }
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        return () => { alive = false; cancelAnimationFrame(rafId); };
    }, [isHome]);

    if (!mounted) return null;

    const getDynamicStyles = () => {
        const path = pathname || '';
        
        // Finance Page theme (Deep Onyx)
        if (path.startsWith('/finance')) {
            return {
                cardBg: '#05070A',
                border: '1px solid rgba(255, 255, 255, 0.03)',
                shadow: '0 20px 80px rgba(0,0,0,0.8)',
                backdrop: 'none'
            };
        }
        
        // Portfolio & Blog (Editorial Dark)
        if (path.startsWith('/portfolio') || path.startsWith('/blog')) {
            return {
                cardBg: '#05070A',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                shadow: 'none',
                backdrop: 'none'
            };
        }

        // Home Page theme (Glassmorphism)
        if (isHome) {
            return {
                cardBg: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, rgba(13, 86, 153, 0.03) 100%)',
                border: '1px solid rgba(45, 121, 44, 0.2)',
                shadow: '0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
                backdrop: 'blur(30px) saturate(180%)'
            };
        }

        // Default (Dark/Service)
        return {
            cardBg: '#0D0A07',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            shadow: 'none',
            backdrop: 'none'
        };
    };

    const ds = getDynamicStyles();

    const footerContent = (
        <>
            {isHome && (
                <div
                    className="fixed inset-0 backdrop-blur-[36px] bg-black/40 pointer-events-none z-[90]"
                    style={{ opacity, visibility: visible ? 'visible' : 'hidden' }}
                />
            )}

            <footer
                aria-label="Site footer"
                className={[
                    isHome
                        ? 'fixed bottom-2 sm:bottom-3 md:bottom-5 lg:bottom-6 left-1/2 -translate-x-1/2 z-[90] w-[98%] sm:w-[97%] max-w-[1700px]'
                        : 'relative w-full z-50',
                    'pointer-events-auto',
                ].join(' ')}
                style={{
                    opacity,
                    visibility: visible ? 'visible' : 'hidden',
                    ...(isHome ? {} : { 
                        opacity: 1, 
                        visibility: 'visible',
                        background: ds.cardBg // Match footer section background to card
                    }),
                }}
            >
                {/* ── Glass card ── */}
                <div
                    className={[
                        isHome ? '' : 'w-[96%] max-w-[1700px] mx-auto my-8 sm:my-12',
                        'flex flex-col font-allomira shadow-2xl transition-all duration-500',
                        // rounded
                        'rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] lg:rounded-[3rem]',
                        // padding
                        'px-4 pt-5 pb-4 sm:px-6 sm:pt-7 sm:pb-5 md:px-10 md:pt-9 md:pb-6 lg:px-14 lg:pt-12 lg:pb-8 xl:px-18 xl:pt-13 xl:pb-9 2xl:px-20 2xl:pt-14 2xl:pb-10',
                        // row gaps
                        'gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12',
                        isHome ? '' : '',
                    ].join(' ')}
                    style={{
                        background: ds.cardBg,
                        backdropFilter: ds.backdrop,
                        WebkitBackdropFilter: ds.backdrop,
                        border: ds.border,
                        boxShadow: ds.shadow,
                    }}
                >
                    {/* ... (previous columns grid and body row) ... */}
                    {/* (Note: I'm keeping the internal body row as it was, just updating the bottom bar) */}

                    {/* ══════════════════════════════════════
                        BODY  —  Logo  +  four link columns
                        Layout progression:
                          mobile  (<640)   : logo top-center, 2-col grid
                          sm      (640+)   : logo top-center, 2-col grid (wider)
                          md      (768+)   : logo top-center, 4-col grid
                          lg      (1024+)  : logo left, 4-col grid beside it
                          xl/2xl  (1280+)  : generous spacing
                    ══════════════════════════════════════ */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start
                                    gap-5 sm:gap-6 md:gap-7 lg:gap-10 xl:gap-14 2xl:gap-20
                                    w-full">

                        {/* Logo */}
                        <div className="flex justify-center lg:justify-start shrink-0
                                        lg:w-[17%] xl:w-[19%] 2xl:w-[20%]">
                            <Image
                                src={getAssetUrl("/logo2.avif")}
                                alt="AquaVida Pools and Spas"
                                width={360} height={120}
                                className="w-[120px] sm:w-[150px] md:w-[180px] lg:w-[200px] xl:w-[240px] 2xl:w-[280px]
                                           h-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
                            />
                        </div>

                        {/* Columns grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.45fr)]
                                        gap-x-4 gap-y-5
                                        sm:gap-x-5 sm:gap-y-6
                                        md:gap-x-5 md:gap-y-0
                                        lg:gap-x-7 xl:gap-x-10
                                        w-full lg:flex-1
                                        text-center md:text-left">

                            {/* ── Explore ── */}
                            <nav aria-label="Explore">
                                <h4 className="text-white font-black tracking-[0.3em] uppercase mb-4 sm:mb-6 drop-shadow-md
                                               text-[12px] sm:text-[14px] md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">
                                    Explore
                                </h4>
                                <ul className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6
                                               text-[14px] sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl
                                               text-white/60 md:text-white/80 font-medium tracking-wider">
                                    <li><Link href="/"          className={lk}>Home</Link></li>
                                    <li><Link href="/portfolio" className={lk}>Portfolio</Link></li>
                                    <li><Link href="/services"  className={lk}>Services</Link></li>
                                    <li><Link href="/finance"   className={lk}>Finance</Link></li>
                                    <li><Link href="/about-us"  className={lk}>About Us</Link></li>
                                </ul>
                            </nav>

                            {/* ── Services ── */}
                            <nav aria-label="Services">
                                <h4 className="text-white font-black tracking-[0.3em] uppercase mb-4 sm:mb-6 drop-shadow-md
                                               text-[10px] sm:text-[12px] md:text-sm lg:text-base xl:text-lg 2xl:text-2xl">
                                    Services
                                </h4>
                                <ul className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6
                                               text-[12px] sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl
                                               font-medium tracking-wider">
                                    <li><Link href="/services/pool-design"       className={lk}>Pool design</Link></li>
                                    <li><Link href="/services/pool-construction" className={lk}>Pool construction</Link></li>
                                    <li><Link href="/services/outdoor-kitchen"   className={lk}>Outdoor kitchens</Link></li>
                                    <li><Link href="/services/fire-pit"          className={lk}>Fire Pits</Link></li>
                                    <li><Link href="/services/pool-remodeling"   className={lk}>Pool remodeling</Link></li>
                                    <li><Link href="/services/pergola-design"    className={lk}>Pergola design</Link></li>
                                    <li><Link href="/services/patio-addition"    className={lk}>Patio Extensions</Link></li>
                                </ul>
                            </nav>

                            {/* ── Information ── */}
                            <nav aria-label="Information">
                                <h4 className="text-white font-black tracking-[0.3em] uppercase mb-4 sm:mb-6 drop-shadow-md
                                               text-[10px] sm:text-[12px] md:text-sm lg:text-base xl:text-lg 2xl:text-2xl">
                                    Information
                                </h4>
                                <ul className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6
                                                text-[12px] sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl
                                                font-medium tracking-wider">
                                    <li><Link href="/privacy" className={lk}>Privacy Policy</Link></li>
                                    <li><Link href="/terms"   className={lk}>Terms &amp; Conditions</Link></li>
                                    <li><Link href="/legal"   className={lk}>Terms of Services</Link></li>
                                </ul>
                            </nav>

                            <div className="flex flex-col gap-8 sm:gap-10
                                            col-span-2 md:col-span-1
                                            border-t md:border-t-0 md:border-l border-white/10
                                            pt-10 md:pt-0 md:pl-6 lg:pl-8 xl:pl-10">
                                <div className="max-w-[520px]">
                                    <h4 className="text-white font-black tracking-[0.4em] uppercase drop-shadow-md mb-4
                                                   text-[12px] sm:text-[14px] md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">
                                        Address
                                    </h4>
                                    <p className="text-white/80 font-medium leading-relaxed tracking-wider
                                                  text-[12px] sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
                                        <span className="whitespace-nowrap">2100 N Greenville Ave.</span><br />
                                        <span className="whitespace-nowrap">Richardson, TX 75082, USA</span>
                                    </p>
                                </div>

                                <div className="mt-12">
                                    <h4 className="text-white font-black tracking-[0.4em] uppercase drop-shadow-md mb-4
                                                   text-[12px] sm:text-[14px] md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">
                                        Phone
                                    </h4>
                                    <a href="tel:+14695876255"
                                       className="text-white font-black hover:text-white/70 transition-colors duration-200 drop-shadow-md block
                                                  text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl whitespace-nowrap">
                                        +1&nbsp;469-587-6255
                                    </a>
                                </div>

                                <div className="h-px bg-white/20 mt-12 mb-8" />

                                <ul className="flex items-center justify-center md:justify-start gap-8" role="list">
                                    {[
                                        { label: 'Instagram', icon: <InstagramIcon className="w-6 h-6 sm:w-8 sm:h-8" /> },
                                        { label: 'Facebook',  icon: <FacebookIcon  className="w-6 h-6 sm:w-8 sm:h-8" /> },
                                        { label: 'LinkedIn',  icon: <LinkedInIcon size={32} /> },
                                        { label: 'TikTok',    icon: <TikTokIcon   size={32} /> },
                                    ].map(({ label, icon }) => (
                                        <li key={label}>
                                            <a href="#"
                                               onClick={(e) => {
                                                   e.preventDefault();
                                                   window.scrollTo({ top: 0, behavior: 'smooth' });
                                               }}
                                               aria-label={label}
                                               className="text-white/60 hover:text-white hover:scale-110 transition-all duration-300 inline-flex items-center">
                                                {icon}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>{/* /columns grid */}
                    </div>{/* /body row */}

                    {/* ══════════════════════════════════════
                        BOTTOM BAR
                        Premium horizontal alignment: Copyright | Powered By | Back to Top
                    ══════════════════════════════════════ */}
                    <div className="flex flex-col lg:flex-row items-center justify-between
                                    border-t border-white/10
                                    pt-12 sm:pt-16 pb-4
                                    gap-12 lg:gap-0">

                        {/* Copyright */}
                        <p className="text-white/30 font-bold tracking-[0.2em] uppercase whitespace-nowrap
                                      text-[11px] sm:text-xs md:text-sm xl:text-base
                                      w-full lg:w-1/3 text-center lg:text-left order-2 lg:order-1">
                            © 2026 AQUAVIDA POOLS AND SPAS. ALL RIGHTS RESERVED.
                        </p>

                        {/* Center Powered By (Primary focus) */}
                        <div className="flex items-center justify-center gap-7 w-full lg:w-1/3 order-1 lg:order-2">
                            <span className="font-allomira tracking-[0.5em] font-black uppercase text-white/20 whitespace-nowrap
                                             text-[7.5px] sm:text-[9.5px] md:text-[11px] lg:text-[12.5px] xl:text-[14px]">
                                Powered By
                            </span>
                            <Image
                                src={getAssetUrl("/CXT.gif")}
                                alt="Control X Tech"
                                width={300} height={100}
                                className="h-[70px] sm:h-[85px] md:h-[100px] lg:h-[115px] xl:h-[130px]
                                           w-auto object-contain mix-blend-screen opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </div>

                        {/* Back to top */}
                        <div className="w-full lg:w-1/3 flex justify-center lg:justify-end order-3">
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
                                className="btn font-allomira font-black uppercase tracking-[0.3em]
                                           text-white hover:text-white/60 transition-all duration-300
                                           flex items-center gap-4 group"
                            >
                                <span className="text-[11px] sm:text-xs md:text-sm xl:text-base whitespace-nowrap">
                                    Back to Top
                                </span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"
                                     strokeLinecap="round" strokeLinejoin="round"
                                     className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6
                                                transform group-hover:-translate-y-2 transition-transform duration-300">
                                    <path d="M12 19V5M5 12l7-7 7 7" />
                                </svg>
                            </button>
                        </div>

                    </div>{/* /bottom bar */}

                </div>{/* /card */}
            </footer>
        </>
    );

    if (isHome) {
        return createPortal(footerContent, document.getElementById('portal-root') || document.body);
    }
    return footerContent;
}
