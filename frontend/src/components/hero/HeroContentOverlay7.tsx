'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import heroFrameRef from '@/lib/heroFrameRef';
import { getF, TIMELINE } from '@/lib/heroBreakpoints';

const POP_SOUND_FRAME = 352;
const ENTER_START     = 348; // text starts appearing at 348 (before sound)
const ENTER_END       = 352; // fully visible by 352 (aligned with sound)
const EXIT_START      = 365;
const EXIT_END        = 373;

export default function HeroContentOverlay7() {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    // Resets when scrolled back before the trigger so it replays each forward pass
    const hasPlayedRef = useRef(false);

    const bgOpacity   = useMotionValue(0);
    const textOpacity = useMotionValue(0);
    const scaleRAW    = useMotionValue(0.5);
    const scale       = useSpring(scaleRAW, { stiffness: 450, damping: 18, mass: 0.7 });

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        let alive = true;

        const tick = () => {
            if (!alive) return;
            const f     = heroFrameRef.current;
            const isM   = heroFrameRef.isMobile;
            const total = heroFrameRef.total;

            const ENTER_START     = getF(TIMELINE.OV7.start,     isM, total);
            const ENTER_END       = getF(TIMELINE.OV7.end,       isM, total);
            const EXIT_START      = getF(TIMELINE.OV7.exitStart,  isM, total);
            const EXIT_END        = getF(TIMELINE.OV7.exitEnd,    isM, total);
            const POP_SOUND_FRAME = getF(TIMELINE.OV7.sound,     isM, total);

            // Trigger audio at exactly POP_SOUND_FRAME
            if (f >= POP_SOUND_FRAME && !hasPlayedRef.current) {
                hasPlayedRef.current = true;
                try {
                    const audio = new Audio('/2.mp3'); // Audio pack '2'
                    audio.volume = 1.0;
                    audio.play().catch(() => {});
                } catch (_) {}
            } else if (f < POP_SOUND_FRAME - 5) {
                // Scrolled back far enough — allow replay on next forward pass
                hasPlayedRef.current = false;
            }

            if (f < ENTER_START) {
                if (visible) setVisible(false);
                bgOpacity.set(0);
                textOpacity.set(0);
                scaleRAW.set(0.5);
            } else if (f <= ENTER_END) {
                if (!visible) setVisible(true);
                const t = (f - ENTER_START) / (ENTER_END - ENTER_START);
                bgOpacity.set(t);
                textOpacity.set(t);
                scaleRAW.set(0.5 + Math.pow(t, 2) * 0.5);
            } else if (f <= EXIT_START) {
                if (!visible) setVisible(true);
                bgOpacity.set(1);
                textOpacity.set(1);
                scaleRAW.set(1);
            } else if (f <= EXIT_END) {
                if (!visible) setVisible(true);
                const t = (f - EXIT_START) / (EXIT_END - EXIT_START);
                bgOpacity.set(1 - t);
                textOpacity.set(1 - t);
                scaleRAW.set(1 + t * 0.15);
            } else {
                if (visible) setVisible(false);
                bgOpacity.set(0);
                textOpacity.set(0);
            }

        };

        const unsub = heroFrameRef.subscribe(tick);
        return () => { alive = false; unsub(); };
    }, [visible, bgOpacity, textOpacity, scaleRAW]);

    if (!mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center overflow-hidden"
            style={{ visibility: visible ? 'visible' : 'hidden' }}
        >
            <motion.div
                className="absolute inset-0 bg-black/35"
                style={{ opacity: bgOpacity, backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}
            />

            <motion.div
                className="flex items-center justify-center w-max max-w-[94vw] mx-auto px-6"
                style={{ opacity: textOpacity, scale }}
            >
                <div className="flex items-center justify-center">
                    <h3
                        className="hero-selectable font-allomira font-black text-white text-center uppercase drop-shadow-[0_20px_60px_rgba(0,0,0,1)]"
                        style={{
                            fontSize: 'clamp(18px, 2.4vw, 44px)',
                            letterSpacing: '0.07em',
                            lineHeight: 1.1,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        THE SUMMER SOLUTION IS WHAT WE ALWAYS KEEP IN MIND
                    </h3>
                </div>
            </motion.div>
        </div>,
        document.getElementById('portal-root') || document.body
    );
}
