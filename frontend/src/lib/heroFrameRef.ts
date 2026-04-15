/**
 * Shared mutable singleton — HeroSection writes the currently-displayed
 * frame index, total frames, and mobile status here on every RAF tick.
 * Overlays read it to stay locked 1:1 with the canvas.
 *
 * Module-level (not React state) so there is zero re-render overhead.
 */
const heroFrameRef = { 
    current: 0, 
    total: 600,
    isMobile: false 
};

export default heroFrameRef;
