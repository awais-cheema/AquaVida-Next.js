'use client';

/**
 * HeroContentOverlay2 — Second content window, frames 70–95.
 *
 * No background blur — text floats directly over the canvas.
 *
 * Animation (frame-driven via heroFrameRef):
 *   frame  65 – 74 : fade in from above  (opacity 0→1, translateY -40px→0) — 9 frames
 *   frame  78 – 88 : fully visible
 *   frame  88 – 95 : fade out downward   (opacity 1→0, translateY 0→40px)  — 7 frames
 *   outside range  : hidden (opacity 0)
 *
 * Portalled to document.getElementById("portal-root") || document.body to escape ScrollSmoother's translateY transform.
 * pointer-events-none so scroll reaches the canvas.
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue } from 'framer-motion';
import heroFrameRef from '@/lib/heroFrameRef';
import { getF, TIMELINE } from '@/lib/heroBreakpoints';

export default function HeroContentOverlay2() {
    const [mounted, setMounted] = useState(false);
    const opacity    = useMotionValue(0);
    const translateY = useMotionValue(-120);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const tick = () => {
            const f     = heroFrameRef.current;
            const isM   = heroFrameRef.isMobile;
            const total = heroFrameRef.total;

            const ENTER_START = getF(TIMELINE.OV2.start,     isM, total);
            const ENTER_END   = getF(TIMELINE.OV2.end,       isM, total);
            const EXIT_START  = getF(TIMELINE.OV2.exitStart,  isM, total);
            const EXIT_END    = getF(TIMELINE.OV2.exitEnd,    isM, total);

            if (f < ENTER_START) {
                opacity.set(0);
                translateY.set(-120);
            } else if (f <= ENTER_END) {
                const t = (f - ENTER_START) / (ENTER_END - ENTER_START);
                opacity.set(t);
                translateY.set(-120 * (1 - t));
            } else if (f <= EXIT_START) {
                opacity.set(1);
                translateY.set(0);
            } else if (f <= EXIT_END) {
                const t = (f - EXIT_START) / (EXIT_END - EXIT_START);
                opacity.set(1 - t);
                translateY.set(40 * t);
            } else {
                opacity.set(0);
                translateY.set(40);
            }
        };

        return heroFrameRef.subscribe(tick);
    }, [opacity, translateY]);

    if (!mounted) return null;

    return createPortal(
        /* Outer section: opacity only — stays fixed inset-0, never moves */
        <motion.section
            className="fixed inset-0 z-[50] flex items-center justify-center
                       pointer-events-none"
            style={{ opacity }}
        >
            {/* Inner content: translateY only — selectable for SEO */}
            <motion.div
                className="w-full max-w-5xl flex flex-col items-center gap-2 md:gap-3
                           px-6 md:px-10 text-center
                           pointer-events-auto select-text cursor-text"
                style={{ y: translateY }}
            >
                <h2 className="hero-selectable font-allomira font-extrabold text-white w-full text-center
                               drop-shadow-[0_0_40px_rgba(0,0,0,1),0_6px_24px_rgba(0,0,0,0.95),0_2px_8px_rgba(0,0,0,1)]
                               leading-[1.15] tracking-normal
                               text-[clamp(22px,3.3vw,60px)]">
                    <span className="block">Renovating your Backyard that</span>
                    <span className="block">your Home Deserves</span>
                </h2>

                <p className="hero-selectable font-allomira text-white/90 leading-relaxed text-center
                              drop-shadow-[0_0_24px_rgba(0,0,0,1),0_4px_16px_rgba(0,0,0,0.95),0_2px_6px_rgba(0,0,0,1)]
                              text-[clamp(13px,1.3vw,22px)] w-full max-w-[min(90vw,820px)] sm:max-w-[min(80vw,860px)] md:max-w-[min(68vw,900px)] tracking-wide text-balance">
                    Expert backyard luxury pool builders design high-end, custom aquatic retreats featuring premium
                    materials, innovative water features, and seamless integration with sophisticated outdoor living
                    spaces
                </p>
            </motion.div>
        </motion.section>,
        document.getElementById("portal-root") || document.body
    );
}
