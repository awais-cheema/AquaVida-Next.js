/**
 * Shared mutable singleton — HeroSection writes the currently-displayed
 * frame index, total frames, and mobile status here on every RAF tick,
 * then calls heroFrameRef.tick() to drive all overlay subscribers in the
 * same RAF frame. This means exactly ONE rAF loop for the entire hero,
 * eliminating the per-overlay RAF overhead that caused scroll choppiness.
 */
type TickFn = () => void;

const heroFrameRef = {
    current:  0,
    total:    600,
    isMobile: false,

    _subs: [] as TickFn[],

    subscribe(fn: TickFn): () => void {
        this._subs.push(fn);
        return () => {
            const i = this._subs.indexOf(fn);
            if (i !== -1) this._subs.splice(i, 1);
        };
    },

    tick() {
        for (let i = 0; i < this._subs.length; i++) {
            try { this._subs[i](); } catch (e) { /* isolate subscriber errors from main RAF */ }
        }
    },
};

export default heroFrameRef;
