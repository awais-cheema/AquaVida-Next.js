'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import heroFrameRef from '@/lib/heroFrameRef';
import { getF, TIMELINE } from '@/lib/heroBreakpoints';
import { getAssetUrl } from '@/lib/constants';


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
        const tick = () => {
            const f     = heroFrameRef.current;
            const isM   = heroFrameRef.isMobile;
            const total = heroFrameRef.total;
            // Desktop: appear at frame 582 (OV10 start). Mobile: lower threshold
            // so the footer isn't gated behind the very last 2 frames.
            const APPEAR_F = isM ? getF(560, isM, total) : getF(582, isM, total);

            if (f < APPEAR_F) { setVisible(false); setOpacity(0); }
            else { setVisible(true); setOpacity(Math.min((f - APPEAR_F) / 4, 1)); }
        };
        return heroFrameRef.subscribe(tick);
    }, [isHome]);

    if (!mounted) return null;

    const getDynamicStyles = () => {
        const path = pathname || '';

        // Home Page theme (Glassmorphism)
        if (isHome) {
            return {
                cardBg: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, rgba(13, 86, 153, 0.03) 100%)',
                wrapperBg: 'transparent',
                border: '1px solid rgba(45, 121, 44, 0.2)',
                shadow: '0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
                backdrop: 'blur(30px) saturate(180%)'
            };
        }

        // Finance page — #05070A
        if (path.startsWith('/finance')) {
            return {
                cardBg: '#05070A',
                wrapperBg: '#05070A',
                border: '1px solid rgba(255, 255, 255, 0.03)',
                shadow: 'none',
                backdrop: 'none'
            };
        }

        // Portfolio & Blog — #05070A
        if (path.startsWith('/portfolio') || path.startsWith('/blog')) {
            return {
                cardBg: '#05070A',
                wrapperBg: '#05070A',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                shadow: 'none',
                backdrop: 'none'
            };
        }

        // Legal pages — #05070A
        if (path === '/privacy-policy' || path === '/terms-conditions') {
            return {
                cardBg: '#05070A',
                wrapperBg: '#05070A',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                shadow: 'none',
                backdrop: 'none'
            };
        }

        // Contact page — #0A0E16
        if (path === '/contact') {
            return {
                cardBg: '#0A0E16',
                wrapperBg: '#0A0E16',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                shadow: 'none',
                backdrop: 'none'
            };
        }

        // Services listing page — body bg #0a0e17
        if (path === '/services') {
            return {
                cardBg: '#0a0e17',
                wrapperBg: '#0a0e17',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                shadow: 'none',
                backdrop: 'none'
            };
        }

        // Service sub-pages (ServicePageShell) — #0D0A07
        if (path.startsWith('/services/')) {
            return {
                cardBg: '#0D0A07',
                wrapperBg: '#0D0A07',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                shadow: 'none',
                backdrop: 'none'
            };
        }

        // Default fallback — matches body bg
        return {
            cardBg: '#0a0e17',
            wrapperBg: '#0a0e17',
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
                        background: ds.wrapperBg,
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
                        'px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4 md:px-8 md:pt-7 md:pb-5 lg:px-10 lg:pt-8 lg:pb-6 xl:px-14 xl:pt-10 xl:pb-7 2xl:px-20 2xl:pt-14 2xl:pb-10',
                        // row gaps
                        'gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-10 2xl:gap-12',
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
                                className="no-skeleton w-[90px] sm:w-[110px] md:w-[130px] lg:w-[150px] xl:w-[200px] 2xl:w-[260px]
                                           h-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
                            />
                        </div>

                        {/* Columns grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.45fr)]
                                        gap-x-3 gap-y-4
                                        sm:gap-x-4 sm:gap-y-5
                                        md:gap-x-4 md:gap-y-0
                                        lg:gap-x-5 xl:gap-x-9
                                        w-full lg:flex-1
                                        text-center md:text-left">

                            {/* ── Explore ── */}
                            <nav aria-label="Explore">
                                <h4 className="text-white font-black tracking-[0.1em] uppercase mb-3 sm:mb-4 md:mb-5 drop-shadow-md
                                               text-[13px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-xl 2xl:text-2xl">
                                    Explore
                                </h4>
                                <ul className="flex flex-col gap-2 sm:gap-2 md:gap-3 lg:gap-3 xl:gap-4 2xl:gap-5
                                               text-[13px] sm:text-[14px] md:text-[15px] lg:text-[17px] xl:text-lg 2xl:text-2xl
                                               text-white/60 md:text-white/80 font-medium tracking-wider">
                                    <li><Link href="/"          className={lk}>Home</Link></li>
                                    <li><Link href="/portfolio" className={lk}>Portfolio</Link></li>
                                    <li><Link href="/services"  className={lk}>Services</Link></li>
                                    <li><Link href="/finance"   className={lk}>Finance</Link></li>
                                </ul>
                            </nav>

                            {/* ── Services ── */}
                            <nav aria-label="Services">
                                <h4 className="text-white font-black tracking-[0.1em] uppercase mb-3 sm:mb-4 md:mb-5 drop-shadow-md
                                               text-[12px] sm:text-[13px] md:text-[16px] lg:text-[18px] xl:text-xl 2xl:text-2xl">
                                    Services
                                </h4>
                                <ul className="flex flex-col gap-2 sm:gap-2 md:gap-3 lg:gap-3 xl:gap-4 2xl:gap-5
                                               text-[12px] sm:text-[13px] md:text-[15px] lg:text-[17px] xl:text-lg 2xl:text-2xl
                                               font-medium tracking-wider">
                                    <li><Link href="/services/pool-design"       className={lk}>Pool design</Link></li>
                                    <li><Link href="/services/pool-construction" className={lk}>Pool construction</Link></li>
                                    <li><Link href="/services/outdoor-grill"  className={lk}>Outdoor Grill</Link></li>
                                    <li><Link href="/services/fire-pit"          className={lk}>Fire Pits</Link></li>
                                    <li><Link href="/services/pool-remodeling"   className={lk}>Pool remodeling</Link></li>
                                    <li><Link href="/services/pergola-design"    className={lk}>Pergola design</Link></li>
                                    <li><Link href="/services/pavers" className={lk}>Patio Extensions</Link></li>
                                </ul>
                            </nav>

                            {/* ── Information ── */}
                            <nav aria-label="Information">
                                <h4 className="text-white font-black tracking-[0.1em] uppercase mb-3 sm:mb-4 md:mb-5 drop-shadow-md
                                               text-[12px] sm:text-[13px] md:text-[16px] lg:text-[18px] xl:text-xl 2xl:text-2xl">
                                    Information
                                </h4>
                                <ul className="flex flex-col gap-2 sm:gap-2 md:gap-3 lg:gap-3 xl:gap-4 2xl:gap-5
                                               text-[12px] sm:text-[13px] md:text-[15px] lg:text-[17px] xl:text-lg 2xl:text-2xl
                                               font-medium tracking-wider">
                                    <li><Link href="/privacy-policy"    className={lk}>Privacy Policy</Link></li>
                                    <li><Link href="/terms-conditions"  className={lk}>Terms &amp; Conditions</Link></li>
                                </ul>
                            </nav>

                            <div className="flex flex-col gap-3 sm:gap-5 md:gap-6
                                            col-span-2 md:col-span-1
                                            border-t md:border-t-0 md:border-l border-white/10
                                            pt-5 md:pt-0 md:pl-5 lg:pl-6 xl:pl-8">
                                <div className="max-w-[520px] mx-auto md:mx-0">
                                    <h4 className="text-white font-black tracking-[0.1em] uppercase drop-shadow-md mb-2 sm:mb-3
                                                   text-[13px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-xl 2xl:text-2xl">
                                        Address
                                    </h4>
                                    <a href="https://maps.app.goo.gl/Vv5TYqKWVKtWKj4q7"
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-white/80 hover:text-white font-medium leading-relaxed tracking-wider transition-colors duration-200
                                                  text-[12px] sm:text-[13px] md:text-[15px] lg:text-[17px] xl:text-lg 2xl:text-2xl block">
                                        <span className="sm:whitespace-nowrap">2100 N Greenville Ave.</span><br />
                                        <span className="sm:whitespace-nowrap">Richardson, TX 75082, USA</span>
                                    </a>
                                </div>

                                <div className="mt-0 sm:mt-3 md:mt-4">
                                    <h4 className="text-white font-black tracking-[0.1em] uppercase drop-shadow-md mb-2 sm:mb-3
                                                   text-[13px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-xl 2xl:text-2xl">
                                        Phone
                                    </h4>
                                    <a href="tel:+14695876255"
                                       className="text-white font-black hover:text-white/70 transition-colors duration-200 drop-shadow-md block
                                                  text-[13px] sm:text-[14px] md:text-[15px] lg:text-[17px] xl:text-lg 2xl:text-2xl whitespace-nowrap">
                                        +1&nbsp;469-587-6255
                                    </a>
                                </div>

                                <div className="h-px bg-white/20 mt-0 sm:mt-3 mb-1 sm:mb-2" />

                                <ul className="flex items-center justify-center md:justify-start gap-5 sm:gap-6" role="list">
                                    {[
                                        { label: 'Instagram', href: 'https://www.instagram.com/aquavida.us?igsh=MWxxOGE1a3I3MGp5', icon: <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" /> },
                                        { label: 'Facebook',  href: 'https://www.facebook.com/share/17zSuCHyWT/',                   icon: <FacebookIcon  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" /> },
                                    ].map(({ label, href, icon }) => (
                                        <li key={label}>
                                            <a href={href}
                                               target="_blank"
                                               rel="noopener noreferrer"
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
                                    pt-4 sm:pt-6 md:pt-8 pb-2
                                    gap-3 sm:gap-5 lg:gap-0">

                        {/* Copyright */}
                        <p className="text-white font-bold tracking-[0.08em] uppercase
                                      text-[10px] sm:text-[12px] md:text-[14px] lg:text-[15px] xl:text-base
                                      w-full lg:w-1/3 text-center lg:text-left order-2 lg:order-1
                                      leading-relaxed sm:whitespace-nowrap">
                            © 2026 AQUAVIDA POOLS AND SPAS.<br className="sm:hidden" /> ALL RIGHTS RESERVED.
                        </p>

                        {/* Center Powered By (Primary focus) */}
                        <div className="flex items-center justify-center gap-4 sm:gap-7 w-full lg:w-1/3 order-1 lg:order-2">
                            <span className="font-allomira tracking-[0.2em] font-black uppercase text-white/20 whitespace-nowrap
                                             text-[9px] sm:text-[10px] md:text-[13px] lg:text-[14px] xl:text-[15px]">
                                Powered By
                            </span>
                            <a href="https://controlxtech.com/" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={getAssetUrl("/CXT.gif")}
                                    alt="Control X Tech"
                                    width={300} height={100}
                                    className="no-skeleton h-[44px] sm:h-[72px] md:h-[82px] lg:h-[90px] xl:h-[108px] 2xl:h-[130px]
                                               w-auto object-contain mix-blend-screen opacity-100"
                                />
                            </a>
                        </div>

                        {/* Back to top */}
                        <div className="w-full lg:w-1/3 flex justify-center lg:justify-end order-3">
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="btn font-allomira font-black uppercase tracking-[0.1em]
                                           text-white hover:text-white/60 transition-all duration-300
                                           flex items-center gap-4 group"
                            >
                                <span className="text-[11px] sm:text-[12px] md:text-[14px] lg:text-[15px] xl:text-base whitespace-nowrap">
                                    Back to Top
                                </span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"
                                     strokeLinecap="round" strokeLinejoin="round"
                                     className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7
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
