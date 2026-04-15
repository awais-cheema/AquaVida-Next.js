'use client';

/**
 * HeroContentOverlay6 — Outdoor Kitchen scene, frames 335–345.
 *
 * Text rests above the dot; dot rests on kitchen counter.
 * Both enter/exit along a 70° diagonal.
 * Dot fades out at frame 341 independently of text.
 * visibility:hidden outside active window.
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue } from 'framer-motion';
import heroFrameRef from '@/lib/heroFrameRef';
import { getF, TIMELINE } from '@/lib/heroBreakpoints';

const ENTER_START = 335;
const ENTER_END   = 340;
const DOT_FADE_END = 341;   // dot gone by this frame
const EXIT_START  = 342;
const EXIT_END    = 345;

// 70° from horizontal → steep diagonal
const SLIDE      = 160;
const SLIDE_X    = Math.round(SLIDE * 0.342); // ≈ 55px
const SLIDE_Y    = Math.round(SLIDE * 0.940); // ≈ 150px

export default function HeroContentOverlay6() {
    const [mounted,  setMounted]  = useState(false);
    const [visible,  setVisible]  = useState(false);

    const diagX      = useMotionValue(-SLIDE_X);
    const diagY      = useMotionValue(-SLIDE_Y);
    const textOpacity = useMotionValue(0);
    const dotOpacity  = useMotionValue(0);   // independent — cuts at frame 341

    const [pingScale,   setPingScale]   = useState(1);
    const [pingOpacity, setPingOpacity] = useState(0.7);

    useEffect(() => { setMounted(true); }, []);

    // Manual ping — same pattern as overlay5
    useEffect(() => {
        if (!visible) return;
        let scale = 1, dir = 1;
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
        const tick = () => {
            const f     = heroFrameRef.current;
            const isM   = heroFrameRef.isMobile;
            const total = heroFrameRef.total;

            const ENTER_START  = getF(TIMELINE.OV6.start,     isM, total);
            const ENTER_END    = getF(TIMELINE.OV6.end,       isM, total);
            const DOT_FADE_END = getF(341,                   isM, total);
            const EXIT_START   = getF(TIMELINE.OV6.exitStart,  isM, total);
            const EXIT_END     = getF(TIMELINE.OV6.exitEnd,    isM, total);

            if (f < ENTER_START) {
                setVisible(false);
                textOpacity.set(0);
                dotOpacity.set(0);
                diagX.set(-SLIDE_X);
                diagY.set(-SLIDE_Y);
            } else if (f <= ENTER_END) {
                setVisible(true);
                const t     = (f - ENTER_START) / (ENTER_END - ENTER_START);
                const eased = 1 - Math.pow(1 - t, 3);
                textOpacity.set(eased);
                dotOpacity.set(eased);
                diagX.set(-SLIDE_X * (1 - eased));
                diagY.set(-SLIDE_Y * (1 - eased));
            } else if (f <= DOT_FADE_END) {
                // Text holds; dot fades out over 1 frame
                setVisible(true);
                textOpacity.set(1);
                const dt = (f - ENTER_END) / (DOT_FADE_END - ENTER_END || 1);
                dotOpacity.set(1 - dt);
                diagX.set(0);
                diagY.set(0);
            } else if (f <= EXIT_START) {
                setVisible(true);
                textOpacity.set(1);
                dotOpacity.set(0);
                diagX.set(0);
                diagY.set(0);
            } else if (f <= EXIT_END) {
                setVisible(true);
                const t     = (f - EXIT_START) / (EXIT_END - EXIT_START);
                const eased = 1 - Math.pow(1 - t, 3);
                textOpacity.set(1 - eased);
                dotOpacity.set(0);
                diagX.set( SLIDE_X * eased);
                diagY.set( SLIDE_Y * eased);
            } else {
                setVisible(false);
                textOpacity.set(0);
                dotOpacity.set(0);
                diagX.set(-SLIDE_X);
                diagY.set(-SLIDE_Y);
            }

        };

        return heroFrameRef.subscribe(tick);
    }, [textOpacity, dotOpacity, diagX, diagY]);

    if (!mounted) return null;

    return createPortal(
        <section
            className="fixed inset-0 z-[50] pointer-events-none overflow-hidden"
            style={{ visibility: visible ? 'visible' : 'hidden' }}
        >
            {/* Text block — responsive, slides in along diagonal */}
            <motion.div
                className="absolute left-1/2
                           flex flex-col gap-2 sm:gap-3 md:gap-4
                           w-[min(92vw,580px)] sm:w-[min(78vw,600px)] md:w-[min(54vw,620px)]
                           text-center pointer-events-auto select-text
                           px-4 sm:px-0"
                style={{
                    top:        '58%',
                    opacity:    textOpacity,
                    x:          diagX,
                    y:          diagY,
                    translateX: '-50%',
                }}
            >
                <h3 className="hero-selectable font-allomira font-extrabold text-white
                               leading-[1.1] tracking-tight
                               text-[clamp(18px,2.3vw,44px)]
                               drop-shadow-[0_2px_20px_rgba(0,0,0,0.95),0_0_40px_rgba(0,0,0,0.8)]">
                    Soft Edges, Excellent Quality Because We CARE!
                </h3>

                <p className="hero-selectable font-allomira text-white/90 leading-relaxed
                              text-[clamp(14px,1.5vw,24px)] tracking-wide text-balance
                              drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)]">
                    We believe that safety and comfort come before anything else, which is why we design pools with
                    smooth, soft edges. We are devoted to quality workmanship, so you can rest assured that the finished
                    product is something that everyone in the family will experience in a friendly environment
                </p>
            </motion.div>

            {/* Kitchen counter dot — fades out at frame 341, diagonal slide */}
            <motion.div
                className="absolute"
                style={{
                    left:        '59.5%',
                    top:         '59.5%',
                    opacity:     dotOpacity,
                    x:           diagX,
                    y:           diagY,
                    translateX:  '-50%',
                    translateY:  '-50%',
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
