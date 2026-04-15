/**
 * canvasRenderer.ts — Dual-buffer GPU-optimized canvas renderer.
 *
 * Two off-screen canvases (bufferA, bufferB) cache the current and next frames.
 *
 * drawFrame()   — single frame, no blending (instant seek or no next frame available).
 * drawBlended() — crossfade: imgA at full opacity, imgB overlaid at `alpha` (0–1).
 *
 * Buffer caching: blit() to an off-screen canvas only when the frame index changes.
 * This avoids redundant GPU uploads when alpha changes but frames stay the same
 * (common during idle loop playback).
 *
 * DPR scaling via ctx.setTransform(dpr,0,0,dpr,0,0) — all coordinates in CSS pixels.
 * Uses window.innerWidth/Height (immune to GSAP pin position:fixed distortion).
 */

export type FrameSource = ImageBitmap | HTMLImageElement;
export type FitMode = 'cover' | 'contain';

function srcSize(img: FrameSource): { w: number; h: number } {
    if (img instanceof ImageBitmap) return { w: img.width,        h: img.height };
    return                                 { w: img.naturalWidth, h: img.naturalHeight };
}

function makeCtx(canvas: HTMLCanvasElement, desync = false): CanvasRenderingContext2D {
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: desync });
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    return ctx;
}

export class CanvasRenderer {
    private canvas:  HTMLCanvasElement;
    private ctx:     CanvasRenderingContext2D;
    private bufA:    HTMLCanvasElement;   // off-screen: current frame
    private bufB:    HTMLCanvasElement;   // off-screen: next frame
    private ctxA:    CanvasRenderingContext2D;
    private ctxB:    CanvasRenderingContext2D;
    private fitMode: FitMode;
    private cssW = 0;
    private cssH = 0;
    private cachedFrameA = -1;
    private cachedFrameB = -1;

    /**
     * @param desync  Pass true on desktop: enables `desynchronized: true` on the main
     *                canvas so the GPU composites it independently of the main thread,
     *                reducing latency by one frame.
     */
    constructor(canvas: HTMLCanvasElement, fitMode: FitMode = 'cover', desync = false) {
        this.canvas  = canvas;
        this.fitMode = fitMode;
        this.ctx     = makeCtx(canvas, desync);  // desync: GPU-composited on desktop
        this.bufA    = document.createElement('canvas');
        this.bufB    = document.createElement('canvas');
        this.ctxA    = makeCtx(this.bufA);
        this.ctxB    = makeCtx(this.bufB);
    }

    resize(): void {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w   = window.innerWidth;
        const h   = window.innerHeight;
        this.cssW = w;
        this.cssH = h;

        for (const [c, cx] of [
            [this.canvas, this.ctx ],
            [this.bufA,   this.ctxA],
            [this.bufB,   this.ctxB],
        ] as [HTMLCanvasElement, CanvasRenderingContext2D][]) {
            c.width  = Math.round(w * dpr);
            c.height = Math.round(h * dpr);
            cx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cx.imageSmoothingEnabled = true;
            cx.imageSmoothingQuality = 'high';
        }

        this.cachedFrameA = -1;
        this.cachedFrameB = -1;
    }

    /** Blit an image onto an off-screen buffer using the current fit mode. */
    private blit(ctx: CanvasRenderingContext2D, img: FrameSource): void {
        const { w: iw, h: ih } = srcSize(img);
        if (!iw || !ih) return;

        const cw = this.cssW;
        const ch = this.cssH;
        const imageAspect  = iw / ih;
        const canvasAspect = cw / ch;

        let dw: number, dh: number;
        if (this.fitMode === 'cover') {
            if (canvasAspect > imageAspect) { dw = cw; dh = cw / imageAspect; }
            else                            { dh = ch; dw = ch * imageAspect; }
        } else {
            if (canvasAspect > imageAspect) { dh = ch; dw = ch * imageAspect; }
            else                            { dw = cw; dh = cw / imageAspect; }
        }

        const dx = (cw - dw) * 0.5;
        const dy = (ch - dh) * 0.5;

        if (this.fitMode === 'contain') {
            ctx.fillStyle = '#0d0a07';
            ctx.fillRect(0, 0, cw, ch);
        }
        ctx.drawImage(img, dx, dy, dw, dh);
    }

    /**
     * Draw a single frame — no blending.
     * Re-blits to bufA only when frameIndex changes.
     * Always re-composites to main canvas (prior draw may have been blended).
     */
    drawFrame(img: FrameSource | null, frameIndex: number): void {
        if (!img) return;
        if (frameIndex !== this.cachedFrameA) {
            this.blit(this.ctxA, img);
            this.cachedFrameA = frameIndex;
        }
        this.ctx.globalAlpha = 1;
        this.ctx.drawImage(this.bufA, 0, 0, this.cssW, this.cssH);
    }

    /**
     * Draw a frame directly to the main canvas — no intermediate off-screen buffer copy.
     * One less GPU blit vs drawFrame. Use on desktop where no blending is needed and
     * desynchronized: true lets the GPU composite without waiting for the main thread.
     */
    drawDirect(img: FrameSource | null, frameIndex: number): void {
        if (!img) return;
        if (frameIndex !== this.cachedFrameA) {
            this.blit(this.ctx, img);
            this.cachedFrameA = frameIndex;
        }
    }

    /**
     * Crossfade blend: imgA rendered at full opacity, imgB composited on top at `alpha`.
     * Re-blits buffers only when frame indices change — alpha changes are free.
     */
    drawBlended(
        imgA: FrameSource, frameA: number,
        imgB: FrameSource, frameB: number,
        alpha: number
    ): void {
        if (frameA !== this.cachedFrameA) {
            this.blit(this.ctxA, imgA);
            this.cachedFrameA = frameA;
        }
        if (frameB !== this.cachedFrameB) {
            this.blit(this.ctxB, imgB);
            this.cachedFrameB = frameB;
        }
        this.ctx.globalAlpha = 1;
        this.ctx.drawImage(this.bufA, 0, 0, this.cssW, this.cssH);
        this.ctx.globalAlpha = alpha;
        this.ctx.drawImage(this.bufB, 0, 0, this.cssW, this.cssH);
        this.ctx.globalAlpha = 1;
    }

    invalidate(): void {
        this.cachedFrameA = -1;
        this.cachedFrameB = -1;
    }

    destroy(): void {
        this.bufA.width = 0;
        this.bufB.width = 0;
    }
}
