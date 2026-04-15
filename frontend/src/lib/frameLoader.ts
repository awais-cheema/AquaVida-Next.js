/**
 * frameLoader.ts — Progressive tiered frame loader.
 *
 * Three loading tiers ensure smooth playback from first paint:
 *
 *   Tier 1 — Critical  (frames 0 … criticalCount-1)
 *     Loads immediately on init. Animation is blocked until complete.
 *
 *   Tier 2 — Priority  (frames criticalCount … priorityEndFrame, plus loop zones)
 *     Parallel load (concurrency 6) immediately after Tier 1.
 *     Loop zone frames are injected at the front of this queue.
 *
 *   Tier 3 — Background  (remaining frames)
 *     Idle load via requestIdleCallback after Tier 2 completes.
 *
 * No frame eviction — all frames stay in memory once loaded.
 * Each frame loads exactly once (in-flight dedup Set).
 * Failed loads are retried up to 3 times with a 500 ms back-off.
 */

import type { FrameSource } from './canvasRenderer';

// ── AVIF support detection (cached promise) ──────────────────────────────────
let _avifSupported: Promise<boolean> | null = null;

function detectAvif(): Promise<boolean> {
    if (_avifSupported) return _avifSupported;
    _avifSupported = new Promise((resolve) => {
        const img = new Image();
        img.onload  = () => resolve(img.width === 1);
        img.onerror = () => resolve(false);
        img.src =
            'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADy' +
            'bWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBp' +
            'dG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAA' +
            'ABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAA' +
            'AAEAAAABAAAAEG' + 'l4aQAAAAADCAgIAAAADGF2MUOBQAwAAAAAE2NvbHJuY2x4AAIAA' +
            'gAGgAAAABdpcG1hAAAAAAAAAAEAAQQBAgMEAAAAH21kYXQSAAoIGAAGiBAANYCYZ//QuoAAAA==';
    });
    return _avifSupported;
}

export interface LoopRange {
    start: number;
    end:   number;
}

export interface FrameLoaderOptions {
    totalFrames:      number;
    basePath:         string;
    /** Primary format: 'avif' | 'webp'. Auto-detected if omitted. */
    format?:          'avif' | 'webp';
    /** Tier 1 — frames loaded before animation starts. Default: 40. */
    criticalCount?:        number;
    /** Tier 2 ends here (inclusive). Default: 200. */
    priorityEndFrame?:     number;
    /** Tier 1 concurrency. Default: 24. */
    criticalConcurrency?:  number;
    /** Tier 2 concurrency. Default: 12. */
    midConcurrency?:       number;
    /** Tier 3 concurrency. Default: 6. */
    backgroundConcurrency?: number;
    /** Batch size for Tier 3 idle loading. Default: 20. */
    batchSize?:            number;
    /** Loop zone frame ranges — always front-queued in Tier 2. */
    loopRanges?:      LoopRange[];
    /**
     * Desktop: use fetch→blob→createImageBitmap instead of new Image().
     * Decodes AVIF off the main thread so the RAF loop never stalls on decode.
     * Default: false (mobile uses the Image path which is lighter on RAM).
     */
    bitmapFetch?:     boolean;
    onCriticalReady?: () => void;
    onProgress?:      (loaded: number, total: number) => void;
}

const RETRY_COUNT    = 3;
const RETRY_DELAY_MS = 500;

export class FrameLoader {
    private frames:          (FrameSource | null)[];
    private inFlight:        Set<number> = new Set();
    private totalFrames:     number;
    private basePath:        string;
    private format:          string | null = null;
    private criticalCount:        number;
    private priorityEndFrame:     number;
    private criticalConcurrency:  number;
    private midConcurrency:       number;
    private backgroundConcurrency: number;
    private batchSize:            number;
    private loopRanges:      LoopRange[];
    private bitmapFetch:     boolean;
    private onCriticalReady?: () => void;
    private onProgress?:      (loaded: number, total: number) => void;
    private loadedCount = 0;
    private cancelled   = false;

    constructor(opts: FrameLoaderOptions) {
        this.totalFrames      = opts.totalFrames;
        this.basePath         = opts.basePath;
        this.criticalCount         = Math.min(opts.criticalCount         ?? 40,  opts.totalFrames);
        this.priorityEndFrame      = Math.min(opts.priorityEndFrame      ?? 200, opts.totalFrames);
        this.criticalConcurrency   = opts.criticalConcurrency            ?? 24;
        this.midConcurrency        = opts.midConcurrency                 ?? 12;
        this.backgroundConcurrency = opts.backgroundConcurrency          ?? 6;
        this.batchSize             = opts.batchSize                      ?? 20;
        this.loopRanges       = opts.loopRanges  ?? [];
        this.bitmapFetch      = opts.bitmapFetch ?? false;
        this.onCriticalReady  = opts.onCriticalReady;
        this.onProgress       = opts.onProgress;
        this.frames           = new Array(opts.totalFrames).fill(null);
        if (opts.format) this.format = opts.format;
    }

    private url(index: number): string {
        const num = String(index + 1).padStart(4, '0');
        return `${this.basePath}/${this.format}/frame_${num}.${this.format}`;
    }

    // ── Desktop: fetch → blob → createImageBitmap (off-main-thread decode) ──────
    private async fetchFrameBitmap(index: number): Promise<void> {
        const res = await fetch(this.url(index), { cache: 'force-cache' });
        if (!res.ok) throw new Error(`frame ${index}: HTTP ${res.status}`);
        const blob = await res.blob();
        const bmp  = await createImageBitmap(blob);
        if (this.cancelled) { bmp.close(); return; }
        this.frames[index] = bmp;
        this.loadedCount++;
        this.onProgress?.(this.loadedCount, this.totalFrames);
    }

    // ── Mobile: Image element path ────────────────────────────────────────────
    private fetchFrameImage(index: number, priority: 'high' | 'low'): Promise<void> {
        return new Promise((resolve, reject) => {
            const img        = new Image();
            img.decoding     = 'async';
            img.fetchPriority = priority;
            img.onload = async () => {
                if (this.cancelled) { resolve(); return; }
                try   { this.frames[index] = await createImageBitmap(img); }
                catch { this.frames[index] = img; }
                this.loadedCount++;
                this.onProgress?.(this.loadedCount, this.totalFrames);
                resolve();
            };
            img.onerror = () => reject(new Error(`frame ${index} failed`));
            img.src = this.url(index);
        });
    }

    private fetchFrame(index: number, priority: 'high' | 'low'): Promise<void> {
        return this.bitmapFetch
            ? this.fetchFrameBitmap(index)
            : this.fetchFrameImage(index, priority);
    }

    private async loadOne(index: number, priority: 'high' | 'low' = 'low'): Promise<void> {
        if (this.cancelled || this.frames[index] !== null || this.inFlight.has(index)) return;
        this.inFlight.add(index);
        try {
            for (let attempt = 0; attempt <= RETRY_COUNT; attempt++) {
                if (this.cancelled) return;
                try {
                    await this.fetchFrame(index, priority);
                    return; // success
                } catch {
                    if (attempt < RETRY_COUNT) {
                        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
                    }
                }
            }
        } finally {
            this.inFlight.delete(index);
        }
    }

    private async loadPool(indices: number[], priority: 'high' | 'low', concurrency: number): Promise<void> {
        let next = 0;
        const worker = async () => {
            while (next < indices.length) {
                if (this.cancelled) return;
                await this.loadOne(indices[next++], priority);
            }
        };
        await Promise.all(
            Array.from({ length: Math.min(concurrency, indices.length) }, worker)
        );
    }

    private yieldToMain(): Promise<void> {
        return new Promise((resolve) =>
            typeof requestIdleCallback !== 'undefined'
                ? requestIdleCallback(() => resolve(), { timeout: 150 })
                : setTimeout(resolve, 4)
        );
    }

    // ── Tier 1 — Critical ────────────────────────────────────────────────────
    async loadCritical(): Promise<void> {
        if (!this.format) {
            this.format = (await detectAvif()) ? 'avif' : 'webp';
        }
        const indices = Array.from({ length: this.criticalCount }, (_, i) => i);
        await this.loadPool(indices, 'high', this.criticalConcurrency);
        if (!this.cancelled) this.onCriticalReady?.();
    }

    // ── Tier 2 + Tier 3 ──────────────────────────────────────────────────────
    /**
     * Tier 2: loop zone frames first, then frames criticalCount–priorityEndFrame.
     * Tier 3: remaining frames via idle loading.
     */
    async loadRemaining(): Promise<void> {
        // ── Build Tier 2 queue ──────────────────────────────────────────────
        // Loop zone frames are always front-queued (may span Tier 2 or Tier 3 range)
        const loopSet = new Set<number>();
        for (const { start, end } of this.loopRanges) {
            for (let i = start; i <= end && i < this.totalFrames; i++) {
                if (i >= this.criticalCount) loopSet.add(i);
            }
        }

        const tier2: number[] = [];
        // 1. Loop zone frames (highest priority — front of queue)
        Array.from(loopSet).forEach(i => tier2.push(i));
        // 2. Priority range frames (excluding those already queued as loop frames)
        for (let i = this.criticalCount; i < this.priorityEndFrame; i++) {
            if (!loopSet.has(i)) tier2.push(i);
        }

        await this.loadPool(tier2, 'high', this.midConcurrency);
        if (this.cancelled) return;

        // ── Tier 3 — Background idle load ──────────────────────────────────
        for (let i = this.priorityEndFrame; i < this.totalFrames; i += this.batchSize) {
            if (this.cancelled) return;
            const end     = Math.min(i + this.batchSize, this.totalFrames);
            const indices: number[] = [];
            for (let j = i; j < end; j++) {
                // Skip loop zone frames — already loaded in Tier 2
                if (!loopSet.has(j) && !this.frames[j]) indices.push(j);
            }
            if (indices.length > 0) await this.loadPool(indices, 'low', this.backgroundConcurrency);
            await this.yieldToMain();
        }
    }

    // ── Scroll-ahead preload ─────────────────────────────────────────────────
    preloadAhead(fromIndex: number, count: number): void {
        if (this.cancelled) return;
        const end = Math.min(fromIndex + count, this.totalFrames);
        for (let i = fromIndex; i < end; i++) this.loadOne(i, 'high');
    }

    // ── Public API ───────────────────────────────────────────────────────────
    getFrame(index: number): FrameSource | null {
        return this.frames[Math.max(0, Math.min(index, this.totalFrames - 1))];
    }

    getNearestFrame(index: number): { img: FrameSource; idx: number } | null {
        const c = Math.max(0, Math.min(index, this.totalFrames - 1));
        if (this.frames[c]) return { img: this.frames[c]!, idx: c };
        for (let d = 1; d < 60; d++) {
            if (c - d >= 0 && this.frames[c - d])               return { img: this.frames[c - d]!, idx: c - d };
            if (c + d < this.totalFrames && this.frames[c + d]) return { img: this.frames[c + d]!, idx: c + d };
        }
        return null;
    }

    destroy(): void {
        this.cancelled = true;
        for (const f of this.frames) if (f instanceof ImageBitmap) f.close();
        this.frames = [];
        this.inFlight.clear();
    }
}
