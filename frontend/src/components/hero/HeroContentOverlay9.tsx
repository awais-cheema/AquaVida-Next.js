'use client';

/**
 * HeroContentOverlay9 — Frames 553–580.
 *
 * Bottom-right text block, right-aligned.
 * Fades in from bottom-right diagonal, holds, fades out same direction.
 * Fully hidden by frame 576. visibility:hidden outside active window.
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue } from 'framer-motion';
import heroFrameRef from '@/lib/heroFrameRef';
import { getF, TIMELINE } from '@/lib/heroBreakpoints';

// Bottom-right diagonal (45°)
const SLIDE_X = 72;
const SLIDE_Y = 72;

export default function HeroContentOverlay9() {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    const opacity = useMotionValue(0);
    const textX   = useMotionValue(SLIDE_X);
    const textY   = useMotionValue(SLIDE_Y);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const tick = () => {
            const f     = heroFrameRef.current;
            const isM   = heroFrameRef.isMobile;
            const total = heroFrameRef.total;

            const ENTER_START = getF(TIMELINE.OV9.start,     isM, total);
            const ENTER_END   = getF(TIMELINE.OV9.end,       isM, total);
            const EXIT_START  = getF(TIMELINE.OV9.exitStart,  isM, total);
            const EXIT_END    = getF(TIMELINE.OV9.exitEnd,    isM, total);

            if (f < ENTER_START) {
                setVisible(false);
                opacity.set(0);
                textX.set(SLIDE_X);
                textY.set(SLIDE_Y);
            } else if (f <= ENTER_END) {
                setVisible(true);
                const t     = (f - ENTER_START) / (ENTER_END - ENTER_START);
                const eased = 1 - Math.pow(1 - t, 2);
                opacity.set(eased);
                textX.set(SLIDE_X * (1 - eased));
                textY.set(SLIDE_Y * (1 - eased));
            } else if (f <= EXIT_START) {
                setVisible(true);
                opacity.set(1);
                textX.set(0);
                textY.set(0);
            } else if (f <= EXIT_END) {
                setVisible(true);
                const t     = (f - EXIT_START) / (EXIT_END - EXIT_START);
                const eased = 1 - Math.pow(1 - t, 2);
                opacity.set(1 - eased);
                textX.set(SLIDE_X * eased);
                textY.set(SLIDE_Y * eased);
            } else {
                setVisible(false);
                opacity.set(0);
                textX.set(SLIDE_X);
                textY.set(SLIDE_Y);
            }

        };

        return heroFrameRef.subscribe(tick);
    }, [opacity, textX, textY]);

    if (!mounted) return null;

    return createPortal(
        <section
            className="fixed inset-0 z-[50] pointer-events-none overflow-hidden"
            style={{ visibility: visible ? 'visible' : 'hidden' }}
        >
            <motion.div
                className="absolute bottom-[6%] right-0
                           pr-4 sm:pr-8 md:pr-14
                           pl-4 sm:pl-6 md:pl-8
                           w-[min(92vw,580px)] sm:w-[min(70vw,600px)] md:w-[min(46vw,620px)]"
                style={{ opacity, x: textX, y: textY }}
            >
                <div className="flex flex-col gap-2 sm:gap-3 md:gap-5 text-right shadow-2xl">
                    <h3 className="hero-selectable font-allomira font-extrabold text-white
                                   leading-[1.1] tracking-tight
                                   text-[clamp(16px,2vw,44px)]
                                   drop-shadow-[0_2px_20px_rgba(0,0,0,0.95),0_0_40px_rgba(0,0,0,0.8)]">
                        Creating the Backdrop for your Family&apos;s Favorite Memories
                    </h3>

                    <p className="hero-selectable font-allomira text-white/90 leading-relaxed
                                  text-[clamp(13px,1.3vw,22px)] tracking-wide text-balance
                                  drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)]">
                        Modern pool construction turns the backyard of your house into a luxurious spot. By blending
                        innovative designing and excellent craftsmanship, we have been able to build beautiful, luxurious and
                        modern pools where the community of a neighborhood can gather, reminisce about old times, and
                        create new memories.
                    </p>
                </div>
            </motion.div>
        </section>,
        document.getElementById("portal-root") || document.body
    );
}
