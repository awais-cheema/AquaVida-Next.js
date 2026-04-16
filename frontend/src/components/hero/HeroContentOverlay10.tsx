'use client';

/**
 * HeroContentOverlay10 — Final overlay, frames 593–599 (last 5 frames).
 *
 * Glassmorphism full-screen blur. Title + subtext centered slightly above
 * vertical midpoint to leave room for the floating footer below.
 * Text fades in from below. No exit — stays visible at end of sequence.
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue } from 'framer-motion';
import heroFrameRef from '@/lib/heroFrameRef';
import { getF, TIMELINE } from '@/lib/heroBreakpoints';

const ENTER_START = 588;
const ENTER_END   = 592;
const EXIT_START  = 594;
const EXIT_END    = 598;
const SLIDE_PX    = 60;

export default function HeroContentOverlay10() {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    const bgOpacity   = useMotionValue(0);
    const textOpacity = useMotionValue(0);
    const textY       = useMotionValue(SLIDE_PX);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const tick = () => {
            const f     = heroFrameRef.current;
            const isM   = heroFrameRef.isMobile;
            const total = heroFrameRef.total;

            const MOBILE_OFFSET = isM ? 12 : 0;
            const ENTER_START = getF(TIMELINE.OV10.start,     isM, total) - MOBILE_OFFSET;
            const ENTER_END   = getF(TIMELINE.OV10.end,       isM, total) - MOBILE_OFFSET;
            const EXIT_START  = getF(TIMELINE.OV10.exitStart,  isM, total) - MOBILE_OFFSET;
            const EXIT_END    = getF(TIMELINE.OV10.exitEnd,    isM, total) - MOBILE_OFFSET;

            if (f < ENTER_START) {
                setVisible(false);
                bgOpacity.set(0);
                textOpacity.set(0);
                textY.set(SLIDE_PX);
            } else if (f <= ENTER_END) {
                setVisible(true);
                const t     = (f - ENTER_START) / (ENTER_END - ENTER_START);
                const eased = 1 - Math.pow(1 - t, 2);
                bgOpacity.set(eased);
                textOpacity.set(eased);
                textY.set(SLIDE_PX * (1 - eased));
            } else if (f <= EXIT_START) {
                setVisible(true);
                bgOpacity.set(1);
                textOpacity.set(1);
                textY.set(0);
            } else if (f <= EXIT_END) {
                setVisible(true);
                const t = (f - EXIT_START) / (EXIT_END - EXIT_START);
                const eased = 1 - Math.pow(1 - t, 2);
                bgOpacity.set(1 - eased); // optionally keep bg blurred till footer? No, let's fade out so footer takes over perfectly
                textOpacity.set(1 - eased);
                textY.set(-SLIDE_PX * eased); // Float upward on exit
            } else {
                setVisible(false);
                bgOpacity.set(0);
                textOpacity.set(0);
            }

        };

        return heroFrameRef.subscribe(tick);
    }, [bgOpacity, textOpacity, textY]);

    if (!mounted) return null;

    return createPortal(
        <section
            className="fixed inset-0 z-[50] pointer-events-none overflow-hidden"
            style={{ visibility: visible ? 'visible' : 'hidden' }}
        >
            {/* Glassmorphism blur background */}
            <motion.div
                className="absolute inset-0 backdrop-blur-[36px] bg-black/30"
                style={{ opacity: bgOpacity }}
            />

            {/* Content — slightly above center to leave footer room */}
            <div className="relative z-10 flex items-center justify-center w-full h-full">
                <motion.div
                    className="flex flex-col items-center text-center gap-1 sm:gap-2
                               px-4 sm:px-8 md:px-12
                               w-full max-w-[min(96vw,960px)] sm:max-w-[min(88vw,1020px)] md:max-w-[min(78vw,1100px)]
                               -translate-y-[8%] pointer-events-auto select-text"
                    style={{ opacity: textOpacity, y: textY }}
                >
                    <h3 className="hero-selectable font-allomira font-extrabold text-white
                                   leading-[1.15] tracking-tight
                                   text-[clamp(16px,2.1vw,44px)]
                                   drop-shadow-[0_2px_24px_rgba(0,0,0,0.95),0_0_50px_rgba(0,0,0,0.8)]">
                        Now let us Start Building your Dream Backyard
                    </h3>

                    <p className="hero-selectable font-allomira text-white/85 leading-relaxed
                                  text-[clamp(12px,1.25vw,20px)] tracking-wide text-balance
                                  w-full max-w-[min(94vw,940px)] sm:max-w-[min(86vw,1000px)] md:max-w-[min(76vw,1060px)]
                                  drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)]">
                        AquaVida Pools and Spas transforms outdoor visions into beautiful realities. Together with us, custom
                        design, the best sustainable materials and passion for transformation unite to form personalized
                        backyards where families can unwind in great health. Let’s start creating the retreat of your dreams.
                    </p>
                </motion.div>
            </div>
        </section>,
        document.getElementById("portal-root") || document.body
    );
}
