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
 *
 * Navigation fix:
 *   ScrollSmoother.kill() does NOT revert position:fixed / overflow:hidden on the wrapper.
 *   Those styles persist and cause Framer Motion's useScroll (used on service/finance pages)
 *   to read a broken scroll container, throwing the "page couldn't load" error.
 *
 *   Fix: the wrapper div carries key={isHome ? 'home' : 'non-home'}. When the user
 *   navigates away from home, React sees the key change, destroys the old DOM element
 *   (taking all ScrollSmoother inline styles with it), and mounts a brand-new, clean
 *   wrapper — before any child layout effects run. No timing tricks needed.
 */

import { useEffect, useLayoutEffect } from 'react';
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

function resetWrapperStyles() {
    const wrapper = document.getElementById('smooth-wrapper');
    const content = document.getElementById('smooth-content');
    if (wrapper) {
        wrapper.style.position = '';
        wrapper.style.overflow = '';
        wrapper.style.height   = '';
        wrapper.style.width    = '';
        wrapper.style.top      = '';
        wrapper.style.left     = '';
    }
    if (content) {
        content.style.transform = '';
        content.style.overflow  = '';
        content.style.position  = '';
    }
}

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome   = pathname === '/';

    // Scroll to top when arriving on a non-home page via client navigation.
    useLayoutEffect(() => {
        if (isHome) return;
        window.scrollTo(0, 0);
    }, [isHome]);

    // ── Kill stale ScrollTrigger state on every route change ────────────────────
    useEffect(() => {
        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
            ScrollTrigger.clearScrollMemory();
        };
    }, [pathname]);

    // ── ScrollSmoother — homepage desktop only ───────────────────────────────────
    useEffect(() => {
        if (!isHome) return;
        if (window.matchMedia(MOBILE_BP).matches) return;

        const smoother = ScrollSmoother.create({
            wrapper:         '#smooth-wrapper',
            content:         '#smooth-content',
            smooth:          SMOOTH_DESKTOP,
            normalizeScroll: true,
        });

        return () => {
            smoother.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
            ScrollTrigger.clearScrollMemory();
            resetWrapperStyles();
        };
    }, [isHome]);

    return (
        <div id="smooth-wrapper" key={isHome ? 'home' : 'non-home'}>
            <div id="smooth-content">
                {children}
            </div>
        </div>
    );
}
