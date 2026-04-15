'use client';

/**
 * HeroScrollOverlay — Full-screen frosted overlay locked 1:1 to canvas frame index.
 *
 * Portalled to document.getElementById("portal-root") || document.body to escape ScrollSmoother's translateY transform.
 *
 * Exit animation (frames 15–35):
 *   - Blur background: fades opacity 1→0, stays in place
 *   - Content block:   fades opacity 1→0 AND translates 0→-150px upward
 *
 * visibility:hidden is applied when frame > FADE_END so the section is
 * compositor-invisible — prevents any flash when loop activation resets
 * lastDrawnFrame and heroFrameRef briefly publishes an in-between value.
 */

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue } from 'framer-motion';
import heroFrameRef from '@/lib/heroFrameRef';
import { getF, TIMELINE } from '@/lib/heroBreakpoints';
import { getAssetUrl } from '@/lib/constants';

export default function HeroScrollOverlay() {
    const [mounted,  setMounted]  = useState(false);
    const [visible,  setVisible]  = useState(true);  // false once fully faded out
    const opacity    = useMotionValue(1);
    const translateY = useMotionValue(0);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const tick = () => {
            const frame = heroFrameRef.current;
            const isM   = heroFrameRef.isMobile;
            const total = heroFrameRef.total;

            const FADE_START = getF(TIMELINE.OV1.start,     isM, total);
            const FADE_END   = getF(TIMELINE.OV1.exitEnd,    isM, total);

            if (frame <= FADE_START) {
                setVisible(true);
                opacity.set(1);
                translateY.set(0);
            } else if (frame <= FADE_END) {
                setVisible(true);
                const t = (frame - FADE_START) / (FADE_END - FADE_START);
                opacity.set(1 - t);
                translateY.set(-(150 * t));
            } else {
                // Hard-hide at compositor level — opacity:0 alone still paints
                setVisible(false);
                opacity.set(0);
                translateY.set(-150);
            }
        };

        return heroFrameRef.subscribe(tick);
    }, [opacity, translateY]);

    if (!mounted) return null;

    return createPortal(
        <section
            className="fixed inset-0 z-[50] pointer-events-none"
            style={{ visibility: visible ? 'visible' : 'hidden' }}
        >
            {/* Blur background — fades only, glassmorphism */}
            <motion.div
                className="absolute inset-0 backdrop-blur-xl bg-black/30"
                style={{ opacity }}
            />

            {/* Content wrapper — centred, shifted 20% higher as requested */}
            <motion.div
                className="relative z-10 flex flex-col items-center justify-center
                           text-center w-full h-full px-4 pt-24 -translate-y-[45%]"
                style={{ opacity, y: translateY }}
            >
                {/* Logo */}
                <div className="mb-6 pointer-events-none">
                    <Image
                        src={getAssetUrl("/logo.avif")}
                        alt="AquaVida Pools and Spas"
                        width={390}
                        height={120}
                        priority
                        className="h-36 w-auto object-contain mx-auto
                                   drop-shadow-[0_4px_32px_rgba(0,0,0,0.7)]"
                    />
                </div>

                {/* H1 — selectable */}
                <h1 className="hero-selectable font-allomira font-bold text-white w-full
                               drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]
                               leading-tight tracking-tight text-center -mt-2">
                    <span className="block text-[clamp(24px,3.5vw,64px)] leading-[1.1] tracking-tight w-full max-w-[min(150vw,1400px)] mx-auto">
                        Aqua Vida Pools and Spas
                    </span>
                    <span className="block text-[clamp(16px,1.9vw,30px)] font-medium text-white/95 mt-2 w-full">
                        The Ultimate Outdoor Experience
                    </span>
                </h1>

                {/* Subtext — selectable */}
                <p className="hero-selectable mt-3 max-w-3xl font-allomira text-white/80 leading-relaxed
                               drop-shadow-[0_1px_10px_rgba(0,0,0,0.65)]
                               text-[clamp(15px,1.5vw,22px)] text-center mx-auto text-balance">
                    Elevate your lifestyle with AquaVida Pools and Spas. We deliver premium pool construction services
                    and one-of-a-kind designs, turning any backyard or commercial site into a private sanctuary of
                    relaxation.
                </p>

                {/* Hero CTAs */}
                <div className="mt-12 flex flex-col sm:flex-row items-center gap-5 pointer-events-auto">
                    <Link
                        href="/contact"
                        className="btn px-10 py-4 bg-[#63b589] text-white font-allomira font-bold text-[clamp(13px,1.05vw,17px)] rounded-full
                                   shadow-[0_10px_30px_rgba(99,181,137,0.35)] hover:scale-110 active:scale-95 transition-all duration-300"
                    >
                        Upgrade Your Lifestyle
                    </Link>
                    <Link
                        href="/portfolio"
                        className="btn px-10 py-4 bg-white/10 text-white font-allomira font-bold text-[clamp(13px,1.05vw,17px)] rounded-full
                                   backdrop-blur-xl border border-white/20 hover:scale-110 active:scale-95 transition-all duration-300"
                    >
                        Start Exploring
                    </Link>
                </div>
            </motion.div>
        </section>,
        document.getElementById("portal-root") || document.body
    );
}
