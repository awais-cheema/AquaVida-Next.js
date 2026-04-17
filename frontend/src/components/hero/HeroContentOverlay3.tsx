'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import heroFrameRef from '@/lib/heroFrameRef';
import { getF, TIMELINE } from '@/lib/heroBreakpoints';

const SERVICES = [
    { title: 'Pool Design',             num: '01', href: '/services/pool-design',      icon: '/Icons/pool_design.webp' },
    { title: 'Pool Construction',       num: '02', href: '/services/pool-construction', icon: '/Icons/pool_construction.webp' },
    { title: 'Outdoor Kitchens',        num: '03', href: '/services/outdoor-grill',   icon: '/Icons/Kitchen.webp' },
    { title: 'Fire Pits',               num: '04', href: '/services/fire-pit',          icon: '/Icons/fire_pit.webp' },
    { title: 'Pool Remodeling',         num: '05', href: '/services/pool-remodeling',   icon: '/Icons/Pool_remodeling.webp' },
    { title: 'Pergola Design',          num: '06', href: '/services/pergola-design',    icon: '/Icons/pergola.webp' },
    { title: 'Patio Extensions',        num: '07', href: '/services/pavers', icon: '/Icons/pergola.webp' },
];

export default function HeroContentOverlay3() {
    const [mounted, setMounted]       = useState(false);
    const [visible, setVisible]       = useState(false);
    const [isMobile, setIsMobile]     = useState(false);
    const [cardsActive, setCardsActive] = useState(false);

    const osOpacity    = useMotionValue(0);
    const osY          = useMotionValue(80);
    const cardsOpacity = useMotionValue(0);
    const cardsX       = useMotionValue(60);
    const scrollT      = useMotionValue(0);
    const springT      = useSpring(scrollT, { stiffness: 600, damping: 55 });

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        let alive = true;

        const tick = () => {
            if (!alive) return;
            const f     = heroFrameRef.current;
            const isM   = heroFrameRef.isMobile;
            const total = heroFrameRef.total;

            const T1_START = getF(TIMELINE.OV3_T1.start,     isM, total);
            const T1_HOLD  = getF(TIMELINE.OV3_T1.end,       isM, total);
            const T1_EXIT  = getF(TIMELINE.OV3_T1.exitStart,  isM, total);

            const T2_START = getF(TIMELINE.OV3_T2.start, isM, total);
            const T2_FULL  = getF(TIMELINE.OV3_T2.full,  isM, total);
            const T2_END   = getF(TIMELINE.OV3_T2.end,   isM, total);
            const T2_EXIT  = getF(TIMELINE.OV3_T2.exit,  isM, total);

            if (f < T1_START || f > T2_EXIT) {
                if (visible) setVisible(false);
                return;
            }

            if (!visible) setVisible(true);

            // Stage 1 — "Our Services"
            if (f >= T1_START && f < T1_EXIT) {
                if (f < T1_HOLD) {
                    const t = (f - T1_START) / (T1_HOLD - T1_START);
                    const e = 1 - Math.pow(1 - t, 3);
                    osOpacity.set(e);
                    osY.set(80 * (1 - e));
                } else {
                    const t = (f - T1_HOLD) / (T1_EXIT - T1_HOLD);
                    const e = t * t;
                    osOpacity.set(1 - e);
                    osY.set(-40 * e);
                }
            } else {
                osOpacity.set(0);
            }

            // Stage 2 — cards
            if (f >= T2_START && f <= T2_EXIT) {
                if (!cardsActive) setCardsActive(true);
                if (f < T2_FULL) {
                    const t = (f - T2_START) / (T2_FULL - T2_START);
                    cardsOpacity.set(t);
                    cardsX.set(40 * (1 - t));
                } else if (f > T2_END) {
                    const t = (f - T2_END) / (T2_EXIT - T2_END);
                    cardsOpacity.set(1 - t);
                    cardsX.set(-30 * t);
                } else {
                    cardsOpacity.set(1);
                    cardsX.set(0);
                }
                scrollT.set(Math.max(0, Math.min(1, (f - T2_FULL) / (T2_END - T2_FULL))));
            } else {
                if (cardsActive) setCardsActive(false);
                cardsOpacity.set(0);
            }

        };

        const unsub = heroFrameRef.subscribe(tick);
        return () => { alive = false; unsub(); };
    }, [visible, cardsActive, osOpacity, osY, cardsOpacity, cardsX, scrollT]);

    if (!mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
            style={{ visibility: visible ? 'visible' : 'hidden' }}
        >
            {/* ── Stage 1: "Our Services" ── */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center flex-col"
                style={{ opacity: osOpacity, y: osY, gap: isMobile ? 8 : 14 }}
            >
                <h2
                    className="text-white font-allomira uppercase font-black text-center px-4"
                    style={{
                        fontSize: isMobile ? 'clamp(1.5rem, 8vw, 2.4rem)' : 'clamp(2rem, 4.5vw, 5rem)',
                        letterSpacing: isMobile ? '0.03em' : '0.08em',
                        textShadow: '0 4px 60px rgba(0,0,0,0.95)',
                        pointerEvents: 'none',
                        lineHeight: 1.1,
                    }}
                >
                    Our Services
                </h2>
                {/* Explore CTA — no font color change on hover, scales up */}
                <Link
                    href="/services"
                    className="btn px-10 py-3 bg-[#63b589] text-white font-allomira font-bold text-[clamp(13px,1.05vw,17px)] rounded-full
                               shadow-[0_10px_30px_rgba(99,181,137,0.25)] hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto"
                    style={{ touchAction: 'manipulation' }}
                >
                    Explore All Services
                </Link>
            </motion.div>

            {/* ── Stage 2: horizontal card strip ── */}
            <motion.div
                className="absolute inset-0"
                style={{ opacity: cardsOpacity, x: cardsX, pointerEvents: cardsActive ? 'auto' : 'none' }}
            >
                {SERVICES.map((svc, idx) => (
                    <GlassCard
                        key={idx}
                        svc={svc}
                        index={idx}
                        total={SERVICES.length}
                        scrollT={springT}
                        isMobile={isMobile}
                    />
                ))}
            </motion.div>
        </div>,
        document.getElementById('portal-root') || document.body
    );
}

// ─── Glass card ───────────────────────────────────────────────────────────────

function GlassCard({
    svc,
    index,
    total,
    scrollT,
    isMobile,
}: {
    svc: { title: string; num: string; href: string; icon: string };
    index: number;
    total: number;
    scrollT: any;
    isMobile: boolean;
}) {
    const [st, setSt] = useState<React.CSSProperties>({
        opacity: 0,
        transform: 'translate(calc(-50% + 150vw), -50%)',
        zIndex: 0,
        pointerEvents: 'none',
    });

    useEffect(() => {
        const update = (v: number) => {
            const vw = window.innerWidth;
            // Card width in px, clamped to screen
            const cardPx = Math.min(Math.max(220, vw * (vw < 640 ? 0.80 : 0.78)), 520);
            const cardVW = (cardPx / vw) * 100;
            // Gap: tighter on mobile (5vw) to show the peek clearly
            const gap = vw < 640 ? 6 : 8;
            const step = cardVW + gap;

            const posVW = (index - v * (total - 1)) * step;
            const clip = step * 1.3;

            if (posVW < -clip || posVW > clip) {
                setSt(p => ({ ...p, opacity: 0, pointerEvents: 'none' }));
                return;
            }

            const opacity = posVW <= 0
                ? Math.max(0, 1 + posVW / (step * 0.9))
                : Math.max(0.45, 1 - posVW / (step * 1.2));

            setSt({
                opacity: Math.min(1, opacity),
                transform: `translate(calc(-50% + ${posVW}vw), -50%)`,
                zIndex: Math.max(1, Math.round(100 - Math.abs(posVW) * 1.4)),
                pointerEvents: opacity > 0.1 ? 'auto' : 'none',
            });
        };

        update(0);
        return scrollT.on('change', update);
    }, [index, total, scrollT]);

    const radius = isMobile ? '1.6rem' : 'clamp(1.8rem, 4vw, 3.8rem)';

    // Responsive sizing
    const cardW = isMobile ? 'clamp(180px, 66vw, 290px)' : 'clamp(220px, 34vw, 410px)';
    const cardH = isMobile ? 'clamp(200px, 36vh, 300px)' : 'clamp(220px, 40vh, 420px)';
    const padX = isMobile ? 20 : 40;
    const gap = isMobile ? 14 : 22;
    return (
        <Link
            href={svc.href}
            className="absolute top-1/2 left-1/2"
            style={{
                ...st,
                width: cardW,
                height: cardH,
                borderRadius: radius,
                pointerEvents: 'auto',
                touchAction: 'manipulation',
                cursor: 'pointer',
                boxShadow: '0 12px 48px rgba(0,0,0,0.55), 0 40px 80px rgba(0,0,0,0.28)',
                display: 'block',
                textDecoration: 'none',
            }}
        >
            {/* Glass pane */}
            <div
                className="relative flex items-center justify-center text-center w-full h-full overflow-hidden"
                style={{
                    borderRadius: radius,
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(30px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                {/* Content — true center */}
                <div style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap,
                    padding: `0 ${padX}px`,
                }}>
                    {/* Service number removed as requested */}

                    {/* Icon — significantly larger (120% increase) */}
                    <img 
                        src={svc.icon} 
                        alt="" 
                        style={{
                            width: isMobile ? 'clamp(55px, 14vw, 85px)' : 'clamp(70px, 7.5vw, 120px)',
                            height: 'auto',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.35))',
                            marginTop: isMobile ? '-4px' : '-8px'
                        }}
                    />

                    <div className="flex-1" />

                    {/* Text content at center bottom borderline */}
                    <div className="flex flex-col items-center w-full pb-3 md:pb-6">
                        {/* Service title (further 25% increase + white) */}
                        <h3
                            className="font-allomira uppercase font-black text-white text-center"
                            style={{
                                fontSize:    isMobile
                                    ? 'clamp(1rem, 3.4vw, 1.5rem)'
                                    : 'clamp(1.1rem, 2.1vw, 2rem)',
                                lineHeight:  1.0,
                                letterSpacing: '0.04em',
                                filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.85))'
                            }}
                        >
                            {svc.title}
                        </h3>
                    </div>
                </div>
            </div>
        </Link>
    );
}
