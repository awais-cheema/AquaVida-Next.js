'use client';

/**
 * HeroContentOverlay5 — Fire Pit loop zone, frames 247–300.
 *
 * Left-anchored title+subtext, pulsing dot at fireplace position.
 * Slides in/out from left. visibility:hidden outside active window.
 */

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue } from 'framer-motion';
import heroFrameRef from '@/lib/heroFrameRef';
import { getF, TIMELINE } from '@/lib/heroBreakpoints';

const SLIDE_PX = 80;

export default function HeroContentOverlay5() {
    const [mounted,  setMounted]  = useState(false);
    const [visible,  setVisible]  = useState(false);
    const opacity    = useMotionValue(0);
    const dotOpacity = useMotionValue(0);
    const textX      = useMotionValue(-SLIDE_PX);
    const pingRef    = useRef<ReturnType<typeof setInterval> | null>(null);
    const [pingScale,   setPingScale]   = useState(1);
    const [pingOpacity, setPingOpacity] = useState(0.7);

    useEffect(() => { setMounted(true); }, []);

    // Manual ping animation (avoids Tailwind animate-ping in portal context)
    useEffect(() => {
        if (!visible) return;
        let scale = 1;
        let dir   = 1;
        const id = setInterval(() => {
            scale += dir * 0.04;
            if (scale >= 2.2) dir = -1;
            if (scale <= 1)   dir = 1;
            setPingScale(scale);
            setPingOpacity(1.5 - scale * 0.5);
        }, 30);
        return () => clearInterval(id);
    }, [visible]);

    useEffect(() => {
        let rafId: number;

        const tick = () => {
            const f     = heroFrameRef.current;
            const isM   = heroFrameRef.isMobile;
            const total = heroFrameRef.total;

            const ENTER_START = getF(TIMELINE.OV5.start,     isM, total);
            const ENTER_END   = getF(TIMELINE.OV5.end,       isM, total);
            const EXIT_START  = getF(TIMELINE.OV5.exitStart,  isM, total);
            const EXIT_END    = getF(TIMELINE.OV5.exitEnd,    isM, total);

            if (f < ENTER_START) {
                setVisible(false);
                opacity.set(0);
                dotOpacity.set(0);
                textX.set(-SLIDE_PX);
            } else if (f <= ENTER_END) {
                setVisible(true);
                const t     = (f - ENTER_START) / (ENTER_END - ENTER_START);
                const eased = 1 - Math.pow(1 - t, 2);
                opacity.set(eased);
                dotOpacity.set(eased);
                textX.set(-SLIDE_PX * (1 - eased));
            } else if (f <= EXIT_START) {
                setVisible(true);
                opacity.set(1);
                // Dot specific: fade out at specific frame
                const dotFade = getF(290, isM, total);
                if (f >= dotFade) {
                    dotOpacity.set(0);
                } else {
                    dotOpacity.set(1);
                }
                textX.set(0);
            } else if (f <= EXIT_END) {
                setVisible(true);
                const t     = (f - EXIT_START) / (EXIT_END - EXIT_START);
                const eased = 1 - Math.pow(1 - t, 2);
                opacity.set(1 - eased);
                dotOpacity.set(0); // Gone during exit
                textX.set(-SLIDE_PX * eased);
            } else {
                setVisible(false);
                opacity.set(0);
                dotOpacity.set(0);
                textX.set(-SLIDE_PX);
            }

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [opacity, dotOpacity, textX]);

    if (!mounted) return null;

    return createPortal(
        <section
            className="fixed inset-0 z-[50] pointer-events-none overflow-hidden"
            style={{ visibility: visible ? 'visible' : 'hidden' }}
        >
            {/* Top-left text block with padding from top */}
            <motion.div
                className="absolute top-[18%] left-0
                           flex flex-col gap-3 md:gap-5
                           pl-6 sm:pl-10 md:pl-14
                           pr-4 sm:pr-6 md:pr-8
                           w-[min(92vw,580px)] md:w-[min(46vw,580px)]"
                style={{ opacity, x: textX }}
            >
                <h3 className="hero-selectable font-allomira font-extrabold text-white
                               leading-[1.1] tracking-tight
                               text-[clamp(16px,2vw,42px)]
                               drop-shadow-[0_2px_20px_rgba(0,0,0,0.95),0_0_40px_rgba(0,0,0,0.8)]">
                    Fire Pit Installation &amp; Custom Design Services
                </h3>

                <p className="hero-selectable font-allomira text-white/90 leading-relaxed
                              text-[clamp(13px,1.3vw,22px)] tracking-wide text-balance
                              drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)]">
                    The sky is the limit with our Expert Fire Pit Installation Services, making your backyard a private
                    sanctuary, and letting us turn your outdoor patio into an all-year amenity. Perfectly paired with your
                    outdoor living space, we are experts in custom luxury fire feature design and construction.
                </p>
            </motion.div>

            {/* Fireplace dot — matte, positioned on fire pit flames */}
            <motion.div
                className="absolute"
                style={{
                    left:      '48%',
                    top:       '49%',
                    opacity:   dotOpacity,
                    transform: 'translate(-50%, -50%)',
                }}
            >
                {/* Matte pulse ring */}
                <div
                    className="absolute rounded-full bg-white/20"
                    style={{
                        width:     40,
                        height:    40,
                        top:       '50%',
                        left:      '50%',
                        transform: `translate(-50%, -50%) scale(${pingScale})`,
                        opacity:   pingOpacity * 0.5,
                        transition: 'none',
                    }}
                />
                {/* Matte solid dot */}
                <div
                    className="relative rounded-full bg-white"
                    style={{ width: 26, height: 26 }}
                />
            </motion.div>
        </section>,
        document.getElementById("portal-root") || document.body
    );
}
