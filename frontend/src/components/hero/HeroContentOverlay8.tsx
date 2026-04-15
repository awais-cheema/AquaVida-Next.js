'use client';

/**
 * HeroContentOverlay8 — Scene loop zone, frames 447–510.
 *
 * Top-right h3 + p block. Fades in from the right, holds for a long
 * read window, fades out to the right. visibility:hidden outside active window.
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue } from 'framer-motion';
import heroFrameRef from '@/lib/heroFrameRef';
import { getF, TIMELINE } from '@/lib/heroBreakpoints';

const ENTER_START = 438;   // loop activation start
const ENTER_END   = 449;   // fully opaque before loop start (450)
const EXIT_START  = 516;   // hold through entire loop, exit as loop ends
const EXIT_END    = 528;   // loop activation end
const SLIDE_PX    = 80;

export default function HeroContentOverlay8() {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    const opacity = useMotionValue(0);
    const textX   = useMotionValue(SLIDE_PX);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const tick = () => {
            const f     = heroFrameRef.current;
            const isM   = heroFrameRef.isMobile;
            const total = heroFrameRef.total;

            const ENTER_START = getF(TIMELINE.OV8.start,     isM, total);
            const ENTER_END   = getF(TIMELINE.OV8.end,       isM, total);
            const EXIT_START  = getF(TIMELINE.OV8.exitStart,  isM, total);
            const EXIT_END    = getF(TIMELINE.OV8.exitEnd,    isM, total);

            if (f < ENTER_START) {
                setVisible(false);
                opacity.set(0);
                textX.set(SLIDE_PX);
            } else if (f <= ENTER_END) {
                setVisible(true);
                const t     = (f - ENTER_START) / (ENTER_END - ENTER_START);
                const eased = 1 - Math.pow(1 - t, 2);
                opacity.set(eased);
                textX.set(SLIDE_PX * (1 - eased));
            } else if (f <= EXIT_START) {
                setVisible(true);
                opacity.set(1);
                textX.set(0);
            } else if (f <= EXIT_END) {
                setVisible(true);
                const t     = (f - EXIT_START) / (EXIT_END - EXIT_START);
                const eased = 1 - Math.pow(1 - t, 2);
                opacity.set(1 - eased);
                textX.set(SLIDE_PX * eased);
            } else {
                setVisible(false);
                opacity.set(0);
                textX.set(SLIDE_PX);
            }

        };

        return heroFrameRef.subscribe(tick);
    }, [opacity, textX]);

    if (!mounted) return null;

    return createPortal(
        <section
            className="fixed inset-0 z-[50] pointer-events-none overflow-hidden"
            style={{ visibility: visible ? 'visible' : 'hidden' }}
        >
            <motion.div
                className="absolute top-[15%] right-0
                           flex flex-col gap-1 sm:gap-1 md:gap-2
                           pr-4 sm:pr-8 md:pr-14
                           pl-4 sm:pl-6 md:pl-8
                           w-[min(92vw,500px)] sm:w-[min(65vw,520px)] md:w-[min(42vw,540px)]
                           text-right"
                style={{ opacity, x: textX }}
            >
                <h3 className="hero-selectable font-allomira font-extrabold text-white
                               leading-[1.1] tracking-tight
                               text-[clamp(16px,2vw,40px)]
                               drop-shadow-[0_2px_20px_rgba(0,0,0,0.95),0_0_40px_rgba(0,0,0,0.8)]">
                    Professional Outdoor Grill Installation
                </h3>

                <p className="hero-selectable font-allomira text-white/90 leading-relaxed
                              text-[clamp(13px,1.3vw,22px)] tracking-wide text-balance
                              drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)]">
                    AquaVida Pools and Spas can create outdoor grills that are as luxurious and functional as the cooking
                    station. The pro crew also promises you a solid construction and reliable setup for an extraordinary
                    dining experience
                </p>
            </motion.div>
        </section>,
        document.getElementById("portal-root") || document.body
    );
}
