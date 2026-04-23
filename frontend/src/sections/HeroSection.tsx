'use client';

/**
 * HeroSection — Responsive cinematic render engine.
 *
 * Core design:
 *   ONE rAF loop. GSAP ScrollTrigger with scrub:true writes proxy.targetFrame instantly.
 *   Rendering splits into two clear phases:
 *
 *   SCROLLING  → Desktop: direct assign (no lerp, no blend). Mobile: adaptive lerp + blend gate.
 *   IDLE       → snap currentFrame = round(targetFrame), single frame draw, no ghosting
 *
 * Ghosting fix:
 *   Canvas skips redraw when the snapped integer frame hasn't changed (lastDrawnFrame).
 *   Blending is disabled the moment isScrolling goes false.
 *
 * Idle loop zones — ping-pong, both desktop and mobile:
 *   Desktop:  fire_loop 269–287 (activation 263–293) | scene_loop 450–515 (activation 444–521)
 *   Mobile:   fire_loop  95–101 (activation  90–106) | scene_loop 158–180 (activation 153–185)
 *   Loops only activate when scrollVelocity < 0.001 (truly stopped).
 *
 * Progressive tiered loading (desktop concurrency 24→12→6):
 *   Tier 1 — Critical  (0–39):   blocks animation start. 24 concurrent workers.
 *   Tier 2 — Priority  (40–199): loop zones front-queued, then 40–200. 12 workers.
 *   Tier 3 — Background (200–end): idle load. 6 workers.
 *   No frame eviction — all frames stay in memory. Retries: 3× with 500 ms back-off.
 */

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { FrameLoader } from '@/lib/frameLoader';
import { CanvasRenderer } from '@/lib/canvasRenderer';
import heroFrameRef from '@/lib/heroFrameRef';
import { R2_BASE, getAssetUrl } from '@/lib/constants';
import { getF } from '@/lib/heroBreakpoints';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);



// ── Frame counts ───────────────────────────────────────────────────────────────
const DESKTOP_FRAMES = 600;
const MOBILE_FRAMES  = 220;

// ── Loading ────────────────────────────────────────────────────────────────────
const CRITICAL_COUNT    = 3;    // Tier 1: blocks animation start — 3 frames at 12 workers ≈ 50 ms
const PRIORITY_END      = 200;  // Tier 2 ends here; loop zones front-queued
const DESKTOP_CRITICAL_CONCURRENCY = 12; // lower concurrency to avoid connection saturating
const MOBILE_CONCURRENCY  = 6;  // mobile: lighter concurrency (all tiers)
const DESKTOP_BATCH     = 15;   // desktop Tier 3 batch size (smaller = smoother background load)
const MOBILE_BATCH      = 10;   // mobile Tier 3 batch size
const SCROLL_BUFFER     = 30;   // frames preloaded ahead during scroll
const BLUR_REMOVE_AT    = 20;   // remove canvas blur after N frames loaded

// ── Scroll ─────────────────────────────────────────────────────────────────────
const DESKTOP_END            = '+=1100%';  // slower hero scrub: spread 600 frames across more scroll distance
const MOBILE_END             = '+=1100%';  // slower mobile scrub: more scroll distance per frame
const MOBILE_LERP            = 0.10;       // mobile adaptive lerp (fast scroll)
const MOBILE_SLOW_VEL        = 0.01;       // velocity threshold: direct assign below this
const MOBILE_SKIP_THRESHOLD  = 0.05;       // skip canvas draw if float frame moved less than this
const MOBILE_SETTLE_SPEED    = 8;          // max frames/tick when settling after fast reverse swipe
const RENDER_LERP            = 0.10;       // desktop: renderFrame trails proxy.targetFrame — cinematic slide
const RENDER_LERP_MOBILE     = 0.14;       // mobile: slightly faster trail — responsive + prevents frame-0 flash on inertia dip
const MAX_FRAME_DELTA          = 40;        // safety clamp: max frames canvas can jump per rAF tick (desktop + loop mode)
const PROXY_MAX_DELTA_SCROLL   = 8;        // mobile: max smoothedTarget change per tick during scroll — caps GSAP glitch in both directions
const PROXY_MAX_DELTA_IDLE     = 4;        // mobile: tighter cap while idle/settling — eliminates residual flutter after direction change
const SCROLL_TIMEOUT_MS          = 150;   // ms after last scroll event → isScrolling = false
const LOOP_READY_DELAY_MS        = 400;   // mobile: ms of stillness before loops activate
const DESKTOP_LOOP_READY_DELAY_MS = 200;  // desktop: 0.2s stillness before loop activates
const IDLE_VELOCITY          = 0.001;  // px/ms threshold for "truly stopped"
const BLEND_MIN_VEL          = 0.05;   // px/ms below this → single frame (kills momentum ghost)
const MOBILE_BP              = '(max-width: 768px)';

// ── Loop zones ─────────────────────────────────────────────────────────────────
interface LoopZone {
    readonly name: string;
    readonly start: number;
    readonly end: number;
    readonly activationStart: number;
    readonly activationEnd: number;
    readonly speed?: number;   // per-zone override for BASE_LOOP_SPEED
}

// Loops removed — they required heavy scroll to exit and caused overlays to be skipped.
const DESKTOP_LOOP_ZONES: readonly LoopZone[] = [];
const MOBILE_LOOP_ZONES:  readonly LoopZone[] = [];

const BASE_LOOP_SPEED = 0.18;
const MAX_LOOP_SPEED  = 2.0;
const VELOCITY_FACTOR = 0.02;

// ── Overlay snap points (desktop only) ────────────────────────────────────────
// Empty — auto-snap is disabled. Scroll moves freely through all overlays.
const DESKTOP_SNAP_POINTS: readonly number[] = [];

// ── Hold zones (desktop) ───────────────────────────────────────────────────────
// Empty — hold suppression is disabled. Snap logic is already gated on
// snapPoints.length > 0 so this has no effect when snap is off.
const DESKTOP_HOLD_ZONES: readonly [number, number][] = [];

function doubleRAF(): Promise<void> {
    return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
}

export default function HeroSection() {
    const sectionRef    = useRef<HTMLElement>(null);
    const canvasRef     = useRef<HTMLCanvasElement>(null);
    const firstFrameRef = useRef<HTMLImageElement>(null);
    const scrollHintRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section    = sectionRef.current;
        const canvas     = canvasRef.current;
        const scrollHint = scrollHintRef.current;
        if (!section || !canvas) return;

        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);

        let cancelled      = false;
        let gsapCtx:       gsap.Context | null   = null;
        let loader:        FrameLoader | null    = null;
        let renderer:      CanvasRenderer | null = null;
        let rafId          = 0;
        let resizeHandler: (() => void) | null   = null;
        let visHandler:    (() => void) | null   = null;
        let scrollTimer:   ReturnType<typeof setTimeout> | null = null;
        let loopTimer:     ReturnType<typeof setTimeout> | null = null;

        const isMobile    = window.matchMedia(MOBILE_BP).matches;
        const totalFrames = isMobile ? MOBILE_FRAMES : DESKTOP_FRAMES;
        const maxFrame    = totalFrames - 1;
        const basePath    = isMobile ? `${R2_BASE}/frames-mobile` : `${R2_BASE}/frames`;
        const scrollEnd   = isMobile ? MOBILE_END : DESKTOP_END;
        const fitMode     = 'cover' as const;   // fill viewport on all devices
        const loopZones   = isMobile ? MOBILE_LOOP_ZONES : DESKTOP_LOOP_ZONES;

        // ── Engine state ───────────────────────────────────────────────────────
        const proxy = { targetFrame: 0 };   // GSAP scrub:true writes this instantly

        let renderFrame    = 0;             // lerps toward proxy.targetFrame — smooth multi-frame slide
        let smoothedTarget = 0;             // mobile: rate-limited view of proxy.targetFrame — backward capped at PROXY_BACKWARD_DELTA/tick
        let currentFrame   = 0;
        let loopFrame      = 0;
        let loopDirection  = 1;
        let activeLoop:    LoopZone | null = null;
        let mode:          'scroll' | 'loop' = 'scroll';

        let isScrolling    = false;
        let loopReady      = false;   // true only after LOOP_READY_DELAY_MS of stillness
        let scrollVelocity = 0;
        let lastScrollY    = 0;
        let lastScrollTime = performance.now();
        let lastDrawnFrame    = -1;          // skip canvas draw if frame unchanged
        let lastRenderedFloat = -1;          // mobile: skip draw if float moved < MOBILE_SKIP_THRESHOLD
        let loopStabilizing   = false;       // mobile: one-cycle pause on loop entry
        let lastPreloadIdx    = -1;
        let firstFrameDrawn = false;
        let blurRemoved     = false;
        let mainST:    ScrollTrigger | null = null;  // main ST instance (set on first refresh)
        let isSnapping = false;                       // true while auto-snap scroll is animating
        const snapPoints: readonly number[] = DESKTOP_SNAP_POINTS.map(f => getF(f, isMobile, totalFrames));
        const holdZones:  readonly [number, number][] = DESKTOP_HOLD_ZONES.map(([s, e]) => [
            getF(s, isMobile, totalFrames),
            getF(e, isMobile, totalFrames)
        ]);

        // Returns true when the frame sits inside a fully-visible overlay zone.
        // Snap is suppressed here so the user can rest on content undisturbed.
        const isInHoldZone = (frame: number): boolean =>
            holdZones.some(([s, e]) => frame >= s && frame <= e);

        const getNearestSnapPoint = (frame: number): number | null => {
            if (snapPoints.length === 0) return null;
            let closest = snapPoints[0];
            let minDist = Math.abs(frame - closest);
            for (const sp of snapPoints) {
                const dist = Math.abs(frame - sp);
                if (dist < minDist) {
                    minDist = dist;
                    closest = sp;
                }
            }
            return closest;
        };

        // ── Snap-cancel on physical user input (wheel / touch) ───────────────────
        // Using wheel/touchstart instead of the scroll event because GSAP's own
        // scrollTo animation triggers scroll events — we must not let the snap
        // kill itself via onScroll.
        const cancelSnap = () => {
            if (isSnapping) {
                gsap.killTweensOf(window);
                isSnapping = false;
            }
        };
        window.addEventListener('wheel',      cancelSnap, { passive: true });
        window.addEventListener('touchstart', cancelSnap, { passive: true });

        // ── Scroll listener ────────────────────────────────────────────────────
        const onScroll = () => {
            // Keep position tracking current so velocity is correct after snap ends.
            const now   = performance.now();
            const prevY = lastScrollY;
            const prevT = lastScrollTime;
            lastScrollY    = window.scrollY;
            lastScrollTime = now;

            // Snap is driving the scroll — don't reset engine state or set timers.
            if (isSnapping) return;

            const dt = now - prevT;
            const dy = Math.abs(window.scrollY - prevY);
            if (dt > 0) scrollVelocity = Math.min(dy / dt, 5);

            isScrolling = true;
            loopReady   = false;   // any scroll cancels loop readiness

            // Timer 1 (150ms): stop blending, snap to clean frame
            if (scrollTimer) clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                isScrolling    = false;
                scrollVelocity = 0;

                // Snap to next overlay — only from transition / dead zones, never from hold zones.
                // This lets the user rest on content (e.g. scroll through service cards)
                // without being ejected to the next overlay.
                if (!isSnapping && mainST && snapPoints.length > 0) {
                    const f = Math.round(proxy.targetFrame);
                    if (!isInHoldZone(f)) {
                        const nearest = getNearestSnapPoint(f);
                        if (nearest !== null && nearest !== f) {
                            isSnapping = true;
                            const progress = nearest / maxFrame;
                            const targetY  = mainST.start + progress * (mainST.end - mainST.start);
                            gsap.to(window, {
                                scrollTo: { y: targetY, autoKill: false },
                                duration: 0.25,   // faster: reduced from 0.35
                                ease: 'power2.out',
                                onComplete: () => { isSnapping = false; },
                            });
                        }
                    }
                }
            }, SCROLL_TIMEOUT_MS);

            // Timer 2: allow loop activation only after genuine stillness.
            // Desktop: extra delay so ScrollSmoother's 1.2s easing fully settles.
            if (loopTimer) clearTimeout(loopTimer);
            loopTimer = setTimeout(
                () => { loopReady = true; },
                isMobile ? LOOP_READY_DELAY_MS : DESKTOP_LOOP_READY_DELAY_MS
            );

            // Exit loop immediately
            if (mode === 'loop') {
                mode       = 'scroll';
                activeLoop = null;
                currentFrame = loopFrame; // pick up from loop position
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        // ── Single rAF render loop ─────────────────────────────────────────────
        const startRenderLoop = () => {
            const loop = () => {
                if (!renderer || !loader) return;

                // Clamp frame index to ±MAX_FRAME_DELTA from lastDrawnFrame.
                // GSAP scrub can briefly reset proxy to 0 on direction change — this
                // guard prevents that glitch from reaching the canvas / heroFrameRef.
                const clampFrame = (raw: number): number => {
                    if (lastDrawnFrame < 0) return raw;
                    return Math.max(
                        lastDrawnFrame - MAX_FRAME_DELTA,
                        Math.min(lastDrawnFrame + MAX_FRAME_DELTA, raw)
                    );
                };

                const truly_idle = !isScrolling && scrollVelocity < IDLE_VELOCITY;

                // Bidirectional rate-limit on mobile proxy — single source of smoothing truth.
                // Caps how many frames smoothedTarget can move per tick in EITHER direction.
                //   • During scroll: 8/tick — fast enough for any realistic swipe, kills GSAP
                //     direction-change glitch that briefly sends proxy to 0 or far forward.
                //   • During idle:   4/tick — prevents residual flutter as scrub:0.3 settles.
                // Forward + backward equally limited → no asymmetric jump artifacts.
                if (isMobile) {
                    const delta = proxy.targetFrame - smoothedTarget;
                    const maxD  = isScrolling ? PROXY_MAX_DELTA_SCROLL : PROXY_MAX_DELTA_IDLE;
                    smoothedTarget = Math.abs(delta) <= maxD
                        ? proxy.targetFrame
                        : smoothedTarget + Math.sign(delta) * maxD;
                    smoothedTarget = Math.max(0, Math.min(maxFrame, smoothedTarget));
                } else {
                    smoothedTarget = proxy.targetFrame;
                }

                if (mode === 'loop' && activeLoop) {
                    // ── Loop mode: integer ping-pong ──────────────────────────
                    // Mobile: one-cycle stabilization pause on loop entry
                    if (isMobile && loopStabilizing) {
                        loopStabilizing = false;
                        // hold current frame, don't advance yet
                    } else {
                        const zoneSpeed = activeLoop.speed ?? BASE_LOOP_SPEED;
                        const speed = Math.min(
                            zoneSpeed + scrollVelocity * VELOCITY_FACTOR,
                            MAX_LOOP_SPEED
                        );
                        loopFrame += speed * loopDirection;

                        if (loopFrame >= activeLoop.end) {
                            loopFrame     = activeLoop.end;
                            loopDirection = -1;
                        } else if (loopFrame <= activeLoop.start) {
                            loopFrame     = activeLoop.start;
                            loopDirection = 1;
                        }
                        currentFrame = loopFrame;
                    }

                    // Draw integer frame — no blending in loop
                    const idx = Math.round(currentFrame);
                    if (idx !== lastDrawnFrame) {
                        const img = loader.getFrame(idx) ?? loader.getNearestFrame(idx)?.img ?? null;
                        if (img) {
                            if (isMobile) renderer.drawFrame(img, idx);
                            else          renderer.drawDirect(img, idx);
                            lastDrawnFrame = idx;
                            if (!firstFrameDrawn) { firstFrameDrawn = true; canvas.style.opacity = '1'; }
                        }
                    }
                    loader.preloadAhead(activeLoop.start, activeLoop.end - activeLoop.start + 2);

                } else if (isScrolling) {
                    // ── Scroll mode ──────────────────────────────────────────
                    if (isMobile) {
                        // Mobile: scrub:0.3 is the ONLY smoothing source.
                        // A second lerp creates double-lag that over-dips into low frames on
                        // direction change, flashing overlay 1. Draw smoothedTarget directly.
                        renderFrame = smoothedTarget;
                        const idx = clampFrame(Math.max(0, Math.min(Math.round(renderFrame), maxFrame)));
                        if (idx !== lastDrawnFrame) {
                            const img = loader.getFrame(idx) ?? loader.getNearestFrame(idx)?.img ?? null;
                            if (img) {
                                renderer.drawFrame(img, idx);
                                lastDrawnFrame    = idx;
                                lastRenderedFloat = renderFrame;
                                if (!firstFrameDrawn) { firstFrameDrawn = true; canvas.style.opacity = '1'; }
                            }
                        }
                    } else {
                        // Desktop: scrub:true = instant proxy; RENDER_LERP trails for cinematic slide.
                        renderFrame += (proxy.targetFrame - renderFrame) * RENDER_LERP;
                        const idx = clampFrame(Math.max(0, Math.min(Math.round(renderFrame), maxFrame)));
                        if (idx !== lastDrawnFrame) {
                            const img = loader.getFrame(idx) ?? loader.getNearestFrame(idx)?.img ?? null;
                            if (img) {
                                renderer.drawDirect(img, idx);
                                lastDrawnFrame    = idx;
                                lastRenderedFloat = renderFrame;
                                if (!firstFrameDrawn) { firstFrameDrawn = true; canvas.style.opacity = '1'; }
                            }
                        }
                    }

                } else {
                    // ── Idle mode ──────────────────────────────────────────────
                    // Mobile: follow smoothedTarget — rate-limited proxy prevents inertia
                    //         overshoot from jumping canvas to frame 0 when flicking from footer.
                    // Desktop: snap clean — scrub:true means proxy is already settled.
                    renderFrame  = isMobile ? smoothedTarget : proxy.targetFrame;
                    currentFrame = clampFrame(Math.max(0, Math.min(Math.round(renderFrame), maxFrame)));
                    const snapped = Math.round(currentFrame);

                    if (snapped !== lastDrawnFrame) {
                        const img = loader.getFrame(snapped) ?? loader.getNearestFrame(snapped)?.img ?? null;
                        if (img) {
                            if (isMobile) renderer.drawFrame(img, snapped);
                            else          renderer.drawDirect(img, snapped);
                            lastDrawnFrame    = snapped;
                            lastRenderedFloat = snapped;
                            if (!firstFrameDrawn) { firstFrameDrawn = true; canvas.style.opacity = '1'; }
                        }
                    }

                    // Loop activation — requires genuine stillness (loopReady fires at 400ms)
                    // Decoupled from the 150ms ghost-snap timer so brief mid-scroll pauses
                    // don't accidentally trigger loops.
                    // Also guarded by settled check: don't activate while still lerping
                    // toward target after a fast reverse swipe.
                    const settled = Math.abs(proxy.targetFrame - currentFrame) <= 2;
                    if (truly_idle && loopReady && !isSnapping && settled) {
                        for (const zone of loopZones) {
                            if (snapped >= zone.activationStart && snapped <= zone.activationEnd) {
                                mode            = 'loop';
                                activeLoop      = zone;
                                loopDirection   = 1;
                                loopFrame       = Math.max(zone.start, Math.min(zone.end, snapped));
                                currentFrame    = loopFrame;
                                lastDrawnFrame  = -1;
                                lastRenderedFloat = -1;
                                loopStabilizing = isMobile; // one-cycle pause on mobile only
                                break;
                            }
                        }
                    }
                }

                // Publish displayed frame for overlay sync, then drive all overlay ticks
                // from this single RAF loop — eliminates per-overlay RAF overhead.
                heroFrameRef.isMobile = isMobile;
                heroFrameRef.total = totalFrames;
                heroFrameRef.current = lastDrawnFrame >= 0 ? lastDrawnFrame : Math.round(currentFrame);
                heroFrameRef.tick();

                // Scroll-ahead preload — boost priority for upcoming frames
                const refIdx = Math.round(currentFrame);
                if (Math.abs(refIdx - lastPreloadIdx) >= 10) {
                    loader.preloadAhead(refIdx, SCROLL_BUFFER);
                    lastPreloadIdx = refIdx;
                }

                rafId = requestAnimationFrame(loop);
            };
            rafId = requestAnimationFrame(loop);
        };

        // ── GSAP ScrollTrigger — scrub:true = instant targetFrame update ──────
        const initGSAP = async () => {
            window.scrollTo(0, 0);
            await doubleRAF();
            if (cancelled) return;
            ScrollTrigger.refresh(true);

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            // normalizeScroll removed — it caused iOS rubber-band bounce at the end
            // of the pinned zone, making the animation loop back unexpectedly.

            gsapCtx = gsap.context(() => {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start:   'top top',
                        end:     scrollEnd,
                        scrub:   true, // instant proxy on all devices — smoothedTarget (8/tick) is the sole smoother on mobile; prevents scrub:0.3 backward-drift on direction change
                        pin:     true,
                        pinSpacing:          true,
                        anticipatePin:       1,
                        invalidateOnRefresh: true,
                        preventOverlaps:     true,
                        onRefresh: (self) => { mainST = self; },
                    },
                }).to(proxy, { targetFrame: maxFrame, duration: 1, ease: 'none' }, 0);

                if (scrollHint) {
                    gsap.to(scrollHint, {
                        opacity: 0,
                        scrollTrigger: {
                            trigger: section,
                            start: 'top top',
                            end:   '+=6%',
                            scrub: true,
                        },
                    });
                }
            }, section);

            resizeHandler = () => {
                if (!renderer || !loader) return;
                renderer.resize();
                renderer.invalidate();
                lastDrawnFrame = -1;
                renderFrame    = proxy.targetFrame;
                smoothedTarget = proxy.targetFrame;
                currentFrame   = proxy.targetFrame;
                const idx = Math.round(Math.max(0, Math.min(proxy.targetFrame, maxFrame)));
                const img = loader.getFrame(idx) ?? loader.getNearestFrame(idx)?.img ?? null;
                if (img) { renderer.drawFrame(img, idx); lastDrawnFrame = idx; }
                ScrollTrigger.refresh();
            };
            window.addEventListener('resize', resizeHandler, { passive: true });

            visHandler = () => {
                if (document.hidden) {
                    cancelAnimationFrame(rafId);
                    ScrollTrigger.getAll().forEach((st) => st.disable());
                } else {
                    ScrollTrigger.getAll().forEach((st) => st.enable());
                    ScrollTrigger.refresh();
                    lastDrawnFrame = -1;
                    startRenderLoop();
                }
            };
            document.addEventListener('visibilitychange', visHandler);
        };

        // ── Init ───────────────────────────────────────────────────────────────
        const init = async () => {
            renderer = new CanvasRenderer(canvas, fitMode, /* desync */ !isMobile);
            renderer.resize();

            loader = new FrameLoader({
                totalFrames,
                basePath,
                criticalCount:    CRITICAL_COUNT,
                priorityEndFrame: PRIORITY_END,
                batchSize:        isMobile ? MOBILE_BATCH : DESKTOP_BATCH,
                // Desktop: tiered concurrency 24/12/6 per spec; mobile: flat 6
                ...(isMobile
                    ? { criticalConcurrency: MOBILE_CONCURRENCY, midConcurrency: MOBILE_CONCURRENCY, backgroundConcurrency: MOBILE_CONCURRENCY }
                    : { criticalConcurrency: DESKTOP_CRITICAL_CONCURRENCY, midConcurrency: 16, backgroundConcurrency: 6 }),
                // Desktop: pure fetch→blob→createImageBitmap (off-main-thread decode)
                bitmapFetch: !isMobile,
                // Loop zone frames are front-queued in Tier 2 on both platforms
                loopRanges: loopZones.map(z => ({ start: z.start, end: z.end })),
                onCriticalReady: () => {
                    if (cancelled) return;
                    initGSAP();
                    window.dispatchEvent(new Event('aquavida:criticalReady'));
                },
                onProgress: (loaded) => {
                    if (!blurRemoved && loaded >= BLUR_REMOVE_AT) {
                        blurRemoved = true;
                        canvas.style.filter = 'blur(0px)';
                        const fi = firstFrameRef.current;
                        if (fi) fi.style.opacity = '0';
                    }
                },
            });

            startRenderLoop();
            await loader.loadCritical();
            if (cancelled) return;
            loader.loadRemaining(); // Tier 2 + Tier 3 on all platforms
        };

        init();

        return () => {
            cancelled = true;
            cancelAnimationFrame(rafId);
            if (scrollTimer)   clearTimeout(scrollTimer);
            if (loopTimer)     clearTimeout(loopTimer);
            if (gsapCtx)       gsapCtx.revert();
            if (loader)        loader.destroy();
            if (renderer)      renderer.destroy();
            if (resizeHandler) window.removeEventListener('resize', resizeHandler);
            if (visHandler)    document.removeEventListener('visibilitychange', visHandler);
            window.removeEventListener('scroll',     onScroll);
            window.removeEventListener('wheel',      cancelSnap);
            window.removeEventListener('touchstart', cancelSnap);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden bg-[#0d0a07]"
            style={{ height: '100dvh', minHeight: 450 }}
            aria-label="Hero cinematic scroll"
            id="hero-section"
        >
            <div className="absolute inset-0 z-0">
                <picture aria-hidden="true">
                    <source media={MOBILE_BP} srcSet={getAssetUrl('/frames-mobile/avif/frame_0001.avif')} type="image/avif" />
                    <source srcSet={getAssetUrl('/frames/avif/frame_0001.avif')} type="image/avif" />
                    <img
                        ref={firstFrameRef}
                        src={getAssetUrl('/frames/avif/frame_0001.avif')}
                        alt=""
                        fetchPriority="high"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: 'blur(10px)', transition: 'opacity 400ms ease' }}
                    />
                </picture>

                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 block w-full h-full"
                    style={{
                        opacity: 0,
                        filter: 'blur(20px)',
                        transition: 'opacity 300ms ease, filter 500ms ease',
                        transform: 'translateZ(0)',
                        willChange: 'contents',
                    }}
                    aria-hidden="true"
                />

                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: [
                            'linear-gradient(to bottom, rgba(13,10,7,0.45) 0%, transparent 18%)',
                            'linear-gradient(to top,    rgba(13,10,7,0.55) 0%, transparent 22%)',
                            'linear-gradient(to right,  rgba(13,10,7,0.08) 0%, transparent 8%)',
                            'linear-gradient(to left,   rgba(13,10,7,0.08) 0%, transparent 8%)',
                        ].join(', '),
                    }}
                    aria-hidden="true"
                />
            </div>

            <div
                ref={scrollHintRef}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-10"
                aria-hidden="true"
            >
                <span className="text-[9px] font-semibold uppercase tracking-[0.45em] text-white/40">
                    Scroll
                </span>
                <div className="w-px h-14 bg-gradient-to-b from-white/60 via-white/20 to-transparent animate-pulse" />
            </div>
        </section>
    );
}
