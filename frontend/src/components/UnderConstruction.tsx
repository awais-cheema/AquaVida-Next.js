'use client';

import Image from 'next/image';
import { getAssetUrl } from '@/lib/constants';

export default function UnderConstruction() {
    return (
        <main
            className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #050812 0%, #091a36 50%, #050c1e 100%)' }}
        >
            {/* Ambient background glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 70% 50% at 50% 55%, rgba(10,68,122,0.35) 0%, transparent 70%)',
                }}
            />

            {/* Subtle grid lines */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }}
            />

            {/* Content */}
            <div className="relative flex flex-col items-center gap-10 px-6 text-center">
                {/* Logo */}
                <div className="relative">
                    <div
                        className="absolute inset-0 rounded-full blur-[60px] pointer-events-none"
                        style={{ background: 'rgba(10,68,122,0.55)', transform: 'scale(1.4)' }}
                    />
                    <Image
                        src={getAssetUrl("/logo2.avif")}
                        alt="AquaVida"
                        width={220}
                        height={80}
                        className="relative w-auto"
                        style={{ height: 'clamp(56px, 8vw, 88px)', filter: 'drop-shadow(0 0 32px rgba(99,181,137,0.3))' }}
                        priority
                    />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 w-full max-w-xs">
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#63b589' }} />
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
                </div>

                {/* Heading */}
                <div className="flex flex-col items-center gap-3">
                    <p
                        className="text-white/40 uppercase tracking-[0.4em] font-medium"
                        style={{ fontSize: '11px' }}
                    >
                        Page
                    </p>
                    <h1
                        className="text-white font-allomira uppercase font-black"
                        style={{
                            fontSize: 'clamp(2rem, 6vw, 4rem)',
                            letterSpacing: '0.08em',
                            lineHeight: 1,
                            textShadow: '0 2px 40px rgba(10,68,122,0.8)',
                        }}
                    >
                        Under Construction
                    </h1>
                    <p
                        className="text-white/45 font-medium max-w-md leading-relaxed"
                        style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)' }}
                    >
                        We're putting the finishing touches on this page.
                        <br />
                        Check back soon.
                    </p>
                </div>

                {/* Bottom accent */}
                <div
                    className="rounded-full"
                    style={{
                        width: 60,
                        height: 3,
                        background: 'linear-gradient(90deg, transparent, #63b589, transparent)',
                        boxShadow: '0 0 16px rgba(99,181,137,0.6)',
                    }}
                />
            </div>
        </main>
    );
}
