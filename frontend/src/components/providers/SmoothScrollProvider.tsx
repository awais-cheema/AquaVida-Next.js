'use client';

/**
 * SmoothScrollProvider — Desktop: GSAP ScrollSmoother smooth: 1.15 (Apple/Tesla scroll physics).
 * Mobile: plain passthrough — HeroSection handles normalizeScroll via ScrollTrigger.
 *
 * DOM structure required by ScrollSmoother:
 *   #smooth-wrapper  ← position: fixed; overflow: hidden  (set by ScrollSmoother)
 *   └─ #smooth-content  ← translateY-driven scroll surface
 *
 * ScrollSmoother is only activated on the homepage ('/').
 * All other pages get native browser scroll — no inertia, no lag.
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    gsap.ticker.lagSmoothing(0);
}

const MOBILE_BP      = '(max-width: 768px)';
const SMOOTH_DESKTOP = 1.15;

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome   = pathname === '/';

    useEffect(() => {
        // Only apply ScrollSmoother on homepage — other pages use native scroll
        if (!isHome) return;
        if (window.matchMedia(MOBILE_BP).matches) return;

        const smoother = ScrollSmoother.create({
            wrapper:         '#smooth-wrapper',
            content:         '#smooth-content',
            smooth:          SMOOTH_DESKTOP,
            normalizeScroll: true,
        });

        return () => smoother.kill();
    }, [isHome]);

    return (
        <div id="smooth-wrapper">
            <div id="smooth-content">
                {children}
            </div>
        </div>
    );
}
