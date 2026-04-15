'use client';

/**
 * HeroContentOverlay4 — Fourth content window, frames 185–215.
 *
 * Background glassmorphism panel: fades in/out with opacity only, never moves.
 * Text (title + subtext): slides only with x, NO opacity change on text.
 *   — Enter: text sweeps in from LEFT viewport edge → resting position
 *   — Exit:  text sweeps out to RIGHT viewport edge
 *
 *   frames 185–197 : bg fades in (0→1), text slides left→center
 *   frames 197–205 : fully visible, text at rest
 *   frames 205–215 : bg fades out (1→0), text slides center→right off-screen
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue } from 'framer-motion';
import heroFrameRef from '@/lib/heroFrameRef';
import { getF, TIMELINE } from '@/lib/heroBreakpoints';

// Park text well beyond any viewport width (up to 4K)
const ENTER_FROM = -3000;  // text waits left, fully off any screen
const EXIT_TO    =  3000;  // text exits right, fully off any screen

export default function HeroContentOverlay4() {
    const [mounted, setMounted] = useState(false);

    const bgOpacity   = useMotionValue(0);
    const textX       = useMotionValue(ENTER_FROM);
    const textOpacity = useMotionValue(0);
    // visibility hard-hides the whole section before / after active window
    // so off-screen parked text never bleeds onto other frames
    const [visible, setVisible] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const tick = () => {
            const f     = heroFrameRef.current;
            const isM   = heroFrameRef.isMobile;
            const total = heroFrameRef.total;

            const ENTER_START = getF(TIMELINE.OV4.start,     isM, total);
            const ENTER_END   = getF(TIMELINE.OV4.end,       isM, total);
            const EXIT_START  = getF(TIMELINE.OV4.exitStart,  isM, total);
            const EXIT_END    = getF(TIMELINE.OV4.exitEnd,    isM, total);

            if (f < ENTER_START) {
                setVisible(false);
                bgOpacity.set(0);
                textOpacity.set(0);
                textX.set(ENTER_FROM);

            } else if (f <= ENTER_END) {
                setVisible(true);
                const t     = (f - ENTER_START) / (ENTER_END - ENTER_START);
                const eased = 1 - Math.pow(1 - t, 2.5);
                bgOpacity.set(eased);
                textOpacity.set(eased * 0.9);
                textX.set(ENTER_FROM * (1 - eased));

            } else if (f <= EXIT_START) {
                bgOpacity.set(1);
                textOpacity.set(0.8);
                textX.set(0);

            } else if (f <= EXIT_END) {
                const t     = (f - EXIT_START) / (EXIT_END - EXIT_START);
                const eased = 1 - Math.pow(1 - t, 2.5);
                bgOpacity.set(1 - eased);
                textOpacity.set(0.8 * (1 - eased));
                textX.set(EXIT_TO * eased);

            } else {
                setVisible(false);
                bgOpacity.set(0);
                textOpacity.set(0);
                textX.set(EXIT_TO);
            }

        };

        return heroFrameRef.subscribe(tick);
    }, [bgOpacity, textX, textOpacity]);

    if (!mounted) return null;

    return createPortal(
        <section
            className="fixed inset-0 z-[50] flex items-center justify-end
                       pointer-events-none overflow-hidden pr-8 md:pr-16"
            style={{ visibility: visible ? 'visible' : 'hidden' }}
        >
            {/* Glassmorphism background — fades only, never moves */}
            <motion.div
                className="absolute inset-0"
                style={{ opacity: bgOpacity }}
            >
                <div className="absolute inset-0 bg-black/25 " />
            </motion.div>

            {/* Text block — slides only, opacity always 1 */}
            <motion.div
                className="relative z-10 flex flex-col items-end gap-2 md:gap-3
                           max-w-xl md:max-w-2xl text-right
                           pointer-events-auto select-text cursor-text"
                style={{ x: textX, opacity: textOpacity }}
            >
                <h3 className="hero-selectable font-allomira font-extrabold text-white text-right w-full
                               leading-[1.15] tracking-normal
                               text-[clamp(22px,3vw,56px)]
                               drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
                    And We Don&apos;t Just Build Pools,
                    <span className="block">We Craft an Experience</span>
                </h3>

                <p className="hero-selectable font-allomira text-white text-right w-full
                              leading-relaxed tracking-wide text-balance
                              text-[clamp(15px,1.6vw,26px)]
                              drop-shadow-[0_1px_10px_rgba(0,0,0,0.8)]">
                    AquaVida Pools and Spas specializes in building swimming pools. We focus primarily on creating a
                    unique aesthetic-based lifestyle experience for your home and skin
                </p>
            </motion.div>
        </section>,
        document.getElementById("portal-root") || document.body
    );
}
