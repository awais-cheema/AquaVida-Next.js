'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getAssetUrl } from '@/lib/constants';

/* ── Data ─────────────────────────────────────────────────────────────── */

const PRINCIPLES = [
    {
        id: 'holistic',
        label: '01',
        pos: 'tl' as const,
        line1: 'The Ultimate',
        line2: 'Outdoor',
        title: 'The Ultimate Outdoor',
        sub: 'We view every project as a delicate ecosystem, where architecture and nature breathe in absolute unison.',
        image: getAssetUrl('/principle_holistic.webp'),
    },
    {
        id: 'innovation',
        label: '02',
        pos: 'tr' as const,
        line1: 'Aesthetically',
        line2: 'Pleasing',
        title: 'Aesthetically Pleasing',
        sub: 'Pushing the boundaries of hydraulic engineering and structural glass to create liquid masterpieces.',
        image: getAssetUrl('/principle_innovation.webp'),
    },
    {
        id: 'integrity',
        label: '03',
        pos: 'bl' as const,
        line1: 'Advocacy',
        line2: 'Speaks Itself',
        title: 'Advocacy Speaks Itself',
        sub: 'Honesty in materials and precision in execution are the cornerstones of the AquaVida legacy.',
        image: getAssetUrl('/principle_integrity.webp'),
    },
    {
        id: 'excellence',
        label: '04',
        pos: 'br' as const,
        line1: 'Authentic',
        line2: 'Materials',
        title: 'Authentic Materials',
        sub: 'From the first sketch to the final splash, we pursue a standard of perfection that knows no compromise.',
        image: getAssetUrl('/principle_excellence.webp'),
    },
] as const;

/* ── Geometry ─────────────────────────────────────────────────────────── */

type Pos = 'tl' | 'tr' | 'bl' | 'br';

const D = 440;          // viewBox size
const R = D / 2;        // sphere radius = 220
const CX = R;
const CY = R;

const Q_CENTER: Record<Pos, { x: number; y: number }> = {
    tl: { x: CX - R * 0.50, y: CY - R * 0.50 },
    tr: { x: CX + R * 0.50, y: CY - R * 0.50 },
    bl: { x: CX - R * 0.50, y: CY + R * 0.50 },
    br: { x: CX + R * 0.50, y: CY + R * 0.50 },
};

const Q_RECT: Record<Pos, { x: number; y: number; w: number; h: number }> = {
    tl: { x: 0, y: 0, w: CX, h: CY },
    tr: { x: CX, y: 0, w: CX, h: CY },
    bl: { x: 0, y: CY, w: CX, h: CY },
    br: { x: CX, y: CY, w: CX, h: CY },
};

const POSITIONS: Pos[] = ['tl', 'tr', 'bl', 'br'];

/* ── Component ────────────────────────────────────────────────────────── */

export default function CorePrinciplesGlobe() {
    const [hovered, setHovered] = useState<string | null>(null);

    const active = PRINCIPLES.find(p => p.id === hovered);
    const panelVis = !!hovered;

    return (
        <section className="relative bg-[#020a13] h-screen overflow-hidden flex flex-col items-center justify-center py-6">
            {/* ── Brand Glows ── */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#0d5699]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#63b589]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* ── Background (Instant Swap) ── */}
            {PRINCIPLES.map(p => (
                <div key={p.id} className="absolute inset-0 object-cover pointer-events-none"
                     style={{
                        backgroundImage: `url(${p.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: hovered === p.id ? 0.35 : 0,
                        filter: 'blur(12px) brightness(0.6)',
                }} />
            ))}
            <div className="absolute inset-0 bg-[#020a13]/94 pointer-events-none" />

            {/* ── Heading ── */}
            <div className="relative z-10 text-center mb-6 lg:mb-10 px-6">
                <h2 className="font-allomira font-bold text-white leading-[1.1] select-none text-[34px] md:text-[44px] lg:text-[76px]">
                    Our Core Principles
                </h2>
            </div>

            {/* ── Main Content Area (Ultra Responsive) ── */}
            <div className="relative z-10 w-full max-w-[1850px] mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-20 h-full max-h-[640px]">
                
                {/* ── LEFT: Title (Instant) ── */}
                <div className="flex-1 w-full lg:text-right order-2 lg:order-1 hidden lg:block">
                    <div className="pointer-events-none" style={{ opacity: panelVis ? 1 : 0 }}>
                        <p className="text-[14px] uppercase tracking-[0.45em] font-bold text-white mb-6">
                            Principle {active?.label ?? '\u00a0'}
                        </p>
                        <h3 className="font-allomira font-bold text-white leading-[1.05] text-[38px] md:text-[52px] lg:text-[72px]">
                            {active?.title ?? '\u00a0'}
                        </h3>
                    </div>
                </div>

                {/* ── CENTER: Floating Transparent Glass Globe ── */}
                <div className="relative flex-none w-[300px] sm:w-[440px] md:w-[560px] lg:w-[620px] xl:w-[700px] aspect-square flex items-center justify-center order-1 lg:order-2">
                    
                    {/* The Pure Glass Blur Circle */}
                    <div className="absolute inset-4 rounded-full bg-white/[0.01] backdrop-blur-[20px] pointer-events-none" />

                    <svg
                        viewBox={`0 0 ${D} ${D}`}
                        className="w-full h-full block overflow-visible select-none relative z-10"
                    >
                        <defs>
                            <clipPath id="cpqSphere">
                                <circle cx={CX} cy={CY} r={R} />
                            </clipPath>

                            {POSITIONS.map(pos => (
                                <clipPath key={pos} id={`cpqQ-${pos}`}>
                                    <rect x={Q_RECT[pos].x} y={Q_RECT[pos].y} width={Q_RECT[pos].w} height={Q_RECT[pos].h} />
                                </clipPath>
                            ))}
                        </defs>

                        {/* Sphere Body */}
                        <circle cx={CX} cy={CY} r={R} fill="rgba(255, 255, 255, 0.02)" />

                        <g clipPath="url(#cpqSphere)">
                            {/* Hover Tints (Instant) */}
                            {PRINCIPLES.map(p => (
                                <g key={`hf-${p.id}`} clipPath={`url(#cpqQ-${p.pos})`}>
                                    <circle cx={CX} cy={CY} r={R} 
                                            fill={hovered === p.id ? 'rgba(255, 255, 255, 0.08)' : 'transparent'} />
                                </g>
                            ))}

                            {/* Labels */}
                            {PRINCIPLES.map(p => {
                                const c = Q_CENTER[p.pos];
                                const hv = hovered === p.id;
                                const off = 18;
                                const tx = p.pos.includes('l') ? c.x + off : c.x - off;
                                
                                return (
                                    <g key={`lbl-${p.id}`} clipPath={`url(#cpqQ-${p.pos})`} className="pointer-events-none">
                                        <text x={tx} y={c.y - 12} textAnchor="middle" dominantBaseline="middle" 
                                              fontSize={24} fontWeight={600} letterSpacing="0.08em" 
                                              fill={hv ? '#ffffff' : 'rgba(255,255,255,0.40)'}
                                              style={{ fontFamily: 'var(--font-allomira), system-ui, sans-serif' }}>
                                            {p.line1}
                                        </text>
                                        <text x={tx} y={c.y + 14} textAnchor="middle" dominantBaseline="middle" 
                                              fontSize={24} fontWeight={600} letterSpacing="0.08em" 
                                              fill={hv ? '#ffffff' : 'rgba(255,255,255,0.40)'}
                                              style={{ fontFamily: 'var(--font-allomira), system-ui, sans-serif' }}>
                                            {p.line2}
                                        </text>
                                    </g>
                                );
                            })}
                            
                            {/* Hit Areas */}
                            {PRINCIPLES.map(p => {
                                const q = Q_RECT[p.pos];
                                return (
                                    <rect key={`mt-${p.id}`} x={q.x} y={q.y} width={q.w} height={q.h} fill="transparent" style={{ cursor: 'pointer' }}
                                          onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)} />
                                );
                            })}
                        </g>

                        {/* Minimalist Logo */}
                        <foreignObject x={CX - 40} y={CY - 40} width={80} height={80}>
                           <div className="w-full h-full flex items-center justify-center p-3 pointer-events-none">
                               <Image src={getAssetUrl("/logo.avif")} alt="AquaVida" width={64} height={24} className="w-full h-auto object-contain brightness-125" />
                           </div>
                        </foreignObject>

                        {/* Static Gloss */}
                        <ellipse cx={CX * 0.45} cy={CY * 0.35} rx={R * 0.25} ry={R * 0.12} fill="rgba(255,255,255,0.05)" style={{ filter: 'blur(12px)' }} />
                    </svg>
                </div>

                {/* ── RIGHT: Description (Instant) ── */}
                <div className="flex-1 w-full lg:text-left order-3 hidden lg:block">
                    <div className="pointer-events-none" style={{ opacity: panelVis ? 1 : 0 }}>
                        <p className="text-white/60 leading-relaxed text-[17px] md:text-[20px] lg:text-[26px] max-w-lg italic">
                            {active?.sub ?? '\u00a0'}
                        </p>
                    </div>
                </div>

                {/* ── MOBILE FALLBACK ── */}
                <div className="lg:hidden text-center order-3 px-6 mt-4 min-h-[120px]">
                    <div style={{ opacity: panelVis ? 1 : 0 }}>
                        <p className="text-white text-[11px] uppercase tracking-widest font-bold mb-1">{active?.label}</p>
                        <h3 className="text-white text-[24px] font-bold mb-2 font-allomira leading-tight">{active?.title}</h3>
                        <p className="text-white/40 text-[14px] leading-relaxed line-clamp-2">{active?.sub}</p>
                    </div>
                </div>

            </div>

            {/* ── Floor Glow ── */}
            <div className="absolute bottom-[-110px] left-1/2 -translate-x-1/2 w-[80%] h-[200px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
        </section>
    );
}
