'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { getAssetUrl } from '@/lib/constants';

/**
 * Minimal loader — logo + green progress bar.
 *
 * Exits as soon as BOTH conditions pass:
 *   1. aquavida:criticalReady fired (HeroSection dispatches after 3 frames decoded)
 *   2. 250 ms minimum (prevents flash on fast connections)
 * Failsafe: force-exit at 2000 ms regardless for slow mobile devices.
 */
export default function LoaderScreen() {
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef  = useRef<HTMLDivElement>(null);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        const progress  = progressRef.current;
        if (!container || !progress) return;

        // Animate bar from 0 → 100% over 600 ms
        const barTween = gsap.fromTo(progress,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.2, ease: 'power1.inOut', transformOrigin: 'left center' }
        );

        let timerDone   = false;
        let framesReady = false;
        let hidden      = false;

        const hide = () => {
            if (hidden || !timerDone || !framesReady) return;
            hidden = true;
            barTween.kill();
            gsap.to(container, {
                opacity: 0,
                duration: 0.35,
                ease: 'power2.inOut',
                onComplete: () => {
                    container.style.display = 'none';
                    setDone(true);
                },
            });
        };

        const minTimer = setTimeout(() => { timerDone  = true; hide(); }, 250);
        const maxTimer = setTimeout(() => { timerDone  = true; framesReady = true; hide(); }, 2000);

        const onReady = () => { framesReady = true; hide(); };
        window.addEventListener('aquavida:criticalReady', onReady);

        return () => {
            clearTimeout(minTimer);
            clearTimeout(maxTimer);
            window.removeEventListener('aquavida:criticalReady', onReady);
        };
    }, []);

    if (done) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center
                       bg-[#0d0a07]"
            role="status"
            aria-label="Loading AquaVida"
        >
            <Image
                src={getAssetUrl("/logo.avif")}
                alt="AquaVida"
                width={260}
                height={80}
                priority
                className="no-skeleton h-24 w-auto object-contain
                           drop-shadow-[0_4px_32px_rgba(0,0,0,0.7)]"
            />

            {/* Green progress bar */}
            <div className="mt-10 w-48 h-[3px] rounded-full overflow-hidden bg-white/10">
                <div
                    ref={progressRef}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #22c55e 0%, #4ade80 100%)' }}
                />
            </div>
        </div>
    );
}
