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
 *   Those styles persist into the next page, clipping it entirely (black screen).
 *   useLayoutEffect resets them synchronously after the DOM commit but BEFORE child
 *   layout effects fire — so Framer Motion's useScroll never sees the clipped container.
 *   useEffect cleanup (smoother.kill) runs later and is harmless at that point.
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

    // ── Synchronous style reset (before paint, before child layout effects) ──────
    // Must be useLayoutEffect so it runs before children's useLayoutEffect hooks.
    // Framer Motion's useScroll (used in services/portfolio hero sections) reads
    // scroll container geometry in its own useLayoutEffect — if the wrapper still
    // has position:fixed from ScrollSmoother at that point it throws, causing the
    // "page couldn't load" error on client-side navigation.
    useLayoutEffect(() => {
        if (isHome) return;
        resetWrapperStyles();
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
        <div id="smooth-wrapper">
            <div id="smooth-content">
                {children}
            </div>
        </div>
    );
}
